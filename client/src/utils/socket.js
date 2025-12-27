import { io } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:8080";

// Create socket instance
export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Connect socket with user data
export const connectSocket = (userData) => {
  if (!socket.connected) {
    socket.connect();
    socket.emit("user_join", userData);
  }
};

// Disconnect socket
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

// Join a specific chat room
export const joinRoom = (roomId, userId) => {
  socket.emit("join_room", { roomId, userId });
};

// Send a message
export const sendMessage = (roomId, senderId, senderName, content, isAdmin) => {
  socket.emit("send_message", { roomId, senderId, senderName, content, isAdmin });
};

// Send typing indicator
export const sendTypingStatus = (roomId, userName, isTyping) => {
  socket.emit("typing", { roomId, userName, isTyping });
};

export default socket;
