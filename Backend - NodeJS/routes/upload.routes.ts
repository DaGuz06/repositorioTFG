import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import { uploadProfilePicture } from '../controllers/upload.controller';

const router = Router();

// Crear directorio de uploads si no existe
const uploadsDir = path.join(process.cwd(), 'uploads', 'profiles');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer con almacenamiento en disco
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, _file, cb) => {
    const userId = (req as any).userId || 'unknown';
    const ext = path.extname(_file.originalname) || '.jpg';
    cb(null, `${userId}_${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes'));
    }
  }
});
import { uploadProfilePicture } from '../controllers/upload.controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB max

const SECRET_KEY = process.env['JWT_SECRET'] || 'super_secret_key';

// Middleware de autenticación JWT
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

export default router;
