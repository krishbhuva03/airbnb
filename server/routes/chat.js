import express from "express";
import {
    getChatHistory,
    getChatRooms,
    getOrCreateRoom,
    checkAdminStatus
} from "../controllers/chat.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// Get chat history for a room
router.get("/history/:roomId", [verifyToken], getChatHistory);

// Get all chat rooms (admin gets all, users get their own)
router.get("/rooms", [verifyToken], getChatRooms);

// Get or create a chat room for the current user
router.get("/my-room", [verifyToken], getOrCreateRoom);

// Check if current user is admin
router.get("/admin-status", [verifyToken], checkAdminStatus);

export default router;
