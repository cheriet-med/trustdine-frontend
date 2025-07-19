'use client'

import React, { useState } from 'react';
import { ArrowLeft, Check, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';


interface PaymentMethod {
  id: string;
  type: 'paypal' | 'mastercard' | 'visa';
  lastFour: string;
  expiry: string;
  isSelected: boolean;
}

const CheckoutPage: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'paypal',
      lastFour: '1234',
      expiry: '06/2024',
      isSelected: false,
    },
    {
      id: '2',
      type: 'mastercard',
      lastFour: '1234',
      expiry: '06/2024',
      isSelected: true,
    },
    {
      id: '3',
      type: 'visa',
      lastFour: '1234',
      expiry: '06/2024',
      isSelected: false,
    },
  ]);

  const handlePaymentMethodSelect = (id: string) => {
    setPaymentMethods(methods =>
      methods.map(method => ({
        ...method,
        isSelected: method.id === id,
      }))
    );
  };

  const getPaymentIcon = (type: 'paypal' | 'mastercard' | 'visa') => {
    const iconClass = "w-8 h-8 rounded-md flex items-center justify-center text-white font-bold text-sm";
    
    switch (type) {
      case 'paypal':
        return (
          <div className={`${iconClass} bg-blue-600`}>
            <span>P</span>
          </div>
        );
      case 'mastercard':
        return (
          <div className={`${iconClass} bg-red-500`}>
            <span>MC</span>
          </div>
        );
      case 'visa':
        return (
          <div className={`${iconClass} bg-blue-500`}>
            <span>V</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getPaymentName = (type: 'paypal' | 'mastercard' | 'visa') => {
    switch (type) {
      case 'paypal':
        return 'Paypal';
      case 'mastercard':
        return 'Mastercard';
      case 'visa':
        return 'Visa';
      default:
        return '';
    }
  };

  return (
    <div >
            <div className="h-60 sm:col-span-1 relative flex items-center bg-secondary rounded-2xl m-1 sm:m-2 md:m-5">
              <Image 
                src= "/m1.jpg"
                alt="hello"
                fill
                sizes="100vw" 
                className="z-0 object-cover rounded-2xl" 
                quality={85}  
                priority 
              />
               <div className="absolute inset-0 bg-a bg-opacity-50 rounded-2xl"></div>
              {/* Centered Content Container */}
              <div className="absolute inset-0 flex flex-col  justify-end px-6 lg:pl-16">
      
                <h1 className="text-2xl md:text-4xl font-bold font-playfair text-white mb-4">
                 Checkout
                </h1>
 
      
              </div>
            </div>
      <div className="max-w-7xl mx-auto mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section - Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <Link href="/en/id">
              <div className="flex items-center gap-1 mb-4 ">
              <button className="p-2 hover:bg-muted rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="font-medium text-gray-600 hover:underline">Confirm & pay</h1>
            </div>
            </Link>
          

            {/* Payment Method Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold font-playfair  mb-6">Payment Method</h2>
              

<div className='border border-1 shadow-sm p-6 grid grid-cols-2 gap-4 rounded-lg'>

<div className='flex gap-2 items-center text-center justify-center border border-1 rounded-lg py-6 '>
     <img
                    src="/paypal.webp"
                    alt="Place to stay"
                    className=" h-8 object-cover rounded-lg"
                  />
                  <p className='text-bold text-lg font-playfair text-gray-800'>Pay White Paypal</p>
</div>
<div className='flex gap-2 items-center text-center justify-center border border-1 rounded-lg py-6 '>
     <img
                    src="/stripe.webp"
                    alt="Place to stay"
                    className=" h-8 object-cover rounded-lg"
                  />
                  <p className='text-bold text-lg font-playfair text-gray-800'>Pay White Credit Card</p>
</div>


</div>

            
            </div>
<div className='border border-1 shadow-sm p-6  rounded-lg'>
            {/* Cancellation Policy */}
            <div className="mb-8">
              <h2 className="text-xl font-playfair font-semibold  mb-4">Cancellation policy</h2>
              <div className="space-y-2 text-gray-600">
                <p >Free cancellation before Nov 30.</p>
                <p >
                  After that, the reservation is non-refundable.{' '}
                  <button className="text-secondary underline text-semibold">Learn more</button>
                </p>
              </div>
            </div>
<hr />
            {/* Ground Rules */}
            <div>
              <h2 className="text-xl font-playfair font-semibold  my-4">Ground rules</h2>
              <p className="text-gray-600 mb-4">
                We ask every guest to remember a few simple things about what makes a great guest.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2 ">
                  <span className="w-1 h-1 bg-foreground rounded-full mt-2 flex-shrink-0"></span>
                  Follow the house rules
                </li>
                <li className="flex items-start gap-2 ">
                  <span className="w-1 h-1 bg-foreground rounded-full mt-2 flex-shrink-0"></span>
                  Treat your Host's home like your own
                </li>
              </ul>
            </div>
          </div>
</div>


          {/* Right Section - Trip Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-8 shadow-sm font-montserrat">
              {/* Property Image and Details */}
              <div className="mb-2">
                <div className="relative mb-4">
                  <img
                    src="/assets/image-9.avif"
                    alt="Place to stay"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-md">
                    <p className="text-sm font-medium">Place to stay</p>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-md">
                    <p className="text-sm">Toronto, Canada</p>
                  </div>
                </div>
               
              </div>

              {/* Trip Summary */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold  mb-4 font-playfair">Your Trip Summary</h3>
                
                <div className="space-y-3 text-sm font-medium text-gray-600">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Check-In</span>
                    <span className=" font-medium">Fri, Dec 01</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Check-Out</span>
                    <span className=" font-medium">Tue, Dec 05</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Guests</span>
                    <span className=" font-medium">04</span>
                  </div>
                </div>
              </div>
<hr className='my-2'/>
              {/* Pricing Breakdown */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold  mb-4 font-playfair">Pricing Breakdown</h3>
                
                <div className="space-y-3 text-sm font-medium text-gray-600">
                  <div className="flex justify-between ">
                    <span className="text-muted-foreground">$30 X 1 night</span>
                    <span className="">$30</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cleaning Fee</span>
                    <span className="">$10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Trustdine Service Fee</span>
                    <span className="">$5</span>
                  </div>
                  
                  
                </div>
                <hr className='my-4'/>
                <div>
                    <div className="flex justify-between font-semibold">
                      <span className=" font-playfair">Total before taxes</span>
                      <span className="">$45</span>
                    </div>
                  </div>
              </div>
                <div>
                    <div className="flex justify-between font-semibold">
                      <span className=" font-playfair text-xl">Total</span>
                      <span className="">$185</span>
                    </div>
                  </div>
             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;


/** 
              <button className="w-full bg-secondary text-white font-semibold py-4 rounded-lg hover:bg-accent transition-colors">
                Confirm & pay $185
              </button> */