'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';
import { FaHome } from "react-icons/fa";


const LanguageSelect: React.FC = () => {
  const t = useTranslations('Menu');
  const locale = useLocale();
  const pathname = usePathname();

  // Helper function to check if current path matches the link
  const isActive = (href: string) => {
    // Remove locale prefix if present
    const normalizedPath = pathname.replace(new RegExp(`^/${locale}`), '') || '/';
    return normalizedPath === href;
  };

  return (
    <div className="custom:flex gap-16 uppercase select-none tracking-wide font-semibold hidden text-sm">
      <Link href="/" rel="preload">
       <FaHome size={22} className='text-bl hover:text-primary block'/>
      </Link>
      <Link href="/find-restaurants" rel="preload">
        <p className={`relative group pb-4 ${
          isActive('/find-restaurants') ? 'text-primary' : 'text-bl hover:text-primary'
        }`}>
          Find Restaurants
          <span className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${
            isActive('/find-restaurants') ? 'w-full' : 'w-0 group-hover:w-full'
          }`}></span>
        </p>
      </Link>
      <Link href="/receipt-verification" rel="preload">
        <p className={`relative group pb-4 ${
          isActive('/receipt-verification') ? 'text-primary' : 'text-bl hover:text-primary'
        }`}>
          Receipt Verification
          <span className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${
            isActive('/receipt-verification') ? 'w-full' : 'w-0 group-hover:w-full'
          }`}></span>
        </p>
      </Link>
      <Link href="/trust-score" rel="preload">
        <p className={`relative group pb-4 ${
          isActive('/trust-score') ? 'text-primary' : 'text-bl hover:text-primary'
        }`}>
          Trust Score
          <span className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${
            isActive('/trust-score') ? 'w-full' : 'w-0 group-hover:w-full'
          }`}></span>
        </p>
      </Link>
      <Link href="/help" rel="preload">
        <p className={`relative group pb-4 ${
          isActive('/help') ? 'text-primary' : 'text-bl hover:text-primary'
        }`}>
          Help
          <span className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${
            isActive('/help') ? 'w-full' : 'w-0 group-hover:w-full'
          }`}></span>
        </p>
      </Link>
    
      <Link href="/became-a-partner" rel="preload" className="relative group">
    <p className="text-bl hover:text-primary font-semibold pb-4">Become a Partner</p>
    <span className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${
            isActive('/became-a-partner') ? 'w-full' : 'w-0 group-hover:w-full'
          }`}></span>
  </Link>
    </div>
  );
};

export default LanguageSelect;