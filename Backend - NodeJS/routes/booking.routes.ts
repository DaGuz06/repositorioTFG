import { Router } from 'express';
import { createBooking, getBookingsByUser } from '../controllers/booking.controller';

const router = Router();

router.post('/', createBooking);
router.get('/', getBookingsByUser);

export default router;
