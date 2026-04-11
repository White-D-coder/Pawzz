import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import { env } from './config/env.js';
import { sendSuccess, sendError } from './utils/responseHelper.js';

// Route Imports
import authRoutes from './routes/auth.js';
import listingRoutes from './routes/listing.js';
import bookingRoutes from './routes/booking.js';
import volunteerRoutes from './routes/volunteer.js';

const app = express();

/**
 * Global Security & Middleware Stack
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' }
});

app.use(limiter);
app.use(helmet()); // Secure Headers

app.use(cors({ 
  origin: env.FRONTEND_URL, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}));
app.use(morgan('dev')); // Request Logging
app.use(express.json({ limit: '10kb' })); // Body Parser with size limit
app.use(cookieParser()); // Cookie Parser for HttpOnly tokens

/**
 * Route Mounting
 */
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/volunteers', volunteerRoutes);




/**
 * Health Check & Base Routes
 */
app.get('/health', (req, res) => {
  return sendSuccess(res, { status: 'ok', timestamp: new Date().toISOString() }, 'System Healthy');
});

/**
 * Centralized Error Handler (Mandatory last middleware)
 */
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  return sendError(res, 'INTERNAL_SERVER_ERROR', 'Something went wrong on our end', 500);
});

export default app;
