"use client";

import { useState } from "react";
import Image from "next/image";


export default function SearchHotelHero() {
  const [activeTab, setActiveTab] = useState("hotels");

  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="h-60 sm:col-span-1 relative flex items-center bg-secondary rounded-2xl m-1 sm:m-2 md:m-5">
        <Image 
          src= "/m1.jpg"
          alt="hello"
          fill
          sizes="100vw" 
          className="z-0 object-cover rounded-2xl" 
          quality={85}  
          priority 
        />
         <div className="absolute inset-0 bg-a bg-opacity-50 rounded-2xl"></div>
        {/* Centered Content Container */}
        <div className="absolute inset-0 flex flex-col  justify-end px-6 lg:pl-16">

          <h1 className="text-2xl md:text-4xl font-bold font-playfair text-white ">
            New York City Hotels and Places to Stay
          </h1>
           <h2 className=" font-bold text-white mb-4 md:mb-8">
           
            Over 40 Places
          </h2>

        </div>
      </div>
    </div>
  )
}