import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { sendSuccess, sendError } from './utils/responseHelper.js';

// Route Imports
import authRoutes from './routes/auth.js';

const app = express();

/**
 * Global Security & Middleware Stack
 */
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
