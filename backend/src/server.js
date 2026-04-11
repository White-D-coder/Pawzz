import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';

dotenv.config();

const PORT = 5001; // Forced to 5001 to avoid macOS port 5000 conflict
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pawzz';

// Start server immediately to resolve 404s
app.listen(PORT, () => {
  console.log(`🚀 PAWZZ Backend LIVE on port ${PORT}`);
  console.log(`🔗 Local link: http://localhost:${PORT}`);
});

// Attempt DB connection in background
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('⚠️ Database connection deferred:', error.message);
    console.log('ℹ️ Running in offline mode. Some features may be limited.');
  }
};

connectDB();

