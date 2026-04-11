import express from 'express';
import { createOrder } from '../controllers/paymentController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.post('/create-order', createOrder);

export default router;
