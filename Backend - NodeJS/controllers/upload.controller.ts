import { Request, Response } from 'express';
import { pool } from '../db';
import { bucket } from '../firebase-admin';
import { promisePool } from '../db';
import path from 'path';

export const uploadProfilePicture = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No se ha enviado ninguna imagen' });
      return;
    }

    const userId = (req as any).userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'No autorizado' });
      return;
    }

    // La URL pública relativa al archivo guardado por multer
    const publicUrl = `/uploads/profiles/${req.file.filename}`;

    // Guardar URL en la BD
    await pool.query(
      'UPDATE users SET profile_picture = $1 WHERE id = $2',
    const ext = path.extname(req.file.originalname) || '.jpg';
    const fileName = `profiles/${userId}_${Date.now()}${ext}`;
    const file = bucket.file(fileName);

    // Subir el buffer a Firebase Storage
    await file.save(req.file.buffer, {
      metadata: { contentType: req.file.mimetype },
    });

    // Hacer el archivo público
    await file.makePublic();

    // Obtener URL pública
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    // Guardar URL en la BD
    await promisePool.query(
      'UPDATE users SET profile_picture = ? WHERE id = ?',
      [publicUrl, userId]
    );

    res.json({ success: true, profilePicture: publicUrl });

  } catch (error: any) {
    console.error('Upload error:', error?.message);
    console.error('Upload error message:', error?.message);
    console.error('Upload error stack:', error?.stack);
    res.status(500).json({ success: false, message: error?.message || 'Error al subir la imagen' });
  }
};
