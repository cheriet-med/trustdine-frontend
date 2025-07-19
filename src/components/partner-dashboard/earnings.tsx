
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { signOut } from "next-auth/react";
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useLocale } from "next-intl";
import { 
  Search,
  X,
  ChevronLeft,
  ChevronRight,

} from 'lucide-react';

import { CgProfile } from "react-icons/cg";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa";
import { MdOutlineTravelExplore } from "react-icons/md";
import { FaRegMessage } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { LuCircleHelp } from "react-icons/lu";
import { FiLogOut } from "react-icons/fi";
import { IoHomeOutline } from "react-icons/io5";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { LuBriefcaseBusiness } from "react-icons/lu";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaRegAddressBook } from "react-icons/fa";
import { MdOutlineInsights } from "react-icons/md";
import { PiMoneyWavyThin } from "react-icons/pi";

import EarningChart from '../Data/earnings';

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  href: string;
  badge?: string;
}

const menuItems: MenuItem[] = [
  { id: 'Insights', label: 'Insights', icon: <MdOutlineInsights size={24} className='text-white'/>, href: '/en/account' },
  { id: 'Calendar', label: 'Calendar', icon: <FaRegCalendarAlt size={24} className='text-white'/>, href: '/en/account/calendar' },
  { id: 'Reservations', label: 'Reservations', icon:  <FaRegAddressBook size={24} className='text-white'/>, href: '/en/account/reservations' },
  { id: 'Earnings', label: 'Earnings', icon: <PiMoneyWavyThin size={24} className='text-white'/>, href: '/en/account/earnings' },
  { id: 'Profile', label: 'Profile', icon: <CgProfile size={24} className='text-white'/>, href: '/en/account/profile' },
  { id: 'Wishlist', label: 'Wishlist', icon:  <FaRegHeart size={24} className='text-white'/>, href: '/en/account/wishlist-partner' },
  { id: 'Listings', label: 'Listings', icon: <MdOutlineTravelExplore size={24} className='text-white'/>, href: '/en/account/listings' },
  { id: 'Messages', label: 'Messages', icon: <FaRegMessage size={24} className='text-white'/>, href: '/en/account/messages', },
  { id: 'Account Settings', label: 'Account Settings', icon:<IoSettingsOutline size={24} className='text-white'/>, href: '/en/account/partner-information' },
  { id: 'Business Support', label: 'Business Support', icon: <LuBriefcaseBusiness size={24} className='text-white'/>, href: '/en/support' },
  { id: 'Help Center', label: 'Help Center', icon: <LuCircleHelp size={24} className='text-white'/>, href: '/en/help-center' },
  { id: 'Home page', label: 'Home page', icon: <IoHomeOutline size={24} className='text-white'/>, href: '/' },
];

export default function EarningsDashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const locale = useLocale(); // Get the current locale
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-highlights border-b border-gray-200 z-50 ">
        <div className="flex items-center justify-between px-4 h-full">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg  transition-colors"
          >
            <HiOutlineMenuAlt1 size={28} className="text-white" />
          </button>
        
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-lg  transition-colors">
             <IoMdNotificationsOutline size={28} className='text-white'/>
            </button>
          
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={toggleMobileMenu} />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-full bg-highlights border-r border-gray-200 z-50 transition-all duration-300 ease-in-out overflow-y-auto
          ${isCollapsed ? 'w-24' : 'w-64'}
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className={`flex items-center justify-between border-b border-gray-200 ${isCollapsed ? 'p-2' : 'p-4'}`}>
          {isCollapsed ? (
            <div className="flex items-center justify-center w-full">
           
                <span className="text-white font-bold font-playfair text-xl">D</span>
             
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              
              <h2 className="text-xl font-bold text-white font-playfair">Dashboard</h2>

              <IoMdNotificationsOutline size={28} className='text-white hidden md:block'/>
            </div>
          )}
          {!isCollapsed && (
            <button
              onClick={window.innerWidth < 1024 ? toggleMobileMenu : toggleSidebar}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
              {window.innerWidth < 1024 ? (
                <X className="h-5 w-5 text-white" />
              ) : (
                <ChevronLeft className="h-6 w-6 text-white" />
              )}
            </button>
          )}
        </div>

        {/* Collapse/Expand Button for Desktop */}
        {isCollapsed && (
          <div className="hidden lg:flex justify-center p-2">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <ChevronRight className="h-7 w-7 text-white" />
            </button>
          </div>
        )}

        {/* Search */}
        {!isCollapsed && (
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-background focus:border-transparent text-gray-900 placeholder-gray-500"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 pb-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <div key={item.id} className='font-montserrat'>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center px-3 py-2 rounded-lg transition-all duration-200 group relative
                      ${isActive 
                        ? 'bg-accent text-white shadow-sm shadow-accent' 
                        : 'text-white hover:bg-accent'
                      }
                      ${isCollapsed ? ' pl-1 w-8 h-8' : 'space-x-3'}
                    `}
                  >
                  <div>
                    {item.icon}
                  </div>
                    {!isCollapsed && (
                      <>
                        <span className="font-medium">{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                    {isCollapsed && item.badge && (
                      <span className="absolute top-0 right-2 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-secondary text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                        {item.label}
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-900"></div>
                      </div>
                    )}
                  </Link>
                </div>
              );
            })}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="p-2 border-t border-gray-200">
          {!isCollapsed ? (
            <div className="flex items-center space-x-3 px-2">
            <div className="w-10 h-10 relative rounded-full overflow-hidden">
  <Image
    src="/h.jpg" 
    alt="Facebook"
    fill // This makes the image fill the container
    style={{ 
      objectFit: 'cover', // This ensures the image covers the area while maintaining aspect ratio
    }}
  />
</div>

  <div className="flex-1">
                <p className=" font-medium text-gray-700 font-playfair text-white">Whispering Pines Resort</p>
                
              </div>
              <div className='hover:bg-accent p-1 rounded-lg' onClick={() => signOut({ callbackUrl: `/en/login` })}>
                <FiLogOut size={24} className='text-white' />
            </div>
            </div>
 

            
          ) : (
            <div className="flex flex-col items-center space-y-4">
               <div className="w-10 h-10 relative rounded-full overflow-hidden">
  <Image
    src="/h.jpg" 
    alt="Facebook"
    fill // This makes the image fill the container
    style={{ 
      objectFit: 'cover', // This ensures the image covers the area while maintaining aspect ratio
    }}
  />
</div>
             <div className='hover:bg-background p-1 rounded-lg' onClick={() => signOut({ callbackUrl: `/en/login` })}>
               <FiLogOut size={24} className='text-white' />
             </div>
            
           
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
     <div className={`
      min-h-screen flex flex-col
      ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
      pt-16 lg:pt-0
    `}>
      <main className="flex-grow p-4 md:p-6">
        <EarningChart />
      </main>
      
      {/* Footer */}
      <div className='bg-white mt-auto'>
        <p className='text-gray-500 text-center py-4 text-sm'>&copy; TrustDine All rights reserved 2025</p>
      </div>
    </div>
    </>
  );
}