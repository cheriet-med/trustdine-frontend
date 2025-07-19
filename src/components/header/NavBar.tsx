'use client';

import { useSession } from "next-auth/react";
import { Link } from '@/i18n/routing';
import LanguageSelect from "./menu";
import MobileMenu from "./MobileMenu";
import { useTranslations } from 'next-intl';
import LoginButton from "./loginButton";
import { useLocale } from "next-intl";
import { useState , useEffect} from 'react';
import { FaHome } from "react-icons/fa";



export default function NavBar() {
  const te = useTranslations('tophero');
  const { data: session, status } = useSession();
  const l = useLocale();
  const [isHovered, setIsHovered] = useState(false);

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show only when scrolling up
      if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      } 
      // Hide when scrolling down
      else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);



  return (
    <header 
    className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
      isVisible ? '' : '-translate-y-full'
    }`}
  >
      <div className="mx-6 md:mx-16 custom:mx-72 py-10 "
     
      >
     <nav 
          className={`flex items-center justify-between py-3 w-full px-5 rounded-lg transition-all duration-300 ${
            isHovered ? 'bg-white bg-opacity-90 shadow-sm' : 'bg-white bg-opacity-90 shadow-sm'
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label="Global"
        >
          <Link href="/" rel="preload">
                 <FaHome size={24} className='text-primary hover:text-secondary lg:hidden'/>
                </Link>
          <LanguageSelect />

          <div className="gap-10 flex flex-auto justify-end">
            {status === "authenticated" ? (
              <Link href="/account" rel="preload">
                <p className="text-bl hover:text-primary font-semibold pb-4 hidden custom:block">My Account</p>
              </Link>
            ) : (
              <div className="hidden custom:block">
                <LoginButton />
              </div>
            )}
            <MobileMenu />
          </div>
        </nav>
      </div>
    </header>
  );
}