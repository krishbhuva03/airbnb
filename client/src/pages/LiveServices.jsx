import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Send as SendIcon, 
  SupportAgent as SupportIcon,
  Circle as OnlineIcon,
  ChatBubbleOutline as ChatIcon,
  Person as PersonIcon,
  Notifications as NotificationIcon
} from '@mui/icons-material';
import { socket, connectSocket, joinRoom, sendMessage, sendTypingStatus } from '../utils/socket';
import { getChatRooms, checkAdminStatus } from '../api';

// Layout Containers
const PageContainer = styled.div`
  display: flex;
  height: calc(100vh - 100px);
  padding: 20px;
  gap: 20px;
  color: white;
  
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 16px;
    height: calc(100vh - 80px);
  }
`;

// Sidebar for Admin
const Sidebar = styled.div`
  width: 300px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  @media (max-width: 768px) {
    width: 100%;
    max-height: ${({ isExpanded }) => isExpanded ? '300px' : '60px'};
    transition: max-height 0.3s ease;
  }
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
  cursor: pointer;
  
  h3 {
    margin: 0;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const RoomCount = styled.span`
  background: ${({ theme }) => theme.primary};
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
`;

const RoomsList = styled.div`
  flex: 1;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
  }
`;

const RoomItem = styled.div`
  padding: 14px 20px;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  background: ${({ isActive }) => isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent'};
  transition: background 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const RoomInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const RoomAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${({ theme }) => theme.primary}, #6366f1);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RoomDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const RoomName = styled.div`
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RoomPreview = styled.div`
  font-size: 0.8rem;
  opacity: 0.7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UnreadBadge = styled.div`
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  background: #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  padding: 0 6px;
`;

// Main Chat Area
const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  color: white;
  min-width: 0;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  
  @media (max-width: 480px) {
    padding: 16px;
    gap: 12px;
    margin-bottom: 16px;
    border-radius: 12px;
  }
`;

const IconWrapper = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${({ theme }) => theme.primary}, #6366f1);
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 480px) {
    width: 48px;
    height: 48px;
  }
`;

const HeaderInfo = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin: 0 0 4px 0;
  
  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

const Subtitle = styled.p`
  margin: 0;
  opacity: 0.8;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const StatusDot = styled(OnlineIcon)`
  font-size: 10px !important;
  color: ${({ connected }) => connected ? '#22c55e' : '#ef4444'};
`;

const AdminBadge = styled.span`
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  overflow: hidden;
  
  @media (max-width: 480px) {
    border-radius: 12px;
  }
`;

const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  @media (max-width: 480px) {
    padding: 16px 12px;
    gap: 10px;
  }
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }
`;

const Message = styled.div`
  max-width: 75%;
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 0.95rem;
  line-height: 1.4;
  align-self: ${({ isOwn }) => isOwn ? 'flex-end' : 'flex-start'};
  background: ${({ isOwn, theme }) => 
    isOwn 
      ? `linear-gradient(135deg, ${theme.primary}, #6366f1)` 
      : 'rgba(255, 255, 255, 0.15)'
  };
  
  @media (max-width: 480px) {
    max-width: 85%;
    padding: 10px 14px;
    font-size: 0.9rem;
  }
`;

const MessageSender = styled.span`
  display: block;
  font-size: 0.75rem;
  opacity: 0.7;
  margin-bottom: 4px;
`;

const MessageTime = styled.span`
  display: block;
  font-size: 0.7rem;
  opacity: 0.6;
  margin-top: 4px;
  text-align: ${({ isOwn }) => isOwn ? 'right' : 'left'};
`;

const TypingIndicator = styled.div`
  font-size: 0.85rem;
  opacity: 0.7;
  font-style: italic;
  padding: 8px 16px;
`;

const InputArea = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (max-width: 480px) {
    padding: 12px;
    gap: 10px;
  }
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 14px 18px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  
  &:focus {
    border-color: ${({ theme }) => theme.primary};
  }
  
  @media (max-width: 480px) {
    padding: 12px 16px;
    font-size: 16px;
  }
`;

const SendButton = styled.button`
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, ${({ theme }) => theme.primary}, #6366f1);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, opacity 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  @media (max-width: 480px) {
    width: 46px;
    height: 46px;
  }
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  opacity: 0.7;
  text-align: center;
  padding: 20px;
`;

const EmptyIcon = styled(ChatIcon)`
  font-size: 64px !important;
  opacity: 0.5;
`;

const LoginPrompt = styled.div`
  text-align: center;
  padding: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  margin-top: 40px;
  
  h2 {
    margin-bottom: 16px;
  }
  
  p {
    opacity: 0.8;
  }
`;

const SelectRoomMessage = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  opacity: 0.7;
  text-align: center;
  padding: 40px;
  
  svg {
    font-size: 80px !important;
    opacity: 0.5;
  }
`;

const LiveServices = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [chatRooms, setChatRooms] = useState([]);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [newMessageRooms, setNewMessageRooms] = useState(new Set());
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check admin status and fetch rooms
  useEffect(() => {
    const initializeAdmin = async () => {
      if (!currentUser) return;
      
      try {
        const token = localStorage.getItem('airbnb-app-token');
        if (!token) return;

        // Check if user is admin
        const adminResponse = await checkAdminStatus(token);
        const userIsAdmin = adminResponse?.data?.isAdmin || currentUser.isAdmin || false;
        setIsAdmin(userIsAdmin);

        if (userIsAdmin) {
          // Fetch all chat rooms for admin
          const roomsResponse = await getChatRooms(token);
          if (roomsResponse?.data?.chats) {
            setChatRooms(roomsResponse.data.chats);
          }
        }
      } catch (error) {
        console.error('Error initializing admin:', error);
        // Fallback to currentUser.isAdmin
        setIsAdmin(currentUser.isAdmin || false);
      }
    };

    initializeAdmin();
  }, [currentUser]);

  // Socket connection and event handlers
  useEffect(() => {
    if (!currentUser) return;

    const userId = currentUser._id || currentUser.id;

    // Connect socket
    connectSocket({
      userId,
      name: currentUser.name,
      isAdmin: currentUser.isAdmin || false
    });

    // Socket event listeners
    const onConnect = () => {
      setIsConnected(true);
      
      // If not admin, auto-join their own room
      if (!isAdmin) {
        const userRoomId = `room_${userId}`;
        setRoomId(userRoomId);
        joinRoom(userRoomId, userId);
      }
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onChatHistory = (history) => {
      setMessages(history);
    };

    const onNewMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    const onUserTyping = ({ userName, isTyping }) => {
      setTypingUser(isTyping ? userName : null);
    };

    // Admin: listen for new support requests
    const onNewSupportRequest = ({ roomId: newRoomId, senderName, preview }) => {
      console.log('New support request:', senderName, preview);
      setNewMessageRooms((prev) => new Set([...prev, newRoomId]));
      
      // Refresh chat rooms list
      const fetchRooms = async () => {
        try {
          const token = localStorage.getItem('airbnb-app-token');
          const roomsResponse = await getChatRooms(token);
          if (roomsResponse?.data?.chats) {
            setChatRooms(roomsResponse.data.chats);
          }
        } catch (error) {
          console.error('Error fetching rooms:', error);
        }
      };
      fetchRooms();
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('chat_history', onChatHistory);
    socket.on('new_message', onNewMessage);
    socket.on('user_typing', onUserTyping);
    socket.on('new_support_request', onNewSupportRequest);

    // Check if already connected
    if (socket.connected) {
      setIsConnected(true);
      if (!isAdmin) {
        const userRoomId = `room_${userId}`;
        setRoomId(userRoomId);
        joinRoom(userRoomId, userId);
      }
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('chat_history', onChatHistory);
      socket.off('new_message', onNewMessage);
      socket.off('user_typing', onUserTyping);
      socket.off('new_support_request', onNewSupportRequest);
    };
  }, [currentUser, isAdmin]);

  // Handle room selection for admin
  const handleSelectRoom = (selectedRoomId) => {
    const userId = currentUser._id || currentUser.id;
    
    // Leave current room and join new one
    setMessages([]);
    setRoomId(selectedRoomId);
    joinRoom(selectedRoomId, userId);
    
    // Clear new message indicator
    setNewMessageRooms((prev) => {
      const updated = new Set(prev);
      updated.delete(selectedRoomId);
      return updated;
    });
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    
    // Send typing indicator
    if (roomId && currentUser) {
      sendTypingStatus(roomId, currentUser.name, true);
      
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Stop typing after 2 seconds of no input
      typingTimeoutRef.current = setTimeout(() => {
        sendTypingStatus(roomId, currentUser.name, false);
      }, 2000);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || !roomId || !currentUser) return;
    
    const userId = currentUser._id || currentUser.id;
    
    sendMessage(
      roomId, 
      userId, 
      currentUser.name, 
      inputMessage.trim(), 
      currentUser.isAdmin || false
    );
    
    setInputMessage('');
    
    // Stop typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    sendTypingStatus(roomId, currentUser.name, false);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getRoomDisplayName = (room) => {
    // Find the non-admin participant
    const nonAdminParticipant = room.participants?.find(p => !p.isAdmin);
    return nonAdminParticipant?.name || room.roomId.replace('room_', 'User ');
  };

  if (!currentUser) {
    return (
      <PageContainer>
        <Container>
          <LoginPrompt>
            <SupportIcon style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.7 }} />
            <h2>Live Support</h2>
            <p>Please sign in to access live support and chat with our team.</p>
          </LoginPrompt>
        </Container>
      </PageContainer>
    );
  }

  // Admin View with Sidebar
  if (isAdmin) {
    return (
      <PageContainer>
        <Sidebar isExpanded={sidebarExpanded}>
          <SidebarHeader onClick={() => setSidebarExpanded(!sidebarExpanded)}>
            <h3>
              <NotificationIcon style={{ fontSize: '20px' }} />
              Support Chats
            </h3>
            <RoomCount>{chatRooms.length}</RoomCount>
          </SidebarHeader>
          <RoomsList>
            {chatRooms.length === 0 ? (
              <EmptyState style={{ padding: '20px' }}>
                <p>No active chats</p>
              </EmptyState>
            ) : (
              chatRooms.map((room) => (
                <RoomItem 
                  key={room.roomId}
                  isActive={roomId === room.roomId}
                  onClick={() => handleSelectRoom(room.roomId)}
                >
                  <RoomInfo>
                    <RoomAvatar>
                      <PersonIcon />
                    </RoomAvatar>
                    <RoomDetails>
                      <RoomName>{getRoomDisplayName(room)}</RoomName>
                      <RoomPreview>
                        {room.status === 'pending' ? 'Awaiting response...' : 'Active conversation'}
                      </RoomPreview>
                    </RoomDetails>
                    {newMessageRooms.has(room.roomId) && (
                      <UnreadBadge>!</UnreadBadge>
                    )}
                  </RoomInfo>
                </RoomItem>
              ))
            )}
          </RoomsList>
        </Sidebar>

        <Container>
          <Header>
            <IconWrapper>
              <SupportIcon style={{ fontSize: '28px' }} />
            </IconWrapper>
            <HeaderInfo>
              <Title>
                Admin Support Panel
                <AdminBadge style={{ marginLeft: '12px' }}>ADMIN</AdminBadge>
              </Title>
              <Subtitle>
                <StatusDot connected={isConnected} />
                {isConnected ? 'Connected' : 'Connecting...'}
                {roomId && ` • ${getRoomDisplayName(chatRooms.find(r => r.roomId === roomId) || { roomId })}`}
              </Subtitle>
            </HeaderInfo>
          </Header>
          
          <ChatContainer>
            {!roomId ? (
              <SelectRoomMessage>
                <ChatIcon />
                <h3>Select a conversation</h3>
                <p>Choose a chat from the sidebar to start responding to user queries.</p>
              </SelectRoomMessage>
            ) : (
              <>
                <MessagesArea>
                  {messages.length === 0 ? (
                    <EmptyState>
                      <EmptyIcon />
                      <p>No messages in this conversation yet.</p>
                    </EmptyState>
                  ) : (
                    messages.map((msg, index) => {
                      const userId = currentUser._id || currentUser.id;
                      const isOwn = msg.sender === userId || msg.sender?._id === userId;
                      
                      return (
                        <Message key={msg._id || index} isOwn={isOwn}>
                          {!isOwn && <MessageSender>{msg.senderName}</MessageSender>}
                          {msg.content}
                          <MessageTime isOwn={isOwn}>{formatTime(msg.timestamp)}</MessageTime>
                        </Message>
                      );
                    })
                  )}
                  {typingUser && (
                    <TypingIndicator>{typingUser} is typing...</TypingIndicator>
                  )}
                  <div ref={messagesEndRef} />
                </MessagesArea>
                
                <InputArea as="form" onSubmit={handleSendMessage}>
                  <MessageInput
                    type="text"
                    placeholder="Type your response..."
                    value={inputMessage}
                    onChange={handleInputChange}
                    disabled={!isConnected}
                  />
                  <SendButton type="submit" disabled={!inputMessage.trim() || !isConnected}>
                    <SendIcon />
                  </SendButton>
                </InputArea>
              </>
            )}
          </ChatContainer>
        </Container>
      </PageContainer>
    );
  }

  // Regular User View
  return (
    <PageContainer>
      <Container>
        <Header>
          <IconWrapper>
            <SupportIcon style={{ fontSize: '28px' }} />
          </IconWrapper>
          <HeaderInfo>
            <Title>Live Support</Title>
            <Subtitle>
              <StatusDot connected={isConnected} />
              {isConnected ? 'Connected' : 'Connecting...'}
            </Subtitle>
          </HeaderInfo>
        </Header>
        
        <ChatContainer>
          <MessagesArea>
            {messages.length === 0 ? (
              <EmptyState>
                <EmptyIcon />
                <p>No messages yet. Start a conversation!</p>
                <span style={{ fontSize: '0.85rem' }}>
                  Our support team is here to help you.
                </span>
              </EmptyState>
            ) : (
              messages.map((msg, index) => {
                const userId = currentUser._id || currentUser.id;
                const isOwn = msg.sender === userId || msg.sender?._id === userId;
                
                return (
                  <Message key={msg._id || index} isOwn={isOwn}>
                    {!isOwn && <MessageSender>{msg.senderName}</MessageSender>}
                    {msg.content}
                    <MessageTime isOwn={isOwn}>{formatTime(msg.timestamp)}</MessageTime>
                  </Message>
                );
              })
            )}
            {typingUser && (
              <TypingIndicator>{typingUser} is typing...</TypingIndicator>
            )}
            <div ref={messagesEndRef} />
          </MessagesArea>
          
          <InputArea as="form" onSubmit={handleSendMessage}>
            <MessageInput
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={handleInputChange}
              disabled={!isConnected}
            />
            <SendButton type="submit" disabled={!inputMessage.trim() || !isConnected}>
              <SendIcon />
            </SendButton>
          </InputArea>
        </ChatContainer>
      </Container>
    </PageContainer>
  );
};

export default LiveServices;
