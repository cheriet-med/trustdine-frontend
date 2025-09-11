'use client';

import { useSession } from "next-auth/react";
import { useTranslations } from 'next-intl';
import { useLocale } from "next-intl";
import { useState , useEffect} from 'react';
import Image from "next/image";
import CircularMenuWrapper from "../CircularMenuWrapper";


export default function GlobalNav() {
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
    
  >
      <div className="mx-6 md:mx-16 custom:mx-36 py-10 "
     
      >
     <nav 
          className={`flex items-center justify-between py-3 w-full px-5 rounded-lg transition-all duration-300 bg-accent${
            isHovered ? '' : ''
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label="Global"
        >
            <div className="col-span-1">
                    <div className="relative h-20 w-40 ">
                              <Image
                                src="/trust.png" // or "/logo.webp" if using an webp
                                alt="logo"
                                fill
                                sizes='100%'
                                style={{ objectFit: 'contain' }} // Maintain aspect ratio
                                priority // Ensures it loads faster
                              />
                            </div>
       
       </div>
      
       <CircularMenuWrapper/>
      
        </nav>
      </div>
    
    </header>
  );
}


/***bg-primary bg-opacity-20 shadow-sm */