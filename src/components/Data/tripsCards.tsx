'use client'

import { Restaurants } from '@/components/Data/restaurants';
import { useState, useEffect, useRef } from "react";
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
import Image from 'next/image';
import { RiCloseLargeLine } from "react-icons/ri";
import { MdOutlineFreeCancellation } from "react-icons/md";
import { LuCalendarCheck } from "react-icons/lu";
import { MdCalendarMonth } from "react-icons/md";
import { FaRegCalendar } from "react-icons/fa";
import { Search } from 'lucide-react';
import { useSession } from 'next-auth/react';


interface PropertyCardProps {
  id: string | number | any;
  price: string | number;
  imageUrl: string;
  receipt: string;
  location: string;
  name: string;
  created_at: string;
  check_in_date: string;
  check_out_date: string;
  total_guests: string;
  room_quantity: string;
  payment_method: string;
  category: string;
  restaurat_check_in_date: string;
  restaurat_check_in_time: string;
  cancellation_policy: string;
  status: string;
  productID: string | number;
  user_id: string | number;
  owner_user: string | number;
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
  receipt,
  user_id,
  owner_user,
  productID
}) => {
  const roundFirstDecimalDigit = (num: number) => {
    const intPart = Math.floor(num);
    const decimal = num - intPart;
    const shifted = decimal * 10;
    const roundedFirst = Math.round(shifted);
    return intPart + roundedFirst / 10;
  }

  const { AllUsers, isLoading } = useFetchAllUser();
  const router = useRouter();
  const { AllBookings, mutate } = useFetchAllBookings();

  const [isOpendelete, setIsOpenDelete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);



  const [isOpenConfirm, setIsOpenConfirm] = useState(false);




  const handleConfirm = () => {
    setIsOpenConfirm(true);
  };


  const handleDelete = () => {
    setIsOpenDelete(true);
  };



  const handleConfirmRequest = async () => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}orderid/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "confirmed" }),
      });

      if (!response.ok) {
        throw new Error(`Failed to cancel reservation: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Show success message
     // setSuccessMessage("Reservation successfully canceled!");
      
      // Trigger SWR revalidation to refresh the data
      if (mutate) {
        await mutate();
      }
      
      // Close the dialog after a short delay
      setTimeout(() => {
        setIsOpenDelete(false);
        setIsSaving(false);
      }, 1500);
      
    } catch (err) {
      setError("An error occurred while canceling the reservation");
      setIsSaving(false);
    }
  };



  const handleDeleteConfirm = async () => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}orderid/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "cancelled" }),
      });

      if (!response.ok) {
        throw new Error(`Failed to cancel reservation: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Show success message
     // setSuccessMessage("Reservation successfully canceled!");
      
      // Trigger SWR revalidation to refresh the data
      if (mutate) {
        await mutate();
      }
      
      // Close the dialog after a short delay
      setTimeout(() => {
        setIsOpenDelete(false);
        setIsSaving(false);
      }, 1500);
      
    } catch (err) {
      setError("An error occurred while canceling the reservation");
      setIsSaving(false);
    }
  };

  const handleCloseDialog = () => {
    if (!isSaving) {
      setIsOpenDelete(false);
      setError(null);
      setSuccessMessage(null);
      setIsOpenConfirm(false);
    }
  };

  return (
    <div className="block rounded-lg p-2 shadow-xs shadow-black border border-1  font-montserrat text-secondary bg-accent lg:flex lg:gap-8">
      <div className="relative w-full">
        <Link href={`/en/booking/${productID}`}>
          <Image
            alt="Property"
            src={imageUrl}
            width={400}
            height={320}
            className="h-80 lg:h-80 w-full lg:w-96  rounded-md object-cover"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaUMk9SQ2Tv6JauWg==="
          />
        </Link>
      </div>

      <div className="mt-2 flex flex-col gap-1 w-full">
        <div className="flex justify-between mb-1 ">
          <p className="text-sm bg-background rounded-xl font-medium py-1 px-2 w-fit flex gap-1 capitalize items-center">
            <SlLocationPin size={16} /> {location}
          </p>
          <p 
            className="underline my-2 text-white cursor-pointer flex gap-1 capitalize items-center hover:text-secondary"
            onClick={() => router.push(`/en/account/receipt-validation?q=${productID}&ctg=${category}&im=${receipt}`)}
          >
            <GoPencil size={18} /> Add Review
          </p>
        </div>
        <div>
          <dd className="font-medium font-playfair text-white">
            {AllUsers.find((user) => user.id === owner_user)?.full_name}
          </dd>
        </div>
        <hr className='my-1.5 text-secondary' />
        <div className='text-sm text-gray-50 space-y-2'>
          <p><span className='font-bold'>Booking ID: </span>{id}</p>
          <p><span className='font-bold'>Service Booked: </span>{name}</p>
          {category == "Hotel" ? <p><span className='font-bold'>Check-In Date: </span>{moment(check_in_date).format("YYYY-MM-DD")} </p> : ""}
          {category == "Hotel" ? <p><span className='font-bold'>Check-Out Date: </span>{moment(check_out_date).format("YYYY-MM-DD")}</p> : ""}
          {category == "Restaurant" ? <p><span className='font-bold'>Check-In Date: </span>{moment(restaurat_check_in_date).format("YYYY-MM-DD")}</p> : ""}
          {category == "Restaurant" ? <p><span className='font-bold'>Check-In Time: </span> {restaurat_check_in_time}</p> : ""}
          <p><span className='font-bold'>Total Price: </span>${price} (incl. taxes & fees)</p>
          <p><span className='font-bold'>Payment Method: </span>{payment_method} </p>

          <p className='font-bold'>Status: 
            {
              status == "Confirmed" ? <span className='text-a'>{status}</span> : (status == " Pending" ?  <span className='text-white'> {status}</span> : (status == "Completed"?  <span className='text-white'> {status}</span> :  <span className='text-secondary'> {status}</span> ))
            }
           
            
            </p>
        </div>
        <PrivacyDialog text={cancellation_policy} />
        <div className='flex justify-between'>
            {status == "pending" ? 
          <p className='flex gap-1 justify-end text-white underline hover:text-secondary cursor-pointer capitalize items-center' onClick={handleConfirm}>
            Confirm <LuCalendarCheck size={18}/>
          </p>: <p></p>}
            {status !== "canceled" && (
          <p className='flex gap-1 justify-end text-white underline hover:text-secondary cursor-pointer capitalize items-center' onClick={handleDelete}>
            Cancel <MdOutlineFreeCancellation size={18}/>
          </p>
        )}

        </div>
      
      </div>



      {/* Confirm Dialog */}
      {isOpenConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-highlights rounded-lg shadow-lg p-6 max-w-lg w-full relative space-y-4">
            {/* Close Button */}
            <RiCloseLargeLine
              size={24}
              className="absolute top-2 right-2 text-white hover:text-gray-300 cursor-pointer"
              onClick={handleCloseDialog}
            />

            {/* Content */}
            <h1 className="text-xl font-semibold font-playfair text-white">
             Confirm Reservation
            </h1>
            <p className='text-sm text-white'>Are you sure you want to Confirm this reservation? This action cannot be undone.</p>

            {successMessage && (
              <div className="mt-4 p-2 bg-green-100 text-green-700 rounded text-sm">
                {successMessage}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-3 py-1 border border-gray-300  hover:bg-accent transition-colors disabled:opacity-50 rounded-lg text-white"
                onClick={handleCloseDialog}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 bg-secondary text-white  hover:bg-accent transition-colors disabled:bg-accent disabled:cursor-not-allowed rounded-lg"
                onClick={handleConfirmRequest}
                disabled={isSaving || status === "confirmed"}
              >
                {isSaving ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Confirming...
                  </span>
                ) : 'Confirm'}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-2 bg-red-100 text-red-700 rounded text-sm">
                {error}
              </div>
            )}
          </div>
        </div>
      )}







      {/* Delete Dialog */}
      {isOpendelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-highlights rounded-lg shadow-lg p-6 max-w-lg w-full relative space-y-4">
            {/* Close Button */}
            <RiCloseLargeLine
              size={24}
              className="absolute top-2 right-2 text-white hover:text-gray-300 cursor-pointer"
              onClick={handleCloseDialog}
            />

            {/* Content */}
            <h1 className="text-xl font-semibold font-playfair text-white">
              Cancel Reservation
            </h1>
            <p className='text-sm text-white'>Are you sure you want to cancel this reservation? This action cannot be undone.</p>

            {successMessage && (
              <div className="mt-4 p-2 bg-green-100 text-green-700 rounded text-sm">
                {successMessage}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-3 py-1 border border-gray-300  hover:bg-accent transition-colors disabled:opacity-50 rounded-lg text-white"
                onClick={handleCloseDialog}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 bg-secondary text-white  hover:bg-accent transition-colors disabled:bg-accent disabled:cursor-not-allowed rounded-lg"
                onClick={handleDeleteConfirm}
                disabled={isSaving || status === "canceled"}
              >
                {isSaving ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Canceling...
                  </span>
                ) : 'Confirm Cancel'}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-2 bg-red-100 text-red-700 rounded text-sm">
                {error}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function TripsCards() {
  const { AllBookings, mutate } = useFetchAllBookings();
  const [currentPage, setCurrentPage] = useState(1);
    const { data: session, status } = useSession({ required: true });
    const userId = session?.user?.id;
 const user = AllBookings.filter(r => r.id === userId);

  const itemsPerPage = 8;
  const [currentCategory, setCurrentCategory] = useState("confirmed");
  const toggle = user.filter(r => r.status === currentCategory);

  const totalPages = Math.ceil(toggle?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = toggle?.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrevious = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  return (
    <div className="flex flex-col gap-4 mx-2 custom:mx-6 mt-6">
        <h1 className="text-2xl font-semibold font-playfair">
        Reservation Overview
      </h1>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        <div className='h-16 border border-1 rounded-xl shaddow-sm bg-accent hover:bg-a flex justify-around items-center text-white' onClick={() => setCurrentCategory("confirmed")}>
          <div className='flex gap-4 items-center cursor-pointer'>
            <LuCalendarCheck size={22} />
            <h1 className="text-xl font-playfair font-semibold">Confirmed</h1>
          </div>
          <FaChevronRight size={18} />
        </div>
                <div className='h-16 border border-1 rounded-xl shaddow-sm bg-highlights hover:bg-a flex justify-around items-center text-white' onClick={() => setCurrentCategory("pending")}>
          <div className='flex gap-4 items-center cursor-pointer'>
            <FaRegCalendar size={22} />
            <h1 className="text-xl font-playfair font-semibold">Pending</h1>
          </div>
          <FaChevronRight size={18} />
        </div>
                <div className='h-16 border border-1 rounded-xl shaddow-sm bg-background hover:bg-a flex justify-around items-center text-white' onClick={() => setCurrentCategory("completed")}>
          <div className='flex gap-4 items-center cursor-pointer'>
            <MdCalendarMonth size={22} />
            <h1 className="text-xl font-playfair font-semibold">Completed</h1>
          </div>
          <FaChevronRight size={18} />
        </div>
        <div className='h-16 border border-1 rounded-xl shaddow-sm bg-secondary hover:bg-a flex justify-around items-center text-white' onClick={() => setCurrentCategory("cancelled")}>
          <div className='flex gap-4 items-center cursor-pointer'>
            <MdOutlineFreeCancellation size={22} />
            <h1 className="text-xl font-playfair font-semibold">Cancelled</h1>
          </div>
          <FaChevronRight size={18} />
        </div>
      </div>


      {toggle.length == 0 ?
  <div className="flex items-center justify-center h-[700px]  bg-gray-50">
              <div className="text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2 font-playfair">No Reservation yet—let's change that</h3>
                <p className="text-gray-500">Start by booking your first reservation today and keep track of all your upcoming plans in one place.</p>
                <Link href="/en/booking">
                 <button className='py-2 bg-accent text-white px-4 rounded-3xl hover:bg-secondary mt-8'>
                  Find Good Place
                </button>
                </Link>
               
              </div>
            </div>:
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 ">
        {currentItems.map((res, index) => (
          <div key={index}>
            <PropertyCard
              id={res.id}
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
              receipt={res.receipt}
              category={res.category}
              restaurat_check_in_date={res.restaurat_check_in_date}
              restaurat_check_in_time={res.restaurat_check_in_time}
              cancellation_policy={res.cancellation_policy}
              user_id={res.user}
              owner_user={res.user_owner}
              productID={res.product}
            />
          </div>
        ))}
      </div>}

      {/* Pagination */}
      {toggle.length > itemsPerPage && (
        <div className="flex justify-end items-center gap-1 flex-wrap">
          <button disabled={currentPage === 1} onClick={handlePrevious} className="text-background hover:text-accent flex items-center ">
            <FaCircleChevronRight size={40} className="rotate-180 " />
          </button>

          <button disabled={currentPage === totalPages} onClick={handleNext} className="text-background hover:text-accent flex items-center">
            <FaCircleChevronRight size={40} />
          </button>
        </div>
      )}
    </div>
  );
}