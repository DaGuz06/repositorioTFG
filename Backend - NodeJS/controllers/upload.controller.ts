import { Request, Response } from 'express';
import { pool } from '../db';

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
      [publicUrl, userId]
    );

    res.json({ success: true, profilePicture: publicUrl });

  } catch (error: any) {
    console.error('Upload error:', error?.message);
    res.status(500).json({ success: false, message: error?.message || 'Error al subir la imagen' });
  }
};
