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
import Link from "next/link";
import useFetchListing from "../requests/fetchListings";
import useFetchReviews from "../requests/fetchReviews";
import Image from "next/image";
interface PropertyCardProps {
  id: string | number | any;
  price: string | null ;
  address: string  ;
  imageUrl: string;
  averageRating: number;
  lengtReviews: string;
  name:string | null
}

// Skeleton component for restaurant cards
const RestaurantCardSkeleton: React.FC = () => {
  return (
    <div className="block rounded-lg p-2 shadow-xs shadow-black border border-1 font-montserrat text-secondary bg-white animate-pulse">
      <div className="relative">
        {/* Image skeleton */}
        <div className="h-80 w-full rounded-md bg-gray-300"></div>
        {/* Heart icon skeleton */}
        <div className="absolute right-4 top-4 z-10 p-1 rounded-full bg-white/80">
          <div className="w-6 h-6 bg-gray-300 rounded"></div>
        </div>
      </div>
      
      <div className="mt-2 flex flex-col gap-1">
        {/* Restaurant name skeleton */}
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
        
        {/* Location and price skeleton */}
        <div className="flex gap-1 items-center">
          <div className="w-3.5 h-3.5 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        </div>
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
  name,
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

  const {Review} = useFetchReviews(id)
  const totalReviews = Review && Review.length > 0? Review.reduce((sum, r) => sum + +r.rating_global, 0) / Review.length: 0

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
        title: name || 'no title',
        dateAdded: "",
        category:"",
        cuisine:"",
        price_range:"",
        rating:averageRating,
        name:address,
        price: price,
        location:address,
        lengtReviews:lengtReviews,
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
 (isInWishlist ?   
 <button 
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
           </button>)   
         :
           (
            <LoginButton />
          )}
      <Link href={`/en/booking/${id}`}>
          <Image
      alt="Property"
      src={imageUrl}
      width={400} // Set appropriate width
      height={320} // Set appropriate height (maintaining 5:4 aspect ratio)
      className="h-80 w-full rounded-md object-cover"
      placeholder="blur" // Optional: add blur placeholder
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaUMk9SQ2Tv6JauWg===" // Optional: small base64 placeholder
    />
        </Link>
      </div>
 <Link href={`/en/booking/${id}`}>
      <div className="mt-2 flex flex-col gap-1">
        <div>
          <dd className="font-medium font-playfair">{name}</dd>
        </div>  
        <div className='flex gap-1'>
         {totalReviews == 0 ? "" : <p className="text-sm">{totalReviews}</p>} 
          <StarRating rating={totalReviews} />      
         {totalReviews == 0 ? "" : <p className=' text-sm'>{"("}{Review.length}{")"}</p>} 
        </div>
        <div className="flex gap-1 text-sm items-center">
          <CiForkAndKnife size={14}/>
          <dd className="text-sm text-gray-500">Average Price {price} -$$</dd>
        </div>
      </div>
      </Link>
    </div>
  );
};

export default function ResCards() {
 const { listings, isLoading, error } = useFetchListing();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
 const userListing = listings?.filter(post => post.category == 'Restaurant');
  const totalPages = Math.ceil((userListing?.length || 0)/ itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = userListing?.slice(startIndex, endIndex) || [];

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrevious = () => currentPage > 1 && setCurrentPage(currentPage - 1);




  // Show error state
  if (error) {
    return (
      <div className="flex flex-col gap-4 mx-2 custom:mx-40">
        <h1 className="text-4xl font-playfair">Restaurants</h1>
        <div className="text-center py-8">
          <p className="text-red-500">Error loading restaurants. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 mx-2 custom:mx-40">
      <h1 className="text-4xl font-playfair">
        Restaurants
      </h1>
        
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 ">
        {isLoading ? (
          // Show skeleton loading cards
          [...Array(itemsPerPage)].map((_, index) => (
            <RestaurantCardSkeleton key={index} />
          ))
        ) : (
          // Show actual data
          currentItems.map((res, index) => (
            <div key={index}>
              <PropertyCard
                id={res.id} // Use restaurant ID or fallback
                name={res.name}
                price={res.average_cost || res.price_range}
                address={res.location || ''}
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
            <CiCircleChevRight size={40} />
          </button>
        </div>
      )}
    </div>
  )
}