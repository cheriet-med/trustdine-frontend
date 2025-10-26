import React, { useState, useMemo } from 'react';
import { Search, User, MapPin, Phone, Mail, Globe, Star, Calendar, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
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
import { FiFilter } from "react-icons/fi";
import { GrClearOption } from "react-icons/gr";


const UserAccordionDisplay = () => {
  const { AllUsers, mutate } = useFetchAllUser();
  const [searchTerm, setSearchTerm] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5); // Users per page
  const [filterByOwners, setFilterByOwners] = useState<null | boolean>(null);
  const [expandedUser, setExpandedUser] = useState<number | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null); // popup state

 const filteredUsers = useMemo(() => {
    if (!AllUsers) return [];
    const searchLower = searchTerm.toLowerCase();

    return AllUsers.filter(user => {
      if (user.is_superuser) return false;

      if (filterByOwners === true && !user.is_staff) return false;
      if (filterByOwners === false && user.is_staff) return false;

      return (
        (user.email && user.email.toLowerCase().includes(searchLower)) ||
        (user.full_name && user.full_name.toLowerCase().includes(searchLower)) ||
        (user.username && user.username.toLowerCase().includes(searchLower)) ||
        (user.title && user.title.toLowerCase().includes(searchLower)) ||
        (user.types && user.types.toLowerCase().includes(searchLower)) ||
        user.id.toString().includes(searchLower)
      );
    });
  }, [AllUsers, searchTerm, filterByOwners]);


  const handleClear = () => {
    setSearchTerm('');
    setFilterByOwners(null); // reset filter -> show all users (owners + normal)
  };


  const handleDelete = async (id: number) => {

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}infoid/${id}`, {
        method: 'DELETE', 
        headers: { 
          'Content-Type': 'application/json', 
          "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
        },
        body: JSON.stringify({ id })
      });
      if (!res.ok) throw new Error('Failed to delete user');



      // optionally refetch users or filter out deleted one
      //alert('User deleted successfully');
      setDeleteUserId(null);
    } catch (err) {
      console.error(err);
      //alert('Error deleting user');
    }
  };



  // Pagination calculations
  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset pagination when search changes
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const toggleExpanded = (userId:any) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  const formatDate = (dateString:any) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const stripHtmlTags = (html:any) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '');
  };

  const getDisplayName = (user:any) => {
    return user.full_name || user.username || user.email || `User ${user.id}`;
  };

  const getDisplayTitle = (user:any) => {
    return user.title || user.types || 'User';
  };

  if (!AllUsers || AllUsers.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <User className="mx-auto h-12 w-12 mb-4" />
          <p>No users found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-playfair mb-6">User Management</h1>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search users by name, email, title, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-secondary focus:border-transparent bg-white shadow-sm"
          />
        </div>
        <div className='mt-4 flex justify-end'>

<button
        onClick={() => setFilterByOwners(prev => !prev)}
        className="ml-2 px-4  bg-background text-white rounded flex gap-2 items-center"
      >
        <FiFilter className='h-4 w-4 text-white'/>
        {filterByOwners ? 'Filter by Users' : 'Filter by Owners'}
      </button>
 <button
        onClick={handleClear}
        className="ml-2 px-4  bg-gray-200 text-accent rounded flex gap-2 items-center"
      >
        <GrClearOption className='h-4 w-4 text-accent'/>
        Clear
      </button>

        </div>
      </div>

      {/* User Accordion */}
      <div className="space-y-0">
        {currentUsers.map((user) => (
          <div key={user.id} className="bg-white shadow-sm rounded-md border  border-gray-200 first:rounded-t-lg last:rounded-b-lg border-t-0 first:border-t overflow-hidden">
            {/* Accordion Header */}
            <div 
              className="flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleExpanded(user.id)}
            >
              {/* Profile Image */}
              <div className="flex-shrink-0 mr-4 flex-wrap">
                {user.profile_image ? (
                  <img
                    src={user.profile_image.startsWith('image/upload') 
                      ? `${process.env.NEXT_PUBLIC_IMAGE}/${user.profile_image}`
                      : user.profile_image
                    }
                    alt={getDisplayName(user)}
                    className="h-10 w-10 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-a flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-grow">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className='flex gap-2 items-center flex-wrap '>
                    <h3 className="font-playfair font-medium text-gray-600">
                      {getDisplayName(user)}
                    </h3>
                    <p className="text-sm text-gray-600">{getDisplayTitle(user)}</p>
                    <p className="text-sm text-gray-500">ID: {user.id}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2 justify-between ">
                    {/* Status Badges */}
                    {user.is_superuser && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <Shield className="h-3 w-3 mr-1" />
                        Superuser
                      </span>
                    )}
                    {user.is_staff && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-white">
                        Owner
                      </span>
                    )}
                    {user.premium_plan && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent text-white">
                        Premium
                      </span>
                    )}
                    {!user.is_active && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Inactive
                      </span>
                    )}
                    
                    {/* Expand Arrow */}
                    <div className={`transform transition-transform duration-200 ${
                      expandedUser === user.id ? 'rotate-180' : ''
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
            {expandedUser === user.id && (
              <div className="border-t border-gray-200 bg-gray-50">
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
                    
                    {/* Personal Information */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-playfair font-medium text-gray-700 mb-3 flex items-center">
                        <FaUserAstronaut className="h-5 w-5 mr-2 text-accent" />
                        Personal Info
                      </h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div>Full Name: {user.full_name || 'N/A'}</div>
                        <div>Username: {user.username || 'N/A'}</div>
                        <div>Born: {user.born || 'N/A'}</div>
                        <div>Language: {user.language || 'N/A'}</div>
                        <div>About: {stripHtmlTags(user.about) || 'N/A'}</div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-playfair font-medium text-gray-700 mb-3 flex items-center">
                        <MdContactEmergency className="h-5 w-5 mr-2 text-accent" />
                        Contact Info
                      </h4>
                   <div className="space-y-1 text-sm text-gray-600">
                        <div>Email: {user.email}</div>
                        <div>Phone: {user.phoneNumber || 'N/A'}</div>
                        <div>Website: {user.website || 'N/A'}</div>
                        <div className="flex items-center space-x-2 ">
                          Verified:
                          <span className={`px-2 py-1 rounded text-sm flex gap-2 ${
                            user.is_email_verified ? ' text-green-800' : ' text-red-800'
                          }`}>
                            Email {user.is_email_verified ? <MdVerified className='h-4 w-4'/> : <VscUnverified className='h-4 w-4'/>}
                          </span>
                          |
                          <span className={`px-2 py-1 rounded text-sm flex gap-2 ${
                            user.is_phone_number_verified ? ' text-green-800' : ' text-red-800'
                          }`}>
                            Phone {user.is_phone_number_verified ? <MdVerified className='h-4 w-4'/>: <VscUnverified className='h-4 w-4'/>}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Location Information */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-playfair font-medium text-gray-700 mb-3 flex items-center">
                        <FaMapLocationDot className="h-5 w-5 mr-2 text-accent" />
                        Location Info
                      </h4>
                     <div className="space-y-1 text-sm text-gray-600">
                        <div>Address 1: {user.address_line_1 || 'N/A'}</div>
                        <div>Address 2: {user.address_line_2 || 'N/A'}</div>
                        <div>City: {user.city || 'N/A'}</div>
                        <div>State: {user.state || 'N/A'}</div>
                        <div>Country: {user.countryCode || 'N/A'}</div>
                        <div>Postal Code: {user.postalCode || 'N/A'}</div>
                        <div>Coordinates: {
                          user.latitude && user.longtitude 
                            ? `${user.latitude}, ${user.longtitude}` 
                            : 'N/A'
                        }</div>
                      </div>
                    </div>

                    {/* Account Information */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-playfair font-medium text-gray-700 mb-3 flex items-center">
                        <RiAccountPinBoxFill className="h-5 w-5 mr-2 text-accent" />
                        Account Info
                      </h4>
                  <div className="space-y-1 text-sm text-gray-600">
                        <div>Status: {user.status || 'N/A'}</div>
                        <div>Plan: {user.premium_plan && "Premium" || 'Free'}</div>
                        <div>Joined: {formatDate(user.joined)}</div>
                        <div>Last Login: {formatDate(user.last_login)}</div>
                        <div>Active: {user.is_active ? 'Yes' : 'No'}</div>
                        <div>Owner: {user.is_staff ? 'Yes' : 'No'}</div>
                        <div>Identity Verified: {user.identity_verified ? 'Yes' : 'No'}</div>
                      </div>
                    </div>

                    {/* Business/Hotel Information */}
                   
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-playfair font-medium text-gray-700 mb-3 flex items-center">
                          <IoBusiness className="h-5 w-5 mr-2 text-accent" />
                          Business Info
                        </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                          <div>Type: {user.types || 'N/A'}</div>
                          <div>Hotel Stars: {user.hotel_stars || 'N/A'}</div>
                          <div>Title: {user.title || 'N/A'}</div>
                        </div>
                      </div>
                   

                    {/* Additional Information */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-playfair font-medium text-gray-700 mb-3 flex items-center">
                        <FaCircleInfo className="h-5 w-5 mr-2 text-accent" />
                        Additional Info
                      </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                        <div>Location: {user.location || 'N/A'}</div>
                        <div>Want to go: {user.want_to_go || 'N/A'}</div>
                        <div>Obsessed: {user.obsessed || 'N/A'}</div>
                        <div>Pets: {user.pets || 'N/A'}</div>
                        <div>Time Spend: {user.time_spend || 'N/A'}</div>
                      </div>
                    </div>
                  </div>
                </div> 
                <div  className='flex justify-end p-4 '>
                  <button className='w-48 bg-accent text-white rounded-md py-1  hover:bg-a flex gap-2 items-center justify-center'
                    onClick={() => setDeleteUserId(user.id)}
                    >
                    <RiDeleteBin6Line className='h-4 w-4 text-white'/>
              Delete
            </button>
                  </div> 
                
              </div>
            )}

          
          </div>
        ))}
      </div>
 {/* Delete confirmation popup */}
{deleteUserId && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md mx-4">
      <h3 className="text-lg font-semibold mb-4 font-playfair">Confirm Delete</h3>
      <p className="mb-6 text-gray-600">Are you sure you want to delete this user?</p>
      <div className="flex justify-end gap-4">
        <button
          onClick={() => setDeleteUserId(null)}
          className="px-4 py-1 bg-gray-50 rounded-lg hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={() => handleDelete(deleteUserId)}
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
                  {Math.min(endIndex, totalUsers)}
                </span>
                {' '}of{' '}
                <span className="font-medium">{totalUsers}</span>
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
                  // Show first page, last page, current page, and 2 pages around current
                  const showPage = 
                    page === 1 || 
                    page === totalPages || 
                    (page >= currentPage - 2 && page <= currentPage + 2);
                  
                  if (!showPage) {
                    // Show ellipsis
                    if (page === 2 && currentPage > 4) {
                      return (
                        <span key={page} className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300">
                          ...
                        </span>
                      );
                    }
                    if (page === totalPages - 1 && currentPage < totalPages - 3) {
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

      {currentUsers.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-500">Try adjusting your search terms or clearing the search.</p>
        </div>
      )}
    </div>
  );
};

export default UserAccordionDisplay;