'use client'

import React, { useState } from "react";
import { Star } from "lucide-react";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import Image from "next/image";
import Link from "next/link";
import useFetchReviews from "@/components/requests/fetchReviews";
import ReportPopup from "@/components/requests/sendReportReview";
import useFetchImageReviews from "@/components/requests/fetchImageReviews";
import useFetchAllUser from "@/components/requests/fetchAllUsers";
import useFetchAllReviews from "@/components/requests/fetchAllReviews";
import { useSession } from "next-auth/react";
import useFetchAllHelpfullReviews from "@/components/requests/fetchAllHelpfulReviews";
import { AiFillLike } from "react-icons/ai";
import { AiOutlineLike } from "react-icons/ai";
import { Gallery, Item } from 'react-photoswipe-gallery';
import 'photoswipe/dist/photoswipe.css';
import LoginButtonReport from "@/components/header/loginButtonReportReview";
import LoginButtonHelpFull from "@/components/header/loginButtonHelpful";


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
const ReviewsCart = ({productID}:any) => {
  // const { Users, isLoading, mutate } = useFetchUser(info.user);
const { AllUsers, isLoading } = useFetchAllUser();
//console.log("this is the product id for fetch reviews",productID)
const {Review} = useFetchReviews(productID)
const {ImageReviews} = useFetchImageReviews()
const {AllReview} =useFetchAllReviews()
const { data: session, status } = useSession();
const {AllHelpfullReview, mutate} = useFetchAllHelpfullReviews()

const [visibleCount, setVisibleCount] = useState(10);

const handleLoadMore = () => {
  setVisibleCount((prev) => prev + 10);
};



const handleSubmit = async (userid:any, reviewid:any) => {
     
   try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}reviewhlpful/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
        },
        body: JSON.stringify({ user: userid, review: reviewid }),
      });

      if (!response.ok) {
        throw new Error('Failed to add helpfull');
      }
       // Trigger SWR revalidation to refresh the data
      if (mutate) {
        await mutate();
      }
    } catch (err) {
      console.error('Error adding helpfull:', err);
      // Revert the change if API call fails
    }

  };



const handleDelete = async (id:any) => {
     
   try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}reviewhlpfulid/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to add helpfull');
      }
       // Trigger SWR revalidation to refresh the data
      if (mutate) {
        await mutate();
      }
    } catch (err) {
      console.error('Error adding helpfull:', err);
      // Revert the change if API call fails
    }
  };




  

  return (
   <div>
            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold font-playfair">Reviews</CardTitle>
                 
                </div>
                
              </CardHeader>
              <CardContent className="space-y-6">
                {Review.slice(0, visibleCount).map((review) => (
                  <div key={review.id} className="space-y-3 pb-6 border-b border-gray-200 last:border-b-0">
                    <div className="flex items-start justify-between flex-wrap gap-3">
                      <Link href={`/en/profile/${AllUsers.find((user) => user.id === +review.user)?.id}`}>
                                  <div className="flex items-start gap-3">
                        <div className="w-10 h-10 relative rounded-full overflow-hidden">
                          <Image
                            src={AllUsers.find((user) => user.id === +review.user)?.profile_image == null ? '/profile.webp' :`${process.env.NEXT_PUBLIC_IMAGE}/${AllUsers.find((user) => user.id === +review.user)?.profile_image}`}
                            alt="Facebook"
                            fill // This makes the image fill the container
                            style={{ 
                              objectFit: 'cover', // This ensures the image covers the area while maintaining aspect ratio
                            }}
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-secondary hover:underline">
                             {AllUsers.find((user) => user.id === +review.user)?.full_name || "Unknown User"}
                          </p>
                          <p className="text-sm text-gray-500">
                           {AllReview.filter(r => +r.user === +review.user).length} contributions</p>
                        </div>
                      </div>
                      </Link>
          
                      {review.description && (
                        AllReview.filter(r => +r.user === +review.user).length > 50 ? 
                        <Badge className="bg-secondary text-white text-xs">Favorite Member</Badge> : ""
                      )}
                    </div>

                    <div className="flex items-center flex-wrap gap-2 ml-15">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < +review.rating_global ? 'fill-accent text-accent' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="font-semibold text-secondary">{review.title}</span>
                      <span className="text-sm text-gray-500">• {review.created_at}</span>
                    </div>

                    <p className="text-gray-500 leading-relaxed ml-15">{review.description}</p>

<Gallery>
  <div className="flex flex-wrap gap-2">
    {ImageReviews
      .filter((img) => +img.ProductReview === +review.id) // show only images for this review
      .map((reviewimage) => (
        <Item
          key={reviewimage.id}
          original={`${process.env.NEXT_PUBLIC_IMAGE}/${reviewimage.image}`}
          thumbnail={`${process.env.NEXT_PUBLIC_IMAGE}/${reviewimage.image}`}
          width="1200"
          height="800"
        >
          {({ ref, open }) => (
            <div
              ref={ref}
              onClick={open}
              className="w-24 h-24 rounded-xl relative overflow-hidden cursor-pointer"
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_IMAGE}/${reviewimage.image}`}
                alt="Review"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          )}
        </Item>
      ))}
  </div>
</Gallery>


                    <div className="flex items-center justify-between ml-15 flex-wrap">
                      <div className="flex items-center flex-wrap gap-4 text-sm text-gray-500">
                        <span>Date of stay: {review.stay_date}</span>
                        <span>• Trip type: {review.trip_type}</span>
                      </div>
                      <div className="flex items-center gap-2">

 { status === "authenticated" ?
                    (AllHelpfullReview.filter(r => +r.user === +review.user).length == 1 ?
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900" onClick={()=>handleDelete(AllHelpfullReview.find((user) => user.user === +review.user)?.id)}>
                          <AiFillLike size={24} className=" mr-1 text-secondary" />
                          Helpful {" "} {AllHelpfullReview.filter(r => +r.review === +review.id).length}
                        </Button>
                        :
                         <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900" onClick={()=>handleSubmit(AllUsers.find((user) => user.id === +review.user)?.id,review.id)}>
                          <AiOutlineLike size={24} className=" mr-1" />
                          Helpful {" "} {AllHelpfullReview.filter(r => +r.review === +review.id).length}
                        </Button>)

                        :  
                        <div className="flex  items-center">
                             <LoginButtonHelpFull/>

                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900" >
                         
                          Helpful {" "} {AllHelpfullReview.filter(r => +r.review === +review.id).length}
                        </Button>
                        </div>

                        
                        }

                        { status === "authenticated" ? <ReportPopup reviewid={review.id}/>:  <LoginButtonReport/>}
                       
                      </div>
                    </div>
                  </div>
                ))}
                 {visibleCount < Review.length && (
       <div className="text-center pt-4 text-secondary">
                  <Button variant="outline" className="w-full sm:w-auto" onClick={handleLoadMore}>
                    View all {Review.length} reviews
                  </Button>
                </div>
      )}
          </CardContent>
          </Card>
        
    </div>
  );
};

export default ReviewsCart;
