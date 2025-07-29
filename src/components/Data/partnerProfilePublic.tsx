'use client'

import React from 'react';
import VerifiedBadge from '@/components/verified';
import { MdOutlineTravelExplore } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { Star } from "lucide-react";
import { TbHistoryToggle } from "react-icons/tb";
import { GoPencil } from "react-icons/go";
import { CiPhone } from "react-icons/ci";
import { MdAlternateEmail } from "react-icons/md";
import { LuMessageCircleMore } from "react-icons/lu";

import {
  Hotel,
  Utensils,
  Wine,
  Briefcase,
  ConciergeBell,
  Bus,
  PawPrint
} from 'lucide-react';

import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => <div className="h-64 flex items-center justify-center">
  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-backgound"></div>
</div>
});

const PartnerProfilePublic: React.FC = () => {
 const options: ApexOptions = {
    chart: {
      height: 350,
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: '14px',
          },
          value: {
            fontSize: '16px',
            formatter: function (val) {
              return val + '%';
            }
          },
          total: {
            show: true,
            label: 'TOTAL',
            formatter: function (w) {
              // Calculate average of all series
              const sum = w.globals.series.reduce((a: number, b: number) => a + b, 0);
              const avg = sum / w.globals.series.length;
              return Math.round(avg) + '%';
            }
          }
        }
      }
    },
    series: [67, 84, 97, 61],
    labels: ['Clean Receipt', 'Blur Receipt', 'Verified Receipt', 'Fake Receipt'],
    colors: ['#9ED0E6', '#B796AC', '#82A7A6', '#785964'], // Custom colors for each bar
    stroke: {
      lineCap: 'round'
    }
  };


  return (
    <>

<div className="mx-2 lg:mx-24 my-8 grid  grid-cols-1 md:grid-cols-2 gap-6 font-montserrat"> 
  <div>
    <div className='border border-1 rounded-2xl p-6 shadow-sm bg-white relative'>

     

      {/* Profile */}

      <div className="flex items-center gap-8 flex-wrap">
        <div className="shrink-0">
          <img
            className="shrink-0 size-48 rounded-full"
            src="/h.jpg"
            alt="Avatar"
          />
        </div>

        <div className="grow">
            <div className='flex gap-2 flex-wrap'>
                 <h1 className="text-lg font-medium text-gray-800 dark:text-neutral-200 font-playfair">
            Whispering Pines Resort
          </h1>
          <VerifiedBadge text='Verified'/>
          
            </div>
         
          <p className="text-sm text-gray-600 dark:text-neutral-400">
           Hotel and Spa
          </p>
           <a
              className="text-sm text-gray-500  hover:text-gray-800 hover:decoration-2 focus:outline-hidden focus:decoration-2 dark:text-neutral-500 dark:hover:text-neutral-400"
              href="#"
            >
             Joined in Jun 2018
            </a>
       
                          <div className=" border border-1 px-5 py-3 w-48 rounded-3xl border-gray-500 shadow-sm text-sm flex gap-1 mt-4 justify-center">
         <LuMessageCircleMore size={18}/>
                <p >
            Send Message
          </p> 
              </div> </div>
      </div>
      {/* End Profile */}

      {/* About */}
     
       <hr className='mt-8'/>

        <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-2">
             <div className="flex items-center gap-x-2.5 text-gray-500">
            <CiLocationOn size={24}/>
                        <a
              className="text-sm   hover:text-gray-800 hover:decoration-2 focus:outline-hidden focus:decoration-2 dark:text-neutral-500 dark:hover:text-neutral-400"
              href="#"
            >
             Location: 123 Luxury Avenue, Downtown, Metropolis
            </a>
          </div>


  <div className="flex items-center gap-x-2.5 text-gray-500">
          <CiPhone size={24}/>
            <a
              className="text-sm   hover:text-gray-800 hover:decoration-2 focus:outline-hidden focus:decoration-2 dark:text-neutral-500 dark:hover:text-neutral-400"
              href="#"
            >
            Phone: +1 (555) 123-4567
            </a>
          </div>


          <div className="flex items-center gap-x-2.5 text-gray-500">
         
           <MdOutlineTravelExplore size={24}/>
            <a
              className="text-sm   hover:text-gray-800 hover:decoration-2 focus:outline-hidden focus:decoration-2 dark:text-neutral-500 dark:hover:text-neutral-400"
              href="#"
            >
             Website: www.hotelgrandluxe.com
            </a>
          </div>

          <div className="flex items-center gap-x-2.5 text-gray-500">
           <MdAlternateEmail size={24}/>
            <a
              className="text-sm   hover:text-gray-800 hover:decoration-2 focus:outline-hidden focus:decoration-2 dark:text-neutral-500 dark:hover:text-neutral-400"
              href="#"
            >
              Email: reservations@hotel.com
            </a>
          </div>

        
        </div>
    
      {/* End About */}
    </div>





{/* Reviews */ }

 <div className='border border-1 rounded-2xl p-6 shadow-sm bg-white relative mt-4'>

     <h1 className='font-medium font-playfair mb-4 text-lg'>Reviews</h1>

       <div>
                   <div className='flex justify-between mb-4 flex-wrap'>
                   
                     <div className="flex items-center gap-2 flex-wrap">
                       <span className="text-2xl font-bold text-gray-900">4.2</span>
                       <div className="flex">
                         {[...Array(4)].map((_, i) => (
                           <Star key={i} className="w-4 h-4 fill-background text-background" />
                         ))}
                         <Star className="w-4 h-4 text-background" />
                       </div>
                       <span className="text-background font-medium">Good</span>
                       <span className="text-sm text-gray-500">(17 reviews)</span>
                     </div>
                      <div className="text-sm text-gray-500 mb-4 px-2 py-1 border border-1 bg-secondary text-white rounded-3xl font-bold w-fit mt-2">Top #59 Reviewer</div>
                   </div>
                   <div>
                     <div className="space-y-4">
                      
                       
                       <div className="grid gap-3 md:w-[400px]">
                         {[
                           { label: "Location", score: 4.8, color: "bg-background" },
                           { label: "Rooms", score: 4.4, color: "bg-background" },
                           { label: "Value", score: 4.0, color: "bg-background" },
                           { label: "Cleanliness", score: 4.6, color: "bg-background" },
                           { label: "Service", score: 4.2, color: "bg-background" },
                           { label: "Sleep Quality", score: 4.5, color: "bg-background" }
                         ].map((item) => (
                           <div key={item.label} className="flex items-center gap-4">
                             <div className="w-24 md:w-28  text-sm font-medium text-gray-500">{item.label}</div>
                             <div className="flex-1 bg-gray-100 rounded-full h-3">
                               <div 
                                 className={`h-3 rounded-full ${item.color}`}
                                 style={{ width: `${(item.score / 5) * 100}%` }}
                               />
                             </div>
                             <div className="w-8 text-sm font-medium text-right">{item.score}</div>
                           </div>
                         ))}
                       </div>
                     </div>
                   </div>
                   <div className='flex gap-1 justify-center text-gray-600 mt-8'>
                     <TbHistoryToggle size={24}/>
                   <p className=' underline'>Reviews History</p>
                   </div>
                  
                 </div>
     
      {/* End About */}
    </div>

</div>



 <div className='border border-1 rounded-2xl p-6 shadow-sm bg-white relative'>
 
     <h1 className='font-medium font-playfair text-lg'>About Us</h1>

      {/* About */}
      <div className="mt-8 space-y-2">
        <p className="text-sm text-gray-600 dark:text-neutral-400">
          At Whispering Pines Resort, we believe every stay should be an unforgettable experience. Nestled in the heart of Downtown, Metropolis, our hotel combines modern elegance with warm hospitality, offering a sanctuary for both leisure and business travelers.
 </p>
 <p className="text-sm text-gray-600 dark:text-neutral-400">
From our exquisitely designed rooms and suites to our world-class dining and rejuvenating spa, every detail is crafted to ensure your utmost comfort. Whether you're here to explore the vibrant surroundings or seeking a peaceful retreat, our dedicated team is committed to making your stay exceptional.
</p>
 <p className="text-sm text-gray-600 dark:text-neutral-400">
Discover the perfect blend of sophistication, convenience, and personalized service at Whispering Pines Resort – your home away from home.
        </p>

      

       
      </div>
      <hr className='mt-8'/>

      <h1 className="mt-4 mb-8 font-medium font-playfair text-lg">Features</h1>
    <div className="flex flex-col gap-6 text-gray-700 text-sm">
  <div className="flex items-start gap-2">
    <Hotel size={20} />
    <p>
      <span className="font-medium">Luxurious Rooms & Suites</span> – Elegantly designed with modern furnishings, plush bedding, and stunning city views.
    </p>
  </div>
  <div className="flex items-start gap-2">
    <Utensils size={20} />
    <p>
      <span className="font-medium">Fine Dining Restaurants</span> – Experience gourmet cuisine at our award-winning in-house restaurants.
    </p>
  </div>
  <div className="flex items-start gap-2">
    <Wine size={20} />
    <p>
      <span className="font-medium">Rooftop Bar & Lounge</span> – Sip cocktails while enjoying panoramic cityscapes.
    </p>
  </div>
  <div className="flex items-start gap-2">
    <Wine size={20} />
    <p>
      <span className="font-medium">Spa & Wellness Center</span> – Rejuvenate with massages, facials, and a fully equipped gym.
    </p>
  </div>
  <div className="flex items-start gap-2">
    <Wine size={20} />
    <p>
      <span className="font-medium">Swimming Pool</span> – Indoor and outdoor pools with a relaxing ambiance.
    </p>
  </div>
  <div className="flex items-start gap-2">
    <Briefcase size={20} />
    <p>
      <span className="font-medium">Business Center</span> – State-of-the-art meeting rooms and high-speed Wi-Fi for corporate guests.
    </p>
  </div>
  <div className="flex items-start gap-2">
    <ConciergeBell size={20} />
    <p>
      <span className="font-medium">24/7 Concierge Service</span> – Personalized assistance for all your needs.
    </p>
  </div>
  <div className="flex items-start gap-2">
    <Bus size={20} />
    <p>
      <span className="font-medium">Free Airport Shuttle</span> – Hassle-free transfers to and from the airport.
    </p>
  </div>
  <div className="flex items-start gap-2">
    <PawPrint size={20} />
    <p>
      <span className="font-medium">Pet-Friendly</span> – Special accommodations for your furry companions.
    </p>
  </div>
</div>
      {/* End About */}
    </div>

    </div>
    </>
  );
};

export default PartnerProfilePublic;