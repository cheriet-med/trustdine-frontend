'use client'

import React, { useState, useRef } from 'react';
import VerifiedBadge from '@/components/verified';
import { MdOutlineTravelExplore } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import Image from 'next/image';
import { IoLanguage } from "react-icons/io5";
import { MdAccessTime } from "react-icons/md";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { MdOutlinePets } from "react-icons/md";
import { FaRegQuestionCircle } from "react-icons/fa";
import { LuMessageCircleMore } from "react-icons/lu";
import useFetchAmenities from '@/components/requests/fetchAmenities';
import { GoUnverified } from "react-icons/go";
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import useFetchAllReviews from '../requests/fetchAllReviews';
import StarRating from '../starsComponent';
import useFetchScores from '../requests/fetchScore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LoginButtonSendMessages from '../header/LoginButtonSendMessage';
import { useSession } from 'next-auth/react';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => <div className="h-64 flex items-center justify-center">
  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-backgound"></div>
</div>
});

import { 
  FaWifi, FaParking, FaDumbbell, FaGlassMartiniAlt, FaChild, FaTaxi, 
  FaBaby, FaCoffee, FaBath, FaSnowflake, FaDesktop, FaBroom, 
  FaTv, FaShower, FaChair, FaWheelchair, FaMusic, FaMotorcycle, 
  FaSpa, FaBriefcase, FaDog, FaTshirt, FaUtensils, 
  FaLeaf, FaSeedling, FaWineGlassAlt, FaFish, FaCocktail, FaIceCream, 
  FaEgg, FaStreetView, FaHotel, FaUmbrellaBeach, FaSkiing, FaTree, 
  FaCity, FaMonument, FaMountain, FaCamera, FaLaptop, FaPalette, 
  FaYinYang, FaRecycle, FaPaw, FaSwimmingPool, FaBicycle, FaPlane, 
  FaBook, FaGamepad, FaBowlingBall, FaCampground, FaHiking, FaCar
} from 'react-icons/fa';
import { PiElevatorFill } from "react-icons/pi";
import { FaHandsAslInterpreting } from "react-icons/fa6";

interface ProfileData {
  id?: number;
  name?: string;
  full_name?: string;
  username?: string;
  title?: string;
  category?: string;
  amenities?: string;
  email?: string;
  location?: string;
  profile_image?: string;
  identity_verified?: boolean;
  about?: any;
  website?: string;
  joined?: string;
  address_line_1?: string;
  phoneNumber?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  countryCode?: string;
  latitude?: string;
  longtitude?: string;
  // New fields added below
  want_to_go?: string;
  time_spend?: string;
  born?: string;
  pets?: string;
  obsessed?: string;
  language?: string;
}
interface PartnerProfileProps {
  idu: any; // you can replace `any` with the actual type of `userData`
}
const UserProfilePublic: React.FC<PartnerProfileProps> = ({ idu }) => {
  const [profileImage, setProfileImage] = useState("/profile.webp");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { data: session, status } = useSession();
  const userId = idu.id;
  //const { Users, isLoading, mutate } = useFetchUser(userId);
  const { Amenitie, isLoading, error: amenitiesError } = useFetchAmenities(userId);
 
 // Replace with actual userId


const {AllReview} = useFetchAllReviews()

const Review = AllReview.filter((user) => user.user === idu.id)

const averageRating = Review && Review.length > 0
  ? Review.reduce((sum, r) => sum + +r.rating_global, 0) / Review.length
  : 0;

const {Score} = useFetchScores()
const userScore = Score.filter((user) => user.user === idu.id)
function average(arr: any[], key: string, normalize = false) {
  if (arr.length === 0) return 0;
  const avg = arr.reduce((sum, r) => sum + +r[key], 0) / arr.length;
  const value = normalize ? avg / 100 : avg; // normalize if percentage (0–100)
  return parseFloat(value.toFixed(2)); // round to 2 decimals
}

const cleanScore = average(userScore, "clean", true);
const cleanBlur = average(userScore, "blur", true);
const cleanVerified = average(userScore, "verified", true);
const cleanFake = average(userScore, "fake", true);

const cleantotal = parseFloat((
  (cleanScore * cleanVerified) 
  * Math.pow(Math.max(0, 1 - cleanBlur), 1.5) 
  * Math.pow(Math.max(0, 1 - cleanFake), 3.0)
).toFixed(2));





const amenityIcons: any = {
  // Fitness & Recreation
  'Gym / Workout Room': <FaDumbbell className="text-lg text-gray-400" />,
  'Yoga': <FaYinYang className="text-lg text-gray-400" />,
  'Spa': <FaSpa className="text-lg text-gray-400" />,
  'Swimming': <FaSwimmingPool className="text-lg text-gray-400" />,
  
  // Arts & Culture
  'Photography': <FaCamera className="text-lg text-gray-400" />,
  'Art Galleries': <FaPalette className="text-lg text-gray-400" />,
  'Music': <FaMusic className="text-lg text-gray-400" />,
  'Reading': <FaBook className="text-lg text-gray-400" />,
  
  // Sports & Activities
  'Bowling': <FaBowlingBall className="text-lg text-gray-400" />,
  'Camping': <FaCampground className="text-lg text-gray-400" />,
  'Hiking': <FaHiking className="text-lg text-gray-400" />,
  'Cycling': <FaBicycle className="text-lg text-gray-400" />,
  'Gaming': <FaGamepad className="text-lg text-gray-400" />,
  
  // Travel & Tourism
  'Travel': <FaPlane className="text-lg text-gray-400" />,
  'Eco Tourism': <FaTree className="text-lg text-gray-400" />,
  'City Breaks': <FaCity className="text-lg text-gray-400" />,
  'Cultural Tours': <FaMonument className="text-lg text-gray-400" />,
  'Adventure Travel': <FaMountain className="text-lg text-gray-400" />,
  
  // Technology
  'Web Design': <FaLaptop className="text-lg text-gray-400" />,
  
  // Lifestyle
  'Sustainability': <FaRecycle className="text-lg text-gray-400" />,
  'Cars': <FaCar className="text-lg text-gray-400" />,
  
  // Pets
  'Pet-Friendly Places': <FaPaw className="text-lg text-gray-400" />
};





  const handleImageClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

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
            label: 'Trust Score',
            formatter: function (w) {
              return Math.round(cleantotal) + '%';
            }
          }
        }
      }
    },
    series: [cleanScore, cleanBlur, cleanVerified, cleanFake],
    labels: ['Clean Receipt', 'Blur Receipt', 'Verified Receipt', 'Fake Receipt'],
    colors: ['#9ED0E6', '#B796AC', '#82A7A6', '#785964'],
    stroke: {
      lineCap: 'round'
    }
  };


const hotelMarkers = [{
  position: [idu.latitude || 51.505, idu.longtitude || -0.09] as [number, number],
  //popup: listing.name // using the listing name as popup text
}];
  // Calculate center position if hotels exist, otherwise use default
  const centerPosition = 
    [idu.latitude || 51.505, idu.longtitude || -0.09] as [number, number];


  if (isLoading) {
    return (
       <>
      {/* Map Skeleton */}
      <div className="rounded-2xl m-1 sm:m-2 md:m-3 relative">
        <div className="h-[300px] bg-gray-200 animate-pulse rounded-2xl relative overflow-hidden">
          {/* Map controls skeleton */}
          <div className="absolute right-4 top-4 bg-gray-300 animate-pulse px-3 py-1 rounded-lg h-8 w-20"></div>
          <div className="absolute left-4 top-4 bg-gray-300 animate-pulse rounded h-10 w-10"></div>
          <div className="absolute left-4 top-16 bg-gray-300 animate-pulse rounded h-10 w-10"></div>
          
          {/* Simulated map marker */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-6 h-6 bg-red-300 animate-pulse rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="mx-2 lg:mx-24 my-8 grid grid-cols-1 custom:grid-cols-2 gap-6 font-montserrat">
        <div className="space-y-4">
          {/* Profile Card Skeleton */}
          <div className='border border-1 rounded-2xl p-6 shadow-sm bg-white relative'>
            {/* Edit button skeleton */}
            <div className="absolute right-4 top-4 bg-gray-200 animate-pulse px-3 py-1 rounded-full h-8 w-16"></div>
            
            {/* Profile Section Skeleton */}
            <div className="flex items-center gap-8 flex-wrap">
              <div className="shrink-0 relative">
                {/* Profile image skeleton with overlay */}
                <div className="size-48 rounded-full bg-gray-200 animate-pulse relative">
                  {/* Camera icon overlay */}
                  <div className="absolute inset-0 rounded-full bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 bg-gray-400 rounded"></div>
                  </div>
                </div>
              </div>
              
              <div className="grow mt-6 space-y-3">
                <div className="flex gap-4 flex-wrap items-center">
                  <div className="h-9 bg-gray-200 animate-pulse rounded w-48"></div>
                  <div className="flex gap-1 items-center mt-2">
                    <div className="w-5 h-5 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-5 bg-gray-200 animate-pulse rounded w-24"></div>
                  </div>
                </div>
                <div className="h-5 bg-gray-200 animate-pulse rounded w-40"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-32"></div>
                <div className="border border-1 px-5 py-3 w-48 rounded-3xl bg-gray-100 animate-pulse h-10"></div>
              </div>
            </div>

            <hr className='mt-8'/>

            {/* Contact Info Skeleton */}
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-x-2.5">
                  <div className="w-6 h-6 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded flex-1 max-w-48"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Card Skeleton */}
          <div className='border border-1 rounded-2xl p-6 shadow-sm bg-white relative'>
            <div className="h-6 bg-gray-200 animate-pulse rounded w-20 mb-4"></div>
            
            <div className='flex justify-between mb-4 flex-wrap'>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="h-8 bg-gray-200 animate-pulse rounded w-12"></div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-gray-200 animate-pulse rounded"></div>
                  ))}
                </div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-16"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-24"></div>
              </div>
              <div className="h-8 bg-gray-200 animate-pulse rounded-3xl w-32 px-2 py-1"></div>
            </div>

            {/* Rating bars skeleton */}
            <div className="space-y-4">
              <div className="grid gap-3 md:w-[400px]">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-24 md:w-28 h-4 bg-gray-200 animate-pulse rounded"></div>
                    <div className="flex-1 bg-gray-100 rounded-full h-3 relative overflow-hidden">
                      <div className="h-3 rounded-full bg-gray-200 animate-pulse absolute inset-0"></div>
                    </div>
                    <div className="w-8 h-4 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                ))}
              </div>
            </div>

            <div className='flex gap-1 justify-center mt-8'>
              <div className="w-6 h-6 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-32"></div>
            </div>
          </div>

          {/* Trust Score Card Skeleton */}
          <div className='border border-1 rounded-2xl p-6 shadow-sm bg-white'>
            <div className="h-6 bg-gray-200 animate-pulse rounded w-24 mb-8"></div>

            <div className='flex sm:justify-around flex-wrap items-center'>
              <div className='flex flex-col gap-3'>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className='flex gap-2 items-center'>
                    <div className='h-3 w-4 bg-gray-200 animate-pulse rounded-xl'></div>
                    <div className='h-4 bg-gray-200 animate-pulse rounded w-20'></div>
                  </div>
                ))}
              </div>
              
              {/* Radial chart skeleton */}
              <div className="w-80 h-80 bg-gray-200 animate-pulse rounded-full flex items-center justify-center">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 bg-gray-200 animate-pulse rounded-full"></div>
                </div>
              </div>
            </div>

            <div className='flex items-center gap-x-2.5 text-gray-500 mt-4'>
              <div className="w-6 h-6 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-48"></div>
            </div>
          </div>
        </div>

        {/* About Us Card Skeleton */}
        <div className='border border-1 rounded-2xl p-6 shadow-sm bg-white relative'>
          {/* Edit button skeleton */}
          <div className="absolute right-4 top-4 bg-gray-200 animate-pulse px-3 py-1 rounded-full h-8 w-16"></div>
          <div className="h-6 bg-gray-200 animate-pulse rounded w-24 mb-8"></div>

          {/* About Text Skeleton - More realistic text blocks */}
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-4/5"></div>
          </div>

          <hr className='mt-8'/>

          <div className="h-6 bg-gray-200 animate-pulse rounded w-20 mt-4 mb-4"></div>
          
          {/* Interests/Amenities Skeleton */}
          <div className="flex flex-wrap gap-2">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="flex gap-2 items-center py-2 px-3 border border-gray-200 rounded-3xl h-10 animate-pulse">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
    );
  }

  return (
    <>  
     <div className="rounded-2xl m-1 sm:m-2 md:m-3 relative">
          <Map
            center={centerPosition}
            zoom={9}
            height="400px"
            markers={hotelMarkers}
          />
        </div>
  
     
<div className="mx-2 lg:mx-24 my-8 grid  grid-cols-1 custom:grid-cols-2 gap-6 font-montserrat"> 
  
  {/* Error Display */}
  {error && (
    <div className="col-span-full bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
      <p className="text-sm">{error}</p>
      <button 
        onClick={() => setError(null)}
        className="text-red-500 hover:text-red-700 text-sm underline ml-2"
      >
        Dismiss
      </button>
    </div>
  )}



    <div className='border border-1 rounded-2xl p-6 shadow-sm bg-white relative'>
    
      {/* Profile */}
      <div className="flex items-center gap-8 flex-wrap">
        <div className="shrink-0 relative group">
       
          
          {/* Profile Image Container */}
          <div 
            className={`relative ${!isUploading ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            onClick={handleImageClick}
          >
            <Image
              className={`shrink-0 size-48 rounded-full object-cover transition-all duration-300 ${
                !isUploading ? 'group-hover:brightness-75' : 'opacity-75'
              }`}
              src={idu.profile_image == null ? '/profile1.webp':`${process.env.NEXT_PUBLIC_IMAGE}/${idu.profile_image}`}
              alt="Avatar"
              height={150}
              width={150}
              onError={() => setProfileImage("/profile1.webp")} // Fallback on image load error
            />
            

            
          </div>
        </div>

        <div className="grow mt-6">
          <div className='flex gap-4 flex-wrap items-center'>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-neutral-200 font-playfair">
              {idu.full_name || " "}
            </h1>
            <div className='mt-2'>
                          {idu.identity_verified == true ?  <VerifiedBadge text='Account verified'/> : 
            <div className='flex gap-1 items-center'>
              <GoUnverified size={18} className='text-gray-400'/>
              <p className='text-gray-400 text-lg font-medium'>Unverified</p>
            </div> }
            </div>

           
          </div>
         
          <p className="text-lg text-gray-500 mt-2 font-medium">
            {idu.title || " "}
          </p>
          <a
            className="text-sm text-gray-500 hover:text-gray-600 hover:decoration-2 focus:outline-hidden focus:decoration-2 dark:text-neutral-500 dark:hover:text-neutral-400"
            
          >
            Joined in {idu.joined}
          </a>

    { status === "authenticated" ? 
                <div className="border border-1 px-5 py-2 w-48 rounded-3xl border-gray-500 shadow-sm text-sm flex gap-3 mt-4 justify-center cursor-pointer hover:bg-gray-50" onClick={()=>router.push(`/en/account/messages/?id=${idu.id}`)}>
                  <LuMessageCircleMore size={18} className='text-gray-500'/>
                  <p className='text-gray-500'>Send Message</p> 
                </div> :
                 <LoginButtonSendMessages/>
}
        </div>
      </div>
       <hr className='mt-8'/>
      {/* End Profile */}

     <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-2">
      {idu.want_to_go &&
                 <div className="flex items-center gap-x-2.5 text-gray-500">
                <MdOutlineTravelExplore size={24}/>
                            <p
                  className="text-sm   hover:text-gray-800 hover:decoration-2 focus:outline-hidden focus:decoration-2 dark:text-neutral-500 dark:hover:text-neutral-400"
                  
                >
                 I've wanted to go: {idu.want_to_go}
                </p>
              </div>}
    
       {idu.language &&
      <div className="flex items-center gap-x-2.5 text-gray-500">
              <IoLanguage size={24}/>
                <p
                  className="text-sm   hover:text-gray-800 hover:decoration-2 focus:outline-hidden focus:decoration-2 dark:text-neutral-500 dark:hover:text-neutral-400"
                  
                >
                Speaks {idu.language}
                </p>
              </div>}

      {idu.location &&
              <div className="flex items-center gap-x-2.5 text-gray-500">
              <CiLocationOn size={24}/>
                <p
                  className="text-sm   hover:text-gray-800 hover:decoration-2 focus:outline-hidden focus:decoration-2 dark:text-neutral-500 dark:hover:text-neutral-400"
                  
                >
                 Lives in {idu.location}
                </p>
              </div>}
      {idu.time_spend &&
              <div className="flex items-center gap-x-2.5 text-gray-500">
               <MdAccessTime size={24}/>
                <p
                  className="text-sm   hover:text-gray-800 hover:decoration-2 focus:outline-hidden focus:decoration-2 dark:text-neutral-500 dark:hover:text-neutral-400"
                  
                >
                  I spend too much time: {idu.time_spend}
                </p>
              </div>}

      {idu.born &&
              <div className="flex items-center gap-x-2.5 text-gray-500">
            <LiaBirthdayCakeSolid size={24}/>
                <p
                  className="text-sm   hover:text-gray-800 hover:decoration-2 focus:outline-hidden focus:decoration-2 dark:text-neutral-500 dark:hover:text-neutral-400"
                  
                >
                 Born in the {idu.born}
                </p>
              </div>
}
              {idu.pets &&
              <div className="flex items-center gap-x-2.5 text-gray-500">
            <MdOutlinePets size={24}/>
                <p
                  className="text-sm   hover:text-gray-800 hover:decoration-2 focus:outline-hidden focus:decoration-2 dark:text-neutral-500 dark:hover:text-neutral-400"
                  
                >
                Pets: {idu.pets}
                </p>
              </div>}
            </div>
        
          {/* End About */}
        </div>





  <div className='border border-1 rounded-2xl p-6 shadow-sm bg-white relative'>
   
   
    <h1 className='font-medium font-playfair text-lg'>About Us</h1>

    {/* About */}

      <div 
  className="text-sm text-gray-600 dark:text-neutral-400 mt-8 space-y-2 prose-inherit"
  dangerouslySetInnerHTML={{ __html: idu?.about || '' }}
/>
     

    <hr className='mt-8'/>

    <h1 className="mt-4 mb-4 font-medium font-playfair text-lg">Interests</h1>
   
     <div className="flex flex-wrap gap-2">
                 {Amenitie.map((amenity) => (
                   <div key={amenity.id} className="flex gap-2 items-center py-2 px-3 border border-1 border-gray-500 rounded-3xl text-gray-600 text-sm w-fit">
                     {amenityIcons[amenity.name] || <FaCampground className="text-lg" />}
                     <p>{amenity.name}</p>
                   </div>
                 ))}
               </div>
  </div>






    {/* Reviews */}
    <div className='border border-1 rounded-2xl p-6 shadow-sm bg-white relative '>
      <h1 className='font-medium font-playfair mb-4 text-lg'>Reviews</h1>

      <div>
        <div className='flex justify-between mb-4 flex-wrap'>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-2xl font-bold text-gray-900">{averageRating}</span>
             <StarRating rating={averageRating} size={16}/>
            <span className="text-background font-medium">{averageRating == 5? "Excellent": (averageRating == 4? "Very Good" :(averageRating == 3? "Good":(averageRating == 2? 	"Poor" : "")))}</span>
            <span className="text-sm text-gray-500">({Review.length} reviews)</span>
          </div>
          {Review.length >50 ?  <div className="text-sm text-gray-500 mb-4 px-2 py-1 border border-1 bg-secondary text-white rounded-3xl font-bold w-fit mt-2">Top Reviewer</div>: ""}
         
        </div>
        <div>
          <div className="space-y-4">
            <div className="grid gap-3 md:w-[400px]">
                                 {[
                      { label: "Location", score: Review && Review.length > 0? Review.reduce((sum, r) => sum + +r.location, 0) / Review.length: 0, color: "bg-accent" },
                      { label: "Rooms", score: Review && Review.length > 0? Review.reduce((sum, r) => sum + +r.room, 0) / Review.length: 0, color: "bg-accent" },
                      { label: "Value", score: Review && Review.length > 0? Review.reduce((sum, r) => sum + +r.value, 0) / Review.length: 0, color: "bg-accent" },
                      { label: "Cleanliness", score: Review && Review.length > 0? Review.reduce((sum, r) => sum + +r.clearliness, 0) / Review.length: 0, color: "bg-accent" },
                      { label: "Service", score: Review && Review.length > 0? Review.reduce((sum, r) => sum + +r.service, 0) / Review.length: 0, color: "bg-accent" },
                      { label: "Spcae", score: Review && Review.length > 0? Review.reduce((sum, r) => sum + +r.restaurant_space, 0) / Review.length: 0, color: "bg-accent" }
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-4">
                        <div className="w-24 md:w-28  text-sm font-medium text-gray-500">{item.label}</div>
                        <div className="flex-1 bg-gray-100 rounded-full h-4">
                          <div 
                            className={`h-4 rounded-full ${item.color}`}
                            style={{ width: `${(item.score / 5) * 100}%` }}
                          />
                        </div>
                        <div className="w-8 text-sm font-medium text-right">{item.score}</div>
                      </div>
                    ))}
            </div>
          </div>
        </div>
      </div>
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
<Link href="/en/trust-score">
<div className='flex items-center gap-x-2.5 text-gray-500'>
  <FaRegQuestionCircle size={24}/>
  <p className='underline'>Read more about trust Score</p>
</div>
</Link>

</div>

</div>
</>
  );
};

export default  UserProfilePublic;