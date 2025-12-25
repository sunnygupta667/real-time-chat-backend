import Message from "../models/Message.model.js";
import { sendSuccess, sendError } from "../utils/response.util.js";
import mongoose from "mongoose";


/**
 * Get conversation between two users
 * GET /api/messages/:userId
 */
export const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;
    const limit = parseInt(req.query.limit) || 50;
    const skip = parseInt(req.query.skip) || 0;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return sendError(res, 400, 'Invalid user ID');
    }

    // Get messages
    const messages = await Message.getConversation(currentUserId, userId, limit, skip);

    sendSuccess(res, 200, 'Conversation fetched successfully', {
      messages: messages.reverse(), // Reverse to show oldest first
      count: messages.length,
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    sendError(res, 500, 'Failed to fetch conversation', error.message);
  }
};

/**
 * Mark messages as read
 * PUT /api/messages/read/:userId
 */
export const markAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return sendError(res, 400, 'Invalid user ID');
    }

    // Update unread messages from this user
    const result = await Message.updateMany(
      {
        sender: userId,
        receiver: currentUserId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
          readAt: new Date(),
        },
      }
    );

    sendSuccess(res, 200, 'Messages marked as read', {
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    sendError(res, 500, 'Failed to mark messages as read', error.message);
  }
};

/**
 * Get unread message count
 * GET /api/messages/unread/count
 */
export const getUnreadCount = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const unreadCount = await Message.countDocuments({
      receiver: currentUserId,
      isRead: false,
    });

    sendSuccess(res, 200, 'Unread count fetched successfully', {
      unreadCount,
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    sendError(res, 500, 'Failed to fetch unread count', error.message);
  }
};