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
import { GoPencil } from "react-icons/go";
import useFetchListing from '@/components/requests/fetchListings';


interface PropertyCardProps {
  id: string | number | any;
  price: string | number;
  address: string;
  imageUrl: string;
  averageRating: number;
  lengtReviews: string;
  location:string;
  category:string | null,
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
          className="h-80 lg:h-60  lg:w-96  rounded-md object-cover"
        />
      </div>
      <div className="mt-2 flex flex-col gap-1 ">
     <div className="flex justify-end">
      <div className="text-sm bg-wite rounded-xl font-medium py-1 px-4 w-fit border border-1 mt-1 flex gap-1">
          <GoPencil size={16}/>
          <p >Edit</p>
      </div>
</div>

       
        <div>
          <dd className="font-medium font-playfair ">{address}</dd>
        </div>  
        <hr className='my-2 text-secondary'/>
<div className='text-sm text-gray-500 space-y-2'>
  <p><span className='font-bold'>listin ID:</span> {id}</p>
  <p><span className='font-bold'>Service Booked:</span> Deluxe Double Room (2 Nights)</p>
  <p><span className='font-bold'>Total Price:</span> ${price} (incl. taxes & fees)</p>
  <p><span className='font-bold'>Payment Method:</span> Credit Card </p>
  <p><span className='font-bold'>Status:</span> Active</p>
</div>      
</div>
    </div>
  );
};
export default function ListinPartnerCard() {
     const { data: session, status } = useSession({ required: true });
  
      const userId = session?.user?.id;
   const { listings, isLoading, error } = useFetchListing(); 
  const userListing = listings?.filter(post => post.user === userId?.toString);
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
    return <div className="flex justify-center items-center h-64">Loading listins...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">Error loading listins: {error.message}</div>;
  }

  if (!listings || listings.length === 0) {
    return <div className="flex justify-center items-center h-64">No listins found</div>;
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {currentItems.map((listin, index) => (
          <div key={listin.id || index}>
            <PropertyCard
              id={listin.id}
              location={listin.location || "Unknown location"}
              price={listin.price_per_night ? `${listin.price_per_night} ${listin.currency || ''}` : "Price not available"}
              address={listin.name || "Unnamed listin"}
              imageUrl={`${process.env.NEXT_PUBLIC_IMAGE}/${listin.image}`}
              averageRating={listin.rating ? parseFloat(listin.rating) : 0}
              lengtReviews={"0"} // You might want to add this to your API
              category={listin.category}
            />
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      {listings.length > itemsPerPage && (
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
      )}
    </div>
  );
}