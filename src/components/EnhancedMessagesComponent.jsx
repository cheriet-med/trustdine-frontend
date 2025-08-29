// components/EnhancedMessagesComponent.jsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Search, Send, Paperclip, Smile, MoreHorizontal, Star, Phone, Video, Info, ArrowLeft, Camera, Image, Users, Loader, Plus } from 'lucide-react';
import { useWebSocket } from '../hooks/useWebSocket';
import { chatApi } from '../lib/chatApi';
import ChatRoomManager from './ChatRoomManager';

const EnhancedMessagesComponent = () => {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [chatRooms, setChatRooms] = useState([]);
  const [messageHistory, setMessageHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [showRoomManager, setShowRoomManager] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // WebSocket connection for the selected room
  const {
    messages: wsMessages,
    onlineUsers,
    typingUsers,
    isConnected,
    sendMessage: wsSendMessage,
    sendTyping,
    sendReadReceipt
  } = useWebSocket(selectedRoom?.name);

  // Load chat rooms on component mount
  useEffect(() => {
    if (status === 'authenticated') {
      loadChatRooms();
    }
  }, [status]);

  // Load message history when room is selected
  useEffect(() => {
    if (selectedRoom?.id) {
      loadMessageHistory(selectedRoom.id);
      markUserOnline(selectedRoom.id);
    }
  }, [selectedRoom]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [wsMessages, messageHistory]);

  // Mark new messages as read
  useEffect(() => {
    const unreadMessages = wsMessages.filter(msg => 
      msg.user.id !== session?.user?.id && !msg.is_read
    );
    
    unreadMessages.forEach(msg => {
      sendReadReceipt(msg.id);
    });
  }, [wsMessages, session?.user?.id, sendReadReceipt]);

  const loadChatRooms = async () => {
    try {
      setLoading(true);
      const rooms = await chatApi.getChatRooms();
      setChatRooms(rooms);
    } catch (error) {
      console.error('Error loading chat rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessageHistory = async (roomId) => {
    try {
      const messages = await chatApi.getRoomMessages(roomId, { page_size: 50 });
      setMessageHistory(messages);
    } catch (error) {
      console.error('Error loading message history:', error);
    }
  };

  const markUserOnline = async (roomId) => {
    try {
      await chatApi.markOnline(roomId);
    } catch (error) {
      console.error('Error marking user online:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedRoom) return;
    
    // Try WebSocket first, fallback to API
    const wsSuccess = wsSendMessage(newMessage);
    
    if (!wsSuccess) {
      try {
        await chatApi.sendMessageViaAPI(selectedRoom.id, {
          content: newMessage,
          message_type: 'text'
        });
      } catch (error) {
        console.error('Error sending message via API:', error);
        return;
      }
    }
    
    setNewMessage('');
    
    // Stop typing indicator
    if (isTyping) {
      sendTyping(false);
      setIsTyping(false);
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    
    // Handle typing indicator
    if (!isTyping && e.target.value.trim()) {
      setIsTyping(true);
      sendTyping(true);
    }
    
    // Reset typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        sendTyping(false);
      }
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setIsMobileView(true);
  };

  const handleRoomCreated = (newRoom) => {
    // Add the new room to the list and select it
    setChatRooms(prev => [newRoom, ...prev]);
    setSelectedRoom(newRoom);
    setShowRoomManager(false);
  };

  const handleBackToList = () => {
    setSelectedRoom(null);
    setIsMobileView(false);
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getUserDisplayName = (user) => {
    return user.full_name || user.username || user.email?.split('@')[0] || 'Unknown User';
  };

  const getUserAvatar = (user) => {
    if (user.profile_image?.url) {
      return user.profile_image.url;
    }
    // Generate a placeholder avatar
    const initials = getUserDisplayName(user).substring(0, 2).toUpperCase();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=6366f1&color=ffffff&size=40`;
  };

  const filteredRooms = chatRooms.filter(room =>
    room.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedRooms = showFavorites 
    ? filteredRooms.filter(room => room.is_favorite)
    : filteredRooms;

  const allMessages = [...messageHistory, ...wsMessages];

  // Mobile Chat View Component
  const MobileChatView = () => {
    if (!selectedRoom) return null;

    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col md:hidden font-montserrat">
        {/* Mobile Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleBackToList}
              className="p-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900 text-lg font-playfair">
                {selectedRoom.display_name || selectedRoom.name}
              </h3>
              <div className="flex items-center space-x-1">
                {isConnected ? (
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                ) : (
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                )}
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-500">{onlineUsers.length}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-gray-800">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800">
              <Video className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {allMessages.map((message, index) => {
            const isOwn = message.user.id === session?.user?.id;
            return (
              <div
                key={message.id || index}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                {!isOwn && (
                  <img
                    src={getUserAvatar(message.user)}
                    alt={getUserDisplayName(message.user)}
                    className="w-8 h-8 rounded-full mr-2 mt-1"
                  />
                )}
                <div className={`max-w-xs px-4 py-3 rounded-2xl ${
                  isOwn 
                    ? 'bg-accent text-white rounded-br-md' 
                    : 'bg-white text-gray-800 rounded-bl-md shadow-sm'
                }`}>
                  {!isOwn && (
                    <p className="text-xs font-medium text-gray-600 mb-1">
                      {getUserDisplayName(message.user)}
                    </p>
                  )}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <p className={`text-xs mt-1 ${
                    isOwn ? 'text-gray-100' : 'text-gray-500'
                  }`}>
                    {formatMessageTime(message.timestamp)}
                    {message.is_edited && ' (edited)'}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {typingUsers.length > 0 && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  {typingUsers.slice(0, 2).map(user => (
                    <img
                      key={user.id}
                      src={getUserAvatar(user)}
                      alt={getUserDisplayName(user)}
                      className="w-6 h-6 rounded-full"
                    />
                  ))}
                </div>
                <div className="bg-white px-4 py-2 rounded-2xl rounded-bl-md shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Mobile Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                disabled={!isConnected}
                className="w-full px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white border border-transparent focus:border-accent disabled:opacity-50"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                <button className="text-gray-500 hover:text-gray-700">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                  <Camera className="w-5 h-5" />
                </button>
              </div>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!isConnected || !newMessage.trim()}
              className="p-3 bg-accent text-white rounded-full hover:bg-secondary transition-colors disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h2>
          <p className="text-gray-600">You need to be signed in to access chat.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-screen bg-gray-50 font-montserrat">
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
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white border border-transparent focus:border-accent"
              />
            </div>

            {/* Favorites Toggle - Desktop Only */}
            <div className="hidden md:flex items-center justify-between">
              <button
                onClick={() => setShowFavorites(!showFavorites)}
                className={`text-sm font-medium px-3 py-1 rounded-md transition-colors ${
                  showFavorites ? 'bg-accent text-white' : 'text-secondary hover:bg-accent hover:text-white'
                }`}
              >
                Favorites
              </button>

              <button 
                onClick={() => setShowRoomManager(true)}
                className="text-xs text-accent hover:text-secondary font-medium"
              >
                New Room
              </button>
            </div>
          </div>

          {/* Chat Rooms List */}
          <div className="flex-1 overflow-y-auto">
            {displayedRooms.map((room) => (
              <div
                key={room.id}
                onClick={() => handleRoomClick(room)}
                className={`p-4 md:p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 active:bg-accent transition-colors ${
                  selectedRoom?.id === room.id ? 'bg-blue-50 md:border-r-2 md:border-r-accent' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-accent to-secondary flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {(room.display_name || room.name).substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    {room.online_count > 0 && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 truncate text-base md:text-sm font-playfair">
                        {room.display_name || room.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {room.latest_message && (
                          <span className="text-sm md:text-xs text-gray-500 flex-shrink-0">
                            {formatMessageTime(room.latest_message.timestamp)}
                          </span>
                        )}
                        {room.unread_count > 0 && (
                          <span className="bg-accent text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {room.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-500 truncate">
                        {room.latest_message ? room.latest_message.content : 'No messages yet'}
                      </p>
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-400">{room.member_count}</span>
                        {room.online_count > 0 && (
                          <>
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            <span className="text-xs text-green-500">{room.online_count} online</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {displayedRooms.length === 0 && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">
                  {searchTerm ? 'No rooms found' : 'No chat rooms available'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Chat Area */}
        <div className="hidden md:flex flex-1 flex-col">
          {selectedRoom ? (
            <>
              {/* Desktop Chat Header */}
              <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-accent to-secondary flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {(selectedRoom.display_name || selectedRoom.name).substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    {isConnected && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 font-playfair">
                      {selectedRoom.display_name || selectedRoom.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{selectedRoom.member_count} members</span>
                      {onlineUsers.length > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-green-500">{onlineUsers.length} online</span>
                        </>
                      )}
                      {!isConnected && (
                        <>
                          <span>•</span>
                          <span className="text-red-500">Disconnected</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
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
              </div>

              {/* Online Users Bar */}
              {onlineUsers.length > 0 && (
                <div className="bg-blue-50 border-b border-blue-100 px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-700 font-medium">Online now:</span>
                    <div className="flex items-center space-x-2">
                      {onlineUsers.slice(0, 5).map(user => (
                        <div key={user.id} className="flex items-center space-x-1">
                          <img
                            src={getUserAvatar(user)}
                            alt={getUserDisplayName(user)}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-sm text-blue-700">{getUserDisplayName(user)}</span>
                        </div>
                      ))}
                      {onlineUsers.length > 5 && (
                        <span className="text-sm text-blue-600">+{onlineUsers.length - 5} more</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Desktop Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {allMessages.map((message, index) => {
                  const isOwn = message.user.id === session?.user?.id;
                  const showAvatar = !isOwn && (index === 0 || allMessages[index - 1]?.user?.id !== message.user.id);
                  
                  return (
                    <div key={message.id || index} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex space-x-2 max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        {showAvatar && !isOwn && (
                          <img
                            src={getUserAvatar(message.user)}
                            alt={getUserDisplayName(message.user)}
                            className="w-8 h-8 rounded-full mt-1"
                          />
                        )}
                        {!showAvatar && !isOwn && (
                          <div className="w-8 h-8"></div>
                        )}
                        
                        <div className={`px-4 py-3 rounded-2xl ${
                          isOwn 
                            ? 'bg-accent text-white rounded-br-md' 
                            : 'bg-white text-gray-800 rounded-bl-md shadow-sm'
                        }`}>
                          {showAvatar && !isOwn && (
                            <p className="text-xs font-medium text-gray-600 mb-1">
                              {getUserDisplayName(message.user)}
                            </p>
                          )}
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className={`text-xs ${
                              isOwn ? 'text-gray-100' : 'text-gray-500'
                            }`}>
                              {formatMessageTime(message.timestamp)}
                              {message.is_edited && ' (edited)'}
                            </p>
                            {message.reply_count > 0 && (
                              <button className="text-xs text-blue-500 hover:text-blue-600 ml-2">
                                {message.reply_count} {message.reply_count === 1 ? 'reply' : 'replies'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Desktop Typing Indicator */}
                {typingUsers.length > 0 && (
                  <div className="flex justify-start">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        {typingUsers.slice(0, 2).map(user => (
                          <img
                            key={user.id}
                            src={getUserAvatar(user)}
                            alt={getUserDisplayName(user)}
                            className="w-6 h-6 rounded-full"
                          />
                        ))}
                      </div>
                      <div className="bg-white px-4 py-2 rounded-2xl rounded-bl-md shadow-sm">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Desktop Message Input */}
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <button 
                    disabled={!isConnected}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full disabled:opacity-50"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <div className="flex-1 relative">
                    <textarea
                      rows={1}
                      placeholder={isConnected ? "Type message..." : "Connecting..."}
                      value={newMessage}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      disabled={!isConnected}
                      className="w-full px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white border border-transparent focus:border-accent resize-none disabled:opacity-50"
                      style={{ minHeight: '48px', maxHeight: '120px' }}
                    />
                    <button 
                      disabled={!isConnected}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    >
                      <Smile className="w-5 h-5" />
                    </button>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!isConnected || !newMessage.trim()}
                    className="p-3 bg-accent text-white rounded-full hover:bg-secondary transition-colors disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                
                {!isConnected && (
                  <div className="flex items-center justify-center mt-2">
                    <div className="flex items-center space-x-2 text-sm text-red-500">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span>Reconnecting...</span>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2 font-playfair">Select a chat room</h3>
                <p className="text-gray-500">Choose a room to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Chat Overlay */}
      {isMobileView && <MobileChatView />}

      {/* Chat Room Manager Modal */}
      <ChatRoomManager
        isOpen={showRoomManager}
        onClose={() => setShowRoomManager(false)}
        onRoomCreated={handleRoomCreated}
      />
    </>
  );
};

export default EnhancedMessagesComponent;