import express from "express";
import {
  getConversation,
  markAsRead,
  getUnreadCount,
} from "../controllers/message.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// All message routes are protected
router.get("/:userId", authenticate, getConversation);
router.put("/read/:userId", authenticate, markAsRead);
router.get("/unread/count", authenticate, getUnreadCount);

export default router;
