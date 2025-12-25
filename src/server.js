import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer } from "http";
import cors from "cors";

import connectDB from "./config/database.js";
import { initializeSocket } from "./config/socket.js";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";

const app = express();
const httpServer = createServer(app);

/* =========================
   🌍 GLOBAL CORS (ALLOW ALL)
   ========================= */
app.use(
  cors({
    origin: "*", // allow all origins
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* =========================
   📦 BODY PARSERS
   ========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   📝 REQUEST LOGGING
   ========================= */
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
  });
}

/* =========================
   ❤️ HEALTH CHECK
   ========================= */
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

/* =========================
   🚏 API ROUTES
   ========================= */
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

/* =========================
   ❌ 404 HANDLER
   ========================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* =========================
   🔥 GLOBAL ERROR HANDLER
   ========================= */
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

/* =========================
   🔌 SOCKET INITIALIZATION
   ========================= */
initializeSocket(httpServer);

/* =========================
   🚀 START SERVER
   ========================= */
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    httpServer.listen(PORT, () => {
      console.log(`
🚀 Server running on port ${PORT}
📡 Socket.IO ready
🌍 Environment: ${process.env.NODE_ENV || "development"}
      `);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});

startServer();
