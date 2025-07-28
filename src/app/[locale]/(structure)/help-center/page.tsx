'use client'

import React, { useState } from 'react';
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
  TrendingUp
} from 'lucide-react';

interface Article {
  title: string;
  id: string;
}

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  articles: Article[];
}

const HelpCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [showTicketForm, setShowTicketForm] = useState<boolean>(false);

  const sections: Section[] = [
    {
      id: 'users',
      title: 'For Users (Guests)',
      icon: <User className="w-6 h-6" />,
      articles: [
        { title: 'How to book a restaurant or hotel', id: 'booking' },
        { title: 'How review verification works', id: 'verification' },
        { title: 'What is a Trust Score and how is it calculated?', id: 'trust-score' },
        { title: 'How to report fake reviews or suspicious behavior', id: 'report-fake' },
        { title: 'How to change or cancel a reservation', id: 'cancel-reservation' },
        { title: 'Refund policy for bookings', id: 'refund-policy' }
      ]
    },
    {
      id: 'partners',
      title: 'For Restaurants & Hotels',
      icon: <Building2 className="w-6 h-6" />,
      articles: [
        { title: 'How to join TrustDine as a partner', id: 'join-partner' },
        { title: "What's included in the Partner Dashboard", id: 'partner-dashboard' },
        { title: 'How to respond to reviews', id: 'respond-reviews' },
        { title: 'How to get featured on TrustDine', id: 'get-featured' },
        { title: 'How TrustDine verifies your location', id: 'verify-location' },
        { title: 'Billing & monthly subscription', id: 'billing' }
      ]
    },
    {
      id: 'account',
      title: 'Account & Privacy',
      icon: <Shield className="w-6 h-6" />,
      articles: [
        { title: 'How to create an account', id: 'create-account' },
        { title: 'How to delete your account', id: 'delete-account' },
        { title: 'How we protect your data', id: 'data-protection' },
        { title: 'Two-factor authentication', id: '2fa' },
        { title: 'Forgot password / email reset', id: 'password-reset' }
      ]
    },
    {
      id: 'support',
      title: 'Contact & Support',
      icon: <MessageCircle className="w-6 h-6" />,
      articles: [
        { title: 'Live Chat Support (coming soon)', id: 'live-chat' },
        { title: 'Email Support', id: 'email-support' },
        { title: 'Trust & Safety Escalations', id: 'safety-escalations' },
        { title: 'Feedback Form', id: 'feedback-form' }
      ]
    }
  ];

  const topFAQs = [
    "How can I edit a review?",
    "Do I need to upload a receipt to leave a review?",
    "Where can I see my saved restaurants?"
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

  const filteredSections = sections.map(section => ({
    ...section,
    articles: section.articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.articles.length > 0 || searchQuery === '');

  return (
    <div >
      {/* Header */}
      <div className="flex flex-col text-center items-center justify-center px-2 mb-10 lg:mb-14 bg-secondary h-96  pt-16 rounded-b-3xl">
        <h2 className="text-xl font-bold md:text-3xl md:leading-tight text-white dark:text-neutral-200 font-playfair ">
        Welcome to the TrustDine Help Center
        </h2>
        <p className='my-8 text-white  lg:text-xl font-playfair w-max-5xl'>
We’re here to help you get the most out of TrustDine. <br /> Whether you’re looking to book a table, leave
a review, or get support as a business partner — this is the place to start.</p>
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
      </div>

      {/* Top FAQs */}
      <div className="mb-8 bg-highlights rounded-lg p-6 border border-blue-100">
        <div className="flex items-center mb-4">
          <TrendingUp className="w-6 h-6 text-white mr-2" />
          <h2 className="text-xl font-semibold text-white">Top Questions This Week</h2>
        </div>
        <div className="space-y-3">
          {topFAQs.map((faq, index) => (
            <div key={index} className="flex items-start">
              <span className="bg-secondary text-gray-50 text-sm font-medium px-2.5 py-0.5 rounded-full mr-3 mt-0.5">
                {index + 1}
              </span>
              <button className="text-left text-gray-50 hover:text-gray-900 hover:underline transition-colors">
                {faq}
              </button>
            </div>
          ))}
        </div>
      </div>

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
                      className="block w-full text-left py-2 px-3 hover:bg-highlights rounded-md transition-colors group"
                    >
                      <span className="text-gray-700 group-hover:text-a transition-colors underline text-medium">
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

      {/* Ticket Form */}
      {showTicketForm && (
        <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 font-playfair">Submit a Support Ticket</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary">
                <option>Select a category</option>
                <option>Booking Issues</option>
                <option>Account Problems</option>
                <option>Review Questions</option>
                <option>Partner Support</option>
                <option>Technical Issues</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="Brief description of your issue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="Please provide as much detail as possible about your issue"
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowTicketForm(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Ticket submitted successfully! Our team will get back to you within 24 hours.');
                  setShowTicketForm(false);
                }}
                className="px-6 py-2 bg-secondary text-white rounded-md hover:bg-highlights transition-colors"
              >
                Submit Ticket
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default HelpCenter;