
import { Server } from "socket.io";
import { socketAuthMiddleware } from "../middleware/socketAuth.middleware.js";
import SocketService from "../services/socket.service.js";

/**
 * Initialize Socket.IO server
 * @param {Object} httpServer - HTTP server instance
 * @returns {Object} Socket.IO instance
 */
export const initializeSocket = (httpServer) => {
  // Create Socket.IO server with CORS configuration
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Apply authentication middleware
  io.use(socketAuthMiddleware);

  // Initialize socket service
  const socketService = new SocketService(io);
  socketService.initialize();

  console.log("✅ Socket.IO server initialized");

  return io;
};
