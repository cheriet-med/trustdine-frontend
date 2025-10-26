'use client'


import SocialMedia from "../header/social";
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import NewsletterDialog from "../header/newsletters";
import Image from "next/image";
import { GoArrowRight } from "react-icons/go";
import dynamic from "next/dynamic";
import { useState } from "react";
import MailChecker from "mailchecker";
import validator from "validator";
import moment from 'moment';


const PartnerMenu = dynamic(
  () => import("./partnerMenu"),
  { 
    ssr: false,
  
  }
);



const Footer = () => {
  const router = useRouter(); // Initialize the router
  const locale = useLocale(); // Get the current locale
  const t = useTranslations('Footer');
  const te = useTranslations('Login');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [email, setEmail] = useState("");

const isValidEmail = (email: string): { valid: boolean; message?: string } => {
  if (!email || email.trim() === "") {
    return { valid: false, message: te('Email-is-required') };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: te('Invalid-email-format') };
  }

  if (!validator.isEmail(email)) {
    return { valid: false, message: te('Invalid-email-format') };
  }

  // remove MailChecker (not safe for client)
  return { valid: true };
};




  const handleSubscribe = async () => {
   const emailValidation = isValidEmail(email);

  if (!emailValidation.valid) {
    setError(emailValidation.message || te('Invalid-email'));
    return;
  }

  setError("");


    const now = new Date();
    const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const time = now.toTimeString().split(" ")[0]; // HH:mm:ss
    const language = "en";

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}newsletterpost/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
        },
        body: JSON.stringify({
          email,
          language,
          date,
          time,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to subscribe");
      }

      const data = await response.json();
      setEmail(""); // clear input
      setSuccess(true)
    } catch (error) {
      console.error("Error:", error);
      setWrong(true)
    }
  };







    return (
        <footer className="bg-a text-gray-50 ">
        <div className="mx-6 md:mx-16 custom:mx-80 py-20 font-montserrat">
          <div className="grid  grid-cols-1 sm:grid-cols-2 custom:grid-cols-2 gap-10">
            {/* Contact & Follow Section */}
            <div className="col-span-1 hover:bg-gray-800 p-3">
             <div className="relative h-24 w-40 ">
                       <Image
                         src="/trust.png" // or "/logo.webp" if using an webp
                         alt="logo"
                         fill
                         sizes='100%'
                         style={{ objectFit: 'contain' }} // Maintain aspect ratio
                         priority // Ensures it loads faster
                       />
                     </div>

            <div className="text-sm 00 py-3">
               <p>Get a taste of the best restaurants, hotel experiences, and dining news, delivered to your inbox.</p>
   
            
            </div>
           
<div className="w-full max-w-xs">
  <div className="flex items-center border-b border-gray-300 pb-1">
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="Subscribe with your email"
      className="flex-grow outline-none px-2 py-1 w-full bg-transparent placeholder:text-white"
    />
    <button
      onClick={handleSubscribe}
      className="flex items-center hover:bg-accent"
    >
      <GoArrowRight size={28} className="text-white" />
    </button>
  </div>
 {success && <p className="text-green-500 text-sm mt-2">Thanks for joining our newsletter!</p>}
  {wrong && <p className="text-red-500 text-sm mt-2"> Something wrong please try later</p>}
  {/* Error message below input */}
  {error && <p className="text-background text-sm mt-2">{error}</p>}
</div>
        


            </div>
            <div className="hover:bg-secondary p-3 flex flex-col justify-center">
            <h2 className="pb-4 font-semibold uppercase font-playfair">{t('Follow us')}</h2>
            <p className="text-sm 00 mb-3">Be part of the TrustDine community, follow us on social media</p>
             <SocialMedia/>
            </div>

            {/* Footer Text Spanning All Columns */}
        
          </div>
       
          <div className="grid  grid-cols-2 sm:grid-cols-2 custom:grid-cols-4 gap-10 pt-10 ">
                     {/* Information Section */}
                     <div className="col-span-1 hover:bg-highlights hover:text-gray-900 p-3">
            <h2 className="pb-4 font-semibold uppercase font-playfair">How It Works</h2>
          <div className=" text-sm flex flex-col gap-3">
            <Link href="/booking-process"><p className=" hover:underline cursor-pointer">Booking Process</p></Link>
            <Link href="/receipt-verification"> <p className=" hover:underline cursor-pointer">Receipt Verification</p></Link>
            <Link href="/trust-score"><p className=" hover:underline cursor-pointer">Trust System</p></Link>
          

          </div>
             
            </div>

                      {/* Useful Links Section */}
                      <div className="col-span-1 hover:bg-accent hover:text-gray-900 p-3">
            <h2 className="pb-4 font-semibold uppercase font-playfair">Company</h2>
            <div className=" text-sm flex flex-col gap-3">
            <Link href="/"><p className=" hover:underline cursor-pointer">Home page</p></Link>
            <Link href="/about-us"><p className=" hover:underline cursor-pointer">About Us</p></Link>
            <Link href="/contact-us"> <p className=" hover:underline cursor-pointer">Contact Us</p></Link>
          
          
          </div>
          
            </div>
            {/* Information Section */}
            <div className="col-span-1 hover:bg-background hover:text-gray-900 p-3">
            <h2 className="pb-4 font-semibold uppercase font-playfair">Support</h2>
          <div className=" text-sm flex flex-col gap-3">
            <Link href="/help-center"><p className=" hover:underline cursor-pointer">Help Center</p></Link>
            <Link href="/help"> <p className=" hover:underline cursor-pointer">FAQ</p></Link>
            <Link href="/support"><p className=" hover:underline cursor-pointer">Business Support</p></Link>
        

          </div>
             
            </div>
            {/* Useful Links Section */}
            <div className="col-span-1 hover:bg-white hover:text-gray-900 p-3  ">
            <h2 className="pb-4 font-semibold uppercase font-playfair">Diners & Restaurants</h2>
            <div className=" text-sm flex flex-col gap-3">
            <Link href="/booking"><p className=" hover:underline cursor-pointer ">Find Hotels & Restaurants</p></Link>
             <Link href="/be-partner"><p className=" hover:underline cursor-pointer ">For Business Owners</p></Link>
     
          
            <Link href="/pro"><p className=" hover:underline cursor-pointer">Pro Plan</p></Link>
            <Link href="/rewards"> <p className=" hover:underline cursor-pointer">Rewards Program</p></Link>
          </div>
          
            </div>
            {/* Footer Text Spanning All Columns */}
        
          </div>
 
          </div>
          <hr className="text-white pt-10 mx-6 md:mx-16 custom:mx-72 "/>
      </footer>
      
    );
  };
  
  export default Footer;
  

  /**       <PartnerMenu/> */