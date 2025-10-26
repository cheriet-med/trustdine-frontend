import React, { useState, useMemo } from 'react';
import { Search, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { FaUserAstronaut } from "react-icons/fa";
import useFetchAllUser from '../requests/fetchAllUsers';
import { MdContactEmergency } from "react-icons/md";
import { FaMapLocationDot } from "react-icons/fa6";
import { RiAccountPinBoxFill } from "react-icons/ri";
import { FaCircleInfo } from "react-icons/fa6";
import { IoBusiness } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdVerified } from "react-icons/md";
import { VscUnverified } from "react-icons/vsc";
import useFetchReviewsReport from '../requests/fetchReportReviews';

interface Reports {
  id: number;
  review: string | number;
  user: string | number;
  reason: string;
  informations: string;
  created_at: string;
}

const ReportReviews = () => {
  const { AllUsers } = useFetchAllUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [reportsPerPage] = useState(5);
  const [expandedReport, setExpandedReport] = useState<number | null>(null);
  const [deleteReportId, setDeleteReportId] = useState<number | null>(null);

  const { Report, mutate } = useFetchReviewsReport();
  
  // Sample reports data - replace this with your actual data source
  const reports: Reports[] = [
    {
      id: 1,
      review: 101,
      user: "john_doe",
      reason: "Inappropriate language",
      informations: "The review contained offensive words.",
      created_at: "2025-09-20T14:32:00Z",
    },
    {
      id: 2,
      review: "Product feedback #202",
      user: 45,
      reason: "Spam",
      informations: "User repeatedly posted the same review.",
      created_at: "2025-09-21T09:15:00Z",
    },
    {
      id: 3,
      review: 303,
      user: "alice_w",
      reason: "False information",
      informations: "The review claimed features that don't exist in the product.",
      created_at: "2025-09-22T18:05:00Z",
    },
    {
      id: 4,
      review: "Review #404",
      user: 78,
      reason: "Harassment",
      informations: "Review targeted another customer personally.",
      created_at: "2025-09-23T11:47:00Z",
    },
  ];

  const filteredReports = useMemo(() => {
    if (!reports) return [];
    const searchLower = searchTerm.toLowerCase();

    return reports.filter(report => {
      return (
        (report.reason && report.reason.toString().toLowerCase().includes(searchLower)) ||
        (report.informations && report.informations.toLowerCase().includes(searchLower)) ||
        (report.user && report.user.toString().toLowerCase().includes(searchLower)) ||
        (report.review && report.review.toString().toLowerCase().includes(searchLower))
      );
    });
  }, [reports, searchTerm]);

  const handleClear = () => {
    setSearchTerm('');
  };

  const handleDelete = async (id: number) => {
    try {
      // Replace with your actual API endpoint
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}report/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
        },
      });
      
      if (!res.ok) throw new Error('Failed to delete report');
      
      // Refresh reports after deletion
      mutate();
      setDeleteReportId(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Pagination calculations
  const totalReports = filteredReports.length;
  const totalPages = Math.ceil(totalReports / reportsPerPage);
  const startIndex = (currentPage - 1) * reportsPerPage;
  const endIndex = startIndex + reportsPerPage;
  const currentReports = filteredReports.slice(startIndex, endIndex);

  // Reset pagination when search changes
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const toggleExpanded = (reportId: number) => {
    setExpandedReport(expandedReport === reportId ? null : reportId);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  if (!reports || reports.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <User className="mx-auto h-12 w-12 mb-4" />
          <p>No reports found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-playfair mb-6">Reviews Report</h1>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search reports by reason, information, user, or review..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-secondary focus:border-transparent bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Reports Accordion */}
      <div className="space-y-0">
        {currentReports.map((report) => (
          <div key={report.id} className="bg-white shadow-sm rounded-md border border-gray-200 first:rounded-t-lg last:rounded-b-lg border-t-0 first:border-t overflow-hidden">
            {/* Accordion Header */}
            <div 
              className="flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleExpanded(report.id)}
            >
              <div className="flex-grow">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className='flex gap-2 items-center flex-wrap '>
                    <h3 className="font-playfair font-medium text-gray-600">
                      Report #{report.id}
                    </h3>
                    <p className="text-sm text-gray-600">Reason: {report.reason}</p>
                    <p className="text-sm text-gray-500">User: {report.user}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2 justify-between">
                    <span className="text-xs text-gray-500">
                      {formatDate(report.created_at)}
                    </span>
                    
                    {/* Expand Arrow */}
                    <div className={`transform transition-transform duration-200 ${
                      expandedReport === report.id ? 'rotate-180' : ''
                    }`}>
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Accordion Content */}
            {expandedReport === report.id && (
              <div className="border-t border-gray-200 bg-gray-50">
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Report Information */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-playfair font-medium text-gray-700 mb-3 flex items-center">
                        <FaCircleInfo className="h-5 w-5 mr-2 text-accent" />
                        Report Details
                      </h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div><strong>Report ID:</strong> {report.id}</div>
                        <div><strong>Reason:</strong> {report.reason}</div>
                        <div><strong>Review ID:</strong> {report.review}</div>
                        <div><strong>User ID:</strong> {report.user}</div>
                        <div><strong>Reported on:</strong> {formatDate(report.created_at)}</div>
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-playfair font-medium text-gray-700 mb-3 flex items-center">
                        <FaCircleInfo className="h-5 w-5 mr-2 text-accent" />
                        Additional Information
                      </h4>
                      <div className="text-sm text-gray-600">
                        <p>{report.informations}</p>
                      </div>
                    </div>

                  </div>
                </div> 
                <div className='flex justify-end p-4 '>
                  <button 
                    className='w-48 bg-accent text-white rounded-md py-1  hover:bg-secondary flex gap-2 items-center justify-center transition-colors'
                    onClick={() => setDeleteReportId(report.id)}
                  >
                    <RiDeleteBin6Line className='h-4 w-4 text-white'/>
                    Delete Report
                  </button>
                </div> 
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Delete confirmation popup */}
      {deleteReportId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4 font-playfair">Confirm Delete</h3>
            <p className="mb-6 text-gray-600">Are you sure you want to delete this report?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteReportId(null)}
               className="px-4 py-1 bg-gray-50 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteReportId)}
                className="px-4 py-1 bg-a text-white rounded-lg hover:bg-secondary"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8 bg-white px-4 py-3 border border-gray-200 rounded-lg shadow-sm">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">{startIndex + 1}</span>
                {' '}to{' '}
                <span className="font-medium">
                  {Math.min(endIndex, totalReports)}
                </span>
                {' '}of{' '}
                <span className="font-medium">{totalReports}</span>
                {' '}results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  const showPage = 
                    page === 1 || 
                    page === totalPages || 
                    (page >= currentPage - 1 && page <= currentPage + 1);
                  
                  if (!showPage) {
                    if (page === 2 && currentPage > 3) {
                      return (
                        <span key={page} className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300">
                          ...
                        </span>
                      );
                    }
                    if (page === totalPages - 1 && currentPage < totalPages - 2) {
                      return (
                        <span key={page} className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }

                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border ${
                        currentPage === page
                          ? 'z-10 bg-blue-600 border-blue-600 text-white'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {currentReports.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
          <p className="text-gray-500">Try adjusting your search terms or clearing the search.</p>
        </div>
      )}
    </div>
  );
};

export default ReportReviews;