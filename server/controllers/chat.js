import Chat from "../models/Chat.js";
import User from "../models/user.js";

// Get chat history for a specific room
export const getChatHistory = async (req, res, next) => {
    try {
        const { roomId } = req.params;
        const chat = await Chat.findOne({ roomId })
            .populate('participants', 'name email isAdmin');
        
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }

        res.status(200).json({
            success: true,
            chat
        });
    } catch (error) {
        next(error);
    }
};

// Get all chat rooms (for admin) or user's rooms
export const getChatRooms = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        
        let query = {};
        if (!user.isAdmin) {
            // Regular users only see their own chats
            query = { participants: userId };
        }
        
        const chats = await Chat.find(query)
            .populate('participants', 'name email isAdmin')
            .sort({ lastActivity: -1 })
            .select('roomId participants lastActivity status');
        
        res.status(200).json({
            success: true,
            chats
        });
    } catch (error) {
        next(error);
    }
};

// Create or get existing chat room for a user
export const getOrCreateRoom = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const roomId = `room_${userId}`;
        
        let chat = await Chat.findOne({ roomId });
        
        if (!chat) {
            // Find an admin to add as participant
            const admin = await User.findOne({ isAdmin: true });
            
            chat = new Chat({
                roomId,
                participants: admin ? [userId, admin._id] : [userId],
                messages: [],
                status: "pending"
            });
            await chat.save();
        }
        
        await chat.populate('participants', 'name email isAdmin');
        
        res.status(200).json({
            success: true,
            chat
        });
    } catch (error) {
        next(error);
    }
};

// Check if current user is admin
export const checkAdminStatus = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        
        res.status(200).json({
            success: true,
            isAdmin: user?.isAdmin || false
        });
    } catch (error) {
        next(error);
    }
};
