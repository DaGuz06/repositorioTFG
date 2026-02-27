import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import { uploadProfilePicture, uploadMenuPicture } from '../controllers/upload.controller';

const router = Router();
const SECRET_KEY = process.env['JWT_SECRET'] || 'super_secret_key';

const fileFilter = (_req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes'));
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter
});

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ success: false, message: 'Token requerido' });
    return;
  }

  try {
    const decoded: any = jwt.verify(token, SECRET_KEY);
    (req as any).userId = decoded.id;
    next();
  } catch {
    res.status(403).json({ success: false, message: 'Token inválido' });
  }
}

router.post('/profile-picture', authMiddleware, upload.single('photo'), uploadProfilePicture);
router.post('/menu-picture', authMiddleware, upload.single('photo'), uploadMenuPicture);

export default router;
