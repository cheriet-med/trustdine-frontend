'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import useFetchUser from '../requests/fetchUser';
import { 
  Search, Send, Paperclip, Smile, MoreHorizontal, Star, 
  Phone, Video, Info, ArrowLeft, Camera, Image, Menu 
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface User {
  id: string ;
  email: string;
  full_name: string;
  profile_image: string;
  is_active?: boolean;
}

interface Message {
  id: string;
  sender: User;
  receiver: User;
  content: string;
  timestamp: string;
  is_read: boolean;
}

interface Conversation {
  user: User;
  last_message: Message;
  unread_count: number;
}

// Loading skeleton component for conversations
const ConversationSkeleton = () => (
  <div className="p-4 border-b border-gray-100">
    <div className="flex items-center space-x-3">
      <div className="w-12 h-12 md:w-10 md:h-10 bg-gray-200 rounded-full animate-pulse"></div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-12"></div>
        </div>
        <div className="h-3 bg-gray-200 rounded animate-pulse w-32 mt-2"></div>
      </div>
    </div>
  </div>
);

// Loading skeleton component for messages
const MessageSkeleton = ({ isOwn }: { isOwn: boolean }) => (
  <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
    <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
      isOwn ? 'bg-gray-200 rounded-br-md' : 'bg-gray-200 rounded-bl-md'
    } animate-pulse`}>
      <div className="h-4 bg-gray-300 rounded w-20 mb-1"></div>
      <div className="h-3 bg-gray-300 rounded w-12"></div>
    </div>
  </div>
);

const MessagesComponent: React.FC = () => {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [wsConnecting, setWsConnecting] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  
  const ws = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchParams = useSearchParams();
  const userId = searchParams.get('id') || 0;
  const {Users} = useFetchUser(userId || session?.user.id)
  
 useEffect(() => {
  if (userId && Users && Users.id) {
    const med = {
      id: String(Users.id),
      email: Users.email,
      full_name: Users.full_name || '',
      profile_image: Users.profile_image,
      is_active: false,
    };
    
    setSelectedContact(med);
    setIsMobileView(true);
    
    // Also fetch messages for this contact if we have a session
    if (status === "authenticated" && session?.accessToken) {
      fetchMessages(String(Users.id));
    }
  }
}, [userId, Users, status, session]);

// Add this additional useEffect to handle the case where session loads after the user data
useEffect(() => {
  if (selectedContact && status === "authenticated" && session?.accessToken && messages.length === 0) {
    fetchMessages(selectedContact.id);
  }
}, [selectedContact, status, session, messages.length]);




  // WebSocket connection management
 
const connectWebSocket = useCallback(() => {
  if (status !== "authenticated" || !session?.accessToken) {
    return;
  }

  setWsConnecting(true);
  
  try {
    ws.current = new WebSocket(
      `wss://api.goamico.com/ws/chat/?token=${session.accessToken}`
    );

    ws.current.onopen = () => {
     // console.log("✅ WebSocket connected");
      setWsConnected(true);
      setWsConnecting(false);
      setReconnectAttempts(0);
      
      // Add a small delay and check readyState before sending
      setTimeout(() => {
        if (ws.current?.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify({
            type: "authenticate",
            token: `Bearer ${session.accessToken}`,
          }));
        }
      }, 100); // 100ms delay to ensure connection is fully established
    };

    // ... rest of your WebSocket handlers remain the same
    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
       // console.log("📩 WebSocket message:", data);
        
        switch (data.type) {
          case 'new_message':
            handleNewMessage(data.message);
            break;
          case 'user_typing':
            handleUserTyping(data.user_id);
            break;
          case 'user_stopped_typing':
            handleUserStoppedTyping(data.user_id);
            break;
          case 'message_read':
            handleMessageRead(data.message_id);
            break;
          default:
            console.log('Unknown message type:', data.type);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.current.onerror = (error) => {
    //  console.error("❌ WebSocket error:", error);
      setWsConnecting(false);
    };

    ws.current.onclose = (event) => {
     // console.log("⚠️ WebSocket closed:", event.code, event.reason);
      setWsConnected(false);
      setWsConnecting(false);
      
      if (reconnectAttempts < 5) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
        reconnectTimeoutRef.current = setTimeout(() => {
          setReconnectAttempts(prev => prev + 1);
          connectWebSocket();
        }, delay);
      }
    };

  } catch (error) {
  //  console.error("❌ WebSocket connection failed:", error);
    setWsConnecting(false);
  }
}, [status, session, reconnectAttempts]);

  // Cleanup WebSocket on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  // Connect to WebSocket when authenticated
  useEffect(() => {
    if (status === "authenticated" && session?.accessToken) {
      connectWebSocket();
    } else {
      if (ws.current) {
        ws.current.close();
      }
    }
  }, [status, session, connectWebSocket]);

  useEffect(() => {
    if (status === "authenticated" && session?.accessToken) {
      fetchConversations();
    }
  }, [status, session]);

  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.accessToken &&
      selectedContact
    ) {
      fetchMessages(selectedContact.id);
    }
  }, [status, session, selectedContact]);

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      setIsLoadingConversations(true);
      setError(null);
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}api/conversations/`, {
        headers: {
          'Authorization': `JWT ${session?.accessToken}`
        }
      });
      //console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }
      
      const data = await response.json();
      setConversations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoadingConversations(false);
    }
  };

  const fetchMessages = async (userId: string) => {
    try {
      setIsLoadingMessages(true);
      setError(null);
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}api/messages/${userId}/`, {
        headers: {
          'Authorization': `JWT ${session?.accessToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      
      const data = await response.json();
     // console.log("📥 Fetched messages data:", data);
    //  console.log("📱 Current session user ID:", session?.user?.id);
      
      // Debug message sender IDs
      data.forEach((msg: Message, index: number) => {
     //   console.log(`Message ${index}: sender.id = "${msg.sender.id}", session.user.id = "${session?.user?.id}", isOwn = ${msg.sender.id === session?.user?.id}`);
      });
      
      setMessages(data);
      
      // Mark messages as read
      await markMessagesAsRead(userId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const markMessagesAsRead = async (userId: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_URL}api/messages/${userId}/read/`, {
        method: 'POST',
        headers: {
          'Authorization': `JWT ${session?.accessToken}`
        }
      });
      
      // Update unread count in conversations
      setConversations(prev => prev.map(convo => 
        convo.user.id === userId 
          ? { ...convo, unread_count: 0 }
          : convo
      ));
    } catch (err) {
      console.error('Failed to mark messages as read:', err);
    }
  };

  const handleNewMessage = (message: Message) => {
 //   console.log("📨 Handling new message:", message);
    
    // Add message to current chat if it's from/to the selected contact
    if (selectedContact && 
        (message.sender.id === selectedContact.id || message.receiver.id === selectedContact.id)) {
      setMessages(prev => {
        // Prevent duplicate messages
        const exists = prev.some(m => m.id === message.id);
        if (exists) return prev;
        return [...prev, message];
      });
      
      // Mark as read if we're viewing this conversation
      if (message.sender.id === selectedContact.id) {
        markMessagesAsRead(selectedContact.id);
      }
    }
    
    // Update conversations list
    setConversations(prev => {
      const updated = [...prev];
      const otherUserId = message.sender.id === session?.user?.id ? message.receiver.id : message.sender.id;
      const otherUser = message.sender.id === session?.user?.id ? message.receiver : message.sender;
      
      const convoIndex = updated.findIndex(c => c.user.id === otherUserId);
      
      if (convoIndex !== -1) {
        // Update existing conversation
        const updatedConvo = {
          ...updated[convoIndex],
          last_message: message,
          unread_count: message.sender.id !== session?.user?.id && 
                       (!selectedContact || selectedContact.id !== message.sender.id)
                       ? updated[convoIndex].unread_count + 1 
                       : updated[convoIndex].unread_count
        };
        
        // Remove from current position and add to top
        updated.splice(convoIndex, 1);
        updated.unshift(updatedConvo);
      } else {
        // Create new conversation
        updated.unshift({
          user: otherUser,
          last_message: message,
          unread_count: message.sender.id !== session?.user?.id ? 1 : 0
        });
      }
      
      return updated;
    });
  };






  const handleMessageRead = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, is_read: true } : msg
    ));
  };

  const handleUserTyping = (userId: string) => {
    setTypingUsers(prev => new Set(prev).add(userId));
    
    // Clear any existing timeout for this user
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set timeout to remove typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }, 5000);
  };

  const handleUserStoppedTyping = (userId: string) => {
    setTypingUsers(prev => {
      const newSet = new Set(prev);
      newSet.delete(userId);
      return newSet;
    });
  };

const sendMessage = async () => {
  if (!newMessage.trim() || !selectedContact || isSendingMessage) return;

  // Check WebSocket state more thoroughly
  if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
   // console.log("WebSocket not ready, attempting to reconnect...");
    connectWebSocket();
    
    // Wait for connection with timeout
    let attempts = 0;
    const maxAttempts = 10;
    
    while ((!ws.current || ws.current.readyState !== WebSocket.OPEN) && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 500));
      attempts++;
    }
    
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      setError('Unable to connect. Please try again.');
      return;
    }
  }

  const messageContent = newMessage.trim();
  
  try {
    setIsSendingMessage(true);
    
    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      sender: {
        id: session?.user?.id || '',
        email: session?.user?.email || '',
        full_name: session?.user?.name || '',
        profile_image: session?.user?.image || ''
      },
      receiver: selectedContact,
      content: messageContent,
      timestamp: new Date().toISOString(),
      is_read: false
    };

    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage('');
    stopTyping();
    
    // Double-check WebSocket state before sending
    if (ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'send_message',
        receiver_id: selectedContact.id,
        content: messageContent
      }));
    } else {
      // Remove optimistic message if can't send
      setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
      setError('Connection lost. Please try again.');
    }
  } catch (err) {
    setMessages(prev => prev.filter(m => m.id.startsWith('temp-')));
    setError('Failed to send message');
//    console.error('Send message error:', err);
  } finally {
    setIsSendingMessage(false);
  }
};

  const handleTyping = () => {
    if (!selectedContact || !ws.current) return;
    
    if (!isTyping) {
      setIsTyping(true);
      if (ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({
          type: 'typing',
          receiver_id: selectedContact.id
        }));
      }
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  };

  const stopTyping = () => {
    if (!selectedContact || !ws.current || !isTyping) return;
    
    if (ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'stopped_typing',
        receiver_id: selectedContact.id
      }));
    }
    setIsTyping(false);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleContactClick = async (user: User) => {
    setSelectedContact(user);
    setIsMobileView(true);
    
    // Mark messages as read when opening conversation
    if (user.id) {
      await markMessagesAsRead(user.id);
    }
  };

  const handleBackToList = () => {
    setSelectedContact(null);
    setIsMobileView(false);
    stopTyping();
  };

  const handleReconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    setReconnectAttempts(0);
    connectWebSocket();
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString();
    }
  };

  // Filter conversations based on search term
  const filteredConversations = conversations.filter(convo =>
    convo.user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    convo.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );




  // Show loading if session is still loading
  if (status === 'loading') {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <div className="h-8 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="h-12 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {[...Array(6)].map((_, i) => (
              <ConversationSkeleton key={i} />
            ))}
          </div>
        </div>
        <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          <p className="mt-4 text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Render message component with proper alignment
  const renderMessage = (message: Message) => {
    const currentUserId = session?.user?.id;
    const messageSenderId = message.sender.id;
    
    // Convert both IDs to strings for comparison (in case one is number, one is string)
    const isOwn = String(messageSenderId) === String(currentUserId);
    
    //console.log(`🔍 Message alignment check:`, {
    //  messageId: message.id,
    //  messageSenderId,
    //  currentUserId,
    //  isOwn,
    //  messageContent: message.content.substring(0, 20) + '...'
    //});
    
    return (
      <div
        key={message.id}
        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
      >
        <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
          isOwn 
            ? 'bg-accent text-white rounded-br-md' 
            : 'bg-white text-gray-800 rounded-bl-md shadow-sm'
        }`}>
          <p className="text-sm leading-relaxed">{message.content}</p>
          <p className={`text-xs mt-1 ${
            isOwn ? 'text-gray-100' : 'text-gray-500'
          }`}>
            {formatTime(message.timestamp)}
            {isOwn && message.is_read && (
              <span className="ml-1">✓✓</span>
            )}
          </p>
        </div>
      </div>
    );
  };

  // Mobile Chat View Component
  const MobileChatView = () => {
    if (!selectedContact) return null;

    const isTypingNow = typingUsers.has(selectedContact.id);

    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col md:hidden">
        {/* Mobile Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleBackToList}
              className="p-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="relative">
              <img
                src={`${process.env.NEXT_PUBLIC_IMAGE}/${selectedContact.profile_image}`|| '/profile.webp'}
                alt={selectedContact.full_name}
                className="w-10 h-10 rounded-full object-cover"
              />
              {selectedContact.is_active && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{selectedContact.full_name}</h3>
              <p className="text-sm text-gray-500">
                {isTypingNow ? 'Typing...' : selectedContact.is_active ? 'Active now' : 'Last seen recently'}
              </p>
            </div>
          </div>
                  {/* Connection status indicator */}
          {wsConnecting && (
            <div className="flex items-center justify-center mt-2 text-xs text-gray-500">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-400 mr-2"></div>
              Connecting...
            </div>
          )}
          {!wsConnected && !wsConnecting && (
            <div className="flex items-center justify-center mt-2 text-xs text-red-500">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              Disconnected - <button onClick={handleReconnect} className="ml-1 underline">Online</button>
            </div>
          )}
        </div>

        {/* Mobile Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {isLoadingMessages ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <MessageSkeleton key={i} isOwn={i % 2 === 0} />
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-32 text-red-500">
              <p className="mb-2">{error}</p>
              <button 
                onClick={() => selectedContact && fetchMessages(selectedContact.id)}
                className="text-sm bg-highlights text-white px-3 py-1 rounded hover:bg-red-200"
              >
                Retry
              </button>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex justify-center items-center h-32 text-gray-500">
              No messages yet. Start a conversation!
            </div>
          ) : (
            <>
              {messages.map(renderMessage)}
              {isTypingNow && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 rounded-2xl rounded-bl-md shadow-sm px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Mobile Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={wsConnected ? "Type a message..." : "Connecting..."}
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  if (e.target.value.trim()) {
                    handleTyping();
                  } else {
                    stopTyping();
                  }
                }}
                onKeyPress={handleKeyPress}
                onBlur={stopTyping}
                disabled={isSendingMessage || !wsConnected}
                className="w-full px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white border border-transparent focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
              />
             

            </div>
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim() || isSendingMessage || !wsConnected}
              className="p-3 bg-accent text-white rounded-full hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative"
            >
              {isSendingMessage ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          

        </div>
      </div>
    );
  };

console.log(filteredConversations)

  return (
    <>
      <div className="flex h-screen bg-gray-50">
        {/* Desktop Left Sidebar / Mobile Full Screen */}
        <div className={`${
          isMobileView ? 'hidden md:block' : 'block'
        } w-full md:w-80 bg-white border-r border-gray-200 flex flex-col`}>
          {/* Header */}
          <div className="p-4 md:p-6 border-b border-gray-200">
            <h1 className="text-2xl md:text-xl font-bold text-gray-900 mb-4 font-playfair">Messages</h1>
            
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white border border-transparent focus:border-accent"
              />
            </div>




          </div>

          {/* Contacts List */}
          <div className="flex-1 overflow-y-auto">
            {isLoadingConversations ? (
              <div className="space-y-0">
                {[...Array(6)].map((_, i) => (
                  <ConversationSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="p-4 text-center">
                <div className="text-secondary mb-2">{error}</div>
                <button 
                  onClick={fetchConversations}
                  className="text-sm bg-highlights text-white px-3 py-1 rounded hover:bg-secondary hover:text-white"

                >
                  Retry
                </button>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchTerm ? 'No conversations found' : 'No conversations yet'}
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.user.id}
                  onClick={() => handleContactClick(conversation.user)}
                  className={`p-4 md:p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedContact?.id === conversation.user.id ? 'bg-blue-50 md:border-r-2 md:border-r-accent' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={`${process.env.NEXT_PUBLIC_IMAGE}/${conversation.user.profile_image}`|| '/profile.webp'}
                        alt={conversation.user.full_name}
                        className="w-12 h-12 md:w-10 md:h-10 rounded-full object-cover"
                      />
                      {conversation.user.is_active && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 truncate">{conversation.user.full_name}</h3>
                        <span className="text-sm md:text-xs text-gray-500 flex-shrink-0 ml-2">
                          {formatTime(conversation.last_message.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate mt-1">
                        {conversation.last_message.sender.id === session?.user?.id ? 'You: ' : ''}
                        {conversation.last_message.content}
                      </p>
                    </div>
                    {conversation.unread_count > 0 && (
                      <div className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">
                        {conversation.unread_count}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Desktop Chat Area */}
        <div className="hidden md:flex flex-1 flex-col">
          {selectedContact ? (
            <>
              {/* Desktop Chat Header */}
              <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={`${process.env.NEXT_PUBLIC_IMAGE}/${selectedContact.profile_image}`|| '/profile.webp'}
                      alt={selectedContact.full_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {selectedContact.is_active && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedContact.full_name}</h3>
                    <p className="text-sm text-gray-500">
                      {typingUsers.has(selectedContact.id) 
                        ? 'Typing...' 
                        : selectedContact.is_active ? 'Active now' : 'Last seen recently'
                      }
                    </p>
                  </div>
                </div>
              

               {/* Connection status indicator */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center">
                    {wsConnecting && (
                      <div className="flex items-center text-xs text-gray-500">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-400 mr-2"></div>
                        Connecting...
                      </div>
                    )}
                    {wsConnected && (
                      <div className="flex items-center text-xs text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Online
                      </div>
                    )}
                    {!wsConnected && !wsConnecting && (
                      <div className="flex items-center text-xs text-red-500">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                        Disconnected
                      </div>
                    )}
                  </div>
                  
                  {/* Retry connection button when disconnected */}
                  {!wsConnected && !wsConnecting && (
                    <button 
                      onClick={handleReconnect}
                      className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200"
                    >
                      Reconnect
                    </button>
                  )}
                </div>

              </div>

              {/* Desktop Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {isLoadingMessages ? (
                  <div className="space-y-4">
                    {[...Array(8)].map((_, i) => (
                      <MessageSkeleton key={i} isOwn={i % 3 === 0} />
                    ))}
                  </div>
                ) : error ? (
                  <div className="flex flex-col justify-center items-center h-full text-secondary">
                    <p className="mb-4">{error}</p>
                    <button 
                      onClick={() => selectedContact && fetchMessages(selectedContact.id)}
                      className="bg-highlights text-white px-4 py-2 rounded hover:bg-secondary hover:text-white"
                    >
                      Retry
                    </button>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex justify-center items-center h-full text-gray-500">
                    No messages yet. Start a conversation!
                  </div>
                ) : (
                  <>
                    {messages.map(renderMessage)}
                    {typingUsers.has(selectedContact.id) && (
                      <div className="flex justify-start">
                        <div className="bg-white text-gray-800 rounded-2xl rounded-bl-md shadow-sm px-4 py-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Desktop Message Input */}
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex items-center space-x-3">
              
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder={wsConnected ? "Type message..." : "Connecting..."}
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value);
                        if (e.target.value.trim()) {
                          handleTyping();
                        } else {
                          stopTyping();
                        }
                      }}
                      onKeyPress={handleKeyPress}
                      onBlur={stopTyping}
                      disabled={isSendingMessage || !wsConnected}
                      className="w-full px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white border border-transparent focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                   
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || isSendingMessage || !wsConnected}
                    className="p-3 bg-accent text-white rounded-full hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative"
                  >
                    {isSendingMessage ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
                
 
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2 font-playfair">Select a conversation</h3>
                <p className="text-gray-500">Choose a contact to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Chat Overlay */}
      {isMobileView && <MobileChatView />}
    </>
  );
};

export default MessagesComponent;





/**
 * # desktop header
 *   <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                    <Info className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
 * 
 */

                /***
                 * #desktop input
                 * 
                 *     <button 
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full disabled:opacity-50"
                    disabled={isSendingMessage}
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                 * 
                 * 
                 * 
                 *  <button 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                      disabled={isSendingMessage}
                    >
                      <Smile className="w-5 h-5" />
                    </button>
                 */



                    /** #mobile header menu
                     *            
            <div className="md:hidden flex justify-between items-center">
              <button className="p-2 text-gray-600 hover:text-gray-800">
                <Menu className="w-5 h-5" />
              </button>
              <button className="text-xs text-accent hover:text-secondary font-medium">
                New Message
              </button>
            </div>





  <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-gray-800">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800">
              <Video className="w-5 h-5" />
            </button>
          </div>


#input
             <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                <button className="text-gray-500 hover:text-gray-700" disabled={isSendingMessage}>
                  <Paperclip className="w-5 h-5" />
                </button>
                <button className="text-gray-500 hover:text-gray-700" disabled={isSendingMessage}>
                  <Camera className="w-5 h-5" />
                </button>
              </div>
                     */