'use client';

import { AiFillFacebook } from "react-icons/ai";
import { RiTwitterXFill } from "react-icons/ri";
import { CiLink } from "react-icons/ci";
import { MdEmail } from "react-icons/md";
import { ImVk } from "react-icons/im";
import { FaLinkedin } from "react-icons/fa6";
import { FaRedditAlien } from "react-icons/fa";
import { FaSquarePinterest } from "react-icons/fa6";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { useLocale } from "next-intl";
import parse from 'html-react-parser';
import PostSideId from "./PostSideId";
import { FaTelegramPlane } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { MdCopyAll } from "react-icons/md";

import { useState, useEffect } from "react";

import {
  FacebookShareButton,
  PinterestShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  VKShareButton,
  EmailShareButton
} from 'next-share'



export default function PostId(info: any) {
  const neo = info;
  const l = useLocale();
  const t = useTranslations('Hero');
  const t1 = useTranslations('Blog-id');
  const [isLoading, setIsLoading] = useState(true); // State to manage loading

  const [isCopied, setIsCopied] = useState(false); // Track if password is copied

  const getLocalizedField = (item: any, field: string) => {
    const localizedField = item[`${field}_${l}`] || item[`${field}_en`]; // Fallback to English if localized field is missing
    return localizedField;
  };




  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Set loading to false after 2 seconds
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SkeletonLoader />; // Show skeleton while loading
  }


  const handleCopyPassword = () => {
    
      navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_HOME}/${l}/blog/${getLocalizedField(neo.info, "url")}`)
        .then(() => {
          setIsCopied(true); // Show "Copied!" text
          setTimeout(() => setIsCopied(false), 2000); // Hide "Copied!" text after 2 seconds
        })
     
  };

  
  const social = () => {
    return (
      <div className="flex gap-3 text-secondary flex-wrap">
         <FacebookShareButton url={`${process.env.NEXT_PUBLIC_HOME}/${l}/blog/${getLocalizedField(neo.info, "url")}`}><AiFillFacebook size={24} className="hover:text-[#1877F2]"/></FacebookShareButton>
          <TwitterShareButton url={`${process.env.NEXT_PUBLIC_HOME}/${l}/blog/${getLocalizedField(neo.info, "url")}`}><RiTwitterXFill size={24} className="hover:text-gray-600"/></TwitterShareButton>
         <RedditShareButton url={`${process.env.NEXT_PUBLIC_HOME}/${l}/blog/${getLocalizedField(neo.info, "url")}`}> <FaRedditAlien size={24} className="hover:text-[#FF4500]"/></RedditShareButton>
         <TelegramShareButton url={`${process.env.NEXT_PUBLIC_HOME}/${l}/blog/${getLocalizedField(neo.info, "url")}`}> <FaTelegramPlane size={24} className="hover:text-blue-500"/></TelegramShareButton>
         <WhatsappShareButton url={`${process.env.NEXT_PUBLIC_HOME}/${l}/blog/${getLocalizedField(neo.info, "url")}`}><FaWhatsapp size={24} className="hover:text-[#25D366]"/></WhatsappShareButton>
          <PinterestShareButton url={`${process.env.NEXT_PUBLIC_HOME}/${l}/blog/${getLocalizedField(neo.info, "url")}`} media={getLocalizedField(neo.info, "description")}><FaSquarePinterest size={24} className="hover:text-[#E60023]"/></PinterestShareButton>
           <LinkedinShareButton url={`${process.env.NEXT_PUBLIC_HOME}/${l}/blog/${getLocalizedField(neo.info, "url")}`}><FaLinkedin size={24} className="hover:text-[#0077B5]"/></LinkedinShareButton>
          <VKShareButton url={`${process.env.NEXT_PUBLIC_HOME}/${l}/blog/${getLocalizedField(neo.info, "url")}`}> <ImVk size={24} className="hover:text-[#0077FF]"/></VKShareButton>
           <EmailShareButton url={`${process.env.NEXT_PUBLIC_HOME}/${l}/blog/${getLocalizedField(neo.info, "url")}`}><MdEmail size={24} className="hover:text-gray-600 "/></EmailShareButton>
         {isCopied? <MdCopyAll size={24} className="text-green-500"/> : <CiLink size={24} onClick={handleCopyPassword} className="hover:text-green-500"/>}
      </div>
    )
  }

  return (
    <div className="md:mx-5 custom:mx-60 mt-10">
      {/* Header Section */}
      <div className="mb-10 mx-5 md:mx-0">
        <h1 className="text-2xl md:text-3xl custom:text-4xl font-bold max-w-5xl mb-5 text-secondary">
          {getLocalizedField(neo.info, "title")}
        </h1>
        <p className="text-gray-400 mb-5"> {t1('Published')}{": "} {neo.info.date} - {neo.info.time} </p>
        {social()}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-10">
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-5">
          {/* Image */}
          <div className="relative h-96 md:h-[550px] w-full">
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE}/${getLocalizedField(neo.info, "image")}`}
              alt={getLocalizedField(neo.info, "tag")}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
              className="z-0"
              priority
            />
          </div>
          <p className="px-5 sm:px-14 md:px-20 lg:px-28 pt-2 text-gray-600 text-sm">{neo.info.licence}</p>

          {/* Description and Content */}
          <div className="px-5 sm:px-14 md:px-20 lg:px-28 py-10 space-y-4">
            <h3 className="font-semibold text-gray-700">
              {getLocalizedField(neo.info, "description")}
            </h3>
            <hr className="border-spacing-1" />
            <div className="text-gray-700 post-content" >
              {parse(getLocalizedField(neo.info, "content"))}
            </div>
            <div>
              <p className="text-gray-600 mb-3">{t1('Loved this post')}</p>
            <div className="flex justify-end">
                {social()}
            </div>
            
            </div>
            <hr className="border-spacing-1" />
          </div>

          {/* Call-to-Action Section */}
          <div className="px-5 sm:px-14 md:px-20 lg:px-28 space-y-3 mb-32">
            <h2 className="text-lg md:text-xl font-semibold">
              {t('title')}
            </h2>
            <p className="text-secondary">
              <span className="text-primary font-semibold">{t('Hurry')}</span> {t('t1')}
            </p>
            <p className="underline">
              {t('t2')}
            </p>
            <p>
              {t('t3')}{" "}<span className="text-red-700">{t('valued')}</span>
            </p>
            <p>
              {t('t4')}
            </p>
            <p>
              {t('t5')}<span className="text-green-600 font-bold uppercase">{t('for free')}</span>
            </p>
            <div className="flex flex-col items-center py-12">

            </div>
            <div className="h-[236px] w-[318px] sm:h-[355px] mx-auto sm:w-[477px] relative">
              <Image
                src="/ad-bk.avif"
                alt={t('padel-book-alt')}
                quality={100}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "contain" }}
                className="shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar) */}
        <PostSideId i={neo.info.id} />
      </div>
    </div>
  );
}

// SkeletonLoader Component
function SkeletonLoader() {
  return (
    <div className="md:mx-5 custom:mx-60 mt-10">
      {/* Header Section Skeleton */}
      <div className="mb-10 mx-5 md:mx-0">
        <div className="h-10 w-3/4 bg-gray-200 rounded mb-5 animate-pulse"></div>
        <div className="h-4 w-1/2 bg-gray-200 rounded mb-5 animate-pulse"></div>
        <div className="flex gap-3">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
          ))}
        </div>
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-10">
        {/* Left Column (Main Content) Skeleton */}
        <div className="lg:col-span-5">
          {/* Image Skeleton */}
          <div className="relative h-[550px] w-full bg-gray-200 animate-pulse"></div>
          <div className="h-4 w-1/4 bg-gray-200 rounded mt-2 animate-pulse mx-5 sm:mx-14 md:mx-20 lg:mx-28"></div>

          {/* Description and Content Skeleton */}
          <div className="px-5 sm:px-14 md:px-20 lg:px-28 py-10 space-y-4">
            <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-1 bg-gray-200 rounded animate-pulse"></div>
            <div className="space-y-2">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* Social Icons Skeleton */}
          <div className="px-5 sm:px-14 md:px-20 lg:px-28">
            <div className="h-4 w-1/3 bg-gray-200 rounded mb-3 animate-pulse"></div>
            <div className="flex gap-3 justify-end">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
              ))}
            </div>
            <div className="h-1 bg-gray-200 rounded mt-5 animate-pulse"></div>
          </div>

          {/* Call-to-Action Section Skeleton */}
          <div className="px-5 sm:px-14 md:px-20 lg:px-28 space-y-3 mb-32">
            <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-12 w-48 bg-gray-200 rounded mt-12 animate-pulse mx-auto"></div>
            <div className="h-[236px] w-[318px] sm:h-[355px] sm:w-[477px] bg-gray-200 rounded mt-12 animate-pulse mx-auto"></div>
          </div>
        </div>

        {/* Right Column (Sidebar) Skeleton */}
        <div className="lg:col-span-2">
          <div className="h-6 w-1/2 bg-gray-200 rounded mb-3 animate-pulse"></div>
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex gap-5 items-center mb-5">
              <div className="h-24 w-[500px] bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}