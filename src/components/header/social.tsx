import { AiFillFacebook } from "react-icons/ai";
import { RiTwitterXFill } from "react-icons/ri";
import { LuInstagram } from "react-icons/lu";
import { IoLogoYoutube } from "react-icons/io5";
import { FaRss } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";
import Link from "next/link";
import { useLocale } from "next-intl";


export default function SocialMedia() {

  const locale = useLocale()


  return (
    <div className="flex w-full gap-3 text-gray-200">
       <Link href="/" target="_blank" title="X Account">
         <AiFillFacebook size={28} className=" hover:text-bl cursor-pointer"/>
       </Link>
  
    <Link href="/" target="_blank" title="X Account">
     <RiTwitterXFill size={28} className=" hover:text-black cursor-pointer"/>
    </Link>
    <Link href="/" target="_blank" title="X Account">
     <LuInstagram size={28} className=" hover:text-orange-700 cursor-pointer"/>
    </Link>
    <Link href="/" target="_blank" title="X Account">
     <IoLogoYoutube size={28} className=" hover:text-red-700 cursor-pointer"/>
    </Link>
    <Link href="/" target="_blank" title="X Account">
    <FaTiktok size={28} className=" hover:text-black cursor-pointer"/>
    </Link>
    
    <Link href="/" target="_blank" rel="noopener noreferrer" title="RSS Feed"> 
    <FaRss size={28} className=" hover:text-orange-800 cursor-pointer"/>
    </Link>
   

  </div>
  );
}