'use client'

import React, { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, MapPin, Phone, Mail, Star,  Bed, Wifi, Car, Coffee, ChefHat, Dumbbell, Utensils, Shield, Thermometer, Bath, Plus, Minus, ThumbsUp, Flag, User } from "lucide-react";
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import Image from "next/image";
import ModernDateRangePicker from "./datePicker";
import Link from "next/link";
import VerifiedBadge from "../verified";
import useFetchUser from '../requests/fetchUser';
import useFetchAmenities from '../requests/fetchAmenities';
import useFetchLanguages from '../requests/fetchLanguage';
import DOMPurify from 'dompurify';
import { LuUsersRound } from "react-icons/lu";
import { FaClock } from "react-icons/fa";
import useFetchAwards from "../requests/fetchAwards";
import useFetchNearby from "../requests/fetchNearby";
import useFetchReviews from '../requests/fetchReviews';
import ReviewsCart from "./reviewsCart";
import StarRating from "../starsComponent";
import HotelBookingComponent from "../requests/submitHotelBooking";
import RestaurantBookingComponent from "../requests/submitRestaurantReservations";
import { SiMyspace } from "react-icons/si";
import { SlSizeFullscreen } from "react-icons/sl";
import { GiCalendarHalfYear } from "react-icons/gi";



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


// Theme Configuration
const theme = {
  colors: {
    accent: "bg-white",
    foreground: "text-gray-900",
    mutedForeground: "text-gray-500",
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900",
    destructive: "bg-red-600 hover:bg-red-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-white",
    info: "bg-blue-500 hover:bg-blue-600 text-white",
    border: "border-gray-200",
    input: "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
    ring: "ring-blue-500",
    card: "bg-white border border-gray-200 shadow-sm",
    badge: {
      default: "bg-gray-100 text-gray-800",
      secondary: "bg-blue-100 text-blue-800",
      destructive: "bg-red-100 text-red-800",
      outline: "border border-gray-300 bg-transparent"
    }
  },
  spacing: {
    px: "px-[1px]",
    0: "p-0",
    0.5: "p-0.5",
    1: "p-1",
    1.5: "p-1.5",
    2: "p-2",
    2.5: "p-2.5",
    3: "p-3",
    3.5: "p-3.5",
    4: "p-4",
    5: "p-5",
    6: "p-6",
    7: "p-7",
    8: "p-8",
    9: "p-9",
    10: "p-10",
    11: "p-11",
    12: "p-12",
    14: "p-14",
    16: "p-16",
    20: "p-20",
    24: "p-24",
    28: "p-28",
    32: "p-32",
    36: "p-36",
    40: "p-40",
    44: "p-44",
    48: "p-48",
    52: "p-52",
    56: "p-56",
    60: "p-60",
    64: "p-64",
    72: "p-72",
    80: "p-80",
    96: "p-96"
  },
  borderRadius: {
    none: "rounded-none",
    sm: "rounded-sm",
    DEFAULT: "rounded",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
    full: "rounded-full"
  }
};

// Card Component
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={`${theme.colors.card} ${theme.borderRadius.lg} ${className || ''}`}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={`flex flex-col space-y-1.5 p-6 ${className || ''}`}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={`text-2xl font-semibold leading-none tracking-tight ${className || ''}`}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={`text-sm ${theme.colors.mutedForeground} ${className || ''}`}
      {...props}
    />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={`p-6 pt-0 ${className || ''}`} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={`flex items-center p-6 pt-0 ${className || ''}`}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

// Button Component
const Button = React.forwardRef<HTMLButtonElement, 
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
  }>(({ className, variant = 'default', size = 'default', ...props }, ref) => {
    
  const variantClasses = {
    default: theme.colors.primary,
    destructive: theme.colors.destructive,
    outline: `border ${theme.colors.border} bg-transparent hover:bg-gray-100`,
    secondary: theme.colors.secondary,
    ghost: "hover:bg-gray-100 hover:text-gray-900",
    link: "text-blue-600 underline-offset-4 hover:underline"
  };
  
  const sizeClasses = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
    icon: "h-10 w-10"
  };
  
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 ${variantClasses[variant]} ${sizeClasses[size]} ${className || ''}`}
      ref={ref}
      {...props}
    />
  )
});
Button.displayName = "Button";

// Input Component
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`flex h-10 w-full rounded-md border ${theme.colors.input} bg-accent px-3 py-2 text-base ring-offset-accent file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${className || ''}`}
        ref={ref}
        {...props}
      />
    )
  }
);
Input.displayName = "Input";

// Label Component
const Label = React.forwardRef<HTMLLabelElement, React.ComponentProps<"label">>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className || ''}`}
      {...props}
    />
  )
);
Label.displayName = "Label";

// Separator Component
const Separator = React.forwardRef<HTMLDivElement, React.ComponentProps<"div"> & {
  orientation?: 'horizontal' | 'vertical';
}>(
  ({ className, orientation = 'horizontal', ...props }, ref) => (
    <div
      ref={ref}
      className={`shrink-0 ${theme.colors.border} ${
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]'
      } ${className || ''}`}
      {...props}
    />
  )
);
Separator.displayName = "Separator";

// Badge Component
const Badge = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement> & {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}>(({ className, variant = 'default', ...props }, ref) => {
  const variantClasses = {
    default: theme.colors.badge.default,
    secondary: theme.colors.badge.secondary,
    destructive: theme.colors.badge.destructive,
    outline: theme.colors.badge.outline
  };
  
  return (
    <span
      ref={ref}
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className || ''}`}
      {...props}
    />
  )
});
Badge.displayName = "Badge";

// Main Index Component
const Index = ({info}:any) => {
  const userid = info.id



  // const { Users, isLoading, mutate } = useFetchUser(info.user);
    const { Amenitie, error: amenitiesError } = useFetchAmenities(info.user);
    const { Users, isLoading, mutate } = useFetchUser(info.user);
    const { Languages } = useFetchLanguages(info.user);
    const { Nearbies } = useFetchNearby(userid);
    const { Awards } = useFetchAwards(userid);
    const {Review} = useFetchReviews(info.id)

  const averageRating = Review && Review.length > 0
  ? Review.reduce((sum, r) => sum + +r.rating_global, 0) / Review.length
  : 0;
  const [guests, setGuests] = useState({ rooms: 1, adults: 2, children: 0 });
  const [showGuestSelector, setShowGuestSelector] = useState(false);
  const [partner, setPartner] = useState(false);

  const updateGuests = (type: keyof typeof guests, increment: boolean) => {
    setGuests(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + (increment ? 1 : -1))
    }));
  };

  
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
  

  return (
    <div className="font-montserrat">
      {/* Header */}
      <div className="container mx-auto  py-6">
        <div className="flex flex-col lg:flex-row gap-2">
          {/* Main Content */}
          <div className="flex-1 space-y-2">
           
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle className="font-playfair">About</CardTitle>

              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-2 flex-wrap">

                  {info.organic_ingredients?  <p className="py-1.5 px-4 bg-highlights text-white font-semibold w-fit rounded-xl">Organic Ingredients</p> : ""}
                  {info.organic_ingredients?    <p className="py-1.5 px-4 bg-highlights text-white font-semibold w-fit rounded-xl">Sustainable Seafood</p> : ""}
                 
                </div>
              
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 font-playfair">Property amenities</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {Amenitie.filter(post => post.categoty != 'Food & Dining').map((amenity, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                           {amenityIcons[amenity.name] || <FaCampground className="text-lg" />}
                          <span className=" text-gray-600">{amenity.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 font-playfair">Food & Dining</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {Amenitie.filter(post => post.categoty == 'Food & Dining').map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          {amenityIcons[feature.name] || <FaCampground className="text-lg" />}
                          <span className=" text-gray-600">{feature.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 text-gray-500">
               
                   
<div 
   className="text-gray-500 leading-relaxed prose-inherit"
   dangerouslySetInnerHTML={{ __html: info.description || '' }}
/>

        -------

<div 
   className="text-gray-500 leading-relaxed prose-inherit"
   dangerouslySetInnerHTML={{ __html: Users?.about || '' }}
/>    
</div>
<hr />

{info.category == "Restaurant" ?
  <div>
                    <h4 className="font-semibold mb-4 font-playfair">Opening Hours</h4>
                   <div className="text-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">

                     <div className="flex gap-2">
                      <FaClock className="text-lg text-gray-400" />
                        <p className="text-gray-500"><span className="font-medium font-playfair text-gray-800">Saturday :</span> {info.opening_hours_saturday == "" ? "Close" : info.opening_hours_saturday}</p>
                     </div>
                      <div className="flex gap-2">
                      <FaClock className="text-lg text-gray-400" />
                      <p className="text-gray-500"><span className="font-medium font-playfair text-gray-800">Sunday :</span> {info.opening_hours_sunday == "" ? "Close" : info.opening_hours_sunday}</p>
                     </div>
                       </div>
 <div className="space-y-2">
   <div className="flex gap-2">
                      <FaClock className="text-lg text-gray-400" />
                       <p className="text-gray-500"><span className="font-medium font-playfair text-gray-800">Thursday :</span> {info.opening_hours_thursday == "" ? "Close" : info.opening_hours_thursday}</p>
                     </div>
 <div className="flex gap-2">
                      <FaClock className="text-lg text-gray-400" />
                      <p className="text-gray-500"><span className="font-medium font-playfair text-gray-800">Tuesday :</span> {info.opening_hours_tuesday == "" ? "Close" : info.opening_hours_tuesday}</p>
 </div> </div>

 <div className="space-y-2">
    <div className="flex gap-2">
                      <FaClock className="text-lg text-gray-400" />
                       <p className="text-gray-500"><span className="font-medium font-playfair text-gray-800">Wednesday :</span> {info.opening_hours_wednesday == "" ? "Close" : info.opening_hours_wednesday}</p>
                      </div>

                       <div className="flex gap-2">
                      <FaClock className="text-lg text-gray-400" />
                      <p className="text-gray-500"><span className="font-medium font-playfair text-gray-800">Friday :</span> {info.opening_hours_friday == "" ? "Close" : info.opening_hours_friday}</p>
 </div> </div>

   <div className="flex gap-2">
                      <FaClock className="text-lg text-gray-400" />
                       <p className="text-gray-500"><span className="font-medium font-playfair text-gray-800">Monday :</span> {info.opening_hours_monday == "" ? "Close" : info.opening_hours_monday}</p>
                    </div> 
                    </div>

                  </div>
:""}

                <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4 ">
                
                  <div>
                    {info.category == "Restaurant" ?  <h4 className="font-semibold mb-2 font-playfair">Restaurant type</h4> : <h4 className="font-semibold mb-2 font-playfair">Room type</h4> }
                   
                    <div className="flex gap-4 text-sm">
                      <p className="py-2 px-4 bg-gray-100 rounded-3xl capitalize">{info.types}</p>
                    </div>
                   {info.category == "Restaurant" ? 
                   <div className="flex gap-2 flex-wrap  mt-4">

                    <div className="text-sm text-white bg-highlights w-fit py-1 px-4 rounded-3xl capitalize font-bold  flex gap-2 items-center" >
                    <GiCalendarHalfYear className="w-5 h-5"/>
                    <p>Established - {info.established}</p>
                   </div>

                  <div className="text-sm text-white bg-highlights w-fit py-1 px-4 rounded-3xl capitalize font-bold  flex gap-2 items-center" >
                    <SlSizeFullscreen className="w-5 h-5"/>
                    <p>Space - {info.size}</p>
                   </div>

                  <div className="text-sm text-white bg-highlights w-fit py-1 px-4 rounded-3xl capitalize font-bold  flex gap-2 items-center" >
                    <SiMyspace className="w-5 h-5"/>
                    <p>Capacity - {info.capacity} person</p>
                   </div>

                    <div className="text-sm text-white bg-highlights w-fit py-1 px-4 rounded-3xl capitalize font-bold flex gap-2 items-center" >
                    <ChefHat className="w-5 h-5"/>
                    <p>Chef - {info.chef}</p>
                   </div>
                   </div>
                   
                    :<div className="flex gap-2 flex-wrap  mt-4">

                    <div className="text-sm text-white bg-highlights w-fit py-1 px-4 rounded-3xl capitalize font-bold  flex gap-2 items-center" >
                    <GiCalendarHalfYear className="w-5 h-5"/>
                    <p>Established - {info.established}</p>
                   </div>

                  <div className="text-sm text-white bg-highlights w-fit py-1 px-4 rounded-3xl capitalize font-bold  flex gap-2 items-center" >
                    <SlSizeFullscreen className="w-4 h-4"/>
                    <p>Space - {info.size}</p>
                   </div>

                  <div className="text-sm text-white bg-highlights w-fit py-1 px-4 rounded-3xl capitalize font-bold  flex gap-2 items-center" >
                    <SiMyspace className="w-5 h-5"/>
                    <p>Capacity - {info.capacity} person</p>
                   </div>

                   </div>}
                  </div>
                  <Link href={`/en/profile/${Users?.id}`}>
                 <div className="flex items-center gap-5 justify-start flex-wrap">

                        <div className="w-32 md:w-24 h-32 md:h-24 relative rounded-full overflow-hidden ">
                          <Image
                            src={Users?.profile_image == null ? '/profile.webp':`${process.env.NEXT_PUBLIC_IMAGE}/${Users?.profile_image}`}
                            alt="image"
                            fill // This makes the image fill the container
                            style={{ 
                              objectFit: 'cover', // This ensures the image covers the area while maintaining aspect ratio
                            }}
                          />
                        </div>
                        <div >
                          <p className="font-semibold font-playfair hover:underline text-2xl">{Users?.full_name}</p>
                           <p className="text-sm font-medium text-gray-500 hover:underline mb-2">{Users?.title}</p>
                             {Users?.identity_verified && Users?.is_email_verified && Users?.is_phone_number_verified ? (
                                    <div className="relative h-8 w-8">
                                      <Image
                                        src="/guarantee.png"
                                        alt="logo"
                                        fill
                                        sizes="100%"
                                        style={{ objectFit: 'contain' }}
                                        priority
                                      />
                                    </div>
                            ) : null}
                        </div>
                      </div>
                      </Link>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2 font-playfair">Hotel Class</h4>
                      <div className="flex">
                        {Array.from({ length: Number(Users?.hotel_stars) || 0 }).map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                        ))}
                      </div>
                      
                    </div>
                    <div> 
                      <h4 className="font-semibold mb-2 font-playfair">Languages Spoken</h4>
                     <div className="flex gap-2">
                                    {Languages.map((feature, index) => (

                      <p className="text-sm text-gray-500 bg-gray-50 py-1 px-3 rounded-3xl capitalize" key={index}>{feature.language}</p>
                       ))}  
                      </div> 

                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                   {Nearbies.length == 0 ? "" :
                    <div>
                      <h4 className="font-semibold mb-2 font-playfair">Nearby</h4>
                      <div className="flex gap-2 flex-wrap">
                        {Nearbies.map((feature, index) => (
                           <p className="text-sm text-white bg-secondary py-1 px-4 rounded-3xl capitalize font-bold " key={index}>{feature.name}  - {feature.distance}</p>
                        ))}
                      </div>
                    </div>
                    } 
                       {Awards.length == 0 ? "" :
                    <div> 
                      <h4 className="font-semibold mb-2 font-playfair">Awards</h4>
                     <div className="flex gap-2 flex-wrap">
                                    {Awards.map((feature, index) => (

                      <p className="text-sm text-white bg-secondary py-1 px-4 rounded-3xl capitalize font-bold" key={index}>{feature.name}  - {feature.year}</p>
                       ))}  
                      </div> 

                    </div>
                     } 
                  </div>

                </div>
              </CardContent>
            </Card>

            {/* Rating Breakdown Section */}
            <div className="lg:hidden">
  <Card>
              <CardHeader>
                <CardTitle className="font-playfair">Rating Breakdown</CardTitle>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-2xl font-bold text-gray-900">{averageRating}</span>
                  <StarRating rating={averageRating} size={16}/>
                   <span className="text-accent font-medium">{averageRating == 5? "Excellent": (averageRating == 4? "Very Good" :(averageRating == 3? "Good":(averageRating == 2? 	"Poor" : "")))}</span>
                  <span className="text-sm text-gray-500">({Review.length} reviews)</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                    <div className="text-sm text-gray-500 mb-4">#165 of 509 {info.category == "Restaurant" ? "Restaurants" : "Hotels"} in {info.location}</div>
                  
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
              </CardContent>
            </Card>
          </div>
            {/* Reviews Section */}
           <ReviewsCart productID={info.id}/>
          </div>
          {/* Booking Sidebar */}
          <div >
               {/* Rating Breakdown Section */}
            <div className=" sm:mb-2 hidden lg:block">
            <Card>
              <CardHeader>
                <CardTitle className="font-playfair">Rating Breakdown</CardTitle>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-2xl font-bold text-gray-900">{averageRating}</span>
                  <StarRating rating={averageRating} size={16}/>
                   <span className="text-accent font-medium">{averageRating == 5? "Excellent": (averageRating == 4? "Very Good" :(averageRating == 3? "Good":(averageRating == 2? 	"Poor" : "")))}</span>
                  <span className="text-sm text-gray-500">({Review.length} reviews)</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                 
                  <p className="text-sm text-gray-500 mb-4">Detailed Review</p>
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
              </CardContent>
            </Card>
</div>


{/**Booking Form */}
<div id="book">
        {info.category == "Restaurant" ? <RestaurantBookingComponent bookdata={info}/> : <HotelBookingComponent bookdata={info}/>}
</div>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Bottom Reservation Button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold">${info.category == "Restaurant" ? info.average_cost : info.price_per_night}</div>
            <div className="text-sm text-gray-500">{info.category == "Restaurant" ? "average price" : "per night"}</div>
          </div>



           
          <button className="bg-secondary hover:bg-accent text-white px-8 rounded-3xl py-2" onClick={() => {
  const el = document.getElementById("book");
  el?.scrollIntoView({ behavior: "smooth" });
}}>
         {info.category == "Restaurant" ?
   "Reserve Now" : "Book Now"}
          </button>
         

           
       
        
        </div>
      </div>

     
    </div>
  );
};

export default Index;





/** <div className="text-sm text-gray-500 mb-4">#165 of 509 {info.category == "Restaurant" ? "Restaurants" : "Hotels"} in {info.location}</div> */