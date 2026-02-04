import { Router } from 'express';
import { getMenus, createMenu, deleteMenu } from '../controllers/menu.controller';

const router = Router();

router.get('/', getMenus);
router.post('/', createMenu);
router.delete('/:id', deleteMenu);

export default router;
