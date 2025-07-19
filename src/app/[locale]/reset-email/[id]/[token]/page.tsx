'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { FaCircleNotch, FaStar } from "react-icons/fa"; 
import { useRouter } from "next/navigation"; // Import useRouter
import { useLocale } from "next-intl";
import MailChecker from "mailchecker";
import validator from "validator";
import { useTranslations } from "next-intl";
import { signOut } from "next-auth/react";

export default function ResetPassword() {
  const params = useParams()
  const { id, token } = params
   const [email, setEmail] = useState('');
  
     const [isLoadingg, setIsLoadingg] = useState(false); // Loading state
     const l = useLocale();
   
     const t = useTranslations('Login');
     const te = useTranslations('user-dashboard');
     const [error1, setError1] = useState(""); // Email validation error state

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



  const handleSubscribe = async () => {

  setIsLoadingg(true);

      // Validate email
      const emailValidation = await isValidEmail(email);
      if (!emailValidation.valid) {
        setError1(emailValidation.message || t('Invalid-email'));
        setIsLoadingg(false); // Stop loading state
        return;
      }
    
  
   
     try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}auth/users/reset_email_confirm/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            uid:id,
            token:token,
            new_email:email,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
    } catch (error) {
      console.error('Error updates', error);
      return false;
    }finally{
        setIsLoadingg(false);
        signOut({ callbackUrl: `/${l}/login-signin` })
    }
  };






  return (
    <div className='my-40 mx-6 md:mx-auto md:w-96'>
        <h1 className='uppercase font-medium mb-4'>{te('reset-email')}</h1>
                    <div>
                    <input
     type="text"
     value={email}
     onChange={(e) => setEmail(e.target.value)}
     placeholder="New email"
     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yel"
     required
   />
    {error1 && <p className="text-bl text-sm mt-2">{error1}</p>}
                </div>

                <div className='mt-8'> 
                    {isLoadingg ? (
                                    <button
                                      onClick={handleSubscribe}
                                      className="w-full hover:bg-secondary hover:text-yel py-2 rounded-lg bg-yel ext-black transition-colors uppercase flex gap-3 justify-center items-center"
                                    >
                                      {te('Edite')}
                                      <FaCircleNotch className="animate-spin w-5 h-5"/>
                                    </button>
                                  ) : (
                                    <button
                                      onClick={handleSubscribe}
                                      className="w-full bg-secondary text-yel py-2 rounded-lg hover:bg-yel font-medium hover:text-black transition-colors uppercase"
                                    >
                                    {te('Edite')}
                                    </button>
                                  )}
                </div>
    </div>
  )
}