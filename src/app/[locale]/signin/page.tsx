"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { FaEye, FaEyeSlash, FaCircleNotch, FaCopy } from "react-icons/fa";
import MailChecker from "mailchecker";
import validator from "validator";
import { useTranslations } from "next-intl";

export default function SignInPage() {
  const t = useTranslations('Login');
  const te = useTranslations('tophero');
  const router = useRouter();
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [error1, setError1] = useState("");
  const [error2, setError2] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordSuggestion, setPasswordSuggestion] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [emailsend, setEmailsend] = useState(false);
  const [emailsenderror, setEmailsenderror] = useState(false);
  const [enteremail, setEnteremail] = useState(false);

  const isValidEmail = async (email: string): Promise<{ valid: boolean; message?: string }> => {
    if (!email || email.trim() === "") {
      return { valid: false, message: t('Email-is-required') };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { valid: false, message: t('Invalid-email-format') };
    }

    if (!validator.isEmail(email)) {
      return { valid: false, message: t('Invalid-email-format') };
    }

    if (!MailChecker.isValid(email)) {
      return { valid: false, message: t('Disposable-emails') };
    }

    return { valid: true };
  };

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return t('8-characters');
    }

    if (!/[A-Z]/.test(password)) {
      return t('uppercase');
    }

    if (!/[a-z]/.test(password)) {
      return t('lowercase');
    }

    if (!/[0-9]/.test(password)) {
      return t('number');
    }

    if (!/[!@#$%^&*]/.test(password)) {
      return t('character');
    }

    return null;
  };

  const resetPassword = async () => {
    if(!email){
      setEnteremail(true);
      return;
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}auth/users/reset_password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
     
      setEmailsend(true);
      setEmailsenderror(false);
      setEnteremail(false);
    } catch {
      setEmailsenderror(true);
      setEmailsend(false);
    }
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

  const handleCopyPassword = () => {
    if (passwordSuggestion) {
      navigator.clipboard.writeText(passwordSuggestion)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        })
        .catch(() => {
          console.error(t('Failed-to-copy-password'));
        });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setError1("");
    setError2("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const emailValidation = await isValidEmail(email);
    if (!emailValidation.valid) {
      setError1(emailValidation.message || t('Invalid-email'));
      setIsLoading(false);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError2(passwordError);
      setIsLoading(false);
      return;
    }

    try {
      const neo = await fetch(`${process.env.NEXT_PUBLIC_URL}auth/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token "+process.env.NEXT_PUBLIC_TOKEN,
        },
        body: JSON.stringify({ email, password }),
      });

    } catch (err) {
      setError(t('An-error-occurred-during-sign-in'));
      console.error(t('Sign-in-error:'), err);
    } finally {
      setIsLoading(false);
      router.push(`/${locale}/login`)
    }
  };

  return (
    <div className="fixed inset-0 bg-[url('/02.webp')] bg-no-repeat bg-center bg-cover overflow-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <form 
          onSubmit={handleSubmit} 
          className="w-full max-w-md bg-secondary px-8 pb-12 rounded-2xl shadow-lg"
        >
          <div className="flex justify-center mb-2">
            <div className="relative h-32 w-48">
              <Image
                src="/trust.png"
                alt={te('logo-padlev-yellow')}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          <h2 className="text-white text-sm  font-medium mb-3">
            {t('text-3')}
          </h2>

          <div className="space-y-4">
            <div>
              <input
                type="email"
                name="email"
                placeholder={t('email')}
                className="w-full px-4 py-3 border border-highlights rounded-lg focus:outline-none focus:ring-2 focus:ring-highlights pr-12 bg-highlights placeholder:text-gray-200 text-a"               
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
                onFocus={handlePasswordFocus}
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

            {passwordSuggestion && (
              <div className="flex items-center gap-2 bg-accent p-2 rounded">
                <p className="text-gray-700 text-sm flex-1">
                  {t('text-5')}: <span className="font-semibold">{passwordSuggestion}</span>
                </p>
                <button
                  type="button"
                  onClick={handleCopyPassword}
                  className="text-gray-600 hover:text-gray-900"
                  
                >
                  <FaCopy size={14} />
                </button>
                {isCopied && <span className="text-secondary text-sm">{t('Copied')}</span>}
              </div>
            )}

            {error && <p className="text-accent text-sm text-center">{error}</p>}

           
            <button 
                type="button"
              
                className="text-sm text-accent hover:underline"
              > <Link href="/login">
                I have Account
               </Link></button>
           
              
          

            {emailsend && <p className="text-green-500 text-sm text-center">{t('emailsend')}</p>}
            {emailsenderror && <p className="text-red-500 text-sm text-center">{t('emailsenderror')}</p>}
            {enteremail && <p className="text-red-500 text-sm text-center">{t('enteremail')}</p>}
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
                 Sign up <FaCircleNotch className="animate-spin" />
                </>
              ) : (
                "Sign up"
              )}
            </button>
            
          </div>
        
                 <p className="text-xs text-white mt-4">By continuing you indicate that you agree to trustdine <span className="font-bold underline"><Link href="/terms-and-conditions">Terms of Service</Link> </span> and <span className="font-bold underline"><Link href="/privacy-policy">Privacy Policy.</Link></span></p>
  
        </form>
      </div>
    </div>
  );
}