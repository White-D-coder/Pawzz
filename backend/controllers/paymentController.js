import { razorpayInstance, verifyRazorpaySignature } from '../services/razorpayService.js';
import { Booking } from '../models/Booking.js';
import { responseHelper } from '../utils/responseHelper.js';

export const createOrder = async (req, res, next) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return responseHelper.error(res, 404, "NOT_FOUND", "Booking not found");
    }

    if (booking.status !== 'pending') {
      return responseHelper.error(res, 400, "BAD_REQUEST", "Booking is not in pending state");
    }

    const order = await razorpayInstance.orders.create({
      amount: 500 * 100, // Hardcoded 500 INR in paise for MVP
      currency: 'INR',
      receipt: `receipt_${bookingId}`
    });

    return responseHelper.success(res, 200, {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID || 'dummy_key'
    }, "Order created");

  } catch (err) {
    next(err);
  }
};

export const handleWebhook = async (req, res, next) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    
    // We expect the raw string body to have been preserved by the raw middleware
    const isValid = verifyRazorpaySignature(req.body, signature);
    
    if (!isValid) {
      console.warn('Invalid Razorpay signature attempt');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const payload = JSON.parse(req.body.toString());
    
    if (payload.event === 'payment.captured') {
      const orderId = payload.payload.payment.entity.order_id;
      
      const updated = await Booking.findOneAndUpdate(
        { paymentRef: orderId },
        { $set: { status: 'confirmed' } },
        { new: true }
      );
      
      if (updated) {
        console.log(`Booking ${updated._id} confirmed via payment webhook.`);
      }
    }
    
    // Always return 200 to acknowledge webhook receipt
    res.status(200).json({ status: 'ok' });
  } catch (err) {
    console.error("Webhook processing error:", err.message);
    res.status(500).json({ error: 'Webhook processing error' });
  }
};
