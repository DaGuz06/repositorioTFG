import { Router } from 'express';
import { getChefs, getChefById, createProfile } from '../controllers/chef.controller';

const router = Router();

router.get('/', getChefs);
router.get('/:id', getChefById);
router.post('/profile', createProfile);

export default router;
