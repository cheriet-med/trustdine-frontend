'use client'

import React, { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, MapPin, Phone, Mail, Star, Users, Bed, Wifi, Car, Coffee, Dumbbell, Utensils, Shield, Thermometer, Bath, Plus, Minus, ThumbsUp, Flag } from "lucide-react";
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import Image from "next/image";
import ModernDateRangePicker from "./datePicker";
import Link from "next/link";
import VerifiedBadge from "../verified";

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
const Index = () => {
  const [checkInDate, setCheckInDate] = useState("Thu, Jul 17");
  const [checkOutDate, setCheckOutDate] = useState("Tue, Aug 12");
  const [guests, setGuests] = useState({ rooms: 1, adults: 2, children: 0 });
  const [showGuestSelector, setShowGuestSelector] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 7),
      key: 'selection'
    }
  ]);

  const updateGuests = (type: keyof typeof guests, increment: boolean) => {
    setGuests(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + (increment ? 1 : -1))
    }));
  };

  const amenities = [
    { icon: Wifi, label: "Free internet", available: true },
    { icon: Car, label: "Valet parking", available: true },
    { icon: Dumbbell, label: "Fitness Center with Gym / Workout Room", available: true },
    { icon: Utensils, label: "Bar / lounge", available: true },
    { icon: Users, label: "Children Activities (Kid / Family Friendly)", available: true },
    { icon: Shield, label: "Taxi service", available: true },
    { icon: Bed, label: "Babysitting", available: true },
    { icon: Coffee, label: "Coffee / tea maker", available: true },
  ];

  const roomFeatures = [
    { icon: Bath, label: "Bathrobes", available: true },
    { icon: Thermometer, label: "Air conditioning", available: true },
    { icon: Wifi, label: "Desk", available: true },
    { icon: Shield, label: "Housekeeping", available: true },
    { icon: Bed, label: "Interconnected rooms available", available: true },
    { icon: Coffee, label: "Coffee / tea maker", available: true },
    { icon: Bath, label: "Flatscreen TV", available: true },
    { icon: Bath, label: "Bath / shower", available: true },
  ];

  const reviews = [
    {
      id: 1,
      author: "Mary Jo T",
      date: "Jul 8",
      rating: 5,
      title: "Fantastic",
      content: "Great hotel, friendly staff that always goes above and beyond our expectations! Room was larger than most NYC hotels, quiet and the beds luxurious. I've stayed here many times and it just keeps getting better. The restaurant is lovely but a bit overpriced, still found it enjoyable.",
      contributions: 2,
      helpful: 12,
      avatar: "/asset/card-1.avif"
    },
    {
      id: 2,
      author: "David B",
      date: "Jun 2025",
      rating: 5,
      title: "Top-notch Accommodations in a Great Location!",
      content: "We're locals who stayed for one night at this hotel in order to attend a nearby Broadway show and not have to ride the subway back home immediately after. A mini luxury staycation, if you will—which is rather nice to do in your own hometown once in a while. Especially if that hometown is New York City! The Intercontinental is actually only two blocks away from my office during the...",
      contributions: 290,
      helpful: 16,
      favorite: true,
      avatar: "/asset/card-2.avif"
    },
    {
      id: 3,
      author: "Jennifer K",
      date: "May 2025",
      rating: 4,
      title: "Great stay in Times Square",
      content: "Perfect location for Broadway shows. The room was clean and comfortable. Staff was very helpful with recommendations. Only downside was the noise from the street, but that's expected in Times Square.",
      contributions: 45,
      helpful: 8,
      avatar: "/asset/card-3.avif"
    },
    {
      id: 4,
      author: "Robert M",
      date: "Apr 2025",
      rating: 5,
      title: "Exceeded expectations",
      content: "Business trip turned into a wonderful experience. The concierge service was outstanding, room service was prompt, and the fitness center was well-equipped. Will definitely stay here again.",
      contributions: 127,
      helpful: 22,
      avatar: "/asset/card-4.avif"
    }
  ];

  return (
    <div className="min-h-screen font-montserrat">
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
                    <p className="py-1.5 px-4 bg-highlights text-white font-semibold w-fit rounded-xl">Great for Couples</p>
                    <p className="py-1.5 px-4 bg-highlights text-white font-semibold w-fit rounded-xl">Business Trips</p>
                    <p className="py-1.5 px-4 bg-highlights text-white font-semibold w-fit rounded-xl">Vegan Options</p>
                    <p className="py-1.5 px-4 bg-highlights text-white font-semibold w-fit rounded-xl">Ocean View</p>
                </div>
              
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 font-playfair">Property amenities</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <amenity.icon className="w-4 h-4 text-gray-500" />
                          <span>{amenity.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 font-playfair">Room features</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {roomFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <feature.icon className="w-4 h-4 text-gray-500" />
                          <span>{feature.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-gray-500 leading-relaxed">
                    Relish tranquility, and an illustrious take on Manhattan at the InterContinental New York Times Square Hotel. 
                    Gaze out at majestic views of the city with floor-to-ceiling windows from various room accommodations and modern event spaces. 
                    With an unrivaled location, our luxury hotel in the Theater District, places you at the doorstep of Times Square and Broadway Theatres, 
                    and close to iconic sites like Central Park and Rockefeller Center.
                  </p>
                </div>

                <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2 font-playfair">Room types</h4>
                    <div className="flex gap-4 text-sm">
                      <p className="py-2 px-4 bg-gray-100 rounded-3xl">Non-smoking rooms</p>
                      <p className="py-2 px-4 bg-gray-100 rounded-3xl">Suites</p>
                    </div>
                  </div>



                                   <Link href="/en/profile-partner">
                                  <div className="flex items-center gap-3 ">
                        <div className="w-16 h-16 relative rounded-full overflow-hidden">
                          <Image
                            src="/h.jpg"
                            alt="Facebook"
                            fill // This makes the image fill the container
                            style={{ 
                              objectFit: 'cover', // This ensures the image covers the area while maintaining aspect ratio
                            }}
                          />
                        </div>
                        <div>
                          <p className="font-semibold font-playfair hover:underline">Whispering Pines Resort</p>
                            <VerifiedBadge text=' verified'/>
                        </div>
                      </div>
                      </Link>
</div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2 font-playfair">Hotel Class</h4>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 font-playfair">Languages Spoken</h4>
                      <p className="text-sm text-gray-500">English, Spanish</p>
                    </div>
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
                  <span className="text-2xl font-bold text-gray-900">4.2</span>
                  <div className="flex">
                    {[...Array(4)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                    <Star className="w-4 h-4 text-gray-300" />
                  </div>
                  <span className="text-accent font-medium">Good</span>
                  <span className="text-sm text-gray-500">(8,684 reviews)</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-gray-500 mb-4">#165 of 509 hotels in New York City</div>
                  
                  <div className="grid gap-3 md:w-[400px]">
                    {[
                      { label: "Location", score: 4.8, color: "bg-accent" },
                      { label: "Rooms", score: 4.4, color: "bg-accent" },
                      { label: "Value", score: 4.0, color: "bg-accent" },
                      { label: "Cleanliness", score: 4.6, color: "bg-accent" },
                      { label: "Service", score: 4.2, color: "bg-accent" },
                      { label: "Sleep Quality", score: 4.5, color: "bg-accent" }
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
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold font-playfair">Reviews</CardTitle>
                 
                </div>
                
              </CardHeader>
              <CardContent className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="space-y-3 pb-6 border-b border-gray-200 last:border-b-0">
                    <div className="flex items-start justify-between flex-wrap gap-3">
                      <Link href="/en/profile">
                                  <div className="flex items-start gap-3">
                        <div className="w-10 h-10 relative rounded-full overflow-hidden">
                          <Image
                            src={review.avatar}
                            alt="Facebook"
                            fill // This makes the image fill the container
                            style={{ 
                              objectFit: 'cover', // This ensures the image covers the area while maintaining aspect ratio
                            }}
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-secondary hover:underline">{review.author}</p>
                          <p className="text-sm text-gray-500">{review.contributions} contributions</p>
                        </div>
                      </div>
                      </Link>
          
                      {review.favorite && (
                        <Badge className="bg-secondary text-white text-xs">Hotel's Favorite</Badge>
                      )}
                    </div>

                    <div className="flex items-center flex-wrap gap-2 ml-15">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < review.rating ? 'fill-accent text-accent' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="font-semibold text-secondary">{review.title}</span>
                      <span className="text-sm text-gray-500">• {review.date}</span>
                    </div>

                    <p className="text-gray-500 leading-relaxed ml-15">{review.content}</p>

                    <div className="flex items-center justify-between ml-15 flex-wrap">
                      <div className="flex items-center flex-wrap gap-4 text-sm text-gray-500">
                        <span>Date of stay: {review.date}</span>
                        <span>• Trip type: Business</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900">
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          Helpful ({review.helpful})
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900">
                          <Flag className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="text-center pt-4 text-secondary">
                  <Button variant="outline" className="w-full sm:w-auto">
                    View all 8,684 reviews
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>





          {/* Booking Sidebar */}
          <div >
            <Card className="sticky top-6">
              <CardHeader>
              
                 
                    <CardTitle className="text-2xl font-bold text-secondary">$357 <span className="text-base font-medium">For Night</span></CardTitle>
                   
                
                 
             
              </CardHeader>
              <CardContent className="space-y-2">
                <div >
                  <Label className="text-sm font-medium mb-3 block">Lowest prices for your stay</Label>
                

                 <ModernDateRangePicker/>  
          
                </div>
 
                <div className="relative">
                  <button 
                   
                    className="w-full flex justify-center items-center rounded-3xl border border-2 py-3 hover:border-secondary"
                    onClick={() => setShowGuestSelector(!showGuestSelector)}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    {guests.rooms} room, {guests.adults} adults, {guests.children} children
                  </button>
                  
                  {showGuestSelector && (
                    <Card className="absolute top-full left-0 right-0 z-10 mt-2  sm:pb-1">
                      <div className="p-4 space-y-4 ">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Rooms</span>
                          <div className="flex items-center gap-2">
                            <button 
                              
                              className="p-2 rounded-full border border-2 hover:bg-secondary hover:text-white"
                              onClick={() => updateGuests('rooms', false)}
                              disabled={guests.rooms <= 1}
                            >
                              <Minus className="w-4 h-4 " />
                            </button>
                            <span className="w-8 text-center select-none">{guests.rooms}</span>
                            <button 
                              className="p-2 rounded-full border border-2 hover:bg-secondary hover:text-white"
                              onClick={() => updateGuests('rooms', true)}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Adults</span>
                          <div className="flex items-center gap-2">
                            <button
                              className="p-2 rounded-full border border-2 hover:bg-secondary hover:text-white"
                              onClick={() => updateGuests('adults', false)}
                              disabled={guests.adults <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center select-none">{guests.adults}</span>
                            <button 
                               className="p-2 rounded-full border border-2 hover:bg-secondary hover:text-white"
                              onClick={() => updateGuests('adults', true)}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Children</span>
                          <div className="flex items-center gap-2">
                            <button 
                              className="p-2 rounded-full border border-2 hover:bg-secondary hover:text-white"
                              onClick={() => updateGuests('children', false)}
                              disabled={guests.children <= 0}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center select-none">{guests.children}</span>
                            <button 
                              className="p-2 rounded-full border border-2 hover:bg-secondary hover:text-white"
                              onClick={() => updateGuests('children', true)}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <button 
                          className="w-full bg-secondary hover:bg-accent py-2 text-white rounded-3xl"
                          onClick={() => setShowGuestSelector(false)}
                        >
                          Update
                        </button>
                      </div>
                    </Card>
                  )}
                </div>

               
                <Separator />

              <Link href="/en/checkout-booking">
                           <button className="w-full bg-secondary hover:bg-accent text-white font-medium py-3 rounded-3xl">
                  Reserve
                </button>
              </Link>
   

                <p className="text-xs text-gray-500 text-center">
                  Prices are provided by our partners, and reflect nightly room rates.
                </p>
              </CardContent>
            </Card>




               {/* Rating Breakdown Section */}
            <div className="mt-2 hidden lg:block">
            <Card>
              <CardHeader>
                <CardTitle className="font-playfair">Rating Breakdown</CardTitle>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-2xl font-bold text-gray-900">4.2</span>
                  <div className="flex">
                    {[...Array(4)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                    <Star className="w-4 h-4 text-gray-300" />
                  </div>
                  <span className="text-accent font-medium">Good</span>
                  <span className="text-sm text-gray-500">(8,684 reviews)</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-gray-500 mb-4">#165 of 509 hotels in New York City</div>
                  
                  <div className="grid gap-3 md:w-[400px]">
                    {[
                      { label: "Location", score: 4.8, color: "bg-accent" },
                      { label: "Rooms", score: 4.4, color: "bg-accent" },
                      { label: "Value", score: 4.0, color: "bg-accent" },
                      { label: "Cleanliness", score: 4.6, color: "bg-accent" },
                      { label: "Service", score: 4.2, color: "bg-accent" },
                      { label: "Sleep Quality", score: 4.5, color: "bg-accent" }
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
          </div>
        </div>
      </div>

      {/* Mobile Fixed Bottom Reservation Button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold">$357</div>
            <div className="text-sm text-gray-500">per night</div>
          </div>
           <Link href="/en/checkout-booking">
          <button className="bg-secondary hover:bg-accent text-white px-8 rounded-3xl py-2">
            Reserve Now
          </button>
          </Link>
        </div>
      </div>

      {/* Mobile bottom padding to prevent content being hidden behind fixed button */}
      <div className="lg:hidden h-32"></div>
    </div>
  );
};

export default Index;