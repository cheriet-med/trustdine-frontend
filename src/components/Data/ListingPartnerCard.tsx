'use client'


import { useState, useEffect } from "react";
import React from 'react';
import { useWishlist } from '@/components/cart';
import { useSession} from "next-auth/react";
import Image from "next/image";
import { LiaHotelSolid } from "react-icons/lia";
import { IoRestaurantOutline } from "react-icons/io5";
import Link from "next/link";
import { FaCircleChevronRight } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import useFetchListing from '@/components/requests/fetchListings';
import { FaBuildingCircleArrowRight } from "react-icons/fa6";
import ManageListing from "@/components/Data/manageListing";

// Skeleton Components
const PropertyCardSkeleton = () => {
  return (
    <div className="block rounded-lg p-2 shadow-xs shadow-black border border-1 font-montserrat text-secondary bg-white lg:flex lg:gap-8 animate-pulse">
      <div className="relative">
        <div className="h-80 lg:h-60 lg:w-96 rounded-md bg-gray-300"></div>
      </div>
      <div className="mt-2 flex flex-col gap-1 flex-1">
        <div className="flex justify-end">
          <div className="h-6 w-20 bg-gray-300 rounded"></div>
        </div>
        
        <div>
          <div className="h-6 w-3/4 bg-gray-300 rounded"></div>
        </div>
        
        <hr className='my-2 text-secondary'/>
        
        <div className='text-sm text-gray-500 space-y-2'>
          <div className="h-4 w-full bg-gray-300 rounded"></div>
          <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
          <div className="h-4 w-4/5 bg-gray-300 rounded"></div>
          <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
          <div className="h-4 w-2/3 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
};

const AddServiceSkeleton = () => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
      <div className='h-16 border border-1 rounded-xl bg-gray-300 animate-pulse'></div>
      <div className='h-16 border border-1 rounded-xl bg-gray-300 animate-pulse'></div>
    </div>
  );
};

interface PropertyCardProps {
  id: string | number | any;
  price: string | number;
  address: string;
  imageUrl: string;
  averageRating: number;
  lengtReviews: string;
  location:string;
  category:string | null,
  mutate?: () => Promise<any>;
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
  mutate,
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
        price:price,
        location:location,
        lengtReviews:lengtReviews
        // Add other required fields if needed for your wishlist context
      };
      addItemToWishlist(wishlistItem);
    }
  };

  return (
    <div className="block rounded-lg p-2 shadow-xs shadow-black border border-1  font-montserrat text-secondary bg-white lg:flex lg:gap-8 ">
      <div className="relative">
     <Image
          alt="Property"
          src={imageUrl}
          height={500}
          width={500}
          className="h-80 lg:h-60 lg:w-96 rounded-md object-cover"
        />
      </div>
      <div className="mt-2 flex flex-col gap-1 ">
     <div className="flex justify-end">
    <ManageListing id={id} category={category} mutate={mutate}/>
</div>

       
        <div>
          <dd className="font-medium font-playfair ">{address}</dd>
        </div>  
        <hr className='my-2 text-secondary'/>
<div className='text-sm text-gray-500 space-y-2'>
  <p><span className='font-bold'>listin ID:</span> {id}</p>
  <p><span className='font-bold'>Service Booked:</span> {category}</p>
  <p><span className='font-bold'>Total Price:</span> ${price} (incl. taxes & fees)</p>
  <p><span className='font-bold'>Payment Method:</span> Credit Card </p>
  <p className="text-green-500"><span className='font-bold text-gray-500'>Status:</span> Active</p>
</div>      
</div>
    </div>
  );
};

export default function ListinPartnerCard() {
  const { data: session, status } = useSession({ required: true });
  const userId = session?.user?.id;
  const { listings, isLoading, error, mutate } = useFetchListing(); 
  const userListing = listings?.filter(post => post.user == userId);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Use the fetched listins instead of Hotels
  const totalPages = Math.ceil((userListing?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = userListing?.slice(startIndex, endIndex) || [];

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrevious = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 mx-2 custom:mx-6 mt-6">
        <AddServiceSkeleton />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {Array.from({ length: itemsPerPage }, (_, index) => (
            <PropertyCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">Error loading listins: {error.message}</div>;
  }


  return (
    <div className="flex flex-col gap-4 mx-2 custom:mx-6 mt-6">
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <Link href="/en/account/add-hotel-listing">
        <div className='h-16 border border-1 rounded-xl shaddow-sm bg-highlights flex justify-around items-center text-white cursor-pointer hover:bg-secondary'>
          <div className='flex gap-4 items-center'>
            <LiaHotelSolid size={20}/>
            <h1 className="text-xl font-playfair font-semibold">
              Add Service Hotel
            </h1>
          </div>
          <FaPlus size={18}/>
        </div>
        </Link>
         <Link href="/en/account/add-restaurant-listing">
        <div className='h-16 border border-1 rounded-xl shaddow-sm bg-highlights flex justify-around items-center text-white cursor-pointer hover:bg-secondary'>
          <div className='flex gap-4 items-center'>
            <IoRestaurantOutline size={20}/>
            <h1 className="text-xl font-playfair font-semibold">
              Add Service Restaurant
            </h1>
          </div>
          <FaPlus size={18}/>
        </div>
        </Link>
      </div>
      {currentItems.length == 0 ?
        <div className="flex items-center justify-center h-[700px]  bg-gray-50">
              <div className="text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaBuildingCircleArrowRight className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2 font-playfair">No Service yet—let's change that</h3>
                <p className="text-gray-500">Boost your business, get more bookings and a higher trust score..</p>
              </div>
            </div>:
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {currentItems.map((listin, index) => (
          <div key={listin.id || index}>
            <PropertyCard
              id={listin.id}
              location={listin.location || "Unknown location"}
              price={listin.price_per_night ? `${listin.price_per_night} ${listin.currency || ''}` : `${listin.average_cost} ${listin.currency || ''}`}
              address={listin.name || "Unnamed listin"}
              imageUrl={`${process.env.NEXT_PUBLIC_IMAGE}/${listin.image}`}
              averageRating={listin.rating ? parseFloat(listin.rating) : 0}
              lengtReviews={"0"} // You might want to add this to your API
              category={listin.category}
              mutate={mutate}
            />
          </div>
        ))}
      </div>
       }
      {/* Pagination */}
        {!isLoading && currentItems.length > 0 && totalPages > 1 && (
        <div className="flex justify-end items-center gap-1 flex-wrap">
          <button 
            disabled={currentPage === 1} 
            onClick={handlePrevious} 
            className="text-highlights hover:text-accent flex items-center"
          >
            <FaCircleChevronRight size={40} className="rotate-180"/>
          </button>

          <button 
            disabled={currentPage === totalPages} 
            onClick={handleNext} 
            className="text-highlights hover:text-accent flex items-center"
          >
            <FaCircleChevronRight size={40}/>
          </button>
        </div>
      )
      }
    </div>
  );
}