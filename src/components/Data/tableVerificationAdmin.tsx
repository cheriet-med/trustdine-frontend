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
import useFetchVerificationDocs from '../requests/fetchVerificationDocs';
import { Gallery, Item } from 'react-photoswipe-gallery';

interface Verification {
  id: number;
  full_name: string;
  user: number;
  document_type: string;
  document_number: string;
  document_photo: string;
  selfie_document: string;
  date: string;
  time: string;
}

const Verification = () => {
  const { AllUsers } = useFetchAllUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [reportsPerPage] = useState(5);
  const [expandedReport, setExpandedReport] = useState<number | null>(null);
  const [deleteReportId, setDeleteReportId] = useState<number | null>(null);
  const [deleteReportId1, setDeleteReportId1] = useState<number | null>(null);
  const { Allverifications, mutate } = useFetchVerificationDocs();



  // Fixed search functionality to use Allverifications data
  const filteredVerifications = useMemo(() => {
    if (!Allverifications || Allverifications.length === 0) return [];
    const searchLower = searchTerm.toLowerCase();

    return Allverifications.filter((verification) => {
      return (
        (verification.full_name && verification.full_name.toString().toLowerCase().includes(searchLower)) ||
        (verification.document_type && verification.document_type.toLowerCase().includes(searchLower)) ||
        (verification.document_number && verification.document_number.toString().toLowerCase().includes(searchLower)) ||
        (verification.user && verification.user.toString().toLowerCase().includes(searchLower)) ||
        (verification.id && verification.id.toString().includes(searchLower))
      );
    });
  }, [Allverifications, searchTerm]);

  const handleClear = () => {
    setSearchTerm('');
  };

  const handleVerify = async (id: number) => {
    try {
      // Replace with your actual API endpoint for verification
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}infoid/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
        },
        body: JSON.stringify({ identity_verified: true })
      });
      
      if (!res.ok) throw new Error('Failed to verify user');
      
      // Refresh verifications after verification
      mutate();
      setDeleteReportId(null);
    } catch (err) {
      console.error(err);
    }
  };


  const handleNotVerify = async (id: number) => {
    try {
      // Replace with your actual API endpoint for verification
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}verifyid/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
        },
        body: JSON.stringify({ status: "Refused" })
      });
      
      if (!res.ok) throw new Error('Failed to verify user');
      
      // Refresh verifications after verification
      mutate();
      setDeleteReportId1(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Use filtered data for pagination
  const totalVerifications = filteredVerifications.length;
  const totalPages = Math.ceil(totalVerifications / reportsPerPage);
  const startIndex = (currentPage - 1) * reportsPerPage;
  const endIndex = startIndex + reportsPerPage;
  const currentVerifications = filteredVerifications.slice(startIndex, endIndex);

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

  if (!Allverifications || Allverifications.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <User className="mx-auto h-12 w-12 mb-4" />
          <p>No verification requests found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-gray-50 ">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-playfair mb-6">Verification Requests</h1>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by name, document type, document number, user ID, or verification ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-secondary focus:border-transparent bg-white shadow-sm"
          />
          {searchTerm && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Gallery wrapper for PhotoSwipe */}
      <Gallery>
        {/* Verifications Accordion */}
        <div className="space-y-0">
          {currentVerifications.map((verification) => (
            <div key={verification.id} className="bg-white shadow-sm rounded-md border border-gray-200 first:rounded-t-lg last:rounded-b-lg border-t-0 first:border-t overflow-hidden">
              {/* Accordion Header */}
              <div 
                className="flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleExpanded(verification.id)}
              >
                <div className="flex-grow">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className='flex gap-2 items-center flex-wrap '>
                      <h3 className="font-playfair font-medium text-gray-600">
                        Verification #{verification.id}
                      </h3>
                      <p className="text-sm text-gray-600">{verification.full_name}</p>
                      <p className="text-sm text-gray-500">User: {verification.user}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2 justify-between">
                      <span className="text-xs text-gray-500">
                        {verification.date} - {verification.time}
                      </span>
                      
                      {/* Expand Arrow */}
                      <div className={`transform transition-transform duration-200 ${
                        expandedReport === verification.id ? 'rotate-180' : ''
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
              {expandedReport === verification.id && (
                <div className="border-t border-gray-200 bg-gray-50">
                  <div className="p-6">
                    {/* Verification Information */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-playfair font-medium text-gray-700 mb-3 flex items-center">
                        <FaCircleInfo className="h-5 w-5 mr-2 text-accent" />
                        Request Details
                      </h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div>
                          <div><strong>Request ID:</strong> {verification.id}</div>
                          <div><strong>Full Name:</strong> {verification.full_name}</div>
                          <div><strong>Document Type:</strong> {verification.document_type}</div>
                          <div><strong>Document Number:</strong> {verification.document_number}</div>
                        </div>

                        <div>
                          <strong>Images:</strong> 
                          <div className='flex gap-2 flex-wrap mt-4'>
                            {/* Document Photo with PhotoSwipe */}
                            <Item
                              original={`${process.env.NEXT_PUBLIC_IMAGE}/${verification.document_photo}`}
                              thumbnail={`${process.env.NEXT_PUBLIC_IMAGE}/${verification.document_photo}`}
                              width="800"
                              height="600"
                            >
                              {({ ref, open }) => (
                                <img
                                  ref={ref}
                                  onClick={open}
                                  src={`${process.env.NEXT_PUBLIC_IMAGE}/${verification.document_photo}`}
                                  alt="Document Photo"
                                  className="h-32 w-32 object-cover border-2 border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                                />
                              )}
                            </Item>
                            
                            {/* Selfie Document with PhotoSwipe */}
                            <Item
                              original={`${process.env.NEXT_PUBLIC_IMAGE}/${verification.selfie_document}`}
                              thumbnail={`${process.env.NEXT_PUBLIC_IMAGE}/${verification.selfie_document}`}
                              width="800"
                              height="600"
                            >
                              {({ ref, open }) => (
                                <img
                                  ref={ref}
                                  onClick={open}
                                  src={`${process.env.NEXT_PUBLIC_IMAGE}/${verification.selfie_document}`}
                                  alt="Selfie with Document"
                                  className="h-32 w-32 object-cover border-2 border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                                />
                              )}
                            </Item>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">Click images to view full size</p>
                        </div>
                      </div>
                    </div>
                  </div> 
                  <div className='flex justify-end p-4 gap-4'>
                     <button 
                      className='w-48 bg-secondary text-white rounded-md py-1 hover:bg-accent flex gap-2 items-center justify-center transition-colors'
                      onClick={() => setDeleteReportId1(verification.id)}
                    >
                      <MdVerified className='h-4 w-4 text-white'/>
                      Mark as UnVerified
                    </button>
                    <button 
                      className='w-48 bg-accent text-white rounded-md py-1 hover:bg-secondary flex gap-2 items-center justify-center transition-colors'
                      onClick={() => setDeleteReportId(verification.user)}
                    >
                      <MdVerified className='h-4 w-4 text-white'/>
                      Mark as Verified
                    </button>
                  </div> 
                </div>
              )}
            </div>
          ))}
        </div>
      </Gallery>

      {/* Verification confirmation popup */}
      {deleteReportId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4 font-playfair">Confirm Verification</h3>
            <p className="mb-6 text-gray-600">Are you sure you want to mark this user as verified?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteReportId(null)}
                className="px-4 py-1 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleVerify(deleteReportId)}
                className="px-4 py-1 bg-a text-white rounded-lg hover:bg-secondary transition-colors"
              >
                Verify User
              </button>
            </div>
          </div>
        </div>
      )}


       {/* Verification confirmation popup */}
      {deleteReportId1 && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4 font-playfair">Confirm UnVerification</h3>
            <p className="mb-6 text-gray-600">Are you sure you want to mark this user as UnVerification?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteReportId1(null)}
                className="px-4 py-1 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleNotVerify(deleteReportId1)}
                className="px-4 py-1 bg-a text-white rounded-lg hover:bg-secondary transition-colors"
              >
                UnVerify User
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
                  {Math.min(endIndex, totalVerifications)}
                </span>
                {' '}of{' '}
                <span className="font-medium">{totalVerifications}</span>
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
                          ? 'z-10 bg-background border-background text-white'
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

      {currentVerifications.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No verification requests found</h3>
          <p className="text-gray-500">Try adjusting your search terms or clearing the search.</p>
          <button
            onClick={handleClear}
            className="mt-2 text-blue-600 hover:text-secondary"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
};

export default Verification;