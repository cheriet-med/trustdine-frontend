'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
interface DropdownProps {
  title: string;
  options: { code: string; name: string, category:string }[];
  onSelect: (option: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ title, options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter(); // Initialize the router
  const locale = useLocale(); // Get the current locale

  const handleNavigateWithQuery = ( query: string) => {
    // Include the locale and query parameters in the URL
    router.push(`/${locale}/p?q=${encodeURIComponent(query)}`);
  };

  // Close dropdown when hovering outside
  useEffect(() => {
    const handleHoverOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mouseover', handleHoverOutside);
    }

    return () => {
      document.removeEventListener('mouseover', handleHoverOutside);
    };
  }, [isOpen]);

  // Open dropdown on hover
  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  // Close dropdown on leave (only if not hovering over the menu)
  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  // Handle option selection
  const handleSelect = (option: string) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div
      className="relative w-auto"
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter} // Open on hover
      onMouseLeave={handleMouseLeave} // Close on leave
    >
      {/* Dropdown Button */}
      <div className="group flex items-center justify-between rounded-md cursor-pointer gap-1 hover:text-bl">
        <span>{title}</span>
        <MdOutlineKeyboardArrowDown
          className={`h-5 w-5 text-gray-300 transition-transform ${
            isOpen ? 'rotate-180' : ''
          } group-hover:text-blue-500`}
        />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute z-10  bg-secondary border border-gray-300 rounded-md shadow-lg w-64 p-3 text-sm font-normal text-yel capitalize"
          onMouseEnter={handleMouseEnter} // Keep open when hovering over menu
          onMouseLeave={handleMouseLeave} // Close when leaving menu
        >
          <div className="py-1">
            {options.map((option) => (
              <div onClick={() => handleNavigateWithQuery(option.category)}   key={option.code}> 
              <p
                onClick={() => handleSelect(option.name)}
                className="px-4 py-2 cursor-pointer hover:text-blue-500 hover:font-semibold"
              > 
              {option.name} 
              </p>   
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;