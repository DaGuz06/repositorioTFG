import { Router } from 'express';
import { createReservation, getReservationsByChef, updateReservationStatus, checkCanReview } from '../controllers/reservation.controller';

const router = Router();

router.post('/', createReservation);
router.get('/chef/:chefId', getReservationsByChef);
router.patch('/:id/status', updateReservationStatus);
router.get('/can-review/:chefId/:userId', checkCanReview);

export default router;
