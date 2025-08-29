'use client'

import { Restaurants } from '@/components/Data/restaurants';
import { useState, useEffect } from "react";
import React from 'react';
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa6";
import { LiaHotelSolid } from "react-icons/lia";
import { IoRestaurantOutline } from "react-icons/io5";
import { FaCircleChevronRight } from "react-icons/fa6";
import useFetchAllBookings from '@/components/requests/fetchAllBookings';
import useFetchAllUser from '@/components/requests/fetchAllUsers';
import PrivacyDialog from '@/components/Data/privacyDialog';
import { GoPencil } from "react-icons/go";
import { CiLocationOn } from "react-icons/ci";
import { SlLocationPin } from "react-icons/sl";
import moment from "moment";
import { useRouter } from "next/navigation";


interface PropertyCardProps {
  id: string | number | any;
  price: string | number;
  imageUrl: string;
  location:string;
  name:string
  created_at:string;
  check_in_date:string;
  check_out_date:string;
  total_guests:string;
  room_quantity:string;
  payment_method:string;
  category:string;
  restaurat_check_in_date:string;
  restaurat_check_in_time:string;
  cancellation_policy:string;
  status:string;
  user_id:string | number
  owner_user:string | number
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  price,
  imageUrl,
  location,
  name,
  created_at,
  check_in_date,
  check_out_date,
  total_guests,
  room_quantity,
  payment_method,
  category,
  restaurat_check_in_date,
  restaurat_check_in_time,
  cancellation_policy,
  status,
  user_id,
  owner_user
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

const { AllUsers, isLoading } = useFetchAllUser();
  const router = useRouter();

  return (
    <div className="block rounded-lg p-2 shadow-xs shadow-black border border-1  font-montserrat text-secondary bg-accent lg:flex lg:gap-8">
      <div className="relative">
     <Link href={`/en/booking/${id}`}>
     <img
          alt="Property"
          src={imageUrl}
          className="h-80 lg:h-80 w-full lg:w-96  rounded-md object-cover"
        />
     </Link>
      </div>

      <div className="mt-2 flex flex-col gap-1">   
     <div className="flex justify-between mb-1 ">
  <p className="text-sm bg-background rounded-xl font-medium py-1 px-2 w-fit flex gap-1 capitalize items-center"><SlLocationPin size={16}/> {location}</p>


  <p className="underline my-2 text-white cursor-pointer flex gap-1 capitalize items-center hover:text-secondary" onClick={()=>router.push(`/en/account/receipt-validation?q=${id}&ctg=${category}`)}><GoPencil size={18}/> Add Review</p>
</div>
        <div>
          <dd className="font-medium font-playfair text-white">{AllUsers.find((user) => user.id === owner_user)?.full_name}</dd>
        </div>  
<hr className='my-1.5 text-secondary'/>
<div className='text-sm text-gray-50 space-y-2'>
  <p><span className='font-bold'>Booking ID: </span>{id}</p>
  <p><span className='font-bold'>Service Booked: </span>{name}</p>
  {category == "Hotel"?  <p><span className='font-bold'>Check-In Date: </span>{moment(check_in_date).format("YYYY-MM-DD")} </p>: "" }
  {category == "Hotel"?<p><span className='font-bold'>Check-Out Date: </span>{moment(check_out_date).format("YYYY-MM-DD")}</p>: "" }
  {category == "Restaurant"?  <p><span className='font-bold'>Check-In Date: </span>{moment(restaurat_check_in_date).format("YYYY-MM-DD")}</p>: "" }
  {category == "Restaurant"?<p><span className='font-bold'>Check-In Time: </span> {restaurat_check_in_time}</p>: "" }
  <p><span className='font-bold'>Total Price: </span>${price} (incl. taxes & fees)</p>
  <p><span className='font-bold'>Payment Method: </span>{payment_method} </p>
  <p><span className='font-bold'>Status: </span>{status}</p>
</div>      
<PrivacyDialog text={cancellation_policy}/>
      </div>
    </div>
  );
};
export default function TripsCards() {

  const {AllBookings} = useFetchAllBookings()
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [currentCategory, setCurrentCategory] = useState("Hotel");
  const toggle = AllBookings.filter(r => r.category === currentCategory)
  const totalPages = Math.ceil(toggle?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = toggle?.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrevious = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  return (
    <div className="flex flex-col gap-4 mx-2 custom:mx-6 mt-6">

      <div className='grid grid-cols-1 sm:grid-cols-2  gap-4'>
 <div className='h-16 border border-1 rounded-xl shaddow-sm bg-accent flex justify-around items-center text-white' onClick={()=>setCurrentCategory("Hotel")}>
  <div className='flex gap-4 items-center cursor-pointer'>
  <LiaHotelSolid size={22}/>
       <h1 className="text-xl font-playfair font-semibold">
        Hotels
      </h1></div>
      <FaChevronRight size={18}/>
     </div>
 <div className='h-16 border border-1 rounded-xl shaddow-sm bg-background flex justify-around items-center text-secondary' onClick={()=>setCurrentCategory("Restaurant")}>
  <div className='flex gap-4 items-center cursor-pointer'>
  <IoRestaurantOutline size={22}/>
       <h1 className="text-xl font-playfair font-semibold">
        Restaurants
      </h1></div>
      <FaChevronRight size={18}/>
     </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2  gap-5 ">
        {currentItems.map((res, index) => (
          <div key={index}>
            <PropertyCard
              id={res.id} // Use restaurant ID or fallback
              location={res.location}
              price={res.total_price}
              name={res.name}
              status={res.status}
              imageUrl={`${process.env.NEXT_PUBLIC_IMAGE}/${res.image}`}
              created_at={res.created_at}
              check_in_date={res.check_in_date}
              check_out_date={res.check_out_date}
              total_guests={res.total_guests}
              room_quantity={res.room_quantity}
              payment_method={res.payment_method}
              category={res.category}
              restaurat_check_in_date={res.restaurat_check_in_date}
              restaurat_check_in_time={res.restaurat_check_in_time}
              cancellation_policy={res.cancellation_policy}
              user_id={res.user}
              owner_user={res.user_owner}
            />
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      {toggle.length > itemsPerPage && (
        <div className="flex justify-end items-center gap-1 flex-wrap">
          <button disabled={currentPage === 1} onClick={handlePrevious} className="text-background hover:text-accent flex items-center ">
            <FaCircleChevronRight size={40} className="rotate-180 "/>
          </button>

          <button disabled={currentPage === totalPages} onClick={handleNext} className="text-background hover:text-accent flex items-center">
            <FaCircleChevronRight size={40}/>
          </button>
        </div>
      )}
    </div>
  )
}




/**
 * 
 *  <div className='h-16 border border-1 rounded-xl shaddow-sm bg-background flex justify-around items-center text-secondary'>
  <div className='flex gap-4 items-center'>
  <TbMapPinCancel size={20}/>
       <h1 className="text-xl font-playfair font-semibold">
        Canceled
      </h1></div>
      <FaChevronRight size={18}/>
     </div>





      <div className='h-16 border border-1 rounded-xl shaddow-sm bg-background flex justify-around items-center text-secondary'>
  <div className='flex gap-4 items-center'>
  <MdOutlineRateReview size={20}/>
       <h1 className="text-xl font-playfair font-semibold">
        Reviewd
      </h1></div>
      <FaChevronRight size={18}/>
     </div>











     <p><span className='font-bold'>Time of Arrival:</span> 3:00 PM</p>

 */