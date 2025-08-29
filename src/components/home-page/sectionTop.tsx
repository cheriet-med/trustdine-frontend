"use client";

import { useEffect, useState, useRef, useCallback, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Head from "next/head";
import { MdOutlineHotel, MdVerified, MdVerifiedUser } from "react-icons/md";
import { IoRestaurantOutline } from "react-icons/io5";
import { FaShieldHalved } from "react-icons/fa6";
import HotelSearchHomepage from "@/components/header/searchHotelforHomepage";
import RestaurantSearch from "@/components/header/SearchRestaurant";

//const HotelSearchHomepage = lazy(() => import("@/components/header/searchHotelforHomepage"));
//const RestaurantSearch = lazy(() => import("@/components/header/SearchRestaurant"));

const slides = [
  { id: 1, src: "/assets/image-1.avif", alt: "Slide 1" },
  { id: 2, src: "/assets/image-16.avif", alt: "Slide 2" },
  { id: 3, src: "/assets/image-11.avif", alt: "Slide 3" },
];

const MotionImage = motion(Image);

export default function FullscreenSlider() {
  const [index, setIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"hotels" | "restaurants">("hotels");
  const headerSpansRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    headerSpansRef.current = headerSpansRef.current.slice(0, 3);
  }, []);

  // Auto-change every 5s
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const setHeaderSpanRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      headerSpansRef.current[i] = el;
    },
    []
  );

  return (
    <>
      {/* Preload all images */}
      <Head>
        {slides.map((s) => (
          <link key={s.id} rel="preload" as="image" href={s.src} />
        ))}
      </Head>

      <div className="relative w-screen h-screen overflow-hidden">
        {/* Background Slides */}
        <AnimatePresence mode="wait">
          <MotionImage
            key={slides[index].id}
            src={slides[index].src}
            alt={slides[index].alt}
            fill
            priority={index === 0} // preload first image
            sizes="100vw"
            placeholder="blur"
            blurDataURL="/assets/placeholder.png" // tiny low-res image
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1 }}
            className="absolute top-0 left-0 object-cover"
          />
        </AnimatePresence>

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center px-4 z-30 space-y-6">
          {/* Title */}
          <h1 className="text-center uppercase text-4xl md:text-6xl lg:text-7xl leading-[0.85] tracking-[-0.25rem] text-white font-bold font-playfair">
            <span
              ref={setHeaderSpanRef(0)}
              className="block select-none bg-highlights px-4 py-2 rounded-3xl opacity-85"
            >
              {activeTab === "hotels" ? "Verified by Receipts" : "Trusted by Real Guests"}
            </span>
          </h1>

          {/* Subtitle */}
          <h2 className="text-center text-xl md:text-3xl lg:text-4xl leading-tight text-white font-playfair">
            <span
              ref={setHeaderSpanRef(1)}
              className="block select-none bg-highlights px-2 py-2 rounded-3xl opacity-85"
            >
              {activeTab === "hotels"
                ? "Skip the fake reviews — discover restaurants and hotels that real people actually visited"
                : "This instantly communicates the platform's unique value, is clear, and builds trust"}
            </span>
          </h2>

          {/* Tab Selector */}
          <div ref={setHeaderSpanRef(2)} className="flex gap-6 pt-6 md:pt-12">
            <div
              className={`flex gap-2 cursor-pointer px-4 py-2 rounded-3xl ${
                activeTab === "hotels"
                  ? "bg-secondary text-white"
                  : "bg-highlights opacity-80 hover:opacity-100"
              }`}
              onClick={() => setActiveTab("hotels")}
            >
              <MdOutlineHotel size={24} />
              <p>Hotels</p>
            </div>

            <div
              className={`flex gap-2 cursor-pointer px-4 py-2 rounded-3xl ${
                activeTab === "restaurants"
                  ? "bg-secondary text-white"
                  : "bg-highlights opacity-80 hover:opacity-100"
              }`}
              onClick={() => setActiveTab("restaurants")}
            >
              <IoRestaurantOutline size={22} />
              <p>Restaurants</p>
            </div>
          </div>

          {/* Search Component */}
          <div className="pt-6 w-full max-w-2xl">
            {activeTab === "hotels" ? <HotelSearchHomepage /> : <RestaurantSearch />}
          </div>
        </div>

        {/* Bottom Info Badges */}
     <div className="absolute bottom-8 w-full flex flex-wrap justify-center gap-6 text-white text-sm md:text-lg z-30 hidden sm:flex">

          <div className="flex items-center gap-2">
            <MdVerified className="h-5 w-5 md:h-6 md:w-6" />
            <span>Verified by Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <MdVerifiedUser className="h-5 w-5 md:h-6 md:w-6" />
            <span>Real Guest Trusted</span>
          </div>
          <div className="flex items-center gap-2">
            <FaShieldHalved className="h-5 w-5 md:h-6 md:w-6" />
            <span>No Fake Reviews</span>
          </div>
        </div>

        {/* Slider dots */}
        <div className="absolute bottom-4 w-full flex justify-center gap-2 z-30">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-16 h-1 rounded-full transition-colors ${
                i === index ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
