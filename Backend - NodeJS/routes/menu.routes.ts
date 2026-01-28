import { Router } from 'express';
import { getMenus, getMenuById, createMenu } from '../controllers/menu.controller';

const router = Router();

router.get('/', getMenus);
router.get('/:id', getMenuById);
router.post('/', createMenu);

export default router;
