'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from "next-intl"
import { IoMdCloseCircle } from "react-icons/io";
import {useLocale} from 'next-intl';
import { Link } from '@/i18n/routing';
import { RiCloseLargeLine } from "react-icons/ri";


const PrivacyDialog = ({text}:any) => {
  const [isOpen, setIsOpen] = useState(false);
 

  const dialogRef = useRef<HTMLDivElement>(null); // Ref for the dialog container
 



  // Close the dialog when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        setIsOpen(false); // Close the dialog
      }
    };

    // Add event listener when the dialog is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]); // Re-run effect when `isOpen` changes

  return (
<div>
<p className='underline my-2 text-white cursor-pointer hover:text-secondary'  onClick={() => setIsOpen(true)}>Cancellation Policy Summary</p>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            ref={dialogRef} // Attach the ref to the dialog container
            className="bg-accent rounded-lg shadow-lg p-6 max-w-lg w-full relative space-y-4"
          >
            {/* Close Button */}
            <RiCloseLargeLine size={24}    className="absolute top-2  right-2 text-white hover:text-gray-700" onClick={() => setIsOpen(false)}/>
            
            {/* Content */}
            <h1 className='text-xl font-semibold font-playfair text-white '>Cancellation Policy Summary</h1>
       <div 
  className="text-white leading-relaxed"
   dangerouslySetInnerHTML={{ __html: text || '' }}
/>    
          </div>
        </div>
      )}</div>
  );
};

export default PrivacyDialog;