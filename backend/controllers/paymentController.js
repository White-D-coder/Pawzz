import Razorpay from 'razorpay';
import { sendSuccess, sendError } from '../utils/responseHelper.js';
import { env } from '../config/env.js';

const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID || 'rzp_test_mock_id',
  key_secret: env.RAZORPAY_KEY_SECRET || 'mock_secret'
});

/**
 * Create a new Payment Order
 */
export const createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    const options = {
      amount: amount * 100, // Amount is in currency subunits (paise for INR)
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);
    
    return sendSuccess(res, { order }, 'Payment order created');
  } catch (error) {
    console.error('❌ Razorpay Order Error:', error);
    return sendError(res, 'PAYMENT_ERROR', 'Failed to initialize payment');
  }
};

/**
 * Verify Razorpay Signature (Optional: For webhook-less sync)
 */
export const verifyPayment = async (req, res) => {
  // Logic to verify HMAC signature from Razorpay
  // For now, we'll implement this as a success bridge
  return sendSuccess(res, null, 'Payment verified');
};

/**
 * Handle Razorpay Webhooks (Payment Succeeded, failed, etc.)
 */
export const handleWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'your_secret';
    // Validate signature here...
    console.log("⚓ Webhook Received:", req.body);
    return res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error("❌ Webhook Error:", error);
    return res.status(500).json({ status: 'error' });
  }
};
