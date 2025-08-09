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
interface PropertyCardProps {
  id: string | number | any;
  price: string  ;
  address: string  ;
  imageUrl: string;
  averageRating: number;
  lengtReviews: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  price,
  address,
  averageRating,
  imageUrl,
  lengtReviews,
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
        title: address,
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
          className="h-80 w-full rounded-md object-cover"
        />
        </Link>
      </div>
 <Link href="/en/id">
      <div className="mt-2 flex flex-col gap-1">
        <div>
          <dd className="font-medium font-playfair">{address}</dd>
        </div>  
        <div className='flex gap-1'>
          <p className="text-sm">{averageRating}</p>
          <StarRating rating={averageRating} />      
          <p className=' text-sm'>{"("}{lengtReviews}{")"}</p>   
        </div>
        <div className="flex gap-1 text-sm items-center">
          <CiForkAndKnife size={14}/>
          <dd className="text-sm text-gray-500">{price}</dd>
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

  const totalPages = Math.ceil((listings?.length || 0)/ itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = listings?.slice(startIndex, endIndex) || [];

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrevious = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  return (
    <div className="flex flex-col gap-4 mx-2 custom:mx-40">
      <h1 className="text-4xl font-playfair">
        Restaurants
      </h1>
        
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 ">
        {currentItems.map((res, index) => (
          <div key={index}>
            <PropertyCard
              id={res.id || `restaurant-${index}`} // Use restaurant ID or fallback
              price={res.average_cost || ''}
              address={res.location || ''}
              imageUrl={`${process.env.NEXT_PUBLIC_IMAGE}/${res.image}`}
              averageRating={4}
              lengtReviews={"170"}
            />
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      {Restaurants.length > itemsPerPage && (
        <div className="flex justify-end items-center gap-1 flex-wrap">
          <button disabled={currentPage === 1} onClick={handlePrevious} className="text-gray-500 hover:text-accent flex items-center">
            <CiCircleChevRight size={40} className="rotate-180 "/>
          </button>

          <button disabled={currentPage === totalPages} onClick={handleNext} className="text-gray-500 hover:text-accent flex items-center">
            <CiCircleChevRight size={40} />
          </button>
        </div>
      )}
    </div>
  )
}