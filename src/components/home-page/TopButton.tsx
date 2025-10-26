'use client';

import { useState, useEffect } from 'react';
import { MdKeyboardArrowUp } from "react-icons/md";
export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Show the button when the user scrolls down 300px
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Smooth scrolling
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isVisible && (
        <button
          
          onClick={scrollToTop}
          className="p-1 bg-primary text-yel rounded-full shadow-lg hover:bg-bl-dark transition-all bg-opacity-40 border border-spacing-1 border-white"
        >
          <MdKeyboardArrowUp size={32} className='hover:text-bl text-white'/>
        </button>
      )}
    </div>
  );
}