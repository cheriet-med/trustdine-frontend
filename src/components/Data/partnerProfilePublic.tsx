'use client'

import React, { useState, useRef } from 'react';
import VerifiedBadge from '@/components/verified';
import { MdOutlineTravelExplore } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { Star } from "lucide-react";
import { TbHistoryToggle } from "react-icons/tb";
import { GoPencil } from "react-icons/go";
import { CiPhone } from "react-icons/ci";
import { MdAlternateEmail } from "react-icons/md";
import { Camera, Upload } from "lucide-react";
import Image from 'next/image';
import { LuCookingPot } from "react-icons/lu";
import { GoUnverified } from "react-icons/go";
import { IoLanguage } from "react-icons/io5";
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import useFetchAmenities from '@/components/requests/fetchAmenities';
import useFetchUser from '@/components/requests/fetchUser';
import { LuMessageCircleMore } from "react-icons/lu";
import useFetchLanguages from '@/components/requests/fetchLanguage';
import useFetchAllReviews from '../requests/fetchAllReviews';
import useFetchListing from '../requests/fetchListings';
import StarRating from '../starsComponent';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import LoginButtonSendMessages from '../header/LoginButtonSendMessage';
const Map = dynamic(() => import('@/components/Map'), { ssr: false });
const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => <div className="h-64 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-background"></div>
  </div>
});

// Icon mapping for each amenity (keeping your existing icons)
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

const amenityIcons: any = {
  // Internet & Connectivity
  'Free internet': <FaWifi className="text-lg text-gray-400" />,
  
  // Parking & Transportation
  'Valet parking': <FaParking className="text-lg text-gray-400" />,
  'Taxi service': <FaTaxi className="text-lg text-gray-400" />,
  'Elevator': <PiElevatorFill className="text-lg text-gray-400" />,
  
  // Fitness & Recreation
  'Gym / Workout Room': <FaDumbbell className="text-lg text-gray-400" />,
  'Yoga': <FaYinYang className="text-lg text-gray-400" />,
  'Spa': <FaSpa className="text-lg text-gray-400" />,
  'Swimming': <FaSwimmingPool className="text-lg text-gray-400" />,
  
  // Food & Dining
  'Bar / lounge': <FaGlassMartiniAlt className="text-lg text-gray-400" />,
  'Coffee / tea maker': <FaCoffee className="text-lg text-gray-400" />,
  'Outdoor seating': <FaChair className="text-lg text-gray-400" />,
  'Private dining': <FaUtensils className="text-lg text-gray-400" />,
  'Delivery': <FaMotorcycle className="text-lg text-gray-400" />,
  'Fine Dining': <FaUtensils className="text-lg text-gray-400" />,
  'Vegetarian': <FaLeaf className="text-lg text-gray-400" />,
  'Vegan': <FaSeedling className="text-lg text-gray-400" />,
  'Farm to Table': <FaSeedling className="text-lg text-gray-400" />,
  'Wine Tasting': <FaWineGlassAlt className="text-lg text-gray-400" />,
  'Seafood': <FaFish className="text-lg text-gray-400" />,
  'Cocktail Bars': <FaCocktail className="text-lg text-gray-400" />,
  'Dessert Spots': <FaIceCream className="text-lg text-gray-400" />,
  'Brunch': <FaEgg className="text-lg text-gray-400" />,
  'Street Food': <FaStreetView className="text-lg text-gray-400" />,
  
  // Family & Children
  'Children Activities': <FaChild className="text-lg text-gray-400" />,
  'Babysitting': <FaBaby className="text-lg text-gray-400" />,
  
  // Room Amenities
  'Bathrobes': <FaBath className="text-lg text-gray-400" />,
  'Air conditioning': <FaSnowflake className="text-lg text-gray-400" />,
  'Desk': <FaDesktop className="text-lg text-gray-400" />,
  'Interconnected rooms available': <FaHotel className="text-lg text-gray-400" />,
  'Flatscreen TV': <FaTv className="text-lg text-gray-400" />,
  'Bath / shower': <FaShower className="text-lg text-gray-400" />,
  
  // Services
  'Housekeeping': <FaBroom className="text-lg text-gray-400" />,
  'Business center': <FaBriefcase className="text-lg text-gray-400" />,
  'Laundry': <FaTshirt className="text-lg text-gray-400" />,
  
  // Accessibility
  'Wheelchair accessible': <FaWheelchair className="text-lg text-gray-400" />,
  
  // Entertainment
  'Live music': <FaMusic className="text-lg text-gray-400" />,
  
  // Pets
  'Pet friendly': <FaDog className="text-lg text-gray-400" />,
  'Pet-Friendly Places': <FaPaw className="text-lg text-gray-400" />,
  
  // Accommodation Types
  'Luxury Hotels': <FaHotel className="text-lg text-gray-400" />,
  'Boutique Stays': <FaHotel className="text-lg text-gray-400" />,
  'Beach Resorts': <FaUmbrellaBeach className="text-lg text-gray-400" />,
  'Ski Resorts': <FaSkiing className="text-lg text-gray-400" />,
  
  // Travel & Tourism
  'Eco Tourism': <FaTree className="text-lg text-gray-400" />,
  'City Breaks': <FaCity className="text-lg text-gray-400" />,
  'Cultural Tours': <FaMonument className="text-lg text-gray-400" />,
  'Adventure Travel': <FaMountain className="text-lg text-gray-400" />,
  
  // Arts & Culture
  'Photography': <FaCamera className="text-lg text-gray-400" />,
  'Art Galleries': <FaPalette className="text-lg text-gray-400" />,
  
  // Technology
  'Web Design': <FaLaptop className="text-lg text-gray-400" />,
  
  // Lifestyle
  'Sustainability': <FaRecycle className="text-lg text-gray-400" />,
  
  // Additional from your original list
  'Bowling': <FaBowlingBall className="text-lg text-gray-400" />,
  'Camping': <FaCampground className="text-lg text-gray-400" />,
  'Hiking': <FaHiking className="text-lg text-gray-400" />,
  'Music': <FaMusic className="text-lg text-gray-400" />,
  'Reading': <FaBook className="text-lg text-gray-400" />,
  'Gaming': <FaGamepad className="text-lg text-gray-400" />,
  'Travel': <FaPlane className="text-lg text-gray-400" />,
  'Cycling': <FaBicycle className="text-lg text-gray-400" />,
  'Cars': <FaCar className="text-lg text-gray-400" />
};


interface PartnerProfileProps {
  idu: any; // you can replace `any` with the actual type of `userData`
}

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
}

const PartnerProfilePublic: React.FC<PartnerProfileProps> = ({ idu }) => {
  const [profileImage, setProfileImage] = useState("/profile.webp");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { listings } = useFetchListing();
  const { data: session, status } = useSession();

const alluserproducts = listings?.filter((user) => user.user === idu.id)
const {AllReview} = useFetchAllReviews()

const userProductIds = alluserproducts?.map((p) => p.id);
const Review = AllReview?.filter((review) =>
  userProductIds?.includes(+review.product)
);

const averageRating = Review && Review.length > 0
  ? Review.reduce((sum, r) => sum + +r.rating_global, 0) / Review.length
  : 0;



  const userId = idu.id;
  //const { Users, isLoading, mutate } = useFetchUser(userId);
  const { Amenitie, isLoading, error: amenitiesError } = useFetchAmenities(idu.id);
  const { Languages } = useFetchLanguages(idu.id);

const hotelMarkers = [{
  position: [idu.latitude || 51.505, idu.longtitude || -0.09] as [number, number],
  //popup: listing.name // using the listing name as popup text
}];
  // Calculate center position if hotels exist, otherwise use default
  const centerPosition = 
    [idu.latitude || 51.505, idu.longtitude || -0.09] as [number, number];
  // Use Users data directly instead of profileData state
 // const profileData: ProfileData = Users || {};

  if (isLoading) {
    return (
      <>
        {/* Map Skeleton */}
        <div className="rounded-2xl m-1 sm:m-2 md:m-3 relative">
          <div className="h-[300px] bg-gray-200 animate-pulse rounded-2xl"></div>
        </div>

        <div className="mx-2 lg:mx-24 my-6 grid grid-cols-1 md:grid-cols-2 gap-6 font-montserrat">
          <div>
            {/* Profile Card Skeleton */}
            <div className="border border-1 rounded-2xl p-6 shadow-sm bg-white relative">
              {/* Profile Section Skeleton */}
              <div className="flex items-center gap-8 flex-wrap">
                <div className="shrink-0">
                  <div className="size-48 rounded-full bg-gray-200 animate-pulse"></div>
                </div>
                <div className="grow space-y-3">
                  <div className="flex gap-2 items-center flex-wrap">
                    <div className="h-8 bg-gray-200 animate-pulse rounded w-64"></div>
                    <div className="h-6 bg-gray-200 animate-pulse rounded w-20"></div>
                  </div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-32"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-28"></div>
                  <div className="h-10 bg-gray-200 animate-pulse rounded-3xl w-48"></div>
                </div>
              </div>

              <hr className="mt-8"/>

              {/* Contact Info Skeleton */}
              <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-x-2.5">
                    <div className="w-6 h-6 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-4 bg-gray-200 animate-pulse rounded flex-1"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Card Skeleton */}
            <div className="border border-1 rounded-2xl p-6 shadow-sm bg-white relative mt-4">
              <div className="h-6 bg-gray-200 animate-pulse rounded w-20 mb-4"></div>
              
              <div className="flex justify-between mb-4 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="h-8 bg-gray-200 animate-pulse rounded w-12"></div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-4 h-4 bg-gray-200 animate-pulse rounded"></div>
                    ))}
                  </div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-16"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-20"></div>
                </div>
                <div className="h-8 bg-gray-200 animate-pulse rounded-3xl w-24"></div>
              </div>

              <div className="space-y-4">
                <div className="grid gap-3 md:w-[400px]">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-24 md:w-28 h-4 bg-gray-200 animate-pulse rounded"></div>
                      <div className="flex-1 bg-gray-100 rounded-full h-3">
                        <div className="h-3 rounded-full bg-gray-200 animate-pulse w-3/4"></div>
                      </div>
                      <div className="w-8 h-4 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-1 justify-center mt-8">
                <div className="w-6 h-6 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-32"></div>
              </div>
            </div>
          </div>

          {/* About Us Card Skeleton */}
          <div className="border border-1 rounded-2xl p-6 shadow-sm bg-white relative">
            <div className="h-6 bg-gray-200 animate-pulse rounded w-20 mb-8"></div>

            {/* About Text Skeleton */}
            <div className="space-y-2 min-h-32">
              <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3"></div>
            </div>

            {/* Features Section Skeleton */}
            <div className="min-h-80">
              <hr className="mt-8"/>
              <div className="h-6 bg-gray-200 animate-pulse rounded w-20 mt-4 mb-4"></div>
              
              {/* Amenities Grid Skeleton */}
              <div className="flex flex-wrap gap-2">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-200 animate-pulse rounded-3xl w-32"></div>
                ))}
              </div>
            </div>

            {/* Languages Section Skeleton */}
            <hr className="mt-8"/>
            <div className="h-6 bg-gray-200 animate-pulse rounded w-20 mt-4 mb-4"></div>
            <div className="flex flex-wrap gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 animate-pulse rounded-3xl w-24"></div>
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

      <div className="mx-2 lg:mx-24 my-6 grid grid-cols-1 md:grid-cols-2 gap-6 font-montserrat"> 
        
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

        <div>
          <div className="border border-1 rounded-2xl p-6 shadow-sm bg-white relative">
            {/* Profile */}
            <div className="flex items-center gap-8 flex-wrap">
              <div className="shrink-0 relative group">
                <Image
                  className={`shrink-0 size-48 rounded-full object-cover transition-all duration-300 ${
                    !isUploading ? 'group-hover:brightness-75' : 'opacity-75'
                  }`}
                  src={idu.profile_image == null ? '/profile.webp':`${process.env.NEXT_PUBLIC_IMAGE}/${idu.profile_image}`}
                  alt="Avatar"
                  height={150}
                  width={150}
                  onError={() => setProfileImage("/profile.webp")} // Fallback on image load error
                />
              </div>

              <div className="grow mt-6">
          <div className='flex gap-4 flex-wrap items-center'>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-neutral-200 font-playfair">
              {idu.full_name || " "}
            </h1>
            <div className='mt-2'>
                       {idu.identity_verified == true && idu.is_email_verified == true && idu.is_phone_number_verified == true?  
                                                    <div className="relative h-8 w-8 ">
                                                                                                  <Image
                                                                                                    src="/guarantee.png" // or "/logo.webp" if using an webp
                                                                                                    alt="logo"
                                                                                                    fill
                                                                                                    sizes='100%'
                                                                                                    style={{ objectFit: 'contain' }} // Maintain aspect ratio
                                                                                                    priority // Ensures it loads faster
                                                                                                  />
                                                                     </div>: ""
                       }
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
<div className='mt-2'>
<div className="flex">
  {Array.from({ length: Number(idu?.hotel_stars) || 0 }).map((_, i) => (
    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
  ))}
</div>


</div>

  {
     status === "authenticated" ? 
                <div className="border border-1 px-5 py-2 w-48 rounded-3xl border-gray-500 shadow-sm text-sm flex gap-3 mt-4 justify-center cursor-pointer hover:bg-gray-50" onClick={()=>router.push(`/en/account/messages/?id=${idu.id}`)}>
                  <LuMessageCircleMore size={18} className='text-gray-500'/>
                  <p className='text-gray-500'>Send Message</p> 
                </div> :
                 <LoginButtonSendMessages/>
}


              </div>
            </div>
            {/* End Profile */}

            {/* About */}
            <hr className="mt-8"/>

            <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-2">
              <div className="flex items-center gap-x-2.5 text-gray-500">
                <MdAlternateEmail size={24}/>
                <p className="text-sm hover:text-gray-600 hover:decoration-2 focus:outline-hidden focus:decoration-2 dark:text-neutral-500 dark:hover:text-neutral-400">
                  Email: reservations@hotel.com
                </p>
              </div>
              
              <div className="flex items-center gap-x-2.5 text-gray-500">
                <CiLocationOn size={24}/>
                <p className="text-sm hover:text-gray-600 hover:decoration-2 focus:outline-hidden focus:decoration-2 dark:text-neutral-500 dark:hover:text-neutral-400">
                  {idu.address_line_1}, {idu.city}, {idu.state} {idu.postalCode}, {idu.countryCode}
                </p>
              </div>

              <div className="flex items-center gap-x-2.5 text-gray-500">
                <CiPhone size={24}/>
                <p className="text-sm hover:text-gray-600 hover:decoration-2 focus:outline-hidden focus:decoration-2 dark:text-neutral-500 dark:hover:text-neutral-400">
                  Phone: {idu.phoneNumber || "+1 (555) 123-4567"}
                </p>
              </div>

              {idu.website &&
                <div className="flex items-center gap-x-2.5 text-gray-500">
                  <MdOutlineTravelExplore size={24}/>
                  <p className="text-sm hover:text-gray-600 hover:decoration-2 focus:outline-hidden focus:decoration-2 dark:text-neutral-500 dark:hover:text-neutral-400">
                    Website: {idu.website}
                  </p>
                </div>
              }
            </div>
            {/* End About */}
          </div>

          {/* Reviews */}
 <div className='border border-1 rounded-2xl p-6 shadow-sm bg-white relative mt-4'>
      <h1 className='font-medium font-playfair mb-4 text-lg'>Reviews</h1>

      <div>
        <div className='flex justify-between mb-4 flex-wrap'>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-2xl font-bold text-gray-900">{averageRating}</span>
             <StarRating rating={averageRating} size={16}/>
            <span className="text-background font-medium">{averageRating == 5? "Excellent": (averageRating == 4? "Very Good" :(averageRating == 3? "Good":(averageRating == 2? 	"Poor" : "")))}</span>
            <span className="text-sm text-gray-500">({Review.length} reviews)</span>
          </div>
          {Review.length >50 ?  <div className="text-sm text-gray-500 mb-4 px-2 py-1 border border-1 bg-secondary text-white rounded-3xl font-bold w-fit mt-2">Trusted</div>: ""}
         
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



        </div>

        <div className="border border-1 rounded-2xl p-6 shadow-sm bg-white relative ">
          <h1 className="font-medium font-playfair text-lg">About Us</h1>

          {/* About */}
          <div 
            className="text-sm text-gray-600 dark:text-neutral-400 mt-8 space-y-2 min-h-32 prose-inherit"
            dangerouslySetInnerHTML={{ __html: idu?.about || '' }}
          />
           
          <div className="min-h-72">
            <hr className="mt-8"/>
            <h1 className="mt-4 mb-4 font-medium font-playfair text-lg">Features</h1>
            <div className="flex flex-wrap gap-2">
              {Amenitie.map((amenity) => (
                <div key={amenity.id} className="flex gap-2 items-center py-2 px-3 border border-1 border-gray-500 rounded-3xl text-gray-600 text-sm w-fit">
                  {amenityIcons[amenity.name] || <FaCampground className="text-lg" />}
                  <p>{amenity.name}</p>
                </div>
              ))}
            </div>
          </div>
   
          <hr className="mt-8"/>

          <h1 className="mt-4 mb-4 font-medium font-playfair text-lg">Languages</h1>
          <div className="flex flex-wrap gap-2">
            {Languages.map((amenity) => (
              <div key={amenity.id} className="flex gap-2 items-center py-2 px-3 border border-1 border-gray-500 rounded-3xl text-gray-600 text-sm w-fit">
                <IoLanguage className="text-lg text-gray-400" />
                <p>{amenity.language}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PartnerProfilePublic;