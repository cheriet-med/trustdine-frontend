'use client'

import React, { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { RiSecurePaymentFill } from "react-icons/ri";
import { TbCalendarCancel } from "react-icons/tb";
import { GiBarbedStar } from "react-icons/gi";
import { SiTrustpilot } from "react-icons/si";
import useFetchAllBookings from '@/components/requests/fetchAllBookings';
import moment from 'moment';

interface PaymentMethod {
  id: string;
  type: 'paypal' | 'mastercard' | 'visa';
  lastFour: string;
  expiry: string;
  isSelected: boolean;
}

// Skeleton component
const SkeletonBox = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);

const CheckoutPage: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: '1', type: 'paypal', lastFour: '1234', expiry: '06/2024', isSelected: false },
    { id: '2', type: 'mastercard', lastFour: '1234', expiry: '06/2024', isSelected: true },
    { id: '3', type: 'visa', lastFour: '1234', expiry: '06/2024', isSelected: false },
  ]);
  const [error, setError] = useState(false)
  const router = useRouter();
  const searchParams = useSearchParams();
  const nb = searchParams.get('nb');

  const { AllBookings, isLoading } = useFetchAllBookings(); // <-- assume hook provides isLoading
 const [isSaving, setIsSaving] = useState(false);
  const selectedBooking = useMemo(() => {
    if (!nb || !AllBookings) return null;
    return AllBookings.find((b: any) => String(b.id) === nb);
  }, [nb, AllBookings]);

  const handleConfirm = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}orderid/${nb}`, {
        method: "PUT",
        headers: {
          "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "confirmed" }),
      });

      if (!response.ok) throw new Error(`Failed: ${response.statusText}`);

      await response.json();
      router.push("/en/account/trips");
    } catch (err) {
      setError(true)
    }
  };

  const handlePaymentMethodSelect = (id: string) => {
    setPaymentMethods(methods =>
      methods.map(method => ({
        ...method,
        isSelected: method.id === id,
      }))
    );
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="h-60 relative flex items-center bg-secondary rounded-2xl m-1 sm:m-2 md:m-5">
        <Image 
          src="/m1.jpg"
          alt="hello"
          fill
          sizes="100vw" 
          className="z-0 object-cover rounded-2xl" 
          quality={85}  
          priority 
        />
        <div className="absolute inset-0 bg-a bg-opacity-50 rounded-2xl"></div>
        <div className="absolute inset-0 flex flex-col justify-end px-6 lg:pl-16">
          <h1 className="text-2xl md:text-4xl font-bold font-playfair text-white mb-4">
            Checkout
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mb-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section */}
        <div className="lg:col-span-2">
          {/* Back Button */}
          <Link href={`/en/booking/${nb}`}>
            <div className="flex items-center gap-1 mb-4">
              <button className="p-2 hover:bg-muted rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="font-medium text-gray-600 hover:underline">Listing Details</h1>
            </div>
          </Link>

          {/* Payment Method Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold font-playfair mb-6">Payment Method</h2>
            <div className="border border-1 shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg">
              <div className="flex gap-2 items-center justify-center border rounded-lg py-6">
                <img src="/dollars.png" alt="Paypal" className="h-12 object-cover rounded-lg" />
                <p className="font-bold text-lg font-playfair text-gray-800">Pay with Cash</p>
              </div>
              <div className="flex gap-2 items-center justify-center border rounded-lg py-6">
                <img src="/stripe.webp" alt="Stripe" className="h-8 object-cover rounded-lg" />
                <p className="font-bold text-lg font-playfair text-gray-800">Pay with Credit Card</p>
              </div>
            </div>

            <div className="items-center flex justify-around py-4 mt-2 border rounded-xl shadow-sm flex-wrap gap-2">
              <div className="flex gap-1 items-center text-secondary">
                <RiSecurePaymentFill size={32}/>
                <p>Safe & Secure Checkout</p>
              </div>
              <div className="flex gap-1 items-center text-secondary">
                <TbCalendarCancel size={32}/>
                <p>Risk-Free Cancellation</p>
              </div>
              <div className="flex gap-1 items-center text-secondary">
                <SiTrustpilot size={32}/>
                <p>Trusted by Thousands of Travelers</p>
              </div>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="border border-1 shadow-sm p-6 rounded-lg mb-2">
            <h2 className="text-xl font-playfair font-semibold mb-4">Cancellation policy</h2>
            {isLoading ? (
              <SkeletonBox className="h-20 w-full" />
            ) : (
              <div 
                className="text-gray-500 leading-relaxed prose-inherit"
                dangerouslySetInnerHTML={{ __html: selectedBooking?.cancellation_policy || '' }}
              />
            )}

            <hr className="my-4"/>
            <h2 className="text-xl font-playfair font-semibold mb-4">Guest Guidelines</h2>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <GiBarbedStar size={18}/> Follow the host’s house rules respectfully
              </li>
              <li className="flex items-center gap-2">
                <GiBarbedStar size={18}/> Leave the space as you found it
              </li>
            </ul>
          </div>
        </div>

        {/* Right Section - Trip Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card border rounded-xl p-6 sticky top-8 shadow-sm font-montserrat">
            {isLoading ? (
              <div className="space-y-4">
                <SkeletonBox className="h-48 w-full" />
                <SkeletonBox className="h-6 w-2/3" />
                <SkeletonBox className="h-4 w-1/2" />
                <SkeletonBox className="h-4 w-1/3" />
                <SkeletonBox className="h-10 w-full mt-4" />
              </div>
            ) : selectedBooking ? (
              <>
                {/* Property Image */}
                <div className="mb-4 relative">
                  <img
                    src={`${process.env.NEXT_PUBLIC_IMAGE}/${selectedBooking.image}`}
                    alt={selectedBooking.name || "Place to stay"}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-md">
                    <p className="text-sm font-medium">{selectedBooking.name}</p>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-md">
                    <p className="text-sm">{selectedBooking.location}</p>
                  </div>
                </div>

             

   {/* Trip Summary */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 font-playfair">Your Trip Summary</h3>
                  <div className="space-y-3 text-sm font-medium text-gray-600">
                    {selectedBooking.check_in_date && ( 
                      <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-In</span>
                      <span>{moment(selectedBooking.check_in_date).format('MMMM Do YYYY')}</span>
                    </div>)}
                   {selectedBooking.check_out_date && ( 
                      <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-Out</span>
                      <span>{moment(selectedBooking.check_out_date).format('MMMM Do YYYY')}</span>
                    </div>)}
                   
                    {selectedBooking.restaurat_check_in_date && ( 
                      <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-In</span>
                      <span>{moment(selectedBooking.restaurat_check_in_date).format('MMMM Do YYYY')}</span>
                    </div>)}

                   {selectedBooking.restaurat_check_in_time && ( 
                      <div className="flex justify-between">
                      <span className="text-muted-foreground">Arrival Time</span>
                      <span>{selectedBooking.restaurat_check_in_time}</span>
                    </div>)}

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Guests</span>
                    <span>{selectedBooking.total_guests}</span>
                    </div>
                  </div>
                </div>


                {/* Pricing Breakdown */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 font-playfair">Pricing Breakdown</h3>
                  <div className="space-y-3 text-sm font-medium text-gray-600">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {selectedBooking.category == "Restaurant" ? "Average Price": "Total Price"}
                      </span>
                      <span>${selectedBooking.total_price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cleaning Fee</span>
                      <span>$0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service Fee</span>
                      <span>${selectedBooking.service_fee || 0}</span>
                    </div>
                  </div>
                  <hr className="my-4"/>
                  <div className="flex justify-between font-semibold">
                    <span className="font-playfair">Total</span>
                    <span>${selectedBooking.total_price}</span>
                  </div>
                  <button
                    className="w-full bg-secondary hover:bg-accent text-white font-medium py-2 rounded-3xl mt-6"
                    onClick={handleConfirm}
                  >
                     {isSaving ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Confirming...
                  </span>
                ) : ' Confirm Reservation '}
                   
                  </button>
                  {error && <p className='text-accent mt-2'>Something went wrong, please try again</p>}
                </div>
              </>
            ) : (
              <p className="text-gray-500">No booking found for id: {nb}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
