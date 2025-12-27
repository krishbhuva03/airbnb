import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
import UserRoutes from "./routes/user.js";
import PropertyRoutes from "./routes/properties.js";
import ContactRoutes from "./routes/contact.js";
import ChatRoutes from "./routes/chat.js";
import Chat from "./models/Chat.js";
import User from "./models/user.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);

// CORS configuration - used by both Express and Socket.IO
const corsOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',') 
  : ["http://localhost:3000", "http://localhost:3001"];

// Socket.IO setup with CORS
const io = new Server(httpServer, {
  cors: {
    origin: corsOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors({
  origin: corsOrigins,
  credentials: true
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

app.post('/api/test', (req, res) => {
  console.log('Received test POST data:', req.body);
  res.json({ message: 'POST request received!', data: req.body });
});

app.use("/api/user", UserRoutes)
app.use("/api/property", PropertyRoutes)
app.use("/api/contact", ContactRoutes)
app.use("/api/chat", ChatRoutes)

// Track online users
const onlineUsers = new Map(); // Map<socketId, { odId, name, isAdmin }>
const userSockets = new Map(); // Map<userId, socketId>

// Socket.IO event handlers
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User joins with their info
  socket.on("user_join", async (userData) => {
    try {
      const { userId, name, isAdmin } = userData;
      
      onlineUsers.set(socket.id, { userId, name, isAdmin });
      userSockets.set(userId, socket.id);
      
      // Notify all clients about online users update
      io.emit("online_users", Array.from(onlineUsers.values()));
      
      console.log(`${name} joined the chat (Admin: ${isAdmin})`);
    } catch (error) {
      console.error("Error in user_join:", error);
    }
  });

  // User joins a specific room
  socket.on("join_room", async ({ roomId, userId }) => {
    try {
      socket.join(roomId);
      
      // Get chat history
      const chat = await Chat.findOne({ roomId });
      if (chat) {
        socket.emit("chat_history", chat.messages);
      }
      
      console.log(`User ${userId} joined room ${roomId}`);
    } catch (error) {
      console.error("Error joining room:", error);
    }
  });

  // Handle new message
  socket.on("send_message", async ({ roomId, senderId, senderName, content, isAdmin }) => {
    try {
      const message = {
        sender: senderId,
        senderName,
        content,
        timestamp: new Date(),
        isRead: false
      };

      // Save to database
      let chat = await Chat.findOne({ roomId });
      if (!chat) {
        chat = new Chat({
          roomId,
          participants: [senderId],
          messages: [],
          status: "active"
        });
      }
      
      chat.messages.push(message);
      chat.status = "active";
      await chat.save();

      // Broadcast to room
      io.to(roomId).emit("new_message", {
        ...message,
        _id: chat.messages[chat.messages.length - 1]._id
      });

      // Notify admins if it's from a regular user
      if (!isAdmin) {
        // Emit to all admin sockets
        onlineUsers.forEach((user, socketId) => {
          if (user.isAdmin) {
            io.to(socketId).emit("new_support_request", {
              roomId,
              senderName,
              preview: content.substring(0, 50)
            });
          }
        });
      }

      console.log(`Message in ${roomId}: ${content.substring(0, 30)}...`);
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("message_error", { error: "Failed to send message" });
    }
  });

  // Handle typing indicator
  socket.on("typing", ({ roomId, userName, isTyping }) => {
    socket.to(roomId).emit("user_typing", { userName, isTyping });
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    const user = onlineUsers.get(socket.id);
    if (user) {
      userSockets.delete(user.userId);
      onlineUsers.delete(socket.id);
      io.emit("online_users", Array.from(onlineUsers.values()));
      console.log(`${user.name} disconnected`);
    } else {
      console.log("User disconnected:", socket.id);
    }
  });
});

// error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

const connectDB = () => {
  mongoose.set("strictQuery", true);
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((err) => {
      console.error("Failed to connect with MongoDB Atlas");
      console.error(err);
    });
};

const startServer = async () => {
  try {
    connectDB();
    const PORT = process.env.PORT || 8080;
    httpServer.listen(PORT, () => console.log(`Server started at ${PORT} with Socket.IO`));
  } catch (error) {
    console.log(error);
  }
};

startServer();
