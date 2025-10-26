'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { useRouter } from "next/navigation"; // Import useRouter
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { FaEye, FaEyeSlash, FaCircleNotch, FaCopy } from "react-icons/fa"; // Import FaCopy
import { useSession } from "next-auth/react";

export default function ResetPassword() {
  const params = useParams()
  const { id, token } = params
  const { data: session } = useSession();
   const [password, setPassword] = useState('');
    const [error2, setError2] = useState(""); // Password validation error state
     const [isLoadingg, setIsLoadingg] = useState(false); // Loading state
     const l = useLocale();
     const router = useRouter(); // Initialize the router
     const locale = useLocale(); // Get the current locale
     const t = useTranslations('Login');
     const te = useTranslations('user-dashboard');
     const [showPassword, setShowPassword] = useState(false); // Show password state
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




  const handleSubscribe = async () => {
   
  
       setIsLoadingg(true);
       // Validate password
       const passwordError = validatePassword(password);
       if (passwordError) {
         setError2(passwordError);
         setIsLoadingg(false); // Stop loading state
         return;
       }
  
   
     try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}auth/users/reset_password_confirm/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            uid:id,
            token:token,
            new_password:password,
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
        {session?.user ? router.push(`/${l}/account`): router.push(`/${l}/login`)}
        
    }
  };






  return (
     <div className="fixed inset-0 bg-[url('/02.webp')] bg-no-repeat bg-center bg-cover overflow-auto">
      <div className="min-h-screen flex items-center justify-center p-4 font-montserrat ">
    <div className=' bg-secondary p-6 rounded-2xl'>
        <h1 className=' mb-4 text-gray-100'>write your new password</h1>
        <div>
        <div className="relative ">
                    <input
     type={showPassword ? "text" : "password"}
     value={password}
     onChange={(e) => setPassword(e.target.value)}
     placeholder="New password"
     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yel bg-highlights placeholder:text-gray-200"
     required
   />
<button
               type="button"
               onClick={() => setShowPassword(!showPassword)}
               className="absolute right-2 top-2 text-gray-200 hover:text-gray-300 flex items-center justify-center w-6 h-6"
             >
               {showPassword ? <FaEyeSlash className="w-5 h-5"/> : <FaEye className="w-5 h-5 " />}
             </button>
             
             </div>
    {error2 && <p className="text-bl text-sm mt-2">{error2}</p>}
                </div>

                <div className='mt-8'> 
                    {isLoadingg ? (
                                    <button
                                      onClick={handleSubscribe}
                                      className="w-full hover:bg-accent hover:text-yel py-2 rounded-lg bg-a text-white transition-colors uppercase flex gap-3 justify-center items-center"
                                    >
                                       {te('Edite')}
                                      <FaCircleNotch className="animate-spin w-5 h-5"/>
                                    </button>
                                  ) : (
                                    <button
                                      onClick={handleSubscribe}
                                      className="w-full bg-a text-white py-2 rounded-lg hover:bg-accent font-medium transition-colors uppercase"
                                    >
                                     {te('Edite')}
                                    </button>
                                  )}
                </div>
    </div>
    </div>
    </div>
  )
}