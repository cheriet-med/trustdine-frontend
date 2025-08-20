'use client'

import React, { useState, useEffect } from 'react';
import { Gallery, Item } from 'react-photoswipe-gallery';
import 'photoswipe/dist/photoswipe.css';
import { ChevronLeft, ChevronRight, Camera, X, User } from 'lucide-react';
import Link from 'next/link';
import { Calendar, MapPin, Phone, Mail, Star } from "lucide-react";
import { RiGlobalLine } from "react-icons/ri";
import { GoPencil } from "react-icons/go";
import { LuShare } from "react-icons/lu";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { CiForkAndKnife } from "react-icons/ci";
import { useWishlist } from '@/components/cart';
import { useSession } from 'next-auth/react';
import LoginButton from '@/components/header/loginButton';
import ShareButton from '@/components/Data/shareSocial';
import { TbGridDots } from "react-icons/tb";
import LoginButtonWishlistSinglepage from '@/components/header/loginButtonWishlistSingle';
import LoginButtonAddReview from '@/components/header/LoginButtonAddReview';
import Index from '@/components/Data/singlePageData';
import ReviewsPopup from './reviewspopup';
import { Check, Clock, BarChart3 } from 'lucide-react';
import dynamic from 'next/dynamic';
import useFetchUser from '../requests/fetchUser';
import useFetchListingImages from '../requests/fetchListingImages';


const Map = dynamic(() => import('@/components/Map'), { ssr: false });
interface ImageData {
  src: string;
  width: number;
  height: number;
  alt: string;
  category: string;
  count?: number;
}

interface PropertyCardProps {
  id: string | number | any;
  price: string | number;
  address: string;
  imageUrl: string;
  averageRating: number;
  lengtReviews: string;
  location:string;
 
}


const ImageGalleryModal = ({ images, onClose }: { images: any[], onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 overflow-y-auto">
      <div className="relative w-full h-full p-4">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white z-50 p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-12">
          <Gallery>
            {images.map((image, index) => (
              <Item
                key={index}
                original={`${process.env.NEXT_PUBLIC_IMAGE}/${image.image}`}
                thumbnail={`${process.env.NEXT_PUBLIC_IMAGE}/${image.image}`}
                width={800}
                height={600}
              >
                {({ ref, open }) => (
                  <div
                    ref={ref}
                    onClick={open}
                    className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden cursor-pointer group"
                  >
                    <img
                      src={`${process.env.NEXT_PUBLIC_IMAGE}/${image.image}`}
                      alt="Property image"
                      className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                    />
                  </div>
                )}
              </Item>
            ))}
          </Gallery>
        </div>
      </div>
    </div>
  );
};

const Idcomponent = (dat:any) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const userid = dat.data.user
  const { Users, isLoading, mutate } = useFetchUser(userid);
   const {productimage} = useFetchListingImages(dat.data.id)


const hotelMarkers = [{
  position: [dat.data.latitude || 51.505, dat.data.longtitude || -0.09] as [number, number],
  //popup: listing.name // using the listing name as popup text
}];
  // Calculate center position if hotels exist, otherwise use default
  const centerPosition = 
    [dat.data.latitude || 51.505, dat.data.longtitude || -0.09] as [number, number];


  const { wishlist, addItemToWishlist, removeItemFromWishlist, isItemInWishlist } = useWishlist();
  const { data: session, status } = useSession();

  // Check if current item is in wishlist
  const isInWishlist = isItemInWishlist(dat.data.id);
  const [showGalleryModal, setShowGalleryModal] = useState(false);














  // Handle heart icon click
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the anchor tag from navigating
    e.stopPropagation(); // Stop event bubbling
    
    if (isInWishlist) {
      removeItemFromWishlist(dat.data.id);
    } else {
      // Create wishlist item with simplified structure
      const wishlistItem = {
       id: dat.data.id,
        image: dat.data.image,
        title: dat.data.title,
        dateAdded: "",
        category:"string",
        cuisine:"string",
        price_range:"string",
        rating:4.5,
        name:dat.data.name,
        price:"price",
        location:"location",
        lengtReviews:"lengtReviews"
      };
      addItemToWishlist(wishlistItem);
    }
  };



  // Check if screen is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % productimage.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + productimage.length) % productimage.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };















  return (
     <div className="flex flex-col gap-4">
     
      
      
        <div className="rounded-2xl m-1 sm:m-2 md:m-3 relative">
          <Map
            center={centerPosition}
            zoom={9}
            height="400px"
            markers={hotelMarkers}
          />
        </div>
    <div className="max-w-7xl mx-auto px-2  font-montserrat ">
          <div className="space-y-2 mb-4 bg-white p-4 rounded-xl shadow-sm">
           <div className='flex flex-wrap gap-4 items-center'>
               <p className='py-1.5 px-16 bg-accent text-white font-playfair rounded-3xl w-fit font-bold'>Book Now</p>
               <div className='flex gap-1 items-center'>
                 <Check className="w-5 h-5 text-accent" />
                  <p className='text-accent font-medium'>Guents aveskient service</p>
               </div>
          
            </div>
           
              <h1 className="text-3xl lg:text-4xl font-bold font-playfair text-gray-900">
               {dat.data.name} 
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold text-gray-900">4.2</span>
                    <div className="flex">
                      {[...Array(4)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                      ))}
                      <Star className="w-4 h-4 text-gray-300" />
                    </div>
                  </div>
                  <span className="text-accent font-medium">Good</span>
                  <span className='underline'>(8,684 reviews)</span>
                </div>
                <ReviewsPopup/>
              </div>
              <p className='text-accent font-semibold font-playfair '>What guests love: Exceptional service, quiet rooms, and great location. Some noted the restaurant
could improve pricing</p>
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin className="w-4 h-4" />
                <span className='underline'>{Users?.address_line_1}, {Users?.city}, {Users?.state} {Users?.countryCode}, {Users?.postalCode} </span>
              </div>

<div className='flex justify-between flex-wrap gap-4'>
              <div className="flex flex-wrap items-center gap-4 ">
                 <div className='flex items-center hover:underline'>
                <RiGlobalLine className="w-4 h-4 mr-2 "/>
                <p >
                  Visit hotel website
                </p>
                </div>
                <div className='flex items-center'>
               <Phone className="w-4 h-4 mr-2" /> 
               <p >
                  {Users?.phoneNumber}
                  
                </p></div>
                <div className='flex  items-center'>
                  <Mail className="w-4 h-4 mr-2" />
                  <p className='underline'>
                     E-mail hotel
                  </p>
                 
                </div>


              
               
              </div>
              <div className='flex gap-4 items-center'>
                 
   
            
              <ShareButton/>

               {
                          status === "authenticated" ?
                          
                        
               (
                            isInWishlist ?    
                            <button onClick={handleWishlistToggle} className='border border-1 border-black px-4 py-1 rounded-3xl flex gap-2 items-center' >
                             <FaHeart size={18} className="text-secondary" />
                              <p className='text-bold'>Save</p>
                          </button> : 
                           <button onClick={handleWishlistToggle} className='border border-1 border-black px-4 py-1 rounded-3xl flex gap-2 items-center' >
                         
              
                              <FaRegHeart size={18} className="text-gray-600 group-hover:text-accent transition-colors" />
                              <p className='text-bold'>Save</p>
                           
                         </button>
                         
                        )   
                       :
                         (
                          <LoginButtonWishlistSinglepage />
                        )}
              </div>
              </div>
            </div>

      <Gallery>
        {/* Desktop Grid Layout */}
        <div className="hidden md:grid md:grid-cols-4 md:gap-4 relative">
          {/* Main large image */}
          <div className="md:col-span-2 md:row-span-2">
            <Item
              original={`${process.env.NEXT_PUBLIC_IMAGE}/${dat.data.image}`}
              thumbnail={`${process.env.NEXT_PUBLIC_IMAGE}/${dat.data.name}`}
              width={800}
              height={600}
            >
              {({ ref, open }) => (
                <div
                  ref={ref}
                  onClick={open}
                  className="relative w-full h-[500px] bg-gray-200 rounded-lg overflow-hidden cursor-pointer group"
                >
                  <img
                    src={`${process.env.NEXT_PUBLIC_IMAGE}/${dat.data.image}`}
                    alt={`${process.env.NEXT_PUBLIC_IMAGE}/${dat.data.name}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
                </div>
              )}
            </Item>
          </div>

          {/* Side images */}
          {productimage?.map((image, index) => (
            <Item
              key={index + 1}
              original={`${process.env.NEXT_PUBLIC_IMAGE}/${image.image}`}
              thumbnail={`${process.env.NEXT_PUBLIC_IMAGE}/${image.image}`}
              width={800}
              height={600}
            >
              {({ ref, open }) => (
                <div
                  ref={ref}
                  onClick={open}
                  className="relative w-full h-45 bg-gray-200 rounded-lg overflow-hidden cursor-pointer group"
                >
                  <img
                    src={`${process.env.NEXT_PUBLIC_IMAGE}/${image.image}`}
                    alt="images"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
                  
                
                  
           
                </div>
              )}
            </Item>
          ))}

          <button className='text-a bg-white px-4 py-1 rounded-3xl  absolute right-4 bottom-4 flex gap-1 items-center'
         
          onClick={() => setShowGalleryModal(true)}
          >
<TbGridDots size={18}/>
            <p >Show All Images </p>
          </button>
          
        </div>

        {/* Mobile Slider Layout */}
        <div className="md:hidden">
          <div className="relative">
            <div className="overflow-hidden rounded-lg">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {productimage?.map((image, index) => (
                  <Item
                    key={index}
                    original={`${process.env.NEXT_PUBLIC_IMAGE}/${image.image}`}
                    thumbnail={`${process.env.NEXT_PUBLIC_IMAGE}/${image.image}`}
                    width={800}
                    height={600}
                  >
                    {({ ref, open }) => (
                      <div
                        ref={ref}
                        onClick={open}
                        className="relative w-full h-96 bg-gray-200 flex-shrink-0 cursor-pointer"
                      >
                        <img
                          src={`${process.env.NEXT_PUBLIC_IMAGE}/${image.image}`}
                          alt="images"
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Category badge */}
                      
                        
                       
                      </div>
                    )}
                  </Item>
                ))}
              </div>
            </div>

            {/* Navigation buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-opacity"
            >
              <ChevronLeft size={20} />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-opacity"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Slide indicators */}
          <div className="flex justify-center mt-4 space-x-2">
            {productimage?.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-secondary' : 'bg-accent'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Additional grid for remaining images on desktop */}

      </Gallery>

 {showGalleryModal && (
  <ImageGalleryModal 
    images={productimage} 
    onClose={() => setShowGalleryModal(false)} 
  />
)}


    <Index info={dat.data}/>
    </div>
    </div>
  );
};

export default Idcomponent;





/** {
                          status === "authenticated" ?   <Link href="/en/account/receipt-validation">
                <div className='flex items-center hover:underline'>
                <GoPencil className="w-4 h-4 mr-2"/>
                 <p >
                  Write a review
                </p></div>
                </Link> :
                <LoginButtonAddReview/>
                            
            } */