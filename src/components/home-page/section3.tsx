'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import StarRating from '../starsComponent';
import VerifiedBadge from '../verified';
import Link from 'next/link';
import Image from 'next/image';
import useFetchListing from '../requests/fetchListings';
interface ImageData {
  src: string;
  alt: string;
  origin: 'left' | 'right';
  name:string;
  rating: number,
  location:string, 
  label:string 
}

const ScrollAnimationGallery = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {listings} = useFetchListing()
   // Sample images - replace with your actual images
const images: ImageData[] = [
  { 
    src: '/assets/image-1.avif', 
    alt: 'Image 1', 
    origin: 'right',
    name: 'The Grand Horizon Resort',
    rating: 4.8,
    location: 'Bali, Indonesia',
    label: 'Luxury Beachfront'
  },
  { 
    src: '/assets/image-2.avif', 
    alt: 'Image 2', 
    origin: 'left',
    name: 'Alpine Peak Lodge',
    rating: 4.6,
    location: 'Swiss Alps, Switzerland',
    label: 'Mountain Retreat'
  },
  { 
    src: '/assets/image-3.avif', 
    alt: 'Image 3', 
    origin: 'left',
    name: 'Azure Waters Hotel',
    rating: 4.7,
    location: 'Santorini, Greece',
    label: 'Seaside Paradise'
  },
  { 
    src: '/assets/image-4.avif', 
    alt: 'Image 4', 
    origin: 'right',
    name: 'The Urban Majesty',
    rating: 4.9,
    location: 'New York, USA',
    label: 'City Skyline'
  },
  { 
    src: '/assets/image-5.avif', 
    alt: 'Image 5', 
    origin: 'left',
    name: 'Serenity Treehouse Villas',
    rating: 4.5,
    location: 'Ubud, Indonesia',
    label: 'Eco Retreat'
  },
  { 
    src: '/assets/image-6.avif', 
    alt: 'Image 6', 
    origin: 'left',
    name: 'The Royal Palms',
    rating: 4.8,
    location: 'Dubai, UAE',
    label: 'Desert Oasis'
  },
  { 
    src: '/assets/image-7.avif', 
    alt: 'Image 7', 
    origin: 'right',
    name: 'Harbor Lights Suites',
    rating: 4.7,
    location: 'Sydney, Australia',
    label: 'Waterfront Luxury'
  },
  { 
    src: '/assets/image-8.avif', 
    alt: 'Image 8', 
    origin: 'left',
    name: 'The Vintage Plaza',
    rating: 4.4,
    location: 'Paris, France',
    label: 'Boutique Hotel'
  },
  { 
    src: '/assets/image-9.avif', 
    alt: 'Image 9', 
    origin: 'left',
    name: 'Emerald Valley Resort',
    rating: 4.6,
    location: 'Queenstown, New Zealand',
    label: 'Adventure Getaway'
  },
  { 
    src: '/assets/image-10.avif', 
    alt: 'Image 10', 
    origin: 'left',
    name: 'The Sapphire Sands',
    rating: 4.9,
    location: 'Maldives',
    label: 'Private Island'
  },
  { 
    src: '/assets/image-11.avif', 
    alt: 'Image 11', 
    origin: 'left',
    name: 'Moonlight Chalets',
    rating: 4.5,
    location: 'Banff, Canada',
    label: 'Winter Wonderland'
  },
  { 
    src: '/assets/image-12.avif', 
    alt: 'Image 12', 
    origin: 'left',
    name: 'The Golden Pagoda',
    rating: 4.7,
    location: 'Kyoto, Japan',
    label: 'Cultural Experience'
  },
  { 
    src: '/assets/image-13.avif', 
    alt: 'Image 13', 
    origin: 'right',
    name: 'Ocean Breeze Towers',
    rating: 4.8,
    location: 'Miami, USA',
    label: 'Art Deco Luxury'
  },
  { 
    src: '/assets/image-14.avif', 
    alt: 'Image 14', 
    origin: 'left',
    name: 'The Desert Rose',
    rating: 4.6,
    location: 'Marrakech, Morocco',
    label: 'Riad Experience'
  },
  { 
    src: '/assets/image-15.avif', 
    alt: 'Image 15', 
    origin: 'left',
    name: 'Northern Lights Lodge',
    rating: 4.7,
    location: 'Reykjavik, Iceland',
    label: 'Aurora Viewing'
  },
  { 
    src: '/assets/image-16.avif', 
    alt: 'Image 16', 
    origin: 'right',
    name: 'The Venetian',
    rating: 4.9,
    location: 'Venice, Italy',
    label: 'Canal View'
  },
  { 
    src: '/assets/image-17.avif', 
    alt: 'Image 17', 
    origin: 'left',
    name: 'Bamboo Forest Retreat',
    rating: 4.5,
    location: 'Chiang Mai, Thailand',
    label: 'Wellness Sanctuary'
  }
];

  // Define the grid layout - each array represents a row with image indices
  const gridLayout = [
    [0, null, 1, null],
    [null, 2, null, null],
    [3, null, null, 4],
    [null, 5, 6, null],
    [7, null, null, 8],
    [null, null, 9, null],
    [null, 10, null, 11],
    [12, null, 13, null],
    [null, 14, null, null],
    [15, null, null, 16],
    [null, null, null, null],
  ];

 const gridLayoutMobile = [
    [0, null, 1],
    [null, 2, null],
    [3, null, null],
    [null, 5, 6],
    [7, null, null],
    [null, null, 9],
    [null, 10, null],
    [12, null, 13],
    [null, 14, null],
    [15, null, null],
    [null, 4, 8],
    [11, null, null],
    [null, 16, null],
    [null, null, null],
  ];


  useEffect(() => {
    if (!containerRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    // Set initial state
    gsap.set('.img-container', { 
      scale: 0, 
      force3D: true,
      opacity: 0
    });

    const rows = document.querySelectorAll('.gallery-row');

    rows.forEach((row) => {
      const rowImages = row.querySelectorAll('.img-container');

      if (rowImages.length > 0) {
        // Scale in animation
        ScrollTrigger.create({
          trigger: row,
          start: 'top bottom',
          end: 'bottom bottom-=10%',
          scrub: true,
          onEnter: () => {
            gsap.to(rowImages, {
              scale: 1,
              opacity: 1,
              duration: 0.5,
              ease: "power2.out",
              force3D: true
            });
          },
          onLeaveBack: () => {
            gsap.to(rowImages, {
              scale: 0,
              opacity: 0,
              duration: 0.3,
              ease: "power2.in",
              force3D: true
            });
          }
        });

        // Scale out animation with pinning
        ScrollTrigger.create({
          trigger: row,
          start: 'top top',
          end: 'bottom top',
          pin: true,
          pinSpacing: false,
          scrub: true,
          onUpdate: (self) => {
            const scale = gsap.utils.interpolate(1, 0, self.progress);
            const opacity = gsap.utils.interpolate(1, 0, self.progress);
            
            gsap.to(rowImages, {
              scale: scale,
              opacity: opacity,
              force3D: true
            });
          }
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
<>
    <div ref={containerRef} className="relative">
   <section className="relative box-border overflow-hidden bg-a md:hidden py-24">
{/**<div className='h-96 flex gap-20 flex-wrap lg:flex-nowrap bg-secondary px-72 py-20 text-white'>
   <h1 className='text-6xl font-bold flex-2 font-playfair'>Discrover More</h1>
        <p className='flex-1'>This implementation maintains both animation behaviors while keeping them separate and organized. The feature cards will animate first as you scroll, followed by the testimonial cards animation.</p>
</div> */}

        {gridLayoutMobile.map((row, rowIndex) => (
          <div key={rowIndex} className="gallery-row box-border flex ">
            {row.map((imageIndex, colIndex) => (
              <div key={colIndex} className="flex-1 aspect-square">
                {imageIndex !== null && (
                  <div className={`img-container relative box-border h-full will-change-transform rounded-xl ${
                    images[imageIndex].origin === 'left' ? 'origin-left' : 'origin-right'
                  }`}>
                    <Link href="/en/">
                    <div >
 <Image
    src={images[imageIndex].src}
    alt={images[imageIndex].alt}
    height={300}
    width={300}
    className="w-full h-full object-cover rounded-xl transition-transform duration-500 ease-in-out hover:scale-110"
  />
                    <div className='bg-secondary rounded-xl px-1.5 md:px-6 py-1 lg:py-2 mt-1 md:mt-2 space-y-1 text-white'>
                    <p className="font-bold font-playfair text-sm md:text-base">{images[imageIndex].name}</p>
                    <div className='flex gap-1'>
<StarRating rating={images[imageIndex].rating}/>
                       <p className="text-sm">{images[imageIndex].rating}</p>
                    </div>
 <p className="md:text-sm text-xs">{images[imageIndex].location}</p>

<div className='hidden custom:block'>
   <VerifiedBadge text='Receipt Verified' />
</div>
<div className='hidden md:block custom:hidden'>
   <VerifiedBadge text='Receipt Verified' size='md'/>
</div>
  <div className='block md:hidden'>
   <VerifiedBadge text='verified' size='sm'/>
</div>

                    </div>

                    </div>
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </section>
</div>
    <div ref={containerRef} className="relative">
  
     
      <section className="relative box-border overflow-hidden bg-a hidden md:block py-32">
         
{/**<div className='h-96 flex gap-20 flex-wrap lg:flex-nowrap bg-secondary px-72 py-20 text-white'>
   <h1 className='text-6xl font-bold flex-2 font-playfair'>Discrover More</h1>
        <p className='flex-1'>This implementation maintains both animation behaviors while keeping them separate and organized. The feature cards will animate first as you scroll, followed by the testimonial cards animation.</p>
</div> */}

        {gridLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="gallery-row box-border flex">
            {row.map((imageIndex, colIndex) => (
              <div key={colIndex} className="flex-1 aspect-square">
                {imageIndex !== null && (
                  <div className={`img-container relative box-border h-full will-change-transform rounded-xl ${
                    images[imageIndex].origin === 'left' ? 'origin-left' : 'origin-right'
                  }`}>
                    <Link href="/en/">
                    <div >
 <Image
    src={images[imageIndex].src}
    alt={images[imageIndex].alt}
    height={300}
    width={300}
    className="w-full h-full object-cover rounded-xl transition-transform duration-500 ease-in-out hover:scale-110"
  />
                    <div className='bg-secondary rounded-xl px-1.5 md:px-6 py-1 lg:py-2 mt-1 md:mt-2 space-y-1 text-white'>
                    <p className="font-bold font-playfair text-sm md:text-base">{images[imageIndex].name}</p>
                    <div className='flex gap-1'>
<StarRating rating={images[imageIndex].rating}/>
                       <p className="text-sm">{images[imageIndex].rating}</p>
                    </div>
 <p className="md:text-sm text-xs">{images[imageIndex].location}</p>

<div className='hidden custom:block'>
   <VerifiedBadge text='Receipt Verified' />
</div>
<div className='hidden md:block custom:hidden'>
   <VerifiedBadge text='Receipt Verified' size='md'/>
</div>
  <div className='block md:hidden'>
   <VerifiedBadge text='verified' size='sm'/>
</div>

                    </div>

                    </div>
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}

      </section>
      {/**<section className='h-32 md:h-96 bg-secondary '></section>
 */}
    
    </div>
    
    </>
  );
};

export default ScrollAnimationGallery;