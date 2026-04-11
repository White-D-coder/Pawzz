import express from 'express';
import { handleWebhook } from '../controllers/paymentController.js';

const router = express.Router();

// The raw parser must be applied BEFORE the webhook controller!
// We export this knowing it must be mounted safely.
// Note: In app.js, make sure express.json() doesn't intercept this route.
router.post('/razorpay', express.raw({ type: 'application/json' }), handleWebhook);

export default router;
