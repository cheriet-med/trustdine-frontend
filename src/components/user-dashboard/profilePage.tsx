'use client'

import React from 'react';
import VerifiedBadge from '@/components/verified';

import { IoFastFoodOutline } from "react-icons/io5";
import { MdOutlinePhotoCamera } from "react-icons/md";
import { LiaHikingSolid } from "react-icons/lia";
import { LuCookingPot } from "react-icons/lu";
import { IoBarbellOutline } from "react-icons/io5";
import { VscCoffee } from "react-icons/vsc";
import { MdOutlineTravelExplore } from "react-icons/md";
import { IoLanguage } from "react-icons/io5";
import { CiLocationOn } from "react-icons/ci";
import { MdAccessTime } from "react-icons/md";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { MdOutlinePets } from "react-icons/md";
import { Star } from "lucide-react";
import { TbHistoryToggle } from "react-icons/tb";
import { FaRegQuestionCircle } from "react-icons/fa";
import { GoPencil } from "react-icons/go";
import { MdOutlineRateReview } from "react-icons/md";
import Link from 'next/link';


import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => <div className="h-64 flex items-center justify-center">
  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-backgound"></div>
</div>
});

const ProfileCard: React.FC = () => {
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
<div className="mx-2 lg:mx-24 my-8 grid  grid-cols-1 md:grid-cols-2 gap-6 font-montserrat"> 
    <div className='border border-1 rounded-2xl p-6 shadow-sm bg-white relative'>
      <div className="absolute right-4 top-4 border border-1 px-3 py-0.5 rounded-3xl border-secondary shadow-sm text-sm flex gap-1">
 <GoPencil size={18}/>
        <p >
    Edit
  </p> 
      </div>
     

      {/* Profile */}

      <div className="flex items-center gap-8 flex-wrap">
        <div className="shrink-0">
          <img
            className="shrink-0 size-48 rounded-full"
            src="/ex.avif"
            alt="Avatar"
          />
        </div>

        <div className="grow">
            <div className='flex gap-2 flex-wrap'>
                 <h1 className="text-lg font-medium text-gray-800 dark:text-neutral-200 font-playfair">
            Eliana Garcia
          </h1>
          <VerifiedBadge text='Identity verified'/>
          
            </div>
         
          <p className="text-sm text-gray-600 dark:text-neutral-400">
            Graphic Designer, Web designer/developer
          </p>
           <a
              className="text-sm text-gray-500  hover:text-gray-800 hover:decoration-2 focus:outline-hidden focus:decoration-2 dark:text-neutral-500 dark:hover:text-neutral-400"
              href="#"
            >
             Joined in Jun 2018
            </a>
        </div>
      </div>
      {/* End Profile */}

      {/* About */}
     
       <hr className='mt-8'/>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-2">
             <div className="flex items-center gap-x-2.5 text-gray-500">
            <MdOutlineTravelExplore size={24}/>
                        <a
              className="text-sm   hover:text-gray-800 hover:decoration-2 focus:outline-hidden focus:decoration-2 dark:text-neutral-500 dark:hover:text-neutral-400"
              href="#"
            >
             I've wanted to go: L'rgentine
            </a>
          </div>


  <div className="flex items-center gap-x-2.5 text-gray-500">
          <IoLanguage size={24}/>
            <a
              className="text-sm   hover:text-gray-800 hover:decoration-2 focus:outline-hidden focus:decoration-2 dark:text-neutral-500 dark:hover:text-neutral-400"
              href="#"
            >
            Speaks English and Italian
            </a>
          </div>


          <div className="flex items-center gap-x-2.5 text-gray-500">
          <CiLocationOn size={24}/>
            <a
              className="text-sm   hover:text-gray-800 hover:decoration-2 focus:outline-hidden focus:decoration-2 dark:text-neutral-500 dark:hover:text-neutral-400"
              href="#"
            >
             Lives in Lovere, Italy
            </a>
          </div>

          <div className="flex items-center gap-x-2.5 text-gray-500">
           <MdAccessTime size={24}/>
            <a
              className="text-sm   hover:text-gray-800 hover:decoration-2 focus:outline-hidden focus:decoration-2 dark:text-neutral-500 dark:hover:text-neutral-400"
              href="#"
            >
              I spend too much time: The lecture
            </a>
          </div>

          <div className="flex items-center gap-x-2.5 text-gray-500">
        <LiaBirthdayCakeSolid size={24}/>
            <a
              className="text-sm   hover:text-gray-800 hover:decoration-2 focus:outline-hidden focus:decoration-2 dark:text-neutral-500 dark:hover:text-neutral-400"
              href="#"
            >
             Born in the 80s
            </a>
          </div>
          <div className="flex items-center gap-x-2.5 text-gray-500">
        <MdOutlinePets size={24}/>
            <a
              className="text-sm   hover:text-gray-800 hover:decoration-2 focus:outline-hidden focus:decoration-2 dark:text-neutral-500 dark:hover:text-neutral-400"
              href="#"
            >
            Pets: 2 cats
            </a>
          </div>
        </div>
    
      {/* End About */}
    </div>










 <div className='border border-1 rounded-2xl p-6 shadow-sm bg-white relative'>
           <div className="absolute right-4 top-4 border border-1 px-3 py-0.5 rounded-3xl border-secondary shadow-sm text-sm flex gap-1">
 <GoPencil size={18}/>
        <p >
    Edit
  </p> 
      </div>
     <h1 className='font-medium font-playfair text-lg'>About Me</h1>

      {/* About */}
      <div className="mt-8">
        <p className="text-sm text-gray-600 dark:text-neutral-400">
          I am a seasoned graphic designer with over 14 years of experience in creating visually
          appealing and user-centric designs. My expertise spans across UI design, design systems,
          and custom illustrations, helping clients bring their digital visions to life.
        </p>

      

       
      </div>
      <hr className='mt-8'/>

      <h1 className="mt-4 mb-8 font-medium font-playfair text-lg">My interests</h1>
      <div className='flex gap-2 flex-wrap'>
        <div className='flex gap-2 items-center py-1 px-2 border border-1 border-gray-500 rounded-3xl text-gray-600 text-sm'>
            <IoFastFoodOutline size={22}/>
            <p>Foodie</p>
        </div>
       
       <div className='flex gap-2 items-center py-1 px-2 border border-1 border-gray-500 rounded-3xl text-gray-600 text-sm'>
            <LiaHikingSolid size={22}/>
            <p>Hiking</p>
        </div>

         <div className='flex gap-2 items-center py-1 px-2 border border-1 border-gray-500 rounded-3xl text-gray-600 text-sm'>
            <MdOutlinePhotoCamera size={22}/>
            <p>Photography</p>
        </div>


         <div className='flex gap-2 items-center py-1 px-2 border border-1 border-gray-500 rounded-3xl text-gray-600 text-sm'>
            <LuCookingPot size={22}/>
            <p>Cooking</p>
        </div>

         <div className='flex gap-2 items-center py-1 px-2 border border-1 border-gray-500 rounded-3xl text-gray-600 text-sm'>
            <IoBarbellOutline size={22}/>
            <p>Weight lifting</p>
        </div>
         <div className='flex gap-2 items-center py-1 px-2 border border-1 border-gray-500 rounded-3xl text-gray-600 text-sm'>
            <VscCoffee size={22}/>
            <p>Coffe</p>
        </div>
      </div>
      {/* End About */}
    </div>

















{/* Reviews */ }

 <div className='border border-1 rounded-2xl p-6 shadow-sm bg-white relative'>
    <Link href="/en/account/receipt-validation">        
  <div className="absolute right-4 top-4 border border-1 px-3 py-0.5 rounded-3xl border-secondary shadow-sm text-sm flex gap-1 hover:bg-secondary hover:text-white">
 <MdOutlineRateReview size={18}/>
    <p >
    Write Review
  </p> 
 </div>
 </Link>
     <h1 className='font-medium font-playfair mb-4 text-lg'>Reviews</h1>

       <div>
                   <div className='flex justify-between mb-8 flex-wrap'>
                   
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























{/*Score */ }


 <div className='border border-1 rounded-2xl p-6 shadow-sm bg-white'>
     
     <h1 className='font-medium font-playfair mb-8 text-lg'>Trust Score</h1>

<div className='flex sm:justify-around flex-wrap'>
     <div className='flex flex-col gap-1'>
<div className='flex gap-2 items-center'>
<div className='h-3 w-4 bg-background rounded-xl'></div>
<p className='text-gray-600 text-sm'>Clean Receipt</p>
</div>

<div className='flex gap-2 items-center'>
<div className='h-3 w-4 bg-highlights rounded-xl'></div>
<p className='text-gray-600 text-sm'>Blur Receipt</p>
</div>

<div className='flex gap-2 items-center'>
<div className='h-3 w-4 bg-accent rounded-xl'></div>
<p className='text-gray-600 text-sm'>Verified Receipt</p>
</div>


<div className='flex gap-2 items-center'>
<div className='h-3 w-4 bg-secondary rounded-xl'></div>
<p className='text-gray-600 text-sm'>Fake Receipt</p>
</div>


</div>
      <Chart
        options={options}
        series={options.series}
        type="radialBar"
        height={350}
      />

</div>

<div className='flex items-center gap-x-2.5 text-gray-500'>
  <FaRegQuestionCircle size={24}/>
  <p className='underline'>Read more about trust Score</p>
</div>

</div>

    </div>
  );
};

export default ProfileCard;