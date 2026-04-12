import { createServer } from 'http';
import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { initSocket } from './utils/socket.js';

const startServer = async () => {
  // Connect to Database
  connectDB();

  const PORT = env.PORT || 5001;
  const httpServer = createServer(app);

  // Initialize Socket.io
  initSocket(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`🚀 PAWZZ Real-time Engine LIVE on port ${PORT}`);
    console.log(`🔗 Health Check: http://localhost:${PORT}/health`);
  });
};

startServer();
