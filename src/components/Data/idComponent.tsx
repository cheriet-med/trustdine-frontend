'use client'

import React, { useState, useEffect } from 'react';
import { Gallery, Item } from 'react-photoswipe-gallery';
import 'photoswipe/dist/photoswipe.css';
import { ChevronLeft, ChevronRight, Camera, X } from 'lucide-react';
import Link from 'next/link';
import { Calendar, MapPin, Phone, Mail, Star, Users, Bed, Wifi, Car, Coffee, Dumbbell, Utensils, Shield, Thermometer, Bath, Plus, Minus, ThumbsUp, Flag } from "lucide-react";
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


const ImageGalleryModal = ({ images, onClose }: { images: ImageData[], onClose: () => void }) => {
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
                original={image.src}
                thumbnail={image.src}
                width={image.width}
                height={image.height}
              >
                {({ ref, open }) => (
                  <div
                    ref={ref}
                    onClick={open}
                    className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden cursor-pointer group"
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                    />
                    {image.category && (
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                        {image.category}
                      </div>
                    )}
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

const Idcomponent: React.FC<PropertyCardProps> = ({
  id,
  
  address,
 
  imageUrl,

}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);


  const { wishlist, addItemToWishlist, removeItemFromWishlist, isItemInWishlist } = useWishlist();
  const { data: session, status } = useSession();
  // Check if current item is in wishlist
  const isInWishlist = isItemInWishlist(id);


  const [showGalleryModal, setShowGalleryModal] = useState(false);














  // Handle heart icon click
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the anchor tag from navigating
    e.stopPropagation(); // Stop event bubbling
    
    if (isInWishlist) {
      removeItemFromWishlist(id);
    } else {
      // Create wishlist item with simplified structure
      const wishlistItem = {
       id: id+"htl",
        image: imageUrl,
        title: address,
        dateAdded: "",
        category:"string",
        cuisine:"string",
        price_range:"string",
        rating:4.5,
        name:address,
        price:"price",
        location:"location",
        lengtReviews:"lengtReviews"
      };
      addItemToWishlist(wishlistItem);
    }
  };


  // Sample restaurant images data
  const images: ImageData[] = [
    {
      src: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop',
      width: 800,
      height: 600,
      alt: 'Grilled steak with garnish',
      category: 'Food',
      count: 156
    },
    {
      src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
      width: 800,
      height: 600,
      alt: 'Restaurant interior',
      category: 'Interior',
      count: 50
    },
    {
      src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
      width: 800,
      height: 600,
      alt: 'Restaurant menu',
      category: 'Menu',
      count: 7
    },
    {
      src: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop',
      width: 800,
      height: 600,
      alt: 'Gourmet pizza',
      category: 'Food'
    },
    {
      src: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop',
      width: 800,
      height: 600,
      alt: 'Fine dining setup',
      category: 'Interior'
    },
    {
      src: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop',
      width: 800,
      height: 600,
      alt: 'Pasta dish',
      category: 'Food'
    },
    {
      src: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop',
      width: 800,
      height: 600,
      alt: 'Bar area',
      category: 'Interior'
    },
    {
      src: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop',
      width: 800,
      height: 600,
      alt: 'Dessert plating',
      category: 'Food'
    }
  ];

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
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };















  return (
    <div className="max-w-7xl mx-auto px-2  font-montserrat ">
          <div className="space-y-2 mb-4 bg-white p-4 rounded-xl shadow-sm">
              <h1 className="text-3xl lg:text-4xl font-bold font-playfair text-gray-900">
                Intercontinental New York Times Square, an IHG hotel
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
                
              </div>

              <div className="flex items-center gap-2 text-gray-500">
                <MapPin className="w-4 h-4" />
                <span className='underline'>300 West 44th Street, New York City, NY 10036</span>
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
                  
                  001 877-859-5095
                </p></div>
                <div className='flex  items-center'>
                  <Mail className="w-4 h-4 mr-2" />
                  <p className='underline'>
                     E-mail hotel
                  </p>
                 
                </div>

 {
                          status === "authenticated" ?   <Link href="/en/account/receipt-validation">
                <div className='flex items-center hover:underline'>
                <GoPencil className="w-4 h-4 mr-2"/>
                 <p >
                  Write a review
                </p></div>
                </Link> :
                <LoginButtonAddReview/>
                            
            }
              
               
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
              original={images[0].src}
              thumbnail={images[0].src}
              width={images[0].width}
              height={images[0].height}
            >
              {({ ref, open }) => (
                <div
                  ref={ref}
                  onClick={open}
                  className="relative w-full h-[500px] bg-gray-200 rounded-lg overflow-hidden cursor-pointer group"
                >
                  <img
                    src={images[0].src}
                    alt={images[0].alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
                </div>
              )}
            </Item>
          </div>

          {/* Side images */}
          {images.slice(1, 5).map((image, index) => (
            <Item
              key={index + 1}
              original={image.src}
              thumbnail={image.src}
              width={image.width}
              height={image.height}
            >
              {({ ref, open }) => (
                <div
                  ref={ref}
                  onClick={open}
                  className="relative w-full h-45 bg-gray-200 rounded-lg overflow-hidden cursor-pointer group"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
                  
                
                  
                  {/* Count badge for last image */}
                  {index === 2 && image.count && (
                    <div className="absolute bottom-2 right-2 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Camera size={14} />
                      {image.count}
                    </div>
                  )}
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
                {images.map((image, index) => (
                  <Item
                    key={index}
                    original={image.src}
                    thumbnail={image.src}
                    width={image.width}
                    height={image.height}
                  >
                    {({ ref, open }) => (
                      <div
                        ref={ref}
                        onClick={open}
                        className="relative w-full h-64 bg-gray-200 flex-shrink-0 cursor-pointer"
                      >
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Category badge */}
                        <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                          {image.category}
                        </div>
                        
                        {/* Count badge */}
                        {image.count && (
                          <div className="absolute bottom-2 right-2 bg-accent text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                            <Camera size={14} />
                            {image.count}
                          </div>
                        )}
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
            {images.map((_, index) => (
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
          images={images} 
          onClose={() => setShowGalleryModal(false)} 
        />
      )}


    <Index/>
    </div>
  );
};

export default Idcomponent;