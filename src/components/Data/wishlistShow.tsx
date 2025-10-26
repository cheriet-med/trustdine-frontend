'use client'

import { useState, useEffect } from "react";
import React from 'react';
import { CiCircleChevRight } from "react-icons/ci";
import StarRating from "@/components/starsComponent";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useWishlist } from '@/components/cart';
import { useSession} from "next-auth/react";
import LoginButton from '@/components/header/loginButton';
import Link from "next/link";
import { Search } from 'lucide-react';
import useFetchReviews from "../requests/fetchReviews";
import { CiForkAndKnife } from "react-icons/ci";
import useWishlistCheck from "../requests/fetchWishlistCheck";
import useFetchWishlist from "../requests/fetchWishlist";
import useFetchListing from "../requests/fetchListings";

interface PropertyCardProps {
  id: string | number | any;
  price: any ;
  address: string;
  imageUrl: string;
  averageRating: number ;
  lengtReviews: string | number;
  location:string;
  category:string;
  onUpdate?: () => Promise<void>;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  price,
  address,
  averageRating,
  imageUrl,
  lengtReviews,
  location,
  category,
  onUpdate
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
  const { wishlistStatus, isLoading, error, mutate } = useWishlistCheck(id, session?.user?.id);




const toggle = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}wishlist/${id}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${process.env.NEXT_PUBLIC_TOKEN}`,
      },
      body: JSON.stringify({ user_id: session?.user?.id }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
     // Trigger SWR revalidation to refresh the data
     if (onUpdate) {
      await onUpdate();
    }
    return (await response.json());
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch data. Please try again later.");
  } 
};





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
        category:" ",
        cuisine:" ",
        price_range:" ",
        rating:averageRating,
        name:address,
        price:price,
        location:location,
        lengtReviews:lengtReviews
        // Add other required fields if needed for your wishlist context
      };
      addItemToWishlist(wishlistItem);
    }
  };

  return (
    <div className="block rounded-lg p-2 shadow-xs shadow-black border border-1  font-montserrat text-secondary bg-white">
      <div className="relative">
        <Link href={`/en/booking/${id}`}>
       <button
          className="absolute left-4 top-4 z-10 py-1 px-3 rounded-3xl bg-secondary hover:bg-accent transition-colors group">
               <p className='text-sm text-white'>Book Now</p>
            </button> 
          </Link>

          {
            status === "authenticated" ?
            
          
 (
  
               wishlistStatus?.is_in_wishlist == true ? <button 
            onClick={toggle}
            className="absolute right-4 top-4 z-10 p-1 rounded-full bg-white/80 hover:bg-white transition-colors group"
          >
                 <FaHeart size={24} className="text-secondary" />
              </button> : 
               <button 
            onClick={toggle}
            className="absolute right-4 top-4 z-10 p-1 rounded-full bg-white/80 hover:bg-white transition-colors group"
          >
                  <FaRegHeart size={24} className="text-gray-600 group-hover:text-accent transition-colors" />
             </button>
           
          )   
         :
           (
            <LoginButton />
          )}
     <Link href={`/en/booking/${id}`}>
     <img
          alt="Property"
          src={imageUrl}
          className="h-80 w-full rounded-md object-cover"
        />
     </Link>
        
      </div>
 <Link href={`/en/booking/${id}`}>
      <div className="mt-2 flex flex-col gap-1">  
        <div>
          <dd className="font-medium font-playfair">{address}</dd>
        </div>  
        <div className='flex gap-1'>
           {totalReviews == 0 ? "" : <p className="text-sm">{totalReviews}</p>} 
          <StarRating rating={totalReviews} />      
         {totalReviews == 0 ? "" : <p className=' text-sm'>{"("}{Review.length}{")"}</p>} 
        </div>
         <div className="flex gap-1 text-sm items-center">
           {price?.includes("Averege Price") && <CiForkAndKnife size={14} />}
          {category == "Hotel"? 
           <dd className="text-sm text-gray-500">{"From $"+price + " per night"}</dd>:
          <dd className="text-sm text-gray-500">{"Averege Price $"+price +" -$$" }</dd>
          }
         </div>
      </div>
      </Link>
    </div>
  );
};

export default function WishlistView() {
 const { data: session, status } = useSession();
 //const { wishlist, addItemToWishlist, removeItemFromWishlist, isItemInWishlist } = useWishlist();

const { Wishlist, mutate: wishlistMutate } = useFetchWishlist();
const { listings, mutate: listingMutate } = useFetchListing();


const wishlist = Wishlist?.filter(x => +x.user === +session?.user?.id);
// get product ids
const wishlistProductIds = wishlist?.map(w => Number(w.product));


// match listings with wishlist product ids
  const lis = listings?.filter(x => wishlistProductIds?.includes(Number(x.id))) || [];
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(lis.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = lis.slice(startIndex, endIndex);
  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrevious = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  return (
    <div className="flex flex-col gap-4 mx-2 custom:mx-6 my-6">
      <h1 className="text-2xl font-semibold font-playfair">
        Wishlist
      </h1>
        
{wishlist.length == 0 ?
  <div className="flex items-center justify-center h-[700px]  bg-gray-50">
              <div className="text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2 font-playfair">No Service yet—let's change that</h3>
                <p className="text-gray-500">Wishlist things before you go, and get right to the good stuff when you're there.</p>
                <Link href="/en/booking">
                 <button className='py-2 bg-accent text-white px-4 rounded-3xl hover:bg-secondary mt-8'>
                  Find Good Place
                </button>
                </Link>
               
              </div>
            </div>
:
        <div>
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 ">
        {currentItems.map((res, index) => (
          <div key={index}>
            <PropertyCard
              id={res.id } // Use restaurant ID or fallback
              location={res.location}
              price={res.price_per_night || res.price_range || res.average_cost || ""}
              category={res.category ?? ""}
              address={res.name ?? ""}
              imageUrl={`${process.env.NEXT_PUBLIC_IMAGE}/${res.image}` }
              averageRating={Number(res.rating) || 0}
              lengtReviews={85}
              onUpdate={async () => {
              await Promise.all([wishlistMutate(), listingMutate()]);
              }}
            />
          </div>
        ))}
      </div>
       {/* Pagination */}
      {itemsPerPage <= 12 ? "" :
     
      (wishlist.length > itemsPerPage && (
        <div className="flex justify-end items-center gap-1 flex-wrap">
          <button disabled={currentPage === 1} onClick={handlePrevious} className="text-gray-500 hover:text-accent flex items-center">
            <CiCircleChevRight size={40} className="rotate-180 "/>
          </button>

          <button disabled={currentPage === totalPages} onClick={handleNext} className="text-gray-500 hover:text-accent flex items-center">
            <CiCircleChevRight size={40}/>
          </button>
        </div>
      ))
    }

        </div>}
      
    </div>
  )
}