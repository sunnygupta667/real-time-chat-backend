import { verifyToken } from "../utils/jwt.util.js";
import { sendError } from "../utils/response.util.js";
import User from "../models/User.model.js";

export const authenticate = async(req, res, next)=>{
  try {
    // Get token from headers
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
      return sendError(res, 401, 'Authorization token missing or malformed');
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = verifyToken(token);

    // Find user
    const user = await User.findById(decoded.userId);

     if (!user) {
       return sendError(res, 401, "User not found. Token is invalid.");
     }

     // Attach user to request
     req.user = user;
     next();

  } catch (error) {

    if (error.message === 'Invalid or expired token') {
      return sendError(res, 401, 'Invalid or expired token');
    }
    return sendError(res, 500, 'Authentication failed', error.message);
  }
};