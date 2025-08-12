'use client'

import { Restaurants } from "./restaurants"
import { useState, useEffect } from "react";
import React from 'react';
import { CiCircleChevRight } from "react-icons/ci";
import StarRating from "../starsComponent";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { CiForkAndKnife } from "react-icons/ci";
import { useWishlist } from "../cart";
import { useSession} from "next-auth/react";
import LoginButton from "../header/loginButton";
import { Hotels } from "./hotels";
import Link from "next/link";
import useFetchListing from "../requests/fetchListings";

interface PropertyCardProps {
  id: string | number | any;
  price: string | number;
  address: string | null;
  imageUrl: string;
  averageRating: number;
  lengtReviews: string;
  location:string | null;
}

// Skeleton component for hotel search cards
const HotelSearchCardSkeleton: React.FC = () => {
  return (
    <div className="block rounded-lg p-2 shadow-xs shadow-black border border-1 font-montserrat text-secondary bg-white animate-pulse">
      <div className="relative">
        {/* Image skeleton with responsive height */}
        <div className="h-80 sm:h-40 md:h-55 custom:h-80 w-full rounded-md bg-gray-300"></div>
        {/* Heart icon skeleton */}
        <div className="absolute right-4 top-4 z-10 p-1 rounded-full bg-white/80">
          <div className="w-6 h-6 bg-gray-300 rounded"></div>
        </div>
      </div>
      
      <div className="mt-2 flex flex-col gap-1">
        {/* Location tag skeleton */}
        <div className="flex">
          <div className="h-6 bg-gray-300 rounded-xl w-20"></div>
        </div>
        
        {/* Address skeleton */}
        <div className="h-5 bg-gray-300 rounded w-3/4"></div>
        
        {/* Rating skeleton */}
        <div className="flex gap-1 items-center">
          <div className="h-4 bg-gray-300 rounded w-8"></div>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-300 rounded"></div>
            ))}
          </div>
          <div className="h-4 bg-gray-300 rounded w-12"></div>
        </div>
        
        {/* Price skeleton */}
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  );
};

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  price,
  address,
  averageRating,
  imageUrl,
  lengtReviews,
  location,
}) => {

  const roundFirstDecimalDigit = (num: number) => {
    const intPart = Math.floor(num);
    const decimal = num - intPart;
  
    // Shift decimal left to isolate the first two digits
    const shifted = decimal * 10;
    const roundedFirst = Math.round(shifted);
  
    // Recombine with integer part
    return intPart + roundedFirst / 10;
  }

  const { wishlist, addItemToWishlist, removeItemFromWishlist, isItemInWishlist } = useWishlist();
  const { data: session, status } = useSession();
  // Check if current item is in wishlist
  const isInWishlist = isItemInWishlist(id);

  // Handle heart icon click
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the anchor tag from navigating
    e.stopPropagation(); // Stop event bubbling

      if (isInWishlist) {
      removeItemFromWishlist(id);
    } else {
      // Create wishlist item with simplified structure
      const wishlistItem = {
        id: id,
        image: imageUrl,
        title: address || 'no title',
        dateAdded: "",
        category:"",
        cuisine:"",
        price_range:"",
        rating:averageRating,
        name:address || 'no name',
        price:price,
        location:location || 'no location',
        lengtReviews:lengtReviews
        // Add other required fields if needed for your wishlist context
      };
      addItemToWishlist(wishlistItem);
    }
  };

  return (
    <div className="block rounded-lg p-2 shadow-xs shadow-black border border-1  font-montserrat text-secondary bg-white">
      <div className="relative">
          {
            status === "authenticated" ?

 (
              isInWishlist ?   <button 
          onClick={handleWishlistToggle}
          className="absolute right-4 top-4 z-10 p-1 rounded-full bg-white/80 hover:bg-white transition-colors group"
        >
               <FaHeart size={24} className="text-secondary" />
            </button> : 
             <button 
          onClick={handleWishlistToggle}
          className="absolute right-4 top-4 z-10 p-1 rounded-full bg-white/80 hover:bg-white transition-colors group"
        >
                <FaRegHeart size={24} className="text-gray-600 group-hover:text-accent transition-colors" />
           </button>
          )   
         :
           (
            <LoginButton />
          )}
      <Link href="/en/id">
        <img
          alt="Property"
          src={imageUrl}
          className="h-80 sm:h-40 md:h-55 custom:h-80 w-full rounded-md object-cover"
        /></Link>
      </div>
 <Link href="/en/id">
      <div className="mt-2 flex flex-col gap-1">   
     <div className="flex">
  <p className="text-sm bg-gray-100 rounded-xl font-medium py-1 px-2 w-fit">{location}</p>
</div>
        <div>
          <dd className="font-medium font-playfair">{address}</dd>
        </div>  
        <div className='flex gap-1'>
          <p className="text-sm">{averageRating}</p>
          <StarRating rating={averageRating} />      
          <p className=' text-sm'>{"("}{lengtReviews}{")"}</p>   
        </div>
          <dd className="text-sm text-gray-500">{price}</dd>
      </div>
      </Link>
    </div>
  );
};

export default function HotelSearchCards() {

  const { listings, isLoading, error } = useFetchListing();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
 const userListing = listings?.filter(post => post.category == 'Hotel');
  const totalPages = Math.ceil((userListing?.length || 0)/ itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = userListing?.slice(startIndex, endIndex) || [];

  const handlePageChange = (page: number) => setCurrentPage(page);
const handleNext = () => {
  if (currentPage < totalPages) {
    setCurrentPage(currentPage + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const handlePrevious = () => {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-center py-8">
          <p className="text-red-500">Error loading hotels. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 ">
        {isLoading ? (
          // Show skeleton loading cards
          [...Array(itemsPerPage)].map((_, index) => (
            <HotelSearchCardSkeleton key={index} />
          ))
        ) : (
          // Show actual data
          currentItems.map((res, index) => (
            <div key={index}>
             <PropertyCard
                id={res.id+"hotel" || `restaurant-${index}`} // Use restaurant ID or fallback
                location={res.location}
                price={"From $"+res.price_per_night + " per night"}
                address={res.name}
                imageUrl={`${process.env.NEXT_PUBLIC_IMAGE}/${res.image}`}
                averageRating={4}
                lengtReviews={"170"}
              />
            </div>
          ))
        )}
      </div>
      
      {/* Pagination - only show if not loading and has items */}
      {!isLoading && currentItems.length > 0 && totalPages > 1 && (
        <div className="flex justify-end items-center gap-1 flex-wrap">
          <button disabled={currentPage === 1} onClick={handlePrevious} className="text-gray-500 hover:text-accent flex items-center disabled:opacity-50 disabled:cursor-not-allowed">
            <CiCircleChevRight size={40} className="rotate-180 "/>
          </button>

          <button disabled={currentPage === totalPages} onClick={handleNext} className="text-gray-500 hover:text-accent flex items-center disabled:opacity-50 disabled:cursor-not-allowed">
            <CiCircleChevRight size={40}/>
          </button>
        </div>
      )}
    </div>
  )
}