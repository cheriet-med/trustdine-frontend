'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TfiWorld } from "react-icons/tfi";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'pt', name: 'Português' },
  { code: 'it', name: 'Italiano' },
  { code: 'fr', name: 'Français' },
  { code: 'ar', name: 'العربية' },
  { code: 'sv', name: 'Svenska' },
  { code: 'de', name: 'Deutsch' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'ru', name: 'Русский' },
];

const LanguageSelect: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectLanguage = (newLocale: string) => {
    const languageName = languages.find(lang => lang.code === newLocale)?.name || 'English';
    setSelectedLanguage(languageName);
    setIsOpen(false);

    if (!pathname) return;

    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    router.push(newPath);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    const currentLanguage = languages.find(lang => lang.code === locale);
    if (currentLanguage) setSelectedLanguage(currentLanguage.name);
  }, [locale]);

  return (
    <div className="relative w-auto" ref={dropdownRef}>
      <div 
        onClick={toggleDropdown} 
        className="group flex items-center justify-between rounded-md cursor-pointer"
      >
        <TfiWorld className="text-gray-300 mr-2 group-hover:text-blue-500 ml-2" />
        <span className="text-gray-300 group-hover:text-blue-500 text-sm select-none">
          {selectedLanguage}
        </span>
        <MdOutlineKeyboardArrowDown 
          className={`h-5 w-5 text-gray-300 transition-transform ${isOpen ? 'rotate-180' : ''} group-hover:text-blue-500`} 
        />
      </div>
      {isOpen && (
        <div className="absolute bottom-full z-10 mb-1 bg-white border border-gray-300 rounded-md shadow-lg text-xs">
          <div className="py-1 max-h-60 overflow-y-auto">
            {languages.map((language) => (
              <p
                key={language.code}
                onClick={() => selectLanguage(language.code)}
                className={`px-4 py-2 cursor-pointer ${
                  selectedLanguage === language.name 
                    ? 'text-blue-500 font-semibold'  
                    : 'text-primary hover:text-blue-400'
                }`}
              >
                {language.name}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelect;