import { Router } from 'express';
import { 
    getAllUsers, 
    getAllChefs, 
    getAllReviews, 
    updateUserStatus, 
    deleteUser, 
    deleteReview 
} from '../controllers/admin.controller';

const router = Router();

// Admin routes
router.get('/users', getAllUsers);
router.get('/chefs', getAllChefs);
router.get('/reviews', getAllReviews);
router.put('/users/:userId/status', updateUserStatus);
router.delete('/users/:userId', deleteUser);
router.delete('/reviews/:reviewId', deleteReview);

export default router;
