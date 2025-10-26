'use client'
import React, { useState, useEffect } from 'react';
import { Search, Send, Paperclip, Star, Trash2, Archive, Reply, ReplyAll, Forward, MoreHorizontal, ArrowLeft, Calendar, Clock, User, Mail, Inbox, FileText, Users, Settings, ChevronDown, Flag, AlertCircle } from 'lucide-react';
import moment from 'moment';
import useFetchAllEmails from '@/components/requests/fetchAllEmails';
import TiptapEditor from '@/components/admin-dashboard/Tiptapeditor';
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
  company:string;
  type:string
}

interface ApiEmail {
  id: number;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  company?: string;
  email: string;
  subject?: string;
  message: string;
  message_type:string;
  date: string;
  time: string;
  category?: string;
  is_read: boolean;
  language?: string;
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
 const [replyEmailId, setReplyEmailId] = useState<string | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);
  // Import your existing hook
  const { AllEmails, isLoading, mutate } = useFetchAllEmails();
const [replyContent, setReplyContent] = useState<string>(""); // NEW
const [isSending, setIsSending] = useState(false); // for compose
const [isReplying, setIsReplying] = useState(false); // for reply




  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileView(false);
       
      } else {
        setIsMobileView(true);
      }
    };

    // Run once on mount
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);



  // Transform API data to component format
  const transformApiEmailsToEmails = (apiEmails: ApiEmail[] | undefined): Email[] => {
    if (!apiEmails || !Array.isArray(apiEmails)) {
      return [];
    }
    
    return apiEmails.map((apiEmail) => ({
      id: apiEmail.id.toString(),
      sender: apiEmail.first_name || apiEmail.full_name || apiEmail.company || 'Unknown Sender',
      company: apiEmail.company || "",
      type: apiEmail.message_type || "general",
      senderEmail: apiEmail.email,
      avatar: '/asset/card-1.avif', // Default avatar, you can add logic to assign different avatars
      subject: apiEmail.subject || 'No Subject',
      preview: (apiEmail.message || '').substring(0, 100) + ((apiEmail.message || '').length > 100 ? '...' : ''),
      timestamp: formatTimestamp(apiEmail.date, apiEmail.time),
      isRead: apiEmail.is_read,
      isStarred: false, // Default value, you can add this field to your API
      isFlagged: false, // Default value, you can add this field to your API
      isImportant: apiEmail.category === 'important', // Assuming you might have this category
      attachments: 0, // Default value, you can add this field to your API
      category: (apiEmail.category as 'inbox' | 'sent' | 'drafts' | 'spam' | 'trash') || 'inbox',
      fullContent: apiEmail.message || 'No content available'
    }));
  };

  // Format timestamp from API data
  const formatTimestamp = (date: string, time: string): string => {
    const emailDate = moment(`${date} ${time}`, 'MMMM Do YYYY h:mm:ss A');
    const now = moment();
    
    if (emailDate.isSame(now, 'day')) {
      return emailDate.format('h:mm A');
    } else if (emailDate.isSame(now.subtract(1, 'day'), 'day')) {
      return 'Yesterday';
    } else {
      return emailDate.format('MMM D');
    }
  };

  // Transform API emails to component format
  const emails: Email[] = transformApiEmailsToEmails(AllEmails);

  // Calculate folder counts based on actual data
  const folderCounts = {
    inbox: emails.filter(email => email.category === 'inbox' || !email.category).length,
    sent: emails.filter(email => email.category === 'sent').length,
    trash: emails.filter(email => email.category === 'trash').length,
  };

  const folders: Folder[] = [
    { id: 'inbox', name: 'Inbox', icon: <Inbox className="w-5 h-5" />, count: folderCounts.inbox, isActive: true },
    { id: 'sent', name: 'Sent Mail', icon: <Send className="w-5 h-5" />, count: folderCounts.sent, isActive: false },
    { id: 'trash', name: 'Trash', icon: <Trash2 className="w-5 h-5" />, count: folderCounts.trash, isActive: false }
  ];

  const filteredEmails = emails.filter(email => {
    const emailCategory = email.category || 'inbox';
    return emailCategory === selectedFolder &&
      (email.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
       email.subject.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const currentEmail = emails.find(email => email.id === selectedEmail);

  const handleEmailClick = (emailId: string) => {
    setSelectedEmail(emailId);
    setIsMobileView(true);
    setReplyEmailId(null); // reset reply
    // You might want to update read status on the server
    updateEmailReadStatus(emailId, true);
  };


// Update read status on server (optional)
  const deleteemail = async (emailId: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_URL}emailletterpostid/${emailId}`, {
        method: 'DELETE',
        headers: {
          "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
          "Content-Type": "application/json",
        },
        //body: JSON.stringify({ category: "trash" }),
      });

       // Trigger SWR revalidation to refresh the data
      if (mutate) {
        await mutate();
      }

      
    } catch (error) {
      console.error('Failed to update email read status:', error);
    }
  };



// Update read status on server (optional)
  const movetotrash = async (emailId: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_URL}emailletterpostid/${emailId}`, {
        method: 'PUT',
        headers: {
          "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category: "trash" }),
      });

       // Trigger SWR revalidation to refresh the data
      if (mutate) {
        await mutate();
      }

      
    } catch (error) {
      console.error('Failed to update email read status:', error);
    }
  };



  // Update read status on server (optional)
  const updateEmailReadStatus = async (emailId: string, isRead: boolean) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_URL}emailletterpostid/${emailId}`, {
        method: 'PUT',
        headers: {
          "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_read: isRead }),
      });

       // Trigger SWR revalidation to refresh the data
      if (mutate) {
        await mutate();
      }


    } catch (error) {
      console.error('Failed to update email read status:', error);
    }
  };

  const handleBackToList = () => {
    setSelectedEmail(null);
    setReplyEmailId(null);
    setIsMobileView(false);
  };

  const handleCompose = () => {
    setIsComposing(true);
    setSelectedEmail(null);
  };

  // Mobile Email View Component
  const MobileEmailView = () => {
    if (!currentEmail) return null;

    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col md:hidden font-montserrat">
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
          
          
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="flex items-center space-x-3 mb-4">
            
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{currentEmail.sender}</h4>
                  <p className="text-sm text-gray-600"><span className="text-gray-400">({currentEmail.senderEmail})</span> {currentEmail.company}</p>
                         <p className="text-sm text-gray-600 mt-1">Type: <span className='font-playfair'>{currentEmail.type}</span>  </p>
              </div>
              <span className="text-sm text-gray-500">{currentEmail.timestamp}</span>
            </div>
            <div className="prose max-w-none">
                 {replyEmailId === currentEmail.id ? (
  <div className="space-y-4">
 <TiptapEditor
  content={replyContent}
  onChange={(value: string) => setReplyContent(value)}
/>
   
    <div className="flex items-center space-x-2 justify-end gap-4">
      <button onClick={()=>setReplyEmailId(null)} className='hover:text-a text-gray-700'>cancel</button>
      <button
        onClick={async () => {
           setIsReplying(true);
          try {
            // Send reply
            await fetch(`${process.env.NEXT_PUBLIC_URL}test-email-config/`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: currentEmail.senderEmail,
                subject: `Re: ${currentEmail.subject}`,
                message: replyContent,
              }),
            });

            // Save to sent
            await fetch(`${process.env.NEXT_PUBLIC_URL}emailletterpost/`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Token " + process.env.NEXT_PUBLIC_TOKEN,
              },
              body: JSON.stringify({
                full_name: "Goamico Team",
                email: currentEmail.senderEmail,
                subject: `Re: ${currentEmail.subject}`,
                message: replyContent,
                category: "sent",
                date: moment().format("MMMM Do YYYY"),
                time: moment().format("LTS"),
              }),
            });

            if (mutate) await mutate();

            setReplyContent(""); // clear content
            setReplyEmailId(null); // close reply box
          } catch (err) {
            console.error("Reply failed:", err);
          }
          finally {
      setIsReplying(false);
    }
        }}disabled={isReplying}
  className={`px-6 py-1 rounded-md transition-colors ${
    isReplying
      ? "bg-a text-white cursor-not-allowed"
      : "bg-secondary text-white hover:bg-a"
  }`}
>
  {isReplying ? "Sending..." : "Send"}
</button>
    </div>
  </div>
) : (

  <div className="prose max-w-none">
    <div 
   className="text-gray-500 leading-relaxed prose-inherit"
   dangerouslySetInnerHTML={{ __html: currentEmail.fullContent || '' }}
/>    
    
  </div>
)}
            </div>
          </div>
        </div>

        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center space-x-2 justify-center">
                     <button
  className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md" 
  onClick={() => setReplyEmailId(currentEmail.id)}
>
  <Reply className="w-4 h-4" />
  <span>Reply</span>
</button>

                        <button className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md" 
                        onClick={()=>movetotrash(currentEmail.id)}>
                        <Trash2 className="w-4 h-4" />
                        <span>Trash</span>
                      </button>
                      <button className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"  
                      onClick={()=>deleteemail(currentEmail.id)}>
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
        </div>
      </div>
    );
  };

  // Compose Email Component
  const ComposeEmail = () => {
   
 const [newEmail, setNewEmail] = useState({
  to: "",
  subject: "",
  content: "",
}); 


  const handleSendEmail = async () => {
    if (newEmail.to && newEmail.subject && newEmail.content) {
      setIsSending(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}test-email-config/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            email: newEmail.to,
            subject: newEmail.subject,
            message: newEmail.content
          }),
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const responses = await fetch(`${process.env.NEXT_PUBLIC_URL}emailletterpost/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
          },
          body: JSON.stringify({
            full_name: "Goamico Team",
            email: newEmail.to,
            subject: newEmail.subject,
            message: newEmail.content,
            category: "sent",
            date: moment().format('MMMM Do YYYY'),
            time: moment().format('LTS'),
          }),
        });

         // Trigger SWR revalidation to refresh the data
        if (mutate) {
        await mutate();
        }

        console.log('Sending email:', newEmail);
        setNewEmail({ to: '', subject: '', content: '' });
        setIsComposing(false);
        
        // Refresh emails after sending via your custom hook if needed
      } catch (err) {
        console.error("Failed to send email:", err);
      } finally {
      setIsSending(false);
    }
    }
  };


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
              onChange={(e) => setNewEmail((prev) => ({ ...prev, to: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <input
              type="text"
              placeholder="Enter subject"
              value={newEmail.subject}
              onChange={(e) => setNewEmail((prev) => ({ ...prev, subject: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
          <TiptapEditor
  content={newEmail.content}
  onChange={(value: string) =>
    setNewEmail((prev) => ({ ...prev, content: value }))
  }
/>

          </div>
        </div>
          <div className="bg-gray-50 border-t border-gray-200 p-4 flex items-center justify-between">
            <div></div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsComposing(false)}
                className="px-4 py-1 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
             <button
  onClick={handleSendEmail}
  disabled={isSending}
  className={`px-6 py-1 rounded-md transition-colors ${
    isSending
      ? "bg-a text-white cursor-not-allowed"
      : "bg-secondary text-white hover:bg-a"
  }`}
>
  {isSending ? "Sending..." : "Send"}
</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading emails...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-screen bg-gray-50 font-montserrat">
        {/* Left Sidebar */}
        <div className={`${isMobileView ? 'hidden md:block' : 'block'}  w-24 sm:w-64 bg-white border-r border-gray-200 flex flex-col`}>
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900 mb-4 font-playfair">Mail</h1>
            <button
              onClick={handleCompose}
              className="w-full bg-highlights text-white px-4 py-2 rounded-md hover:bg-secondary transition-colors flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
            <span className='hidden sm:block'>Compose</span>
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
                  <span className="font-medium hidden sm:block">{folder.name}</span>
                </div>
                {folder.count > 0 && (
                  <span className="text-xs bg-background text-white px-2 py-1 rounded-full">
                    {folder.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
             
              <div className="flex-1 min-w-0 hidden sm:block">
                <p className="text-sm font-medium text-gray-900 truncate">Goamico Team</p>
                <p className="text-xs text-gray-500 truncate">Contact@goamico.com</p>
              </div>
             
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
                {filteredEmails.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No emails found</p>
                  </div>
                ) : (
                  filteredEmails.map((email) => (
                    <div
                      key={email.id}
                      onClick={() => handleEmailClick(email.id)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedEmail === email.id ? 'bg-blue-50 border-r-2 border-r-blue-600' : ''
                      } ${!email.isRead ? 'font-semibold' : ''}`}
                    >
                      <div className="flex items-start space-x-3">
                       
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
                              <div 
   className="text-gray-500 leading-relaxed prose-inherit"
   dangerouslySetInnerHTML={{ __html: email.preview || '' }}
/>          
                        </div>
                      </div>
                    </div>
                  ))
                )}
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
                      
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900 font-playfair">{currentEmail.subject}</h2>
                          <p className="text-sm text-gray-600">{currentEmail.sender}  <span className="text-gray-400">({currentEmail.senderEmail})</span> {currentEmail.company}</p>
                         <p className="text-sm text-gray-600 mt-1">Type: <span className='font-playfair'>{currentEmail.type}</span>  </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">{currentEmail.timestamp}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                     <button
  className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md" 
  onClick={() => setReplyEmailId(currentEmail.id)}
>
  <Reply className="w-4 h-4" />
  <span>Reply</span>
</button>

                        <button className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md" 
                        onClick={()=>movetotrash(currentEmail.id)}>
                        <Trash2 className="w-4 h-4" />
                        <span>Trash</span>
                      </button>
                      <button className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"  
                      onClick={()=>deleteemail(currentEmail.id)}>
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Email Body */}
                  <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                    {replyEmailId === currentEmail.id ? (
  <div className="space-y-4">
 <TiptapEditor
  content={replyContent}
  onChange={(value: string) => setReplyContent(value)}
/>
   
    <div className="flex items-center space-x-2 justify-end gap-4">
      <button onClick={()=>setReplyEmailId(null)} className='hover:text-a text-gray-700'>cancel</button>
      <button
        onClick={async () => {
           setIsReplying(true);
          try {
            // Send reply
            await fetch(`${process.env.NEXT_PUBLIC_URL}test-email-config/`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: currentEmail.senderEmail,
                subject: `Re: ${currentEmail.subject}`,
                message: replyContent,
              }),
            });

            // Save to sent
            await fetch(`${process.env.NEXT_PUBLIC_URL}emailletterpost/`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Token " + process.env.NEXT_PUBLIC_TOKEN,
              },
              body: JSON.stringify({
                full_name: "Goamico Team",
                email: currentEmail.senderEmail,
                subject: `Re: ${currentEmail.subject}`,
                message: replyContent,
                category: "sent",
                date: moment().format("MMMM Do YYYY"),
                time: moment().format("LTS"),
              }),
            });

            if (mutate) await mutate();

            setReplyContent(""); // clear content
            setReplyEmailId(null); // close reply box
          } catch (err) {
            console.error("Reply failed:", err);
          }
          finally {
      setIsReplying(false);
    }
        }}disabled={isReplying}
  className={`px-6 py-1 rounded-md transition-colors ${
    isReplying
      ? "bg-a text-white cursor-not-allowed"
      : "bg-secondary text-white hover:bg-a"
  }`}
>
  {isReplying ? "Sending..." : "Send"}
</button>
    </div>
  </div>
) : (

  <div className="prose max-w-none">
    <div 
   className="text-gray-500 leading-relaxed prose-inherit"
   dangerouslySetInnerHTML={{ __html: currentEmail.fullContent || '' }}
/>    
    
  </div>
)}


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