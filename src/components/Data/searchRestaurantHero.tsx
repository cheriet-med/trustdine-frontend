"use client";

import { useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import useFetchListing from "../requests/fetchListings";
export default function SearchRestaurantHero() {
  const [activeTab, setActiveTab] = useState("hotels");
  const searchParams = useSearchParams();

  // ✅ Get q parameter
  const q = searchParams.get("q") || "New York";
  const { listings, isLoading, error } = useFetchListing();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const userListing = listings?.filter(post => post.category == 'Restaurant').length;
  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="h-60 sm:col-span-1 relative flex items-center bg-secondary rounded-2xl m-1 sm:m-2 md:m-5">
        <Image 
          src="/m1.avif"
          alt="hello"
          fill
          sizes="100vw"
          className="z-0 object-cover rounded-2xl"
          quality={85}
          priority 
        />
        <div className="absolute inset-0 bg-a bg-opacity-50 rounded-2xl"></div>

        {/* Centered Content Container */}
        <div className="absolute inset-0 flex flex-col justify-end px-6 lg:pl-16 ">

          {/* ✅ Replace "New York City" with q value */}
          <h1 className="text-2xl md:text-4xl font-bold font-playfair text-white">
            {q} Hotels and Places to Stay
          </h1>

          <h2 className="font-bold text-white pt-2 mb-4 md:mb-8">
            Over {userListing} Places
          </h2>

        </div>
      </div>
    </div>
  );
}
