'use client'
import React, { useState } from 'react';
import { Search, Send, Paperclip, Smile, MoreHorizontal, Star, Phone, Video, Info, ArrowLeft, Camera, Image } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  isActive: boolean;
  unreadCount?: number;
  isFavorite?: boolean;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

const MessagesComponent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  const contacts: Contact[] = [
    {
      id: 'devin-glove',
      name: 'Devin Glove',
      avatar: '/asset/card-1.avif',
      lastMessage: 'Sent an attachment',
      timestamp: '12:34',
      isActive: false,
      isFavorite: false
    },
    {
      id: 'steven-webb',
      name: 'Steven Webb',
      avatar: '/asset/card-2.avif',
      lastMessage: 'Okay, see you there than!',
      timestamp: '10:21',
      isActive: true,
      isFavorite: true
    },
    {
      id: 'dollie-santo',
      name: 'Dollie Santo',
      avatar: '/asset/card-3.avif',
      lastMessage: 'Same to you! 😊',
      timestamp: '9:15',
      isActive: false,
      isFavorite: true
    },
    {
      id: 'edith-owen',
      name: 'Edith Owen',
      avatar: '/asset/card-4.avif',
      lastMessage: 'Have you decided?',
      timestamp: '8:45',
      isActive: false,
      isFavorite: true
    },
    {
      id: 'connor-brev',
      name: 'Connor Brev',
      avatar: '/asset/card-5.avif',
      lastMessage: 'Thanks! - Yesterday',
      timestamp: 'Yesterday',
      isActive: false,
      isFavorite: false
    },
    {
      id: 'mary-chand',
      name: 'Mary Chand',
      avatar: '/asset/card-6.avif',
      lastMessage: 'Hi let him know...',
      timestamp: '2d',
      isActive: false,
      isFavorite: false
    }
  ];

  const messages: Message[] = [
    {
      id: '1',
      senderId: 'steven-webb',
      content: 'quality before you make',
      timestamp: '10:21',
      isOwn: false
    },
    {
      id: '2',
      senderId: 'steven-webb',
      content: 'Okay, see you there than!',
      timestamp: '10:21',
      isOwn: false
    },
    {
      id: '3',
      senderId: 'current-user',
      content: 'Hi, do you have time today for a short call?',
      timestamp: '10:22',
      isOwn: true
    },
    {
      id: '4',
      senderId: 'current-user',
      content: 'I have some stuff to still finish, but in a couple of hours it will be deployed, so we can talk about next steps.',
      timestamp: '10:24',
      isOwn: true
    },
    {
      id: '5',
      senderId: 'steven-webb',
      content: 'Sure! I\'ll schedule a meeting for 2pm.',
      timestamp: '10:25',
      isOwn: false
    },
    {
      id: '6',
      senderId: 'steven-webb',
      content: 'Okay, see you there than!',
      timestamp: '10:21',
      isOwn: false
    }
  ];

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedContacts = showFavorites 
    ? filteredContacts.filter(contact => contact.isFavorite)
    : filteredContacts;

  const currentContact = contacts.find(contact => contact.id === selectedContact);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleContactClick = (contactId: string) => {
    setSelectedContact(contactId);
    setIsMobileView(true);
  };

  const handleBackToList = () => {
    setSelectedContact(null);
    setIsMobileView(false);
  };

  // Mobile Chat View Component
  const MobileChatView = () => {
    if (!currentContact) return null;

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
            <div className="relative">
              <img
                src={currentContact.avatar}
                alt={currentContact.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              {currentContact.isActive && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg font-playfair">{currentContact.name}</h3>
              <p className="text-sm text-gray-500">
                {currentContact.isActive ? 'Active now' : 'Last seen recently'}
              </p>
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
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs px-4 py-3 rounded-2xl ${
                message.isOwn 
                  ? 'bg-accent text-white rounded-br-md' 
                  : 'bg-white text-gray-800 rounded-bl-md shadow-sm'
              }`}>
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.isOwn ? 'text-gray-100' : 'text-gray-500'
                }`}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white border border-transparent focus:border-accent"
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
              className="p-3 bg-accent text-white rounded-full hover:bg-secondary transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

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
                placeholder="Search"
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

              <button className="text-xs text-accent hover:text-secondary  font-medium">
                Add New
              </button>
            </div>
          </div>

          {/* Contacts List */}
          <div className="flex-1 overflow-y-auto">
            {displayedContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => handleContactClick(contact.id)}
                className={`p-4 md:p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 active:bg-accent transition-colors ${
                  selectedContact === contact.id ? 'bg-blue-50 md:border-r-2 md:border-r-accent' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="w-12 h-12 md:w-10 md:h-10 rounded-full object-cover"
                    />
                    {contact.isActive && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 truncate text-base md:text-sm font-playfair">{contact.name}</h3>
                      <span className="text-sm md:text-xs text-gray-500 flex-shrink-0 ml-2">{contact.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-500 truncate mt-1">{contact.lastMessage}</p>
                  </div>
                  {contact.isFavorite && (
                    <Star className="w-4 h-4 text-accent fill-current hidden md:block" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Chat Area */}
        <div className="hidden md:flex flex-1 flex-col">
          {currentContact ? (
            <>
              {/* Desktop Chat Header */}
              <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={currentContact.avatar}
                      alt={currentContact.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {currentContact.isActive && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 font-playfair">{currentContact.name}</h3>
                    <p className="text-sm text-gray-500">
                      {currentContact.isActive ? 'Active now' : 'Last seen recently'}
                    </p>
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

              {/* Desktop Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      message.isOwn 
                        ? 'bg-accent text-white rounded-br-md' 
                        : 'bg-white text-gray-800 rounded-bl-md shadow-sm'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.isOwn ? 'text-gray-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Message Input */}
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Type message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white border border-transparent focus:border-accent"
                    />
                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700">
                      <Smile className="w-5 h-5" />
                    </button>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    className="p-3 bg-accent text-white rounded-full hover:bg-secondary transition-colors"
                  >
                    <Send className="w-5 h-5" />
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