'use client';

import { useEffect, useRef, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import StarRating from '../starsComponent';
import VerifiedBadge from '../verified';
import Link from 'next/link';
import Image from 'next/image';

// Register plugin once
gsap.registerPlugin(ScrollTrigger);

interface ImageData {
  src: string;
  alt: string;
  origin: 'left' | 'right';
  name: string;
  rating: number;
  location: string;
  label: string;
}

// Move static data outside component to prevent recreation
const IMAGES: ImageData[] = [
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

// Grid layout configuration
const GRID_LAYOUT = [
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
];

// Animation configuration
const ANIMATION_CONFIG = {
  scaleIn: {
    scale: 1,
    opacity: 1,
    duration: 0.5,
    ease: "power2.out"
  },
  scaleOut: {
    scale: 0,
    opacity: 0,
    duration: 0.3,
    ease: "power2.in"
  }
};

// Memoized image card component
interface ImageCardProps {
  imageData: ImageData;
  imageIndex: number;
}

const ImageCard = ({ imageData, imageIndex }: ImageCardProps) => {
  // Memoize the verified badge component selection
  const verifiedBadges = useMemo(() => ({
    large: <VerifiedBadge text='Receipt Verified' />,
    medium: <VerifiedBadge text='Receipt Verified' size='md' />,
    small: <VerifiedBadge text='verified' size='sm' />
  }), []);

  return (
    <div className={`img-container relative box-border h-full will-change-transform rounded-xl ${
      imageData.origin === 'left' ? 'origin-left' : 'origin-right'
    }`}>
      <Link href="/en/id" prefetch={false}>
        <div>
          <Image
            src={imageData.src}
            alt={imageData.alt}
            height={300}
            width={300}
            className="w-full h-full object-cover rounded-xl transition-transform duration-500 ease-in-out hover:scale-110"
            quality={75}
            sizes="(max-width: 768px) 25vw, (max-width: 1200px) 20vw, 300px"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0eH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/2gAMAwEAAhEDEQA/AJvBYWZjAQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/2Q=="
          />
          <div className='bg-a rounded-xl px-1.5 md:px-6 py-1 lg:py-2 mt-1 md:mt-2 space-y-1 text-white'>
            <p className="font-bold font-playfair text-sm md:text-base">{imageData.name}</p>
            <div className='flex gap-1'>
              <StarRating rating={imageData.rating} />
              <p className="text-sm">{imageData.rating}</p>
            </div>
            <p className="md:text-sm text-xs">{imageData.location}</p>
            
            {/* Responsive verified badges */}
            <div className='hidden custom:block'>
              {verifiedBadges.large}
            </div>
            <div className='hidden md:block custom:hidden'>
              {verifiedBadges.medium}
            </div>
            <div className='block md:hidden'>
              {verifiedBadges.small}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

const ScrollAnimationGallery = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTriggersRef = useRef<ScrollTrigger[]>([]);
  const isInitializedRef = useRef(false);

  // Optimized animation setup
  const setupAnimations = useCallback(() => {
    if (!containerRef.current || isInitializedRef.current) return;
    
    isInitializedRef.current = true;

    // Batch initial state setting for better performance
    gsap.set('.img-container', { 
      scale: 0, 
      force3D: true,
      opacity: 0
    });

    const rows = containerRef.current.querySelectorAll('.gallery-row');

    rows.forEach((row, index) => {
      const rowImages = row.querySelectorAll('.img-container');

      if (rowImages.length === 0) return;

      // Scale in animation with optimized triggers
      const enterTrigger = ScrollTrigger.create({
        trigger: row,
        start: 'top bottom',
        end: 'bottom bottom-=10%',
        scrub: true,
        onEnter: () => {
          gsap.to(rowImages, {
            ...ANIMATION_CONFIG.scaleIn,
            force3D: true,
            stagger: 0.1 // Add stagger for visual appeal
          });
        },
        onLeaveBack: () => {
          gsap.to(rowImages, {
            ...ANIMATION_CONFIG.scaleOut,
            force3D: true
          });
        }
      });

      // Scale out animation with pinning
      const pinTrigger = ScrollTrigger.create({
        trigger: row,
        start: 'top top',
        end: 'bottom top',
        pin: true,
        pinSpacing: false,
        scrub: 1,
        onUpdate: (self) => {
          const scale = gsap.utils.interpolate(1, 0, self.progress);
          const opacity = gsap.utils.interpolate(1, 0, self.progress);
          
          // Use requestAnimationFrame for smoother updates
          requestAnimationFrame(() => {
            gsap.set(rowImages, {
              scale: scale,
              opacity: opacity,
              force3D: true
            });
          });
        }
      });

      // Store triggers for cleanup
      scrollTriggersRef.current.push(enterTrigger, pinTrigger);
    });

    // Refresh ScrollTrigger after setup
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    scrollTriggersRef.current.forEach(trigger => trigger.kill());
    scrollTriggersRef.current = [];
    isInitializedRef.current = false;
  }, []);

  // Main effect
  useEffect(() => {
    // Use RAF for better performance
    requestAnimationFrame(() => {
      setupAnimations();
    });

    return cleanup;
  }, [setupAnimations, cleanup]);

  // Memoize grid rows to prevent unnecessary re-renders
  const gridRows = useMemo(() => 
    GRID_LAYOUT.map((row, rowIndex) => ({
      row,
      rowIndex,
      key: `row-${rowIndex}`
    }))
  , []);

  return (
    <div ref={containerRef} className="relative">
      <section className="relative box-border overflow-hidden bg-secondary">
        {gridRows.map(({ row, rowIndex, key }) => (
          <div key={key} className="gallery-row box-border flex">
            {row.map((imageIndex, colIndex) => (
              <div key={colIndex} className="flex-1 aspect-square">
                {imageIndex !== null && (
                  <ImageCard 
                    imageData={IMAGES[imageIndex]} 
                    imageIndex={imageIndex}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </section>
    </div>
  );
};

export default ScrollAnimationGallery;