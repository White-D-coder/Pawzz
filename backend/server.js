import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';

const startServer = async () => {
  // Connect to Database in background - don't block the server startup
  connectDB();

  // Start Express App
  const PORT = env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`🚀 PAWZZ Backend LIVE on port ${PORT}`);
    console.log(`🔗 Health Check: http://localhost:${PORT}/health`);
  });
};

startServer();
