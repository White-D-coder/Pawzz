import Razorpay from 'razorpay';
import crypto from 'crypto';
import { env } from '../config/env.js';

export const razorpayInstance = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID || 'dummy_key',
  key_secret: env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

export const verifyRazorpaySignature = (body, signature) => {
  const expectedSig = crypto
    .createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET || 'dummy_secret')
    .update(body) // This must be the raw string payload
    .digest('hex');

  return expectedSig === signature;
};
