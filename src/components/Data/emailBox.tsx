'use client'
import React, { useState } from 'react';
import { Search, Send, Paperclip, Star, Trash2, Archive, Reply, ReplyAll, Forward, MoreHorizontal, ArrowLeft, Calendar, Clock, User, Mail, Inbox, FileText, Users, Settings, ChevronDown, Flag, AlertCircle } from 'lucide-react';

interface Email {
  id: string;
  sender: string;
  senderEmail: string;
  avatar: string;
  subject: string;
  preview: string;
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  isFlagged: boolean;
  isImportant: boolean;
  attachments?: number;
  category: 'inbox' | 'sent' | 'drafts' | 'spam' | 'trash';
  fullContent?: string;
}

interface Folder {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
  isActive: boolean;
}

const EmailClient: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [selectedFolder, setSelectedFolder] = useState('inbox');
  const [isComposing, setIsComposing] = useState(false);
  const [newEmail, setNewEmail] = useState({ to: '', subject: '', content: '' });
  const [isMobileView, setIsMobileView] = useState(false);

  const folders: Folder[] = [
    { id: 'inbox', name: 'Inbox', icon: <Inbox className="w-5 h-5" />, count: 12, isActive: true },
    { id: 'sent', name: 'Sent Mail', icon: <Send className="w-5 h-5" />, count: 5, isActive: false },
    { id: 'drafts', name: 'Drafts', icon: <FileText className="w-5 h-5" />, count: 3, isActive: false },
    { id: 'spam', name: 'Spam', icon: <AlertCircle className="w-5 h-5" />, count: 2, isActive: false },
    { id: 'trash', name: 'Trash', icon: <Trash2 className="w-5 h-5" />, count: 1, isActive: false }
  ];

  const emails: Email[] = [
    {
      id: 'email-1',
      sender: 'LinkedIn',
      senderEmail: 'noreply@linkedin.com',
      avatar: '/asset/card-1.avif',
      subject: 'You have 3 new profile views',
      preview: 'See who viewed your profile this week and connect with them to expand your network...',
      timestamp: '2:34 PM',
      isRead: false,
      isStarred: false,
      isFlagged: false,
      isImportant: true,
      attachments: 0,
      category: 'inbox',
      fullContent: 'Hello! You have 3 new profile views this week. Check out who viewed your profile and connect with them to expand your professional network. Best regards, LinkedIn Team'
    },
    {
      id: 'email-2',
      sender: 'GitHub',
      senderEmail: 'noreply@github.com',
      avatar: '/asset/card-2.avif',
      subject: 'Your weekly digest',
      preview: 'Here\'s what happened in your repositories this week...',
      timestamp: '11:45 AM',
      isRead: true,
      isStarred: true,
      isFlagged: false,
      isImportant: false,
      attachments: 1,
      category: 'inbox',
      fullContent: 'Weekly Repository Digest: 15 commits, 3 pull requests merged, 2 issues closed. Great work on maintaining your repositories!'
    },
    {
      id: 'email-3',
      sender: 'Design Team',
      senderEmail: 'team@designco.com',
      avatar: '/asset/card-3.avif',
      subject: 'Project Update - Q4 Campaign',
      preview: 'The latest mockups are ready for review. Please check the attached files...',
      timestamp: '10:21 AM',
      isRead: false,
      isStarred: false,
      isFlagged: true,
      isImportant: true,
      attachments: 3,
      category: 'inbox',
      fullContent: 'Hi team, The Q4 campaign mockups are ready for your review. Please find the attached files and let us know your feedback by end of week. Thanks!'
    },
    {
      id: 'email-4',
      sender: 'Marketing Newsletter',
      senderEmail: 'news@marketing.com',
      avatar: '/asset/card-4.avif',
      subject: 'Latest Marketing Trends for 2024',
      preview: 'Discover the top marketing strategies that will dominate next year...',
      timestamp: '9:15 AM',
      isRead: true,
      isStarred: false,
      isFlagged: false,
      isImportant: false,
      attachments: 0,
      category: 'inbox',
      fullContent: 'Marketing Trends 2024: AI-driven personalization, voice search optimization, and sustainability messaging are key trends to watch.'
    },
    {
      id: 'email-5',
      sender: 'Client Services',
      senderEmail: 'support@client.com',
      avatar: '/asset/card-5.avif',
      subject: 'Meeting scheduled for tomorrow',
      preview: 'Just confirming our meeting tomorrow at 2 PM. Please let me know if you need to reschedule...',
      timestamp: '8:45 AM',
      isRead: false,
      isStarred: true,
      isFlagged: false,
      isImportant: false,
      attachments: 0,
      category: 'inbox',
      fullContent: 'Hi! Just confirming our meeting tomorrow at 2 PM to discuss the project timeline. Please let me know if you need to reschedule. Best regards, Client Services'
    },
    {
      id: 'email-6',
      sender: 'John Doe',
      senderEmail: 'john.doe@email.com',
      avatar: '/asset/card-6.avif',
      subject: 'Thanks for the collaboration',
      preview: 'It was great working with you on the project. Looking forward to future opportunities...',
      timestamp: 'Yesterday',
      isRead: true,
      isStarred: false,
      isFlagged: false,
      isImportant: false,
      attachments: 0,
      category: 'sent',
      fullContent: 'Thank you for the excellent collaboration on the recent project. Your expertise and dedication made all the difference. Looking forward to working together again!'
    }
  ];

  const filteredEmails = emails.filter(email => 
    email.category === selectedFolder &&
    (email.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
     email.subject.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const currentEmail = emails.find(email => email.id === selectedEmail);

  const handleEmailClick = (emailId: string) => {
    setSelectedEmail(emailId);
    setIsMobileView(true);
  };

  const handleBackToList = () => {
    setSelectedEmail(null);
    setIsMobileView(false);
  };

  const handleCompose = () => {
    setIsComposing(true);
    setSelectedEmail(null);
  };

  const handleSendEmail = () => {
    if (newEmail.to && newEmail.subject && newEmail.content) {
      console.log('Sending email:', newEmail);
      setNewEmail({ to: '', subject: '', content: '' });
      setIsComposing(false);
    }
  };

  // Mobile Email View Component
  const MobileEmailView = () => {
    if (!currentEmail) return null;

    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col md:hidden font-montserrat">
        {/* Mobile Email Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={handleBackToList} className="p-2 text-gray-600 hover:text-gray-800">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate font-playfair">{currentEmail.subject}</h3>
              <p className="text-sm text-gray-500 truncate">{currentEmail.sender}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-gray-800">
              <Star className={`w-5 h-5 ${currentEmail.isStarred ? 'text-yellow-400 fill-current' : ''}`} />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Email Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="flex items-center space-x-3 mb-4">
              <img src={currentEmail.avatar} alt={currentEmail.sender} className="w-10 h-10 rounded-full object-cover" />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{currentEmail.sender}</h4>
                <p className="text-sm text-gray-500">{currentEmail.senderEmail}</p>
              </div>
              <span className="text-sm text-gray-500">{currentEmail.timestamp}</span>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">{currentEmail.fullContent}</p>
            </div>
          </div>
        </div>

        {/* Mobile Action Buttons */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center justify-around">
            <button className="flex flex-col items-center space-y-1 p-2 text-gray-600 hover:text-gray-800">
              <Reply className="w-5 h-5" />
              <span className="text-xs">Reply</span>
            </button>
            <button className="flex flex-col items-center space-y-1 p-2 text-gray-600 hover:text-gray-800">
              <ReplyAll className="w-5 h-5" />
              <span className="text-xs">Reply All</span>
            </button>
            <button className="flex flex-col items-center space-y-1 p-2 text-gray-600 hover:text-gray-800">
              <Forward className="w-5 h-5" />
              <span className="text-xs">Forward</span>
            </button>
            <button className="flex flex-col items-center space-y-1 p-2 text-gray-600 hover:text-gray-800">
              <Trash2 className="w-5 h-5" />
              <span className="text-xs">Delete</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Compose Email Component
  const ComposeEmail = () => {
    if (!isComposing) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 p-4 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 font-playfair">Compose Email</h3>
            <button onClick={() => setIsComposing(false)} className="text-gray-500 hover:text-gray-700">
              <span className="sr-only">Close</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
              <input
                type="email"
                placeholder="recipient@example.com"
                value={newEmail.to}
                onChange={(e) => setNewEmail({ ...newEmail, to: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                placeholder="Enter subject"
                value={newEmail.subject}
                onChange={(e) => setNewEmail({ ...newEmail, subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                placeholder="Type your message..."
                value={newEmail.content}
                onChange={(e) => setNewEmail({ ...newEmail, content: e.target.value })}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>
          <div className="bg-gray-50 border-t border-gray-200 p-4 flex items-center justify-between">
            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
              <Paperclip className="w-5 h-5" />
              <span className="text-sm">Attach file</span>
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsComposing(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex h-screen bg-gray-50 font-montserrat">
        {/* Left Sidebar */}
        <div className={`${isMobileView ? 'hidden md:block' : 'block'} w-full md:w-64 bg-white border-r border-gray-200 flex flex-col`}>
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900 mb-4 font-playfair">Mail</h1>
            <button
              onClick={handleCompose}
              className="w-full bg-highlights text-white px-4 py-2 rounded-md hover:bg-secondary transition-colors flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Compose</span>
            </button>
          </div>

          {/* Folders */}
          <div className="flex-1 overflow-y-auto p-2">
            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => setSelectedFolder(folder.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg mb-1 transition-colors ${
                  selectedFolder === folder.id
                    ? 'bg-gray-50 text-secondary border-r-2 border-highlights'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {folder.icon}
                  <span className="font-medium">{folder.name}</span>
                </div>
                {folder.count > 0 && (
                  <span className="text-xs bg-accent text-white px-2 py-1 rounded-full">
                    {folder.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <img src="/asset/card-1.avif" alt="Profile" className="w-8 h-8 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
                <p className="text-xs text-gray-500 truncate">john.doe@email.com</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Search Bar */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-highlights focus:bg-white border border-transparent focus:border-highlights"
              />
            </div>
          </div>

          <div className="flex-1 flex">
            {/* Email List */}
            <div className={`${selectedEmail ? 'hidden lg:block' : 'block'} w-full lg:w-96 bg-white border-r border-gray-200 flex flex-col`}>
              <div className="flex-1 overflow-y-auto">
                {filteredEmails.map((email) => (
                  <div
                    key={email.id}
                    onClick={() => handleEmailClick(email.id)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedEmail === email.id ? 'bg-blue-50 border-r-2 border-r-blue-600' : ''
                    } ${!email.isRead ? 'font-semibold' : ''}`}
                  >
                    <div className="flex items-start space-x-3">
                      <img src={email.avatar} alt={email.sender} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className={`text-sm truncate ${!email.isRead ? 'font-medium text-gray-900 font-playfair' : 'text-gray-900 font-playfair'}`}>
                            {email.sender}
                          </p>
                          <div className="flex items-center space-x-1">
                            <span className="text-xs text-gray-500">{email.timestamp}</span>
                            {email.isStarred && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                            {email.isFlagged && <Flag className="w-4 h-4 text-red-400 fill-current" />}
                          </div>
                        </div>
                        <p className={`text-sm truncate mb-1 ${!email.isRead ? 'font-semibold text-gray-600' : 'text-gray-500'}`}>
                          {email.subject}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{email.preview}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            {email.isImportant && (
                              <span className="text-xs bg-secondary  text-white px-2 py-1 rounded-full">Important</span>
                            )}
                            
                              <div className="flex items-center space-x-1">
                                <Paperclip className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-500">{email.attachments}</span>
                              </div>
                            
                          </div>
                          {!email.isRead && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Email Content */}
            <div className="hidden lg:flex flex-1 flex-col">
              {currentEmail ? (
                <>
                  {/* Email Header */}
                  <div className="bg-white border-b border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <img src={currentEmail.avatar} alt={currentEmail.sender} className="w-12 h-12 rounded-full object-cover" />
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900 font-playfair">{currentEmail.subject}</h2>
                          <p className="text-sm text-gray-600">{currentEmail.sender} <span className="text-gray-400">({currentEmail.senderEmail})</span></p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">{currentEmail.timestamp}</span>
                        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                          <Star className={`w-5 h-5 ${currentEmail.isStarred ? 'text-yellow-400 fill-current' : ''}`} />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md">
                        <Reply className="w-4 h-4" />
                        <span>Reply</span>
                      </button>
                      <button className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md">
                        <ReplyAll className="w-4 h-4" />
                        <span>Reply All</span>
                      </button>
                      <button className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md">
                        <Forward className="w-4 h-4" />
                        <span>Forward</span>
                      </button>
                      <button className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md">
                        <Archive className="w-4 h-4" />
                        <span>Archive</span>
                      </button>
                      <button className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md">
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Email Body */}
                  <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <div className="prose max-w-none">
                        <p className="text-gray-700 leading-relaxed">{currentEmail.fullContent}</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-highlights rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2 font-playfair">Select an email</h3>
                    <p className="text-gray-500">Choose an email to read its content</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Email Overlay */}
      {isMobileView && <MobileEmailView />}
      
      {/* Compose Email Modal */}
      <ComposeEmail />
    </>
  );
};

export default EmailClient;