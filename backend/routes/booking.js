import express from 'express';
import { createBooking, getMyBookings } from '../controllers/bookingController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * All booking routes are protected (Login required)
 */
router.use(protect);

router.get('/my', getMyBookings);
router.post('/', createBooking);

export default router;
