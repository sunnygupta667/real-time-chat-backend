import User from '../models/User.model.js';
import { generateToken } from "../utils/jwt.util.js";
import { sendSuccess, sendError } from "../utils/response.util.js";

/**
 * Register a new user
 * POST /api/auth/register
 */

export const register = async (req, res ) =>{
  try {
    const { username, email, password } = req.body;

    // validation
    if (!username || !email || !password) {
      return sendError(res, 400, "All fields are required");
    }

    // check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return sendError(res, 409, "Email already registered");
      }
      if (existingUser.username === username) {
        return sendError(res, 409, "Username already taken");
      }
    }

    const user = await User.create({ username, email, password });

    // Generate Token
    const token = generateToken({ userId: user._id });

    // Send response
    sendSuccess(res, 201, "User registered successfully", {
      token,
      user: user.getPublicProfile(),
    });

    
  } catch (error) {
        console.error("Register error:", error);
        sendError(res, 500, "Registration failed", error.message);

  }
}



/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return sendError(res, 400, 'Please provide email and password');
    }

    // Find user (include password field)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return sendError(res, 401, 'Invalid credentials');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return sendError(res, 401, 'Invalid credentials');
    }

    // Generate token
    const token = generateToken({ userId: user._id });

    // Send response
    sendSuccess(res, 200, 'Login successful', {
      token,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error('Login error:', error);
    sendError(res, 500, 'Login failed', error.message);
  }
};

/**
 * Get current user profile
 * GET /api/auth/me
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    sendSuccess(res, 200, 'User profile fetched successfully', {
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error('Get profile error:', error);
    sendError(res, 500, 'Failed to fetch profile', error.message);
  }
};


/**
 * Get all users (for chat list)
 * GET /api/auth/users
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select('username email isOnline lastSeen')
      .sort({ username: 1 });

    sendSuccess(res, 200, 'Users fetched successfully', { users });
  } catch (error) {
    console.error('Get users error:', error);
    sendError(res, 500, 'Failed to fetch users', error.message);
  }
};
