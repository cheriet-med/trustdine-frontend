'use client'
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Download } from 'lucide-react';
import useFetchAllNewsLetterEmails from '../requests/fetchAllNewsletters';


const NewsletterTable = () => {
  // Sample data - in a real app, this would come from your database


  const [searchTerm, setSearchTerm] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const {AllNewsLetters} = useFetchAllNewsLetterEmails()

  // Set timestamp on client side only to avoid hydration issues
  useEffect(() => {
    setLastUpdated(new Date().toLocaleString());
  }, []);

  // Filter subscribers based on search term
  const filteredSubscribers = useMemo(() => {
    if (!searchTerm) return AllNewsLetters;
    
    return AllNewsLetters.filter(subscriber =>
      subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.date.includes(searchTerm)
    );
  }, [AllNewsLetters, searchTerm]);

  // Export to CSV function
  const exportToCSV = () => {
    const csvContent = [
      ['Email', 'Date', 'Time'], // Header
      ...filteredSubscribers.map(sub => [sub.email, sub.date, sub.time])
    ];

    const csvString = csvContent
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatDateTime = (dateTime:string) => {
    const date = new Date(dateTime);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800 mb-4 font-playfair">Newsletter Subscribers</h1>
        
        {/* Search and Export Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by email or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
            />
          </div>
          
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-1 bg-a text-white rounded-lg hover:bg-a transition-colors duration-200 font-medium text-sm"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Results counter */}
     
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
        <table className="w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subscription Date & Time
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredSubscribers.length > 0 ? (
              filteredSubscribers.map((subscriber, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-700">
                      {subscriber.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">
                      {formatDateTime(subscriber.date)} - {subscriber.time}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-6 py-8 text-center text-gray-500">
                  No subscribers found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer info */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        Data updates in real-time {lastUpdated && `• Last updated: ${lastUpdated}`}
      </div>
    </div>
  );
};

export default NewsletterTable;