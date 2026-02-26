import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import jwt from 'jsonwebtoken';
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
