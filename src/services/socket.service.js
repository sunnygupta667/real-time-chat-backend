
import User from "../models/User.model.js";
import Message from "../models/Message.model.js";

class SocketService {
  constructor(io) {
    this.io = io;
    this.userSocketMap = new Map(); // userId -> socketId mapping
  }

  /**
   * Initialize socket event handlers
   */
  initialize() {
    this.io.on("connection", (socket) => {
      console.log(`✅ User connected: ${socket.userId} (${socket.id})`);

      // Add user to online users map
      this.handleUserOnline(socket);

      // Socket event handlers
      socket.on("send_message", (data) => this.handleSendMessage(socket, data));
      socket.on("typing_start", (data) => this.handleTypingStart(socket, data));
      socket.on("typing_stop", (data) => this.handleTypingStop(socket, data));
      socket.on("message_read", (data) => this.handleMessageRead(socket, data));

      // Disconnect handler
      socket.on("disconnect", () => this.handleDisconnect(socket));
    });
  }

  /**
   * Handle user coming online
   */
  async handleUserOnline(socket) {
    try {
      const userId = socket.userId;

      // Store socket mapping
      this.userSocketMap.set(userId, socket.id);

      // Update user status in database
      await User.findByIdAndUpdate(userId, {
        isOnline: true,
        socketId: socket.id,
        lastSeen: new Date(),
      });

      // Broadcast online status to all connected users
      this.io.emit("user_status", {
        userId,
        isOnline: true,
        lastSeen: new Date(),
      });

      console.log(`📡 User ${userId} is now online`);
    } catch (error) {
      console.error("Error handling user online:", error);
    }
  }

  /**
   * Handle sending a message
   */
  async handleSendMessage(socket, data) {
    try {
      const { receiverId, content, messageType = "text" } = data;
      const senderId = socket.userId;

      // Validation
      if (!receiverId || !content) {
        socket.emit("error", {
          message: "Receiver ID and content are required",
        });
        return;
      }

      // Create message in database
      const message = await Message.create({
        sender: senderId,
        receiver: receiverId,
        content,
        messageType,
      });

      // Populate sender and receiver info
      await message.populate("sender", "username email isOnline");
      await message.populate("receiver", "username email isOnline");

      // Send to receiver if online
      const receiverSocketId = this.userSocketMap.get(receiverId);

      if (receiverSocketId) {
        this.io.to(receiverSocketId).emit("receive_message", {
          message: message.toObject(),
        });
        console.log(`📨 Message sent to ${receiverId}`);
      } else {
        console.log(`📭 User ${receiverId} is offline, message saved`);
      }

      // Confirm to sender
      socket.emit("message_sent", {
        message: message.toObject(),
        tempId: data.tempId, // If client sends temporary ID for optimistic updates
      });
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  }

  /**
   * Handle typing start indicator
   */
  handleTypingStart(socket, data) {
    try {
      const { receiverId } = data;
      const senderId = socket.userId;

      const receiverSocketId = this.userSocketMap.get(receiverId);

      if (receiverSocketId) {
        this.io.to(receiverSocketId).emit("user_typing", {
          userId: senderId,
          isTyping: true,
        });
      }
    } catch (error) {
      console.error("Error handling typing start:", error);
    }
  }

  /**
   * Handle typing stop indicator
   */
  handleTypingStop(socket, data) {
    try {
      const { receiverId } = data;
      const senderId = socket.userId;

      const receiverSocketId = this.userSocketMap.get(receiverId);

      if (receiverSocketId) {
        this.io.to(receiverSocketId).emit("user_typing", {
          userId: senderId,
          isTyping: false,
        });
      }
    } catch (error) {
      console.error("Error handling typing stop:", error);
    }
  }

  /**
   * Handle message read receipt
   */
  async handleMessageRead(socket, data) {
    try {
      const { messageId, senderId } = data;
      const readerId = socket.userId;

      // Update message as read
      await Message.findByIdAndUpdate(messageId, {
        isRead: true,
        readAt: new Date(),
      });

      // Notify sender if online
      const senderSocketId = this.userSocketMap.get(senderId);

      if (senderSocketId) {
        this.io.to(senderSocketId).emit("message_read_receipt", {
          messageId,
          readerId,
          readAt: new Date(),
        });
      }
    } catch (error) {
      console.error("Error handling message read:", error);
    }
  }

  /**
   * Handle user disconnect
   */
  async handleDisconnect(socket) {
    try {
      const userId = socket.userId;

      // Remove from online users map
      this.userSocketMap.delete(userId);

      // Update user status in database
      await User.findByIdAndUpdate(userId, {
        isOnline: false,
        socketId: null,
        lastSeen: new Date(),
      });

      // Broadcast offline status to all connected users
      this.io.emit("user_status", {
        userId,
        isOnline: false,
        lastSeen: new Date(),
      });

      console.log(`❌ User disconnected: ${userId} (${socket.id})`);
    } catch (error) {
      console.error("Error handling disconnect:", error);
    }
  }

  /**
   * Get online users count
   */
  getOnlineUsersCount() {
    return this.userSocketMap.size;
  }
}

export default SocketService;
