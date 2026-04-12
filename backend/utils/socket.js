import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('⚡ New client connected:', socket.id);

    socket.on('join-room', (roomId) => {
      socket.join(roomId);
      console.log(`👤 Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on('disconnect', () => {
      console.log('👋 Client disconnected');
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

// Helper to emit events to specific roles or users
export const emitUpdate = (room, event, data) => {
  if (io) {
    io.to(room).emit(event, data);
    // Also emit to all for global updates if no room specified
    if (!room) io.emit(event, data);
  }
};
