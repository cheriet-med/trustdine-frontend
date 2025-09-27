"use client";

import { useEffect, useState, useRef, useCallback, lazy, Suspense } from 'react';
import { MdOutlineHotel } from "react-icons/md";
import { IoRestaurantOutline } from "react-icons/io5";
import { MdVerified } from "react-icons/md";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { MdVerifiedUser } from "react-icons/md";
import { FaShieldHalved } from "react-icons/fa6";
import Image from 'next/image';
// Lazy load heavy components
const HotelSearchHomepage = lazy(() => import('../header/searchHotelforHomepage'));
const RestaurantSearch = lazy(() => import("../header/SearchRestaurant"));

// Lazy load GSAP only when needed
const loadGSAP = () => {
  return Promise.all([
    import('gsap'),
    import('gsap/CustomEase')
  ]).then(([gsapModule, customEaseModule]) => {
    const gsap = gsapModule.default;
    const CustomEase = customEaseModule.default;
    gsap.registerPlugin(CustomEase);
    return { gsap, CustomEase };
  });
};

export default function CombatLanding() {
  // Refs
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

  // Load GSAP only after component mounts
  useEffect(() => {
    let mounted = true;
    
    loadGSAP().then(({ gsap, CustomEase }) => {
      if (!mounted) return;
      
      setGsapLoaded(true);
      
      // Early return if refs aren't ready
      if (!heroRef.current || !videoContainerRef.current) return;

      const customEase = CustomEase.create("custom", ".87,0,.13,1");

      // Initial setup for all animated elements
      gsap.set(videoContainerRef.current, {
        scale: 0,
        rotation: -20,
      });

      gsap.set(headerSpansRef.current, {
        y: "100%",
        opacity: 0
      });

      gsap.set(headerSpansRef.current[2], {
        y: 20,
        opacity: 0
      });

      // Animation timeline
      const tl = gsap.timeline({
        defaults: { ease: customEase },
        onComplete: () => {
          // Clean up will-change after animations
          gsap.set(headerSpansRef.current, { willChange: "auto" });
        }
      });

      // Hero animation sequence
      tl.to(heroRef.current, {
        clipPath: "polygon(0% 45%, 25% 45%, 25% 55%, 0% 55%)",
        duration: 1.5,
        delay: 1,
      })
      .to(heroRef.current, {
        clipPath: "polygon(0% 45%, 100% 45%, 100% 55%, 0% 55%)",
        duration: 2,
        onStart: () => {
          gsap.to(progressBarRef.current, {
            width: "100vw",
            duration: 2,
            ease: customEase,
          });

          gsap.to(counterRef.current, {
            innerHTML: 100,
            duration: 2,
            snap: { innerHTML: 1 },
          });
        },
      }, "+=1")
      .to(heroRef.current, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 1,
        onStart: () => {
          gsap.to(videoContainerRef.current, {
            scale: 1,
            rotation: 0,
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 1.25,
          });

          gsap.to(progressBarRef.current, {
            opacity: 0,
            duration: 0.3,
          });
        },
      }, "+=1")
      .to(headerSpansRef.current.slice(0, 2), {
        y: "0%",
        opacity: 1,
        duration: 1,
        stagger: 0.125,
        ease: "power3.out",
      }, "-=0.25")
      .to(headerSpansRef.current[2], {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.5)",
        onStart: () => {
          // Optimize for animation during the elastic effect
          gsap.set(headerSpansRef.current[2], { willChange: "transform, opacity" });
        }
      }, "-=0.3");

      return () => {
        if (mounted) {
          tl.kill();
        }
      };
    });

    return () => {
      mounted = false;
    };
  }, []);

  // Handle video loading
  const handleVideoLoad = useCallback(() => {
    setVideoLoaded(true);
  }, []);

  // Preload video with intersection observer
  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.load();
            observer.unobserve(video);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative h-screen bg-a font-sans overflow-hidden">
      <div 
        ref={heroRef}
        className="relative h-screen bg-secondary flex flex-col justify-between"
        style={{ clipPath: 'polygon(0% 45%, 0% 45%, 0% 55%, 0% 55%)' }}
      >
        {/* Loading Progress Bar */}
        <div 
          ref={progressBarRef}
          className="absolute top-1/2 left-0 w-[25vw] p-4 flex justify-between items-center text-accent z-20"
        >
          <p className="text-sm font-semibold uppercase">loading</p>
          <span ref={counterRef} className="text-sm font-semibold uppercase">0</span>
        </div>

        {/* Video Background */}
        <div 
          ref={videoContainerRef}
          className="absolute top-1/2 left-1/2 w-[97vw] h-[95vh] bg-secondary overflow-hidden rounded-2xl z-10"
          style={{ 
            transform: 'translate(-50%, -50%) scale(0)',
          }}
        >
          <video 
            ref={videoRef}
            autoPlay={false} // Don't autoplay immediately
            loop 
            muted 
            playsInline 
            preload="metadata" // Only load metadata initially
            onLoadedData={handleVideoLoad}
            className="absolute top-1/2 left-1/2 min-h-full object-cover opacity-70 rounded-2xl"
            style={{ 
              transform: 'translate(-50%, -50%)',
              width: '100%',
              height: '100%',
              display: videoLoaded ? 'block' : 'none'
            }}
            onCanPlay={() => {
              // Start playing only when can play
              if (videoRef.current && gsapLoaded) {
                videoRef.current.play().catch(console.error);
              }
            }}
          >
            <source src="/output.mp4" type="video/mp4" />
          </video>
          
          {/* Video Loading Placeholder */}
        {!videoLoaded && (
  <div className="absolute inset-0 bg-secondary rounded-2xl">
    <Image
      src="/loading.webp"
      alt="Loading placeholder"
      fill
      className="object-cover rounded-2xl"
    />
    
  </div>
)}
        </div>

        {/* Main Content */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full md:max-w-5xl px-4 flex flex-col justify-center items-center space-y-2 z-30">
          {/* Title */}
          <h1 className="text-center uppercase text-4xl md:text-6xl lg:text-6.5xl leading-[0.85] tracking-[-0.25rem] text-white font-bold font-playfair pb-2">
            <span 
              ref={setHeaderSpanRef(0)} 
              className="block transform translate-y-full select-none"
              style={{ wordSpacing: '0.1em' }}
            >
              {activeTab === "hotels" ? "Verified by Receipts" : "Trusted by Real Guests"}
            </span>
          </h1>
          
          {/* Subtitle */}
          <h1 className="text-center text-3xl md:text-4xl custom:text-5xl leading-[0.85] tracking-[-0.25rem] text-white font-playfair">
            <span 
              ref={setHeaderSpanRef(1)} 
              className="block transform translate-y-full select-none"
              style={{ wordSpacing: '0.25em' }}
            >
              {activeTab === "hotels" ? "Skip the fake reviews, Discover restaurants and hotels that real people actually visited" 
              : "This instantly communicates the platform's unique value, is clear, and builds trust"}
            </span>
          </h1>

          {/* Tab Selector */}
          <div 
            ref={setHeaderSpanRef(2)} 
            className="flex gap-6 mb-8 md:mb-8 pt-4 pb-4"
          >
            <div 
              className={`flex gap-2 cursor-pointer pb-2 transition-colors ${
                activeTab === "hotels" ? "border-b-2 border-white" : "opacity-80 hover:opacity-100"
              }`}
              onClick={() => handleTabChange("hotels")}
            >
              <MdOutlineHotel className="text-white" size={28}/>
              <p className="max-w-5xl text-white sm:text-lg">Hotels</p>
            </div>
            
            <div 
              className={`flex gap-2 cursor-pointer pb-2 transition-colors ${
                activeTab === "restaurants" ? "border-b-2 border-white" : "opacity-80 hover:opacity-100"
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

        {/* Trust Badges */}
        <div className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 flex gap-2 md:gap-6 z-30 justify-center md:justify-between w-full px-2 md:px-16 flex-wrap">
          <div className="flex items-center gap-2">
            <MdVerified className="text-white h-5 w-5 md:h-6 md:w-6" />
            <span className="text-white text:xs md:text-lg font-playfair md:font-bold">Verified by Receipt</span>
          </div>
        
          <div className="flex items-center gap-2">
            <FaShieldHalved className="text-white h-5 w-5 md:h-6 md:w-6" />
            <span className="text-white text:xs md:text-lg font-playfair md:font-bold">No Fake Reviews</span>
          </div>
        </div>
      </div>
    </div>
  );
}