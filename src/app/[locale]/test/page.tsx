"use client";

import { useEffect, useState, useRef, useCallback, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { MdOutlineHotel } from "react-icons/md";
import { IoRestaurantOutline } from "react-icons/io5";
import { MdVerified } from "react-icons/md";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { MdVerifiedUser } from "react-icons/md";
import { FaShieldHalved } from "react-icons/fa6";
const HotelSearchHomepage = lazy(() => import('@/components/header/searchHotelforHomepage'));
const RestaurantSearch = lazy(() => import("@/components/header/SearchRestaurant"));

const slides = [
  { id: 1, src: "/assets/image-1.avif", alt: "Slide 1" },
  { id: 2, src: "/assets/image-16.avif", alt: "Slide 2" },
  { id: 3, src: "/assets/image-11.avif", alt: "Slide 3" },
];

export default function FullscreenSlider() {
  const [index, setIndex] = useState(0);

  const counterRef = useRef<HTMLSpanElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeTab, setActiveTab] = useState<"hotels" | "restaurants">("hotels");
  const [gsapLoaded, setGsapLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  
  // Initialize ref array for animated elements
  const headerSpansRef = useRef<(HTMLDivElement | null)[]>([]);
  
  useEffect(() => {
    headerSpansRef.current = headerSpansRef.current.slice(0, 3);
  }, []);

  const handleTabChange = useCallback((tab: "hotels" | "restaurants") => {
    setActiveTab(tab);
  }, []);

  const setHeaderSpanRef = useCallback((index: number) => (el: HTMLDivElement | null) => {
    headerSpansRef.current[index] = el;
  }, []);


  // Auto-change every 5s
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <AnimatePresence>
        <motion.img
          key={slides[index].id}
          src={slides[index].src}
          alt={slides[index].alt}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1 }}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Overlay content (optional) */}
       <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full md:max-w-5xl px-4 flex flex-col justify-center items-center space-y-2 z-30">
          {/* Title */}
          <h1 className="text-center uppercase text-4xl md:text-6xl lg:text-6.5xl leading-[0.85] tracking-[-0.25rem] text-white font-bold font-playfair pb-2 ">
            <span 
              ref={setHeaderSpanRef(0)} 
              className="block transform translate-y-full select-none bg-highlights px-4 py-2 rounded-3xl opacity-85"
              style={{ wordSpacing: '0.1em' }}
            >
              {activeTab === "hotels" ? "Verified by Receipts" : "Trusted by Real Guests"}
            </span>
          </h1>
          
          {/* Subtitle */}
          <h1 className="text-center text-3xl md:text-4xl custom:text-5xl leading-[0.85] tracking-[-0.25rem] text-white font-playfair">
            <span 
              ref={setHeaderSpanRef(1)} 
              className="block transform translate-y-full select-none bg-highlights px-2 py-2 rounded-3xl opacity-85"
              style={{ wordSpacing: '0.25em' }}
            >
              {activeTab === "hotels" ? "Skip the fake reviews, Discover restaurants and hotels that real people actually visited" 
              : "This instantly communicates the platform's unique value, is clear, and builds trust"}
            </span>
          </h1>

          {/* Tab Selector */}
          <div 
            ref={setHeaderSpanRef(2)} 
            className="flex gap-6 mb-8 md:mb-8 pt-32 pb-4"
          >
            <div 
              className={`flex gap-2 cursor-pointer pb-2 transition-colors bg-highlights px-4 py-1 rounded-3xl opacity-85${
                activeTab === "hotels" ? "border-b-2 border-white bg-secondary" : "opacity-80 hover:opacity-100"
              }`}
              onClick={() => handleTabChange("hotels")}
            >
              <MdOutlineHotel className="text-white" size={28}/>
              <p className="max-w-5xl text-white sm:text-lg">Hotels</p>
            </div>
            
            <div 
              className={`flex gap-2 cursor-pointer pb-2 transition-colors bg-highlights px-4 py-1 rounded-3xl opacity-85${
                activeTab === "restaurants" ? "border-b-2 border-white bg-secondary"  : "opacity-80 hover:opacity-100"
              }`}
              onClick={() => handleTabChange("restaurants")}
            >
              <IoRestaurantOutline className="text-white" size={22}/>
              <p className="max-w-5xl text-white sm:text-lg">Restaurants</p>
            </div>
          </div>
          
          <div className='pt-10 md:pt-1'>
            {/* Conditional Search Component with Suspense */}
            <Suspense fallback={<div className="text-white">Loading search...</div>}>
              {activeTab === "hotels" ? <HotelSearchHomepage /> : <RestaurantSearch />}
            </Suspense>
          </div>
        </div>
              <div className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 flex gap-2 md:gap-6 z-30 justify-center md:justify-between w-full px-2 md:px-16 flex-wrap">
                <div className="flex items-center gap-2">
                  <MdVerified className="text-white h-5 w-5 md:h-6 md:w-6" />
                  <span className="text-white text:xs md:text-lg font-playfair md:font-bold">Verified by Receipt</span>
                </div>
                <div className="flex items-center gap-2">
                  <MdVerifiedUser className="text-white h-5 w-5 md:h-6 md:w-6" />
                  <span className="text-white text:xs md:text-lg font-playfair md:font-bold">Real Guest Trusted</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaShieldHalved className="text-white h-5 w-5 md:h-6 md:w-6" />
                  <span className="text-white text:xs md:text-lg font-playfair md:font-bold">No Fake Reviews</span>
                </div>
              </div>

      {/* Slider dots */}
      <div className="absolute bottom-6 w-full flex justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-20 h-1 rounded-full ${
              i === index ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
