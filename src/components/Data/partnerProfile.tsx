'use client'

import React, { useState, useRef, useEffect } from 'react';
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
import { useSession } from 'next-auth/react';
import { GoUnverified } from "react-icons/go";
import useFetchListing from '../requests/fetchListings';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import AmenitiesSelector from '@/components/requests/amenities';
import useFetchUser from '@/components/requests/fetchUser';
import useFetchAllReviews from '../requests/fetchAllReviews';
import StarRating from '../starsComponent';
import { getStripe, SUBSCRIPTION_PRICE_ID } from '@/lib/stripe-client';
import type { SubscriptionData } from '@/types/subscription';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });
const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => <div className="h-64 flex items-center justify-center">
  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-backgound"></div>
</div>
});

import EditAboutPopup from '@/components/requests/editeAbout';
import EditNameTitle from '@/components/requests/editeInfoProfile';
import EditLocationPopup from '@/components/requests/editeLocation';


interface Subscription {
  cancelAtPeriodEnd: boolean;
  customerId: string;
  id: string;
  priceId: string;
  status: string;
}


interface ProfileData {
  id?: number | string;
  name?: string;
  full_name?:string;
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
  premium_plan?:boolean;
  is_staff?:boolean;
  is_email_verified?:boolean;
  hotel_stars?:string | undefined;
  is_phone_number_verified?:boolean;
}

const PartnerProfile: React.FC = () => {
  const [profileImage, setProfileImage] = useState("/profile.webp");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
    const [emailsendvalidation, setEmailsendvalidation] = useState(false);
  const [emailsenderrorvalidation, setEmailsenderrorvalidation] = useState(false);
   const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
    const [fetchingSubscriptions, setFetchingSubscriptions] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
   const { data: session, status } = useSession({ required: true });

    const userId = session?.user?.id;
   
  const { Users,  isLoading, mutate } = useFetchUser(userId);
 const { listings } = useFetchListing();

const alluserproducts = listings?.filter((user) => user.user === +userId)
const {AllReview} = useFetchAllReviews()






  useEffect(() => {
    fetchSubscriptions();
  }, []);


  
const fetchSubscriptions = async () => {
  try {
    const response = await fetch(`/api/get-subscriptions?email=${session?.user.email}`);
    const data = await response.json();
    
    if (response.ok) {
      setSubscriptions(data.subscriptions);
      
      // Check if any subscription has active status
      const hasActiveSubscription = data.subscriptions.some((subscription: Subscription) => 
        subscription.status === 'active'
      );
      
      // Make PUT request based on subscription status
      try {
        const putResponse = await fetch(`${process.env.NEXT_PUBLIC_URL}infoid/${session?.user.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            premium_plan: hasActiveSubscription
          })
        });
        
        if (putResponse.ok) {
          console.log(`Premium plan ${hasActiveSubscription ? 'activated' : 'deactivated'} successfully`);
        } else {
          console.error('Failed to update premium plan:', await putResponse.text());
        }
      } catch (putError) {
        console.error('Error making PUT request:', putError);
      }
      
    } else {
      console.error('Error fetching subscriptions:', data.error);
    }
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
  } finally {
    setFetchingSubscriptions(false);
  }
};




const sendVerificationEmail = async () => {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_URL}send-verification-email/`, {

      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `JWT ${session?.accessToken}`,
      },
      body: JSON.stringify({
        email: session?.user.email,
      }),
    });

    console.log("Verification email request sent successfully");
     setEmailsendvalidation(true);
  } catch (err) {
    console.error("Failed to send verification email:", err);
     setEmailsenderrorvalidation(true);
  }
};



  const handleSubscribe = async () => {
    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session?.user?.email,
          priceId: SUBSCRIPTION_PRICE_ID,
        }),
      });

      const data = await response.json();

      if (response.ok) {



        const stripe = await getStripe();
        const { error } = await stripe!.redirectToCheckout({
          sessionId: data.sessionId,
        });

        if (error) {
          console.error('Stripe error:', error);
          alert('Error redirecting to checkout');
        }
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
      alert('Error creating subscription');
    } finally {
   
    }
  };

const userProductIds = alluserproducts?.map((p) => p.id);
const Review = AllReview?.filter((review) =>
  userProductIds?.includes(+review.product)
);

const averageRating = Review && Review.length > 0
  ? Review.reduce((sum, r) => sum + +r.rating_global, 0) / Review.length
  : 0;


 // Replace with actual userId

  // Use Users data directly instead of profileData state
  // Users is now a single object, not an array
  const profileData: ProfileData = Users || {};
  // Calculate center position if hotels exist, otherwise use default
  const centerPosition = 
    [51.505, -0.09] as [number, number];

const initialAmenities = [
    // Internet & Connectivity
    { id: 1, name: 'Free internet', category: 'Internet & Connectivity', selected: false },
    
    // Parking & Transportation
    { id: 2, name: 'Valet parking', category: 'Parking & Transportation', selected: false },
    { id: 6, name: 'Taxi service', category: 'Parking & Transportation', selected: false },
    { id: 24, name: 'Elevator', category: 'Parking & Transportation', selected: false },
    
    // Fitness & Recreation
    { id: 3, name: 'Gym / Workout Room', category: 'Fitness & Recreation', selected: false },
    { id: 48, name: 'Yoga', category: 'Fitness & Recreation', selected: false },
    { id: 21, name: 'Spa', category: 'Fitness & Recreation', selected: false },
    
    // Food & Dining
    { id: 4, name: 'Bar / lounge', category: 'Food & Dining', selected: false },
    { id: 8, name: 'Coffee / tea maker', category: 'Food & Dining', selected: false },
    { id: 16, name: 'Outdoor seating', category: 'Food & Dining', selected: false },
    { id: 17, name: 'Private dining', category: 'Food & Dining', selected: false },
    { id: 20, name: 'Delivery', category: 'Food & Dining', selected: false },
    { id: 26, name: 'Fine Dining', category: 'Food & Dining', selected: false },
    { id: 27, name: 'Vegetarian', category: 'Food & Dining', selected: false },
    { id: 28, name: 'Vegan', category: 'Food & Dining', selected: false },
    { id: 29, name: 'Farm to Table', category: 'Food & Dining', selected: false },
    { id: 30, name: 'Wine Tasting', category: 'Food & Dining', selected: false },
    { id: 31, name: 'Seafood', category: 'Food & Dining', selected: false },
    { id: 32, name: 'Cocktail Bars', category: 'Food & Dining', selected: false },
    { id: 33, name: 'Dessert Spots', category: 'Food & Dining', selected: false },
    { id: 34, name: 'Brunch', category: 'Food & Dining', selected: false },
    { id: 35, name: 'Street Food', category: 'Food & Dining', selected: false },
    
    // Family & Children
    { id: 5, name: 'Children Activities', category: 'Family & Children', selected: false },
    { id: 7, name: 'Babysitting', category: 'Family & Children', selected: false },
    
    // Room Amenities
    { id: 9, name: 'Bathrobes', category: 'Room Amenities', selected: false },
    { id: 10, name: 'Air conditioning', category: 'Room Amenities', selected: false },
    { id: 11, name: 'Desk', category: 'Room Amenities', selected: false },
    { id: 13, name: 'Interconnected rooms available', category: 'Room Amenities', selected: false },
    { id: 14, name: 'Flatscreen TV', category: 'Room Amenities', selected: false },
    { id: 15, name: 'Bath / shower', category: 'Room Amenities', selected: false },
    
    // Services
    { id: 12, name: 'Housekeeping', category: 'Services', selected: false },
    { id: 22, name: 'Business center', category: 'Services', selected: false },
    { id: 25, name: 'Laundry', category: 'Services', selected: false },
    
    // Accessibility
    { id: 18, name: 'Wheelchair accessible', category: 'Accessibility', selected: false },
    
    // Entertainment
    { id: 19, name: 'Live music', category: 'Entertainment', selected: false },
    { id: 47, name: 'Live Music', category: 'Entertainment', selected: false },
    
    // Pets
    { id: 23, name: 'Pet friendly', category: 'Pets', selected: false },
    { id: 50, name: 'Pet-Friendly Places', category: 'Pets', selected: false },
    
    // Accommodation Types
    { id: 36, name: 'Luxury Hotels', category: 'Accommodation Types', selected: false },
    { id: 37, name: 'Boutique Stays', category: 'Accommodation Types', selected: false },
    { id: 38, name: 'Beach Resorts', category: 'Accommodation Types', selected: false },
    { id: 39, name: 'Ski Resorts', category: 'Accommodation Types', selected: false },
    
    // Travel & Tourism
    { id: 40, name: 'Eco Tourism', category: 'Travel & Tourism', selected: false },
    { id: 41, name: 'City Breaks', category: 'Travel & Tourism', selected: false },
    { id: 42, name: 'Cultural Tours', category: 'Travel & Tourism', selected: false },
    { id: 43, name: 'Adventure Travel', category: 'Travel & Tourism', selected: false },
    
    // Arts & Culture
    { id: 44, name: 'Photography', category: 'Arts & Culture', selected: false },
    { id: 46, name: 'Art Galleries', category: 'Arts & Culture', selected: false },
    
    // Technology
    { id: 45, name: 'Web Design', category: 'Technology', selected: false },
    
    // Lifestyle
    { id: 49, name: 'Sustainability', category: 'Lifestyle', selected: false }
];

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);
    setError(null);
    
    try {
      // Method 1: Upload as FormData (recommended for file uploads)
      const formData = new FormData();
      formData.append('profile_image', file);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}infoid/${userId}`, {
        method: "PUT",
        headers: {
          "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
          // Don't set Content-Type when sending FormData, let the browser set it
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Upload failed: ${response.status} - ${errorData}`);
      }

      const updatedData = await response.json();
      
      // Refetch data to get updated profile information using SWR mutate
      if (mutate) {
        await mutate();
      }
      
      // Update profile image with the new URL from server or create object URL for immediate display
      if (updatedData.profile_image) {
        setProfileImage(updatedData.profile_image);
      } else {
        // Fallback: create temporary URL for immediate display
        const tempUrl = URL.createObjectURL(file);
        setProfileImage(tempUrl);
      }
      
      
    } catch (error) {
      console.error('Error uploading image:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload image');
      
      // Revert to previous image on error
      if (profileData.profile_image) {
        setProfileImage(profileData.profile_image);
      } else {
        setProfileImage("/ex.avif");
      }
    } finally {
      setIsUploading(false);
    }
  };

  // Alternative method: Convert to base64 if your API expects it
  const handleImageUploadBase64 = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    
    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64String = e.target?.result as string;
        
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_URL}infoid/${userId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
            },
            body: JSON.stringify({
              profile_image: base64String,
            }),
          });
          
          if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Upload failed: ${response.status} - ${errorData}`);
          }
          
          const updatedData = await response.json();
          
          // Refetch data to get updated profile information using SWR mutate
          if (mutate) {
            await mutate();
          }
          
          setProfileImage(base64String);
          
        
        } catch (error) {
          console.error('Error uploading image:', error);
          setError('Failed to upload image');
          // Revert image on error
          setProfileImage(profileData.profile_image || "/ex.avif");
        } finally {
          setIsUploading(false);
        }
      };
      
      reader.onerror = () => {
        setError('Failed to read file');
        setIsUploading(false);
      };
      
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('Error processing file:', error);
      setError('Failed to process file');
      setIsUploading(false);
    }
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
            label: 'TOTAL',
            formatter: function (w) {
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
    colors: ['#9ED0E6', '#B796AC', '#82A7A6', '#785964'],
    stroke: {
      lineCap: 'round'
    }
  };

  if (isLoading) {
    return (
      <>
    
        {/* Map Skeleton */}
        <div className="rounded-2xl m-1 sm:m-2 md:m-3 relative">
          <div className="h-[300px] bg-gray-200 animate-pulse rounded-2xl"></div>
          <div className="absolute right-4 top-4 bg-gray-200 animate-pulse px-3 py-0.5 rounded-3xl h-8 w-16"></div>
        </div>

        <div className="mx-2 lg:mx-24 my-6 grid grid-cols-1 md:grid-cols-2 gap-6 font-montserrat">
          <div>
            {/* Profile Card Skeleton */}
            <div className='border border-1 rounded-2xl p-6 shadow-sm bg-white relative'>
              <div className="absolute right-4 top-4 bg-gray-200 animate-pulse px-3 py-0.5 rounded-3xl h-8 w-16"></div>
              
              {/* Profile Section Skeleton */}
              <div className="flex items-center gap-8 flex-wrap">
                <div className="shrink-0">
                  <div className="size-48 rounded-full bg-gray-200 animate-pulse"></div>
                </div>
                <div className="grow space-y-3">
                  <div className="flex gap-2 items-center">
                    <div className="h-8 bg-gray-200 animate-pulse rounded w-64"></div>
                    <div className="h-6 bg-gray-200 animate-pulse rounded w-20"></div>
                  </div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-32"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-28"></div>
                </div>
              </div>

              <hr className='mt-8'/>

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
            <div className='border border-1 rounded-2xl p-6 shadow-sm bg-white relative mt-4'>
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

              <div className='flex gap-1 justify-center mt-8'>
                <div className="w-6 h-6 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-32"></div>
              </div>
            </div>
          </div>

          {/* About Us Card Skeleton */}
          <div className='border border-1 rounded-2xl p-6 shadow-sm bg-white relative'>
            <div className="absolute right-4 top-4 bg-gray-200 animate-pulse px-3 py-0.5 rounded-3xl h-8 w-16"></div>
            <div className="h-6 bg-gray-200 animate-pulse rounded w-20 mb-8"></div>

            {/* About Text Skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3"></div>
            </div>

            <hr className='mt-8'/>

            <div className="h-6 bg-gray-200 animate-pulse rounded w-20 mt-4 mb-8"></div>
            
            {/* Amenities Skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 animate-pulse rounded-full"></div>
              ))}
            </div>

            <hr className='mt-8'/>
            
            <div className="h-6 bg-gray-200 animate-pulse rounded w-20 mt-4 mb-4"></div>
             <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3 mb-2"></div>
              <div className="h-10 bg-gray-200 animate-pulse rounded-full w-full"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>  
    {profileData.premium_plan == false ? 
      <div  className="rounded-lg m-1 sm:m-2 md:m-3 relative bg-accent p-2 flex gap-4 flex-wrap justify-center">
        <p className='text-white font-playfair'>
          Upgrade to our Premium plan for $29/month to unlock all features.
        </p>
       <p className='text-secondary font-extrabold underline hover:text-white cursor-pointer font-playfair' onClick={handleSubscribe}>
         Upgrade
        </p>
    </div> : "" }
     {profileData.is_email_verified == false ? 
      <div  className="rounded-lg m-1 sm:m-2 md:m-3 relative bg-secondary p-2 flex gap-4 flex-wrap justify-center items-center">
        <p className='text-white font-playfair'>
          Please click Verify to receive an email with your verification link.
        </p>
         {emailsendvalidation && <p className="text-white text-sm">Verification email sent, please check your inbox or spam folder.</p>}
                {emailsenderrorvalidation && <p className="text-white text-sm ">We couldn’t send the verification email. Please try again.</p>}
       <p className='text-white font-extrabold underline hover:text-accent cursor-pointer font-playfair' onClick={sendVerificationEmail}>
         Verify
        </p>
    </div> : "" }
    <div className="rounded-2xl m-1 sm:m-2 md:m-3 relative">
     <Map
    center={
      profileData.latitude && profileData.longtitude
        ? [parseFloat(profileData.latitude), parseFloat(profileData.longtitude)]
        : [51.505, -0.09] // Default fallback position
    }
    zoom={profileData.latitude && profileData.longtitude ? 15 : 9}
    height="300px"
    markers={
      profileData.latitude && profileData.longtitude
        ? [{
            position: [parseFloat(profileData.latitude), parseFloat(profileData.longtitude)],
            popup: profileData.location || profileData.address_line_1 || "Location"
          }]
        : [] // No markers if no coordinates
    }
  />
   <EditLocationPopup 
  initialLatitude={51.505} 
  initialLongtitude={-0.09} 
  infoId={userId}
  onUpdateSuccess={(newLat, newLng) => {
    console.log('Updated coordinates:', newLat, newLng);
  
  }}
  mutate={mutate}
/>
        </div>
<div className="mx-2 lg:mx-8 my-6 grid grid-cols-1 md:grid-cols-2 gap-6 font-montserrat"> 
  
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
    <div className='border border-1 rounded-2xl p-6 shadow-sm bg-white relative'>
    
<EditNameTitle
  initialFullName={profileData.full_name}
  initialTitle={profileData.title}
  infoId={userId}
  onUpdateSuccess={(newFullName, newTitle) => {
    console.log('Updated:', newFullName, newTitle);
  }}
  mutate={mutate}
/>
      {/* Profile */}
      <div className="flex items-center gap-8 flex-wrap">
        <div className="shrink-0 relative group">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload} // Use handleImageUploadBase64 if your API expects base64
            className="hidden"
            disabled={isUploading}
          />
          
          {/* Profile Image Container */}
          <div 
            className={`relative ${!isUploading ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            onClick={handleImageClick}
          >
            <Image
              className={`shrink-0 size-48 rounded-full object-cover transition-all duration-300 ${
                !isUploading ? 'group-hover:brightness-75' : 'opacity-75'
              }`}
              src={profileData.profile_image == null ? '/profile.webp':`${process.env.NEXT_PUBLIC_IMAGE}/${profileData.profile_image}`}
              alt="Avatar"
              height={150}
              width={150}
              onError={() => setProfileImage("/profile.webp")} // Fallback on image load error
            />
            
            {/* Overlay with edit icon - shown on hover or when uploading */}
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 rounded-full ${
              isUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}>
              {isUploading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
              ) : (
                <div className="bg-black bg-opacity-50 rounded-full p-3">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
            
            {/* Small edit indicator in corner */}
            <div className={`absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg border transition-opacity duration-300 ${
              isUploading ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
            }`}>
              <Upload className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="grow mt-6">
          <div className='flex gap-4 flex-wrap items-center'>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-neutral-200 font-playfair">
              {profileData.full_name || " "}
            </h1>
            <div className='mt-2'>
                          {profileData.identity_verified == true && profileData.is_email_verified == true && profileData.is_phone_number_verified == true?  
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
            {profileData.title || " "}
          </p>
          <a
            className="text-sm text-gray-500 hover:text-gray-600 hover:decoration-2 focus:outline-hidden focus:decoration-2 dark:text-neutral-500 dark:hover:text-neutral-400"
            
          >
            Joined in {profileData.joined}
          </a>
<div className='mt-2'>
<div className="flex">
  {Array.from({ length: Number(profileData?.hotel_stars) || 0 }).map((_, i) => (
    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
  ))}
</div>


</div>
          
        </div>
      </div>
      {/* End Profile */}

      {/* About */}
      <hr className='mt-8'/>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-2">

<div className="flex items-center gap-x-2.5 text-gray-500">
          <MdAlternateEmail size={24}/>
          <p
            className="text-sm hover:text-gray-600 hover:decoration-2 focus:outline-hidden focus:decoration-2 dark:text-neutral-500 dark:hover:text-neutral-400"
           
          >
            Email: {profileData.email}
          </p>
        </div>
     

       
        
                <div className="flex items-center gap-x-2.5 text-gray-500">
          <CiLocationOn size={24}/>
          <p
            className="text-sm hover:text-gray-600 hover:decoration-2 focus:outline-hidden focus:decoration-2 dark:text-neutral-500 dark:hover:text-neutral-400"
           
          >
            {profileData.address_line_1}, {profileData.city}, {profileData.state}, {profileData.postalCode}, {profileData.countryCode}
          </p>
        </div>
   <div className="flex items-center gap-x-2.5 text-gray-500">
          <CiPhone size={24}/>
          <p
            className="text-sm hover:text-gray-600 hover:decoration-2 focus:outline-hidden focus:decoration-2 dark:text-neutral-500 dark:hover:text-neutral-400"
         
          >
            Phone: {profileData.phoneNumber || "+1 (555) 123-4567"}
          </p>
        </div>

{profileData.website &&
         <div className="flex items-center gap-x-2.5 text-gray-500">
          <MdOutlineTravelExplore size={24}/>
          <p
            className="text-sm hover:text-gray-600 hover:decoration-2 focus:outline-hidden focus:decoration-2 dark:text-neutral-500 dark:hover:text-neutral-400"
       
          >
            Website: {profileData.website}
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

  <div className='border border-1 rounded-2xl p-6 shadow-sm bg-white relative'>
   
      <EditAboutPopup initialAbout={profileData.about} infoId={userId}  mutate={mutate}/>
    <h1 className='font-medium font-playfair text-lg'>About Us</h1>

    {/* About */}
{profileData?.about == null  ? <div className="flex items-center justify-center h-40">
          <p className=" text-2xl md:text-4xl text-gray-300 uppercase font-playfair font-extrabold">add Description</p> 
        </div> 
        :
      <div 
  className="text-sm text-gray-600 dark:text-neutral-400 mt-8 space-y-2 prose-inherit"
  dangerouslySetInnerHTML={{ __html: profileData?.about || '' }}
/>
}

    <hr className='mt-8'/>

    <h1 className="mt-4 mb-4 font-medium font-playfair text-lg">Features</h1>
   
    <AmenitiesSelector  initialAmenities={initialAmenities}
      user={userId} 
      mutate={mutate}
  />
  </div>


</div>
</>
  );
};

export default PartnerProfile;








/** <div className='flex gap-1 items-center'>
              <GoUnverified size={18} className='text-gray-400'/>
              <p className='text-gray-400 text-lg font-medium'>Unverified</p>
            </div>  */