"use client";

import { useState, lazy } from "react";
import Image from "next/image";

//import HotelSearch from "../header/SearchHotels";
import { MdOutlineHotel } from "react-icons/md";
import { IoRestaurantOutline } from "react-icons/io5";
import SearchForm from "../header/search";
import HotelSearch from "../header/search";
const HotelSearchHomepage = lazy(() => import('@/components/header/searchHotelforHomepage'));
const RestaurantSearch = lazy(() => import("@/components/header/SearchRestaurant"));
export default function SearchHero() {
  const [activeTab, setActiveTab] = useState("hotels");

  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="h-[550px] sm:col-span-1 relative flex items-center bg-secondary rounded-2xl m-1 sm:m-2 md:m-5">
        <Image 
          src= {activeTab === "hotels" ?"/assets/image-11.avif":"/assets/image-15.avif"}
          alt="hello"
          fill
          sizes="100vw" 
          className="z-0 object-cover rounded-2xl" 
          quality={85}  
          priority 
        />
         <div className="absolute inset-0 bg-a bg-opacity-50 rounded-2xl"></div>
        {/* Centered Content Container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center mx-2">
          <h1 className="text-3xl md:text-4xl custom:text-6xl font-bold font-playfair text-white mb-4 md:mb-8">
            {activeTab === "hotels" ? "Stay somewhere great" : "Dine somewhere amazing"}
          </h1>
          
          <div className="flex gap-6 mb-6 md:mb-8">
            <div 
              className={`flex gap-2 cursor-pointer pb-2 ${
                activeTab === "hotels" ? "border-b-2 border-white" : ""
              }`}
              onClick={() => handleTabChange("hotels")}
            >
              <MdOutlineHotel className="text-white" size={28}/>
              <p className="max-w-5xl text-white sm:text-lg">Hotels</p>
            </div>

            <div 
              className={`flex gap-2 cursor-pointer pb-2 ${
                activeTab === "restaurants" ? "border-b-2 border-white" : ""
              }`}
              onClick={() => handleTabChange("restaurants")}
            >
              <IoRestaurantOutline className="text-white" size={22}/>
              <p className="max-w-5xl text-white sm:text-lg">Restaurants</p>
            </div>
          </div>
          
          {/* Conditional Search Component */}
          {activeTab === "hotels" ? <HotelSearchHomepage/> : <RestaurantSearch/>}
        </div>
      </div>
    </div>
  )
}