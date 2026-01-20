import { Router } from 'express';
import { getReviews, addReview } from '../controllers/review.controller';

const router = Router();

router.get('/', getReviews);
router.post('/', addReview);

export default router;
