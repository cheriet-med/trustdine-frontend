import { useState, useEffect, useCallback , lazy} from 'react';
import { MdOutlineHotel } from "react-icons/md";
import { IoRestaurantOutline } from "react-icons/io5";
import { MdVerified } from "react-icons/md";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { MdVerifiedUser } from "react-icons/md";
import { FaShieldHalved } from "react-icons/fa6";
import Image from 'next/image';

const HotelSearchHomepage = lazy(() => import('@/components/header/searchHotelforHomepage'));
const RestaurantSearch = lazy(() => import("@/components/header/SearchRestaurant"));
const slides = [
  { id: 1, src: "/assets/image-2.avif", alt: "Slide 1" },
  { id: 2, src: "/assets/image-16.avif", alt: "Slide 2" },
  { id: 3, src: "/assets/image-9.avif", alt: "Slide 3" },
];

export default function FullscreenSlider() {
  const [index, setIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"hotels" | "restaurants">("hotels");
  const [isVisible, setIsVisible] = useState(false);

  // Auto-change every 5s
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleTabChange = useCallback((tab: "hotels" | "restaurants") => {
    setActiveTab(tab);
  }, []);



  return (
    <div className="relative w-full h-screen max-w-full">
      {/* Preload all images for better performance */}
<div className="hidden">
  {slides.map((slide) => (
    <Image
      key={slide.id}
      src={slide.src}
      alt={slide.alt}
      width={1920}
      height={1080}
      priority
    />
  ))}
</div>
      
      {/* Simple image display without animations */}

<div className="absolute top-0 left-0 w-full h-full overflow-hidden bg-black">
  <div
    key={slides[index].id}
    className="absolute top-0 left-0 w-full h-full animate-zoomInFade"
    style={{ transformOrigin: "center center" }}
  >
    <Image
      src={slides[index].src}
      alt={slides[index].alt}
      fill
      sizes="100vw"
      className="object-cover"
      priority
    />
  </div>

  <style jsx>{`
    @keyframes zoomInFade {
      0% {
        transform: scale(1);
        opacity: 0.4;
      }
      10% {
        opacity: 1;
      }
      100% {
        transform: scale(1.1);
        opacity: 1;
      }
    }
    .animate-zoomInFade {
      animation: zoomInFade 10s ease-out forwards;
    }
  `}</style>
</div>

   <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-gray-700"></div>
      {/* Overlay content */}
      <div className="absolute mt-6 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl px-4 flex flex-col justify-center items-center space-y-2 z-30">
        {/* Title */}
        <h1 className="text-center uppercase text-2xl md:text-4xl lg:text-6xl leading-tight text-white font-black font-playfair pb-2 max-w-full">
          <span 
            className="block select-none  px-4 py-2 rounded-3xl"
            style={{ wordSpacing: '0.1em' }}
          >
            {activeTab === "hotels" ? "Discover Unforgettable Stays & Dining" : "Trusted by Real Guests"}
          </span>
        </h1>
        
        {/* Subtitle */}
        <h2 className="text-center text-xl md:text-2xl lg:text-5xl leading-tight text-white font-playfair max-w-9xl mb-2 sm:mb-0">
          <span 
            className="block select-none  px-2 py-2 rounded-3xl"
            style={{ wordSpacing: '0.1em' }}
          >
            {activeTab === "hotels" 
              ? "Trusted Places Await!" 
              : "Explore with Confidence! "}
          </span>
        </h2>

        {/* Tab Selector */}
        <div className="flex gap-4 md:gap-6 mb-4 md:mb-8 pt-8 md:pt-16 pb-4 max-w-full">
          <button
  aria-label="Show Hotels"
  aria-pressed={activeTab === "hotels"}
  className={`flex gap-2 cursor-pointer transition-colors bg-highlights px-4 py-1 rounded-3xl opacity-85 ${
    activeTab === "hotels" ? "border-b-2 border-white bg-secondary" : "opacity-80 hover:opacity-100"
  }`}
  onClick={() => handleTabChange("hotels")}
>
  <MdOutlineHotel className="text-white" size={28}/>
  <p className="max-w-5xl text-white sm:text-lg">Hotels</p>
</button>

<button
  aria-label="Show Restaurants"
  aria-pressed={activeTab === "restaurants"}
  className={`flex gap-2 cursor-pointer transition-colors bg-highlights px-4 py-1 rounded-3xl opacity-85 ${
    activeTab === "restaurants" ? "border-b-2 border-white bg-secondary" : "opacity-80 hover:opacity-100"
  }`}
  onClick={() => handleTabChange("restaurants")}
>
  <IoRestaurantOutline className="text-white" size={22}/>
  <p className="max-w-5xl text-white sm:text-lg">Restaurants</p>
</button>
        </div>
        
        <div className='w-full md:pt-4 max-w-full'>
              {activeTab === "hotels" ? <HotelSearchHomepage /> : <RestaurantSearch />}
        </div>
      </div>
      
      <div className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 w-full lg:px-24 gap-2 md:gap-6 z-30 justify-center md:justify-between px-4 md:px-8 flex-wrap hidden xl:flex">
        <div className="flex items-center gap-2">
          <MdVerified className="text-white h-5 w-5 md:h-6 md:w-6" />
          <span className="text-white text:xs md:text-lg font-playfair md:font-bold">Verified by Receipt</span>
        </div>

        <div className="flex items-center gap-2">
          <FaShieldHalved className="text-white h-5 w-5 md:h-6 md:w-6" />
          <span className="text-white text:xs md:text-lg font-playfair md:font-bold">No Fake Reviews</span>
        </div>
      </div>

      {/* Slider dots */}
      <div className="absolute bottom-6 w-full flex justify-center gap-2">
         {slides.map((slide, i) => (
    <button
      key={i}
      onClick={() => setIndex(i)}
      aria-label={`Go to slide ${i + 1}: ${slide.alt}`} 
      title={`Go to slide ${i + 1}`} // optional tooltip
      className={`w-20 h-1 rounded-full ${
        i === index ? "bg-white" : "bg-white/50"
      }`}
    />
  ))}
      </div>
    </div>
  );
}