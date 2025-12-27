import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    senderName: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
});

const ChatSchema = new mongoose.Schema(
    {
        roomId: {
            type: String,
            required: true,
            unique: true,
        },
        participants: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
        messages: [MessageSchema],
        lastActivity: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            enum: ["active", "closed", "pending"],
            default: "pending",
        },
    },
    { timestamps: true }
);

// Update lastActivity when new message is added
ChatSchema.pre('save', function(next) {
    if (this.isModified('messages')) {
        this.lastActivity = Date.now();
    }
    next();
});

export default mongoose.model("Chat", ChatSchema);
