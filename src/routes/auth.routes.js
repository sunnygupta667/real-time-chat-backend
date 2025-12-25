import express from "express";
import {
  register,
  login,
  getMe,
  getAllUsers,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/me", authenticate, getMe);
router.get("/users", authenticate, getAllUsers);

export default router;
