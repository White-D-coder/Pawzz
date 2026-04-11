import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

/**
 * Sign a payload into a JWT
 */
export const signToken = (payload) => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  });
};

/**
 * Verify a JWT token
 */
export const verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};
