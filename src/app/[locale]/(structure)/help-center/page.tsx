'use client'

import React, { useState, useRef, useEffect } from 'react';
import { RiChatSmileAiLine } from "react-icons/ri";
import { useRouter } from 'next/navigation';
import LoginButtonLiveChat from '@/components/header/loginButtonLiveChat';
import { useSession } from 'next-auth/react';
import moment from 'moment';
import { 
  Search, 
  User, 
  Building2, 
  Shield, 
  MessageCircle, 
  ChevronDown, 
  ChevronUp,
  Star,
  MapPin,
  CreditCard,
  Mail,
  HelpCircle,
  Plus,
  TrendingUp,
  Loader2,
  X,
  CheckIcon
} from 'lucide-react';

interface Article {
  title: string;
  id: string;
  content?: string;
}

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  articles: Article[];
}

interface TicketForm {
  name: string;
  email: string;
  category: string;
  subject: string;
  description: string;
}

const HelpCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [showTicketForm, setShowTicketForm] = useState<boolean>(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<string>('');
  const articleDisplayRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  const [ticketForm, setTicketForm] = useState<TicketForm>({
    name: '',
    email: '',
    category: '',
    subject: '',
    description: ''
  });




  const CustomSelect = ({ 
    value, 
    onChange, 
    options, 
    placeholder,
    className = ""
  }: {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder: string;
    className?: string;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);
    const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder;

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    return (
      <div className={`relative ${className}`} ref={selectRef}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className={`flex h-12 w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-3 text-left text-sm transition-all hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-accent ${
            isOpen ? 'ring-2 ring-accent' : ''
          }`}
        >
          <span className="truncate text-left">{selectedLabel}</span>
          <ChevronDown
            className={`h-4 w-4 text-gray-500 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div 
            className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="max-h-60 overflow-y-auto"
              onWheel={(e) => {
                e.stopPropagation();
                const { currentTarget } = e;
                if (
                  e.deltaY < 0 && currentTarget.scrollTop <= 0 ||
                  e.deltaY > 0 && currentTarget.scrollHeight - currentTarget.clientHeight <= currentTarget.scrollTop
                ) {
                  e.preventDefault();
                }
              }}
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`relative flex w-full cursor-pointer select-none items-center px-4 py-2 text-sm text-left ${
                    value === option.value
                      ? 'bg-accent text-white'
                      : 'text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="flex-1 truncate text-left">{option.label}</span>
                  {value === option.value && (
                    <CheckIcon className="ml-2 h-4 w-4 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  
  const sections: Section[] = [
    {
      id: 'users',
      title: 'For Users (Guests)',
      icon: <User className="w-6 h-6" />,
      articles: [
        { 
          title: 'How to book a restaurant or hotel', 
          id: 'booking',
          content: 'To book a restaurant or hotel on TrustDine, simply browse our listings, select your preferred venue, choose your date and time, and complete the reservation process. You can filter by location, cuisine type, price range, and availability to find the perfect match for your needs.'
        },
        { 
          title: 'How review verification works', 
          id: 'verification',
          content: 'Our review verification system ensures authenticity by requiring proof of visit through receipt uploads, reservation confirmations, or location verification. Verified reviews are marked with a special badge and carry more weight in our Trust Score calculations.'
        },
        { 
          title: 'What is a Trust Score and how is it calculated?', 
          id: 'trust-score',
          content: 'Trust Score is our proprietary rating system that combines multiple factors: verified reviews, review quality, business response rate, consistency of service, and overall customer satisfaction. Scores range from 1-10, with higher scores indicating more trustworthy establishments.'
        },
        { 
          title: 'How to report fake reviews or suspicious behavior', 
          id: 'report-fake',
          content: 'If you encounter fake reviews or suspicious activity, use the "Report" button on any review or contact our Trust & Safety team. We investigate all reports within 24 hours and take appropriate action including review removal and account suspension when necessary.'
        },
        { 
          title: 'How to change or cancel a reservation', 
          id: 'cancel-reservation',
          content: 'You can modify or cancel reservations through your account dashboard up to 2 hours before your booking time. For last-minute changes, contact the venue directly or our customer support team for assistance.'
        },
        { 
          title: 'Refund policy for bookings', 
          id: 'refund-policy',
          content: 'Refunds are available for cancellations made at least 24 hours in advance. For cancellations within 24 hours, a 50% fee may apply. Emergency cancellations are reviewed case-by-case. Processing time is typically 3-5 business days.'
        }
      ]
    },
    {
      id: 'partners',
      title: 'For Restaurants & Hotels',
      icon: <Building2 className="w-6 h-6" />,
      articles: [
        { 
          title: 'How to join TrustDine as a partner', 
          id: 'join-partner',
          content: 'Join TrustDine by completing our partner application form, providing business verification documents, and setting up your profile. Our team reviews applications within 2-3 business days and provides onboarding support to get you started.'
        },
        { 
          title: "What's included in the Partner Dashboard", 
          id: 'partner-dashboard',
          content: 'The Partner Dashboard includes reservation management, review monitoring and response tools, analytics and insights, promotional features, customer communication tools, and billing management. You can track performance metrics and optimize your listing in real-time.'
        },
        { 
          title: 'How to respond to reviews', 
          id: 'respond-reviews',
          content: 'Respond to reviews through your Partner Dashboard within 48 hours for best results. Keep responses professional, address specific concerns, and thank customers for feedback. Public responses show potential customers that you care about service quality.'
        },
        { 
          title: 'How to get featured on TrustDine', 
          id: 'get-featured',
          content: 'Featured listings are selected based on Trust Score, customer feedback quality, photo quality, complete profile information, and promotional partnerships. Maintain excellent service standards and engage actively with the platform to increase featuring opportunities.'
        },
        { 
          title: 'How TrustDine verifies your location', 
          id: 'verify-location',
          content: 'Location verification involves document review (business license, lease agreement), phone verification, and sometimes an on-site visit. This process ensures listing accuracy and builds customer trust in our platform.'
        },
        { 
          title: 'Billing & monthly subscription', 
          id: 'billing',
          content: 'Partner subscriptions are billed monthly based on your chosen plan tier. Basic plans start at $29/month with advanced features available in premium tiers. All billing is handled securely through our payment system with detailed invoicing.'
        }
      ]
    },
    {
      id: 'account',
      title: 'Account & Privacy',
      icon: <Shield className="w-6 h-6" />,
      articles: [
        { 
          title: 'How to create an account', 
          id: 'create-account',
          content: 'Creating an account is simple: click "Sign Up", provide your email and password, verify your email address, and complete your profile. You can also sign up using Google or Facebook for faster registration.'
        },
        { 
          title: 'How to delete your account', 
          id: 'delete-account',
          content: 'To delete your account, go to Settings > Account > Delete Account. This action is permanent and will remove all your data including reviews, reservations, and preferences. Download your data first if needed.'
        },
        { 
          title: 'How we protect your data', 
          id: 'data-protection',
          content: 'We use industry-standard encryption, secure servers, and strict access controls to protect your personal information. We never sell your data to third parties and only use it to improve your TrustDine experience as outlined in our Privacy Policy.'
        },
        { 
          title: 'Two-factor authentication', 
          id: '2fa',
          content: 'Enable 2FA in your Security Settings for added account protection. We support SMS, authenticator apps, and email verification. This extra layer of security helps protect your account even if your password is compromised.'
        },
        { 
          title: 'Forgot password / email reset', 
          id: 'password-reset',
          content: 'Use the "Forgot Password" link on the login page to reset your password via email. For email changes, log into your account and update your email in Settings. You\'ll need to verify the new email address.'
        }
      ]
    },
    {
      id: 'support',
      title: 'Contact & Support',
      icon: <MessageCircle className="w-6 h-6" />,
      articles: [
        { 
          title: 'Live Chat Support (coming soon)', 
          id: 'live-chat',
          content: 'Live chat support is currently in development and will be available 24/7 to assist with urgent issues. In the meantime, please use our email support or submit a ticket for fastest response.'
        },
        { 
          title: 'Email Support', 
          id: 'email-support',
          content: 'Email us at support@trustdine.com for non-urgent inquiries. Our team responds within 24 hours on weekdays and 48 hours on weekends. Please include relevant details to help us assist you faster.'
        },
        { 
          title: 'Trust & Safety Escalations', 
          id: 'safety-escalations',
          content: 'For serious safety concerns, fake reviews, or policy violations, contact our Trust & Safety team at safety@trustdine.com. These issues receive priority handling with response within 2-4 hours during business hours.'
        },
        { 
          title: 'Feedback Form', 
          id: 'feedback-form',
          content: 'We value your input! Use our feedback form to suggest new features, report bugs, or share ideas for improvement. While we can\'t respond to all feedback individually, we review every submission for product development.'
        }
      ]
    }
  ];

  const topFAQs = [
    {
      question: "How can I edit a review?",
      answer: "You can edit your reviews within 48 hours of posting by going to your profile, finding the review, and clicking 'Edit'. After 48 hours, reviews become permanent to maintain authenticity and prevent manipulation."
    },
    {
      question: "Do I need to upload a receipt to leave a review?",
      answer: "While not required, uploading a receipt or proof of visit helps verify your review and increases its credibility. Verified reviews are given more weight in our Trust Score calculations and are marked with a special badge."
    },
    {
      question: "Where can I see my saved restaurants?",
      answer: "Your saved restaurants can be found in your account dashboard under the 'Favorites' or 'Saved' section. You can also access them quickly from the heart icon in the main navigation menu."
    }
  ];

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
    // Scroll to article display after a short delay to ensure it's rendered
    setTimeout(() => {
      articleDisplayRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }, 100);
  };

  const handleFAQClick = (faq: {question: string, answer: string}) => {
    setSelectedArticle({
      title: faq.question,
      id: 'faq',
      content: faq.answer
    });
    // Scroll to article display after a short delay to ensure it's rendered
    setTimeout(() => {
      articleDisplayRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }, 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTicketForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handleCategoryChange = (value: string) => {
  setTicketForm(prev => ({
    ...prev,
    category: value
  }));
};

  const submitTicket = async () => {
    if (!ticketForm.name || !ticketForm.email || !ticketForm.subject || !ticketForm.description ||  !ticketForm.category) {
      setSubmitMessage('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}emailletterpost/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
        },
        body: JSON.stringify({
          first_name: ticketForm.name,
          email: ticketForm.email,
          message_type: true,
          subject: ticketForm.subject,
          message: ticketForm.description,
          category:"inbox",
          date:moment().format('MMMM Do YYYY'),
          time:moment().format('LTS'),
        }),
      });

      if (response.ok) {
        setSubmitMessage('Ticket submitted successfully! Our team will get back to you within 24 hours.');
        setTicketForm({
          name: '',
          email: '',
          category: '',
          subject: '',
          description: ''
        });
        setTimeout(() => {
          setShowTicketForm(false);
          setSubmitMessage('');
        }, 3000);
      } else {
        throw new Error('Failed to submit ticket');
      }
    } catch (error) {
      setSubmitMessage('Error submitting ticket. Please try again or contact support directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredSections = sections.map(section => ({
    ...section,
    articles: section.articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.content && article.content.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })).filter(section => section.articles.length > 0 || searchQuery === '');

  const filteredFAQs = topFAQs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col text-center items-center justify-center px-4 mb-10 lg:mb-14 bg-secondary h-96 pt-32 rounded-b-3xl">
        <h2 className="text-xl font-bold md:text-3xl md:leading-tight text-white dark:text-neutral-200 font-playfair">
          Welcome to the Goamico Help Center
        </h2>
        <p className='my-8 text-white lg:text-xl font-playfair w-max-5xl'>
          We're here to help you get the most out of TrustDine. <br /> Whether you're looking to book a table, leave
          a review, or get support as a business partner — this is the place to start.
        </p>
      </div>

      <div className="max-w-7xl mx-auto bg-white p-6 lg:p-10 rounded-xl shadow-sm mb-10 text-gray-700 font-montserrat text-sm space-y-4">
        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border border-secondary rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Search Results Display */}
        {searchQuery && (
          <div className="mb-8 bg-highlights rounded-lg p-4 border border-secondary">
            <h3 className="font-semibold text-white mb-2">
              Search Results for "{searchQuery}"
            </h3>
            <p className="text-sm text-white">
              {filteredSections.reduce((total, section) => total + section.articles.length, 0) + filteredFAQs.length} results found
            </p>
          </div>
        )}

        {/* Top FAQs */}
        {(!searchQuery || filteredFAQs.length > 0) && (
          <div className="mb-8 bg-highlights rounded-lg p-6 border border-blue-100">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-6 h-6 text-white mr-2" />
              <h2 className="text-xl font-semibold text-white">Top Questions This Week</h2>
            </div>
            <div className="space-y-3">
              {(searchQuery ? filteredFAQs : topFAQs).map((faq, index) => (
                <div key={index} className="flex items-start">
                  <span className="bg-secondary text-gray-50 text-sm font-medium px-2.5 py-0.5 rounded-full mr-3 mt-0.5">
                    {index + 1}
                  </span>
                  <button 
                    onClick={() => handleFAQClick(faq)}
                    className="text-left text-gray-50 hover:text-gray-200 hover:underline transition-colors"
                  >
                    {faq.question}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Help Sections */}
        <div className="space-y-4 mb-8">
          {filteredSections.map((section) => (
            <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <div className="text-secondary mr-3">
                    {section.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-highlights font-playfair">{section.title}</h3>
                </div>
                {expandedSections.has(section.id) ? (
                  <ChevronUp className="w-5 h-5 text-secondary" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-secondary" />
                )}
              </button>
              
              {expandedSections.has(section.id) && (
                <div className="px-6 py-4 bg-white">
                  <div className="space-y-3">
                    {section.articles.map((article) => (
                      <button
                        key={article.id}
                        onClick={() => handleArticleClick(article)}
                        className="block w-full text-left py-2 px-3 hover:bg-highlights rounded-md transition-colors group"
                      >
                        <span className="text-gray-700 group-hover:text-white transition-colors underline text-medium">
                          {article.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Article Content Display */}
        {selectedArticle && (
          <div ref={articleDisplayRef} className="mb-8 bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-700 font-playfair">
                {selectedArticle.title}
              </h3>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-gray-600 leading-relaxed">
              {selectedArticle.content}
            </div>
          </div>
        )}

        {/* Ticket Form Toggle */}
        <div className="text-center">
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <HelpCircle className="w-12 h-12 text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-secondary mb-2 font-playfair">Can't find what you're looking for?</h3>
            <p className="text-gray-600 mb-4">Submit a support ticket and our team will get back to you within 24 hours.</p>
            <button
              onClick={() => setShowTicketForm(!showTicketForm)}
              className="bg-secondary hover:bg-highlights text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center mx-auto"
            >
              <Plus className="w-5 h-5 mr-2" />
              Submit a Ticket
            </button>
          </div>
        </div>

        {/* Submit Message */}
        {submitMessage && (
          <div className={`mt-4 p-4 rounded-lg ${submitMessage.includes('Error') ? ' text-secondary' : 'text-accent'}`}>
            {submitMessage}
          </div>
        )}

        {/* Ticket Form */}
        {showTicketForm && (
          <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 font-playfair">Submit a Support Ticket</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={ticketForm.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={ticketForm.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                 <CustomSelect
                        value={ticketForm.category}
                        onChange={handleCategoryChange}
                        placeholder="Select a category"
                        options={[
                          { value: 'Booking Issues', label: 'Booking Issues' },
                          { value: 'Account Problems', label: 'Account Problems' },
                          { value: 'Review Questions', label: 'Review Questions' },
                          { value: 'Partner Support', label: 'Partner Support' },
                          { value: 'Technical Issues', label: 'Technical Issues' },
                          { value: 'Other', label: 'Other' },
                        ]}
                      />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={ticketForm.subject}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="Brief description of your issue"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  rows={5}
                  name="description"
                  value={ticketForm.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="Please provide as much detail as possible about your issue"
                  required
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowTicketForm(false);
                    setSubmitMessage('');
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submitTicket}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-secondary text-white rounded-md hover:bg-highlights transition-colors flex items-center disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Ticket'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
{status === "authenticated" ?       
<div className="fixed bottom-24 right-8 z-50">
              <button
                
                onClick={()=>router.push(`/en/account/messages/?id=10`)}
                className="p-1 flex flex-col justify-center items-center bg-secondary w-20 h-20 text-yel rounded-full shadow-lg hover:bg-accent transition-all bg-opacity-80 border border-spacing-1 border-white"
              >
                <RiChatSmileAiLine size={32} className='text-white '/>
               <p className='text-xs text-white'>Live Chat</p>
               
              </button>
           
          </div>: 
          <LoginButtonLiveChat/> }
    </div>
  );
};

export default HelpCenter;