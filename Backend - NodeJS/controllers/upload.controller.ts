import { Request, Response } from 'express';
import { pool } from '../db';
import sharp from 'sharp';

const processImageToBase64 = async (buffer: Buffer): Promise<string> => {
  const processedBuffer = await sharp(buffer)
    .resize(200, 200, { fit: 'cover' })
    .jpeg({ quality: 80 })
    .toBuffer();
  return `data:image/jpeg;base64,${processedBuffer.toString('base64')}`;
};

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

    const base64Image = await processImageToBase64(req.file.buffer);

    await pool.query(
      'UPDATE users SET profile_picture = $1 WHERE id = $2',
      [base64Image, userId]
    );

    res.json({ success: true, profilePicture: base64Image });

  } catch (error: any) {
    console.error('Upload Error:', error?.message);
    res.status(500).json({ success: false, message: 'Error procesando la imagen del perfil' });
  }
};

export const uploadMenuPicture = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No se ha enviado ninguna imagen para el menú' });
      return;
    }

    const userId = (req as any).userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'No autorizado' });
      return;
    }

    const base64Image = await processImageToBase64(req.file.buffer);

    res.json({ success: true, menuPictureUrl: base64Image });

  } catch (error: any) {
    console.error('Menu Upload Error:', error?.message);
    res.status(500).json({ success: false, message: 'Error procesando la imagen del menú' });
  }
};
