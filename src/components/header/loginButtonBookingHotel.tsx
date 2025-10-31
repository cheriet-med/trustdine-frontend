'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from "next-intl";
import { IoMdCloseCircle } from "react-icons/io";
import { useLocale } from 'next-intl';
import { FiUser } from "react-icons/fi";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { RiCloseLargeLine } from "react-icons/ri";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";


import Image from "next/image";
import { Link } from "@/i18n/routing";
import { FaEye, FaEyeSlash, FaCircleNotch, FaCopy } from "react-icons/fa"; // Import FaCopy
import MailChecker from "mailchecker";
import validator from "validator";


const LoginButtonBookinHotel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null); // Ref for the dialog container
  const t = useTranslations('Login');
  const te = useTranslations('tophero');
  const l = useLocale();
  const router = useRouter();
  const locale = useLocale(); // Get the current locale
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [error1, setError1] = useState(""); // Email validation error state
  const [error2, setError2] = useState(""); // Password validation error state
  const [showPassword, setShowPassword] = useState(false); // Show password state
  const [passwordSuggestion, setPasswordSuggestion] = useState(""); // Password suggestion state
  const [isCopied, setIsCopied] = useState(false); // Track if password is copied

  const [email, setEmail] = useState('');
  const [emailsend, setEmailsend] = useState(false);
  const [emailsenderror, setEmailsenderror] = useState(false);
  const [enteremail, setEnteremail] = useState(false);
const handleGoogleLogin = () => {
  signIn("google");
};

const handleFacebookleLogin = () => {
  signIn("facebook");
};

  const isValidEmail = async (email: string): Promise<{ valid: boolean; message?: string }> => {
    // Step 1: Check if the email is empty or null
    if (!email || email.trim() === "") {
      return { valid: false, message: t('Email-is-required') };
    }

    // Step 2: Validate email format using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { valid: false, message: t('Invalid-email-format') };
    }

    // Step 3: Validate email format using validator library
    if (!validator.isEmail(email)) {
      return { valid: false, message: t('Invalid-email-format') };
    }

    // Step 4: Check if the email is disposable using mailchecker
    if (!MailChecker.isValid(email)) {
      return { valid: false, message: t('Disposable-emails') };
    }

    // If all checks pass, the email is valid
    return { valid: true };
  };

  const validatePassword = (password: string): string | null => {
    // Check if password is at least 8 characters long
    if (password.length < 8) {
      return t('8-characters');
    }

    // Check if password contains at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return t('uppercase');
    }

    // Check if password contains at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      return t('lowercase');
    }

    // Check if password contains at least one digit
    if (!/[0-9]/.test(password)) {
      return t('number');
    }

    // Check if password contains at least one special character
    if (!/[!@#$%^&*]/.test(password)) {
      return t('character');
    }

    // If all conditions are met, return null (no error)
    return null;
  };

  const generatePasswordSuggestion = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPasswordSuggestion(password);
  };

  const handlePasswordFocus = () => {
    generatePasswordSuggestion();
  };



 const resetPassword = async () => {
  if(!email){
    setEnteremail(true)
    return
  }
  try {
    const neo = await fetch(`${process.env.NEXT_PUBLIC_URL}auth/users/reset_password/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    });
    
    if (!neo.ok) {
      throw new Error("Network response was not ok");
     
    }
   
    setEmailsend(true)
   }
   catch {
    setEmailsenderror(true)
  }
  }
  

  


  const handleCopyPassword = () => {
    if (passwordSuggestion) {
      navigator.clipboard.writeText(passwordSuggestion)
        .then(() => {
          setIsCopied(true); // Show "Copied!" text
          setTimeout(() => setIsCopied(false), 2000); // Hide "Copied!" text after 2 seconds
        })
        .catch(() => {
          console.error(t('Failed-to-copy-password')); // Handle error
        });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state
    setError(null); // Reset error state
    setError1(""); // Reset email validation error state
    setError2(""); // Reset password validation error state

    const formData = new FormData(e.currentTarget);
    const email = formData.get(t('email')) as string;
    const password = formData.get(t('password')) as string;

    // Validate email
    const emailValidation = await isValidEmail(email);
    if (!emailValidation.valid) {
      setError1(emailValidation.message || t('Invalid-email'));
      setIsLoading(false); // Stop loading state
      return;
    }

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError2(passwordError);
      setIsLoading(false); // Stop loading state
      return;
    }

    try {
      // Make the fetch request
      const neo = await fetch(`${process.env.NEXT_PUBLIC_URL}auth/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      // Sign in using NextAuth's credentials provider
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(t('Please-verify-your-email-or-password')); // Set error message
      } else {
        ""
      }
    } catch (err) {
      setError(t('An-error-occurred-during-sign-in')); // Set generic error message
      console.error(t('Sign-in-error:'), err);
    } finally {
      setIsLoading(false); // Reset loading state
      setIsOpen(false)
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

            <button 
                  className="w-full bg-secondary hover:bg-accent text-white font-medium py-2 rounded-3xl"
                  onClick={() => setIsOpen(true)}
                >
                  Reserve Now
                </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            ref={dialogRef} // Attach the ref to the dialog container
            className="bg-secondary rounded-xl shadow-xl p-6 max-w-md w-full relative"
          >
            {/* Close Button */}
           
              <RiCloseLargeLine
                size={24}
                className="absolute top-4 right-4 text-white hover:text-accent cursor-pointer"
                onClick={() => setIsOpen(false)}
              />
           

            {/* Scrollable Content */}
            <div className="max-h-[70vh] overflow-y-auto ">
   <div className=" flex flex-col py-7">

        <form onSubmit={handleSubmit} className="space-y-4">
         
           <h2 className="text-white text-sm  font-medium mb-3">
            {t('text-3')}
          </h2>
   
         <div className="space-y-4">
                    <div>
                      <input
                        type="email"
                        name="email"
                        placeholder={t('email')}
                        className="w-full px-4 py-3 border border-highlights rounded-lg focus:outline-none focus:ring-2 focus:ring-highlights bg-highlights placeholder:text-gray-200 text-a"
                        onChange={(e) => setEmail(e.target.value)}
                        //required
                      />
                      {error1 && <p className="text-background text-sm mt-1">{error1}</p>}
                    </div>
        
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder={t('password')}
                        className="w-full px-4 py-3 border border-highlights rounded-lg focus:outline-none focus:ring-2 focus:ring-highlights pr-12 bg-highlights placeholder:text-gray-200 text-a"
                        //onFocus={handlePasswordFocus}
                        //required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-200 hover:text-gray-300"
                      >
                        {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                      </button>
                    </div>
                    {error2 && <p className="text-background text-sm">{error2}</p>}
        
                    {error && <p className="text-background text-sm text-center">{error}</p>}
        
                    
                      <button 
                        type="button"
                        onClick={resetPassword}
                        className="text-sm text-accent hover:underline"
                      >
                        Forgot your password?
                      </button>
                  
        
                    {emailsend && <p className="text-background text-sm text-center">{t('emailsend')}</p>}
                    {emailsenderror && <p className="text-background text-sm text-center">{t('emailsenderror')}</p>}
                    {enteremail && <p className="text-background text-sm text-center">{t('enteremail')}</p>}
        
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-3 rounded-lg font-medium  transition-colors text-white ${
                        isLoading 
                          ? "bg-a text-black flex items-center justify-center gap-2"
                          : "bg-a text-black hover:bg-accent"
                      }`}
                    >
                      {isLoading ? (
                        <>
                         Login <FaCircleNotch className="animate-spin" />
                        </>
                      ) : (
                        "Login"
                      )}
                    </button>
                    
                  </div>
        
            
                  <div className="flex flex-col gap-3">
                 
                   

                            <div className="w-full py-3 px-4 rounded-lg font-medium transition-colors text-white border border-white flex items-center justify-center gap-3 hover:bg-accent cursor-pointer"
                            onClick={handleGoogleLogin}
                            >
          <Image
            src="/google.png" 
            alt="google"
            width={20}
            height={20}
          />
          Continue with Google
        </div>
                  </div>
                  
                  <p className="text-xs text-white mt-4">By continuing you indicate that you agree to Goamico <span className="font-bold underline"><Link href="/terms-and-conditions">Terms of Service</Link> </span> and <span className="font-bold underline"><Link href="/privacy-policy">Privacy Policy.</Link></span></p>
           </form>
            </div>
            

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginButtonBookinHotel;