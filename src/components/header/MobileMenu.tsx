'use client';
import { useSession } from "next-auth/react"; // Import useSession
import React, { useState } from 'react';
import { VscMenu } from "react-icons/vsc";
import { IoMdClose } from "react-icons/io";
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';


const MobileMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations('Menu');
  const locale = useLocale();
  const { data: session, status } = useSession(); // Get session and status
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = isMenuOpen ? 'auto' : 'hidden';
  };

  return (
    <>
      {/* Menu Button with animated transition */}
      <div className='-pt-7 '>
      <button 
        onClick={toggleMenu}
        className="flex items-center  gap-2  relative z-50"
      >
       
        <span className=" font-semibold  text-sm transition-opacity duration-300 text-primary">
          {isMenuOpen ? 'CLOSE' : 'MENU'}
        </span> 
        <div className="relative w-6 h-6">
          <VscMenu className={`absolute size-6 transition-all duration-300 text-primary ${isMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} />
          <IoMdClose className={`absolute size-6 transition-all duration-300 text-primary ${isMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} />
        </div>
      </button>

      {/* Full Screen Overlay */}
      <div className={`
        fixed inset-0 bg-slate-50 z-40 transition-opacity duration-500
        ${isMenuOpen ? 'opacity-50 visible' : 'opacity-0 invisible delay-300'}
      `}
      onClick={toggleMenu}
      />

      {/* Full Screen Menu Content */}
      <div className={`
        fixed inset-0 z-40 transition-all duration-500
        ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible delay-300'}
      `}>
        <div className="absolute inset-0 bg-slate-50 bg-opacity-95 backdrop-blur-sm flex flex-col">
          {/* Close Button */}
         
          {/* Menu Content with fade-in effect */}
          <div className={`flex-1 flex flex-col justify-center items-center px-4  transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'} overflow-y-auto `}>
            <div className="w-full max-w-md py-36 text-primary">
          
            <div className="mb-12 text-center opacity-90 pt-64 sm:pt-96 custom:pt-0">
              <Link href="/find-restaurants">  
               <h2 className="text-2xl font-semibold mb-4 cursor-pointer hover:text-gray-600 " onClick={toggleMenu}>Find Restaurants</h2>
              </Link>
             
             <hr className='border border-spacing-1 bg-gray-400'/> 
              </div>
              <div className="mb-12 text-center opacity-90">
              <Link href="/receipt-verification">  
  <h2 className="text-2xl font-semibold mb-4 cursor-pointer hover:text-gray-600" onClick={toggleMenu}>Receipt Verification</h2>
              </Link>
              
                <hr className='border border-spacing-1'/> 
              </div>


              <div className="mb-12 text-center opacity-90">
              <Link href="/trust-score">  
<h2 className="text-2xl font-semibold mb-4 cursor-pointer hover:text-gray-600" onClick={toggleMenu}> Trust Score</h2>
              </Link>
                
                <hr className='border border-spacing-1'/> 
              </div>

              <div className="mb-12 text-center opacity-90">
              <Link href="/help">  
  <h2 className="text-2xl font-semibold mb-4 cursor-pointer hover:text-gray-600" onClick={toggleMenu}>Help</h2>
              </Link>
              
                <hr className='border border-spacing-1'/> 
              </div>

             
              <div className="mb-12 text-center opacity-90">
              <Link href="/became-a-partner">  
  <h2 className="text-2xl font-semibold mb-4 cursor-pointer hover:text-gray-600" onClick={toggleMenu}>Become a Partner</h2>
              </Link>
              
                <hr className='border border-spacing-1'/> 
              </div>

              <div className="mb-12 text-center opacity-90">
              {status === "authenticated" ? ( // If user is logged in
    <Link href="/" rel="preload">
       <p className="text-2xl font-semibold mb-4 cursor-pointer hover:text-gray-600 " onClick={toggleMenu}>My Account</p>
    </Link>
  ) : ( // If user is not logged in
    <Link href="/" rel="preload">
    <p className="text-2xl font-semibold mb-4 cursor-pointer hover:text-gray-600 " onClick={toggleMenu}>Sign in</p>
 </Link>
  )}
                <hr className='border border-spacing-1'/> 
              </div>


           
            </div>

           
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default MobileMenu;


//   <h1 className="text-4xl font-bold mb-12 text-center opacity-90">How It Works</h1>