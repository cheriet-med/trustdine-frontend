
'use client'
import { useRef, useEffect, useState } from 'react';
import { cn } from "@/lib/utils";
import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards';
import { FaCheck } from "react-icons/fa6";
import Link from "next/link";
import Image from "next/image";

import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/ui/scroll-velocity"



interface Plan {
  name: string;
  id: string;
  href: string;
  priceMonthly: string;
  description: string;
  features: string[];
  featured: boolean;
  mostPopular?: boolean;
}

const plans: Plan[] = [
  {
    name: 'Free',
    id: 'tier-free',
    href: '/en/checkout-partner-free-plan',
    priceMonthly: '$0',
    description: "Perfect for individuals getting started with basic booking needs.",
    features: [
      'Up to 50 bookings/month',
      '1 calendar connection',
      'Basic scheduling',
      'Email notifications',
      '24-hour support response',
      'Standard booking page',
      'Basic reporting',
    ],
    featured: false,
  },
  {
    name: 'Premium',
    id: 'tier-premium',
    href: '/en/checkout-partner',
    priceMonthly: '$29',
    description: 'Advanced features for professionals and businesses.',
    features: [
      'Unlimited bookings',
      'Multiple calendar connections',
      'Group appointments',
      'Custom booking forms',
      'SMS notifications',
      'Customizable booking page',
      'Advanced analytics',
      'Payment processing',
      'Calendar sync',
      'Team scheduling',
      'Priority support (4-hour response)',
      'API access',
      'White-label options',
    ],
    featured: true,
    mostPopular: true,
  },
]
function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}
export default function Partner () {







 const videoRef = useRef<HTMLVideoElement | null>(null);

  // Ensure autoplay works (muted is required for most browsers)
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.warn('Autoplay prevented:', err);
      });
    }
  }, []);



    return(
        <>

 <section className="relative h-[500px]">
      {/* Video background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover object-bottom"
        src="/partner-section.mp4" // ✅ replace with your video path
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        //poster="/footer.jpg" // ✅ optional poster
      />
       <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
    </section>
   
<div className=' bg-highlights grid grid-cols-1  lg:grid-cols-2 '>

<div className='items-center  justify-center h-full'>
<h1 className='text-3xl md:text-4xl lg:text-6xl text-center xl:text-9xl mx-6 py-8 font-bold font-playfair'>Grow Your Business with Verified Trust</h1>
<div className='flex justify-center items-center'>
<button
  onClick={() => {
    const section = document.getElementById("plan");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }}
  className="px-12 py-4 rounded-md bg-secondary text-white text-sm md:text-xl  xl:text-3xl font-montserrat hover:bg-accent font-medium"
>
  Join the new era of trusted Hospitality
</button>
</div>
</div>

         <section className="relative h-72 md:h-[550px] lg:h-[350px] xl:h-[550px]">
      {/* Video background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full "
        src="/text-video.mp4" // ✅ replace with your video path
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        //poster="/footer.jpg" // ✅ optional poster
      />
    </section>

</div>
<div className='bg-black py-16 md:py-32'>
    <p className=' max-w-7xl mx-6 xl:mx-auto md:text-lg  lg:text-2xl xl:text-3xl text-white font-montserrat text-center font-thin'>GoAmico is your partner in growing your restaurant, hotel, or leisure business. Unlike TripAdvisor or Booking.com, we focus on verified reviews from real guests, fair exposure based on quality, and powerful AI tools to help you shine. 
        <span className='font-bold text-highlights cursor-pointer'  onClick={() => {
    const section = document.getElementById("plan");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }}> List your business today</span> and attract the guests you deserve!</p>
</div>
<div className=' bg-accent'>
    <div className='py-16'>
           <h2 className='text-2xl md:text-4xl lg:text-7xl font-bold text-center font-playfair'>Why Partner with GoAmico?</h2>
    <p className=' md:text-xl font-medium text-center'>Build trust, attract guests, and grow with tools designed for your success.</p>

 
    </div>


<div>

    <div className=" pt-8 rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
    </div>
  <div className="pb-8  rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={testimonials1}
        direction="left"
        speed="slow"
      />
    </div>

</div>
 <section className="relative h-[500px]">
      {/* Video background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover object-bottom"
        src="/walk.mp4" // ✅ replace with your video path
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        //poster="/footer.jpg" // ✅ optional poster
      />
    </section>
</div>

<div className='bg-secondary relative' id='plan'>
     
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:20px_20px]",
          "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
          "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]",
        )}
      />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
  <div className='relative z-20'>
  
    <div className='pt-16 pb-8 text-white'>
           <h2 className='text-3xl md:text-5xl lg:text-7xl font-bold text-center font-playfair'>Choose Your Plan</h2>
    <p className=' md:text-xl font-medium text-center'>Simple pricing to suit your business needs, with powerful tools to grow.</p>

 
    </div>


     <div className="mx-auto pb-24 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-6xl lg:grid-cols-2">
        {plans.map((tier, tierIdx) => (
          <div
            key={tier.id}
            className={classNames(
              tier.featured ? 'relative bg-gray-900 shadow-2xl' : 'bg-white sm:mx-8 lg:mx-0',
              tier.featured
                ? ''
                : tierIdx === 0
                  ? 'rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl'
                  : 'sm:rounded-t-none lg:rounded-tr-3xl lg:rounded-bl-none',
              'rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10',
            )}
          >
            <h3
              id={tier.id}
              className={classNames(
                tier.featured ? 'text-accent' : 'text-accent',
                'text-base font-semibold leading-7'
              )}
            >
              {tier.name}
            </h3>
            <p className="mt-4 flex items-baseline gap-x-2">
              <span
                className={classNames(
                  tier.featured ? 'text-white' : 'text-gray-900',
                  'text-5xl font-bold tracking-tight'
                )}
              >
                {tier.priceMonthly}
              </span>
              <span className={classNames(tier.featured ? 'text-gray-200' : 'text-gray-500', 'text-base')}>/month</span>
            </p>
            <p className={classNames(tier.featured ? 'text-gray-200' : 'text-gray-600', 'mt-6 text-base leading-7')}>
              {tier.description}
            </p>
            <ul
              role="list"
              className={classNames(
                tier.featured ? 'text-gray-200' : 'text-gray-600',
                'mt-8 space-y-3 text-sm leading-6 sm:mt-10',
              )}
            >
              {tier.features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <FaCheck
                    className={classNames(
                      tier.featured ? 'text-accent' : 'text-accent',
                      'h-6 w-5 flex-none'
                    )}
                    aria-hidden="true"
                  />
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href={tier.href}
              aria-describedby={tier.id}
              className={classNames(
                tier.featured
                  ? 'bg-accent text-white shadow-sm hover:bg-secondary hover:text-white focus-visible:outline-background'
                  : 'bg-accent text-white ring-1 ring-inset ring-accent shadow-sm cursor-pointer hover:bg-secondary hover:text-white focus-visible:outline-accent',
                'mt-8 block rounded-md px-3.5 py-3 text-center  font-extrabold focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10 ',
              )}
            >
              Get started today
            </Link>
            {tier.featured && (
              <div className="absolute top-0 right-0 -z-10 h-full w-full rounded-3xl bg-gray-900/5" />
            )}
          </div>
        ))}
      </div>
      </div>
</div>
<div className='bg-black py-16  md:pt-8 sm:py-32'>
<ScrollVelocityContainer className=" text-accent">
  <ScrollVelocityRow baseVelocity={20} direction={1} className='text-7xl  lg:text-9xl font-playfair font-extrabold'>
    Success Stories. 
  </ScrollVelocityRow>
  <ScrollVelocityRow baseVelocity={10} direction={-1} className='text-2xl lg:text-3xl font-montserrat font-bold text-white'>
   See how businesses like yours thrive with GoAmico
  </ScrollVelocityRow>
</ScrollVelocityContainer>
</div>

<div>

    <div className="  rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={success}
        direction="right"
        speed="slow"
      />
    </div>
  <div className="  rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={success1}
        direction="left"
        speed="slow"
      />
    </div>

</div>
        </>
    )
}



const testimonials = [
  {
    quote:
      "Every review is linked to a real booking or bill—no fake or malicious feedback to harm your reputation.",
    name: "",
    title: "Verified Reviews Only",
  },
  {
    quote:
      "Earn visibility through quality and trust, not by paying for rankings. Get featured in our curated section!",
    name: "",
    title: "Fair Exposure",
  },
  {
    quote: "Manage bookings, reviews, and guest messages in one simple, intuitive platform.",
    name: "",
    title: "Business Dashboard",
  },
  {
    quote:
      "Our AI detects trends in reviews, highlighting what guests love and where you can improve.",
    name: "",
    title: "AI Reputation Insights",
  },
  
];



const testimonials1 = [
  {
    quote:
      "Write empathetic, professional responses to reviews with our AI-powered assistant.",
    name: "",
    title: "AI Reply Assistant",
  },
  {
    quote:
      "Spot rating drops early and get actionable strategies to win back guest trust.",
    name: "",
    title: "Reputation Recovery Tools",
  },
  {
    quote: "A visible score showcases your reliability, helping you stand out to guests.",
    name: "",
    title: "Trust Score System",
  },
  {
    quote:
      "Join now for premium placement in our featured section and extra exposure to attract more guests.",
    name: "",
    title: "Early Partner Benefits",
  },
  
];






const success = [
  {
    quote:
      "GoAmico’s verified reviews brought us guests who value quality. Being featured on the homepage doubled our bookings!",
    name: "/assets/image-3.avif",
    title: "The Ivy Cottage, London",
  },
  {
    quote:
      "The AI insights helped us improve service, and our trust score attracts families. GoAmico is a game-changer!",
    name: "/assets/image-5.avif",
    title: "The Highland Bistro, Edinburgh",
  },
  {
    quote: "GoAmico’s fair exposure and reply assistant helped us connect with guests and boost our reputation.",
    name: "/assets/image-12.avif",
    title: "Cotswold Kitchen, Cotswolds",
  },
  
];


const success1 = [
  {
    quote:
      "The featured section on GoAmico’s homepage increased our occupancy by 25% in just three months!",
    name: "/assets/image-11.avif",
    title: "Seaside Haven, Brighton",
  },
  {
    quote:
      "Calendar sync and team scheduling eliminated double bookings, saving us hours every week.",
    name: "/assets/image-10.avif",
    title: "Lakeside Retreat, Windermere",
  },
  {
    quote: "Group bookings via GoAmico boosted our revenue by 30%, connecting us with adventure seekers.",
    name: "/assets/image-7.avif",
    title: "Adventure Tours, Cornwall",
  },
];



