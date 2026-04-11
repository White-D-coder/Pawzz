import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // In dev, we log and continue; in prod, we might want to retry or exit
    if (env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};
