import { verifyToken } from "../utils/jwt.util.js";
import User from "../models/User.model.js";

export const socketAuthMiddleware = async (socket, next) => {

  try {
    // Get token from handshake auth or query params
    const token = socket.handshake.auth.token || socket.handshake.query.token;

    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    // Verify token
    const decoded = verifyToken(token);

    // Find user
    const user = await User.findById(decoded.userId);

    if (!user) {
      return next(new Error("Authentication error: User not found"));
    }

    // Attach user to socket
    socket.userId = user._id.toString();
    socket.user = user;
    next(); 
    
  } catch (error) {
    console.error("Socket authentication error:", error.message);
    return next(new Error("Authentication error: Invalid token")); 
  }

};