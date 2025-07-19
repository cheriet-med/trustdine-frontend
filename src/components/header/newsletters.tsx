'use client';

import React, { useState, useRef, useEffect } from 'react';
import { HiOutlineMail } from "react-icons/hi";
import { useTranslations } from "next-intl"
import {useLocale} from 'next-intl';
import MailChecker from "mailchecker";
import validator from "validator";
import moment from 'moment';
import { FaCircleNotch } from "react-icons/fa"; 
import { RiCloseLargeLine } from "react-icons/ri";


const NewsletterDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null); // Ref for the dialog container
  const t = useTranslations('TopNav');
  const l = useLocale();
  const te = useTranslations('Login');
  const now = moment();

  const isValidEmail = async (email: string): Promise<{ valid: boolean; message?: string }> => {
    // Step 1: Check if the email is empty or null
    if (!email || email.trim() === "") {
      return { valid: false, message: te('Email-is-required') };
    }

    // Step 2: Validate email format using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { valid: false, message: te('Invalid-email-format') };
    }

    // Step 3: Validate email format using validator library
    if (!validator.isEmail(email)) {
      return { valid: false, message: te('Invalid-email-format') };
    }

    // Step 4: Check if the email is disposable using mailchecker
    if (!MailChecker.isValid(email)) {
      return { valid: false, message: te('Disposable-emails') };
    }

    // If all checks pass, the email is valid
    return { valid: true };
  };

  const handleSubscribe = async () => {
    const emailValidation = await isValidEmail(email);
    if (!emailValidation.valid) {
      setError(emailValidation.message || te('Invalid-email'));
      return; // Exit the function if the email is invalid
    }

    setIsLoading(true);
    const language = l;
    const date = now.format('MMMM Do YYYY');
    const time = now.format('h:mm:ss a');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}newsletterpost/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token "+process.env.NEXT_PUBLIC_TOKEN,
        },
        body: JSON.stringify({
          email,
          language,
          date,
          time,
        }),
      });

      // Log the raw response for debugging
      const rawResponse = await response.text();

      if (!response.ok) {
        // Handle HTTP errors
        const errorData = JSON.parse(rawResponse); // Try parsing the raw response
        setError(errorData.message || te('Subscription-failed'));
        return;
      }

      const data = JSON.parse(rawResponse); // Parse the raw response as JSON
      setIsSubscribed(true);
      setIsLoading(false);
      setError('');
      setEmail('');
    } catch (error) {
      console.error(te('Error-uring-subscription'), error);
      setError(te('Network-error'));
    } finally {
      setIsLoading(false);
    }
  };

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
    <>
      {/* Button to open the dialog */}
      <div className="flex gap-1 text-gray-200 items-center cursor-pointer group" onClick={() => setIsOpen(true)}>
        <HiOutlineMail size={18} className="group-hover:text-blue-300"/>
        <p className=" text-sm group-hover:text-blue-300 select-none">Subscribe to our newsletter</p>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            ref={dialogRef} // Attach the ref to the dialog container
            className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative "
          >
            {/* Close Button */}
            {l === "ar"? (
              <RiCloseLargeLine size={28} className="absolute top-2 left-2 text-primary hover:text-gray-700" onClick={() => setIsOpen(false)}/>
            ) : (
              <RiCloseLargeLine size={28} className="absolute top-2 right-2 text-primary hover:text-gray-700" onClick={() => setIsOpen(false)}/>
            )}
            
            {/* Content */}
            {isSubscribed ? (
              <div>
                <h2 className="text-xl font-semibold text-green-600 mb-4 uppercase text-center">{t('success-title')}</h2>
                <p className="text-primary text-sm mb-4">{t('success-description')}</p>
                <p className='text-primary text-sm'>{t('success-description-1')}</p>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-primary mb-4 uppercase">Get the Latest Updates!</h2>
                <p className="text-primary mb-6 text-sm">Elevate your dining experience! Subscribe to the TrustDine newsletter for exclusive restaurant insights, chef-curated tips, special offers, and insider updates delivered fresh to your inbox.</p>
                <div className="flex flex-col space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('newsletter-email-input')}
                    className="w-full px-4 py-2 border border-primary text-primary rounded-lg placeholder-bl focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  {error && <p className="text-orange-700 text-sm">{error}</p>}
                  {isLoading ? (
                    <button
                      aria-label={t('newsletter-subscribe-button')}
                      onClick={handleSubscribe}
                      className="w-full hover:bg-secondary hover:text-gray-200 py-2 rounded-lg bg-primary transition-colors uppercase flex gap-3 justify-center items-center"
                    >
                      {t('newsletter-subscribe-button')}
                      <FaCircleNotch className="animate-spin w-5 h-5"/>
                    </button>
                  ) : (
                    <button
                      aria-label={t('newsletter-subscribe-button')}
                      onClick={handleSubscribe}
                      className="w-full bg-secondary text-gray-200 py-2 rounded-lg hover:bg-primary font-medium transition-colors uppercase"
                    >
                      {t('newsletter-subscribe-button')}
                    </button>
                  )}
                  <p className='text-primary text-xs'>{t('security-msg')}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default NewsletterDialog;