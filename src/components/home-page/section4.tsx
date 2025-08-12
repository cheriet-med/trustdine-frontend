'use client';

import { useRef, useEffect, useMemo, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/all';
import { LiaStarSolid } from "react-icons/lia";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { RiShieldStarFill } from "react-icons/ri";
import { TbFileCheck } from "react-icons/tb";
import { IoRocket } from "react-icons/io5";
import { LuMapPinCheck } from "react-icons/lu";
import Image from 'next/image';

// Register plugins once
gsap.registerPlugin(useGSAP, ScrollTrigger);

// Move static data outside component to prevent recreation
const STACKING_CARDS = [
  {
    title: 'Verified by AI, Trusted by People',
    copy: 'Every review on TrustDine is backed by proof — a real receipt or booking, No fake hype, Just honest, verified experiences you can count on.',
  },
  {
    title: 'Your Trust Score, Your Superpower',
    copy: 'The more you review and book, the more your Trust Score grows — unlocking hidden gems, top-tier restaurants, and perks just for trusted users.',
  },
  {
    title: 'Skip the Line. Book Smarter',
    copy: "As a trusted diner, you get priority access to hot spots, limited tables, and exclusive deals, Why wait, when you've earned it?",
  },
  {
    title: 'Smart Filters. Real Voices',
    copy: 'We use AI to block spam and fake reviews — without silencing real people. You see the truth, not the noise.',
  },
];

const CARD_TEXTS = [
  'The dinner exceeded all expectations. The ingredients were fresh, the presentation was beautiful, and each bite was perfectly seasoned. You can tell the chef truly cares about quality.',
  "We came here to celebrate our anniversary, and it couldn't have been more perfect. The staff went above and beyond to make us feel special, and the food was absolutely delicious.",
  'What a pleasant surprise! The dinner was superb—especially the main course. Everything was served hot and fresh. Definitely coming back with friends next time.',
  'The dinner exceeded all expectations. The ingredients were fresh, the presentation was beautiful, and each bite was perfectly seasoned. You can tell the chef truly cares about quality.',
  'Cozy atmosphere, hearty meals, and friendly service. It felt like a home-cooked dinner but elevated. The kind of place that leaves you full and happy.',
  "From the moment we walked in, everything was perfect. The ambiance was warm and inviting, the service was outstanding, and every dish was full of flavor. Easily one of the best dinners we've had in a long time."
];

const CARD_NAMES = [
  'Aine Walls', 'Charlie Bryant', 'Joel Rubio', 'Emilia Hodge', 'Simon Stevens', 'Izabella Proctor'
];

const HOTEL_NAMES = [
  'Blue Horizon Hotel', 'The Olive Garden Bistro', 'Royal Mirage Inn', 'Cedar Grove Restaurant', 'Sunset Bay Resort', 'La Petite Cuisine'
];

const PLACE_NAMES = [
  'Santorini, Greece', 'Florence, Italy', 'Marrakech, Morocco', 'Vancouver, Canada', 'Malibu, USA', 'Lyon, France'
];

const BG_COLORS = [
  'bg-background',
  'bg-a text-white',
  'bg-secondary text-white',
  'bg-highlights',
];

const ROTATIONS = [-12, 10, -5, 5, -5, -2];

// Memoized icon components to prevent recreation
const ICONS = [
  <TbFileCheck key="file-check" className='h-28 w-28 md:h-48 md:w-48 custom:h-56 custom:w-56 text-white'/>,
  <RiShieldStarFill key="shield-star" className='h-28 w-28 md:h-48 md:w-48 custom:h-56 custom:w-56 text-accent'/>,
  <VscWorkspaceTrusted key="workspace-trusted" className='h-28 w-28 md:h-48 md:w-48 custom:h-56 custom:w-56 text-background'/>,
  <IoRocket key="rocket" className='h-28 w-28 md:h-48 md:w-48 custom:h-56 custom:w-56 text-white'/>,
];

// Memoized star rating component
const StarRating = () => (
  <div className='flex gap-1 items-center'>
    {[1, 2, 3, 4, 5].map(i => (
      <LiaStarSolid key={i} className='text-yellow-500'/>
    ))}
  </div>
);

type CardProps = {
  title: string;
  copy: string;
  index: number;
};

const Card = ({ title, copy, index }: CardProps) => {
  const bgColor = BG_COLORS[index % BG_COLORS.length];
  const Icon = ICONS[index % ICONS.length];

  return (
    <div id={`card-${index + 1}`} className="relative card">
      <div
        className={`relative h-full p-8 flex flex-col md:flex-row gap-8 md:gap-16 ${bgColor} will-change-transform card-inner`}
      >          
        <div className='flex justify-between custom:gap-16'>
          <div className="flex-[3] md:flex-[2] custom:flex-[3] card-content">
            <h1 className="text-3xl md:text-6xl leading-none mb-10 md:mb-[1.5em] font-playfair font-bold">
              {title}
            </h1>
            <p className="text-xl md:text-4xl font-playfair mb-6">{copy}</p>
          </div>
          {Icon}
        </div>
      </div>
    </div>
  );
};

const RotatingCard = ({ index }: { index: number }) => {
  // Use useMemo for expensive computations
  const cardData = useMemo(() => ({
    name: CARD_NAMES[index],
    hotelName: HOTEL_NAMES[index],
    placeName: PLACE_NAMES[index],
    text: CARD_TEXTS[index]
  }), [index]);

  return (
    <div 
      className="rotating-card absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform w-64 custom:w-80 p-2 flex flex-col gap-2 bg-[#202020] text-white opacity-0 invisible rounded-xl"
    >
      <div className="box-border">
        <Image 
          src={`/asset/card-${index + 1}.avif`}
          alt={`Card ${index + 1}`}
          className="box-border h-full object-cover rounded-lg"
          loading="lazy"
          height={300}
          width={300}
          quality={75}
          sizes="(max-width: 768px) 256px, 320px"
        />
      </div>
      <div className="flex-none flex flex-col flex-wrap space-y-2">
        <div className='flex gap-3 item-center pt-1'>
          <p>{cardData.name}</p>
          <StarRating />
        </div>
        <p className='font-playfair font-bold text-xl'>{cardData.hotelName}</p>
        <div className='flex gap-1 border border-1 rounded-3xl py-0.5 px-2 w-fit items-center'>
          <LuMapPinCheck/> 
          <p>{cardData.placeName}</p>
        </div>
        <p className="font-montserrat text-sm">
          {cardData.text}
        </p>
      </div>
    </div>
  );
};

export default function CombinedScrollAnimation() {
  const container = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);

  // Memoize viewport calculations
  const viewport = useMemo(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080
  }), []);

  // Debounced resize handler
  const handleResize = useCallback(() => {
    ScrollTrigger.refresh();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const debouncedResize = debounce(handleResize, 100);
    window.addEventListener('resize', debouncedResize);
    
    return () => {
      window.removeEventListener('resize', debouncedResize);
    };
  }, [handleResize]);

  useGSAP(
    () => {
      if (isInitializedRef.current) return;
      isInitializedRef.current = true;

      // Use RAF for better performance
      const initAnimations = () => {
        // First Section: Stacking Cards Animation
        const cardElements = gsap.utils.toArray<HTMLElement>('.card');

        if (cardElements.length > 0) {
          ScrollTrigger.create({
            trigger: cardElements[0],
            start: 'top 35%',
            endTrigger: cardElements[cardElements.length - 1],
            end: 'top 30%',
            pin: '.intro',
            pinSpacing: false,
          });

          cardElements.forEach((card, index) => {
            const isLastCard = index === cardElements.length - 1;
            const cardInner = card.querySelector<HTMLElement>('.card-inner');

            if (!isLastCard && cardInner) {
              ScrollTrigger.create({
                trigger: card,
                start: 'top 35%',
                endTrigger: '.transition-section',
                end: 'top 65%',
                pin: true,
                pinSpacing: false,
              });

              gsap.to(cardInner, {
                y: `-${(cardElements.length - index) * 14}vh`,
                ease: 'none',
                scrollTrigger: {
                  trigger: card,
                  start: 'top 35%',
                  endTrigger: '.transition-section',
                  end: 'top 65%',
                  scrub: true,
                },
              });
            }
          });
        }

        // Second Section: Rotating Cards Animation
        const rotatingCards = gsap.utils.toArray('.rotating-card');
        
        // Batch set initial states for better performance
        gsap.set(rotatingCards, {
          y: viewport.height * 0.1,
          rotate: (i: number) => ROTATIONS[i],
          opacity: 0,
          visibility: 'hidden'
        });

        ScrollTrigger.create({
          trigger: '.sticky-cards',
          start: 'top top',
          end: `+=${viewport.height * 2}px`,
          pin: true,
          pinSpacing: true,
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            const totalCards = rotatingCards.length;
            const progressPerCard = 1 / totalCards;
            
            // Use requestAnimationFrame for smoother updates
            requestAnimationFrame(() => {
              rotatingCards.forEach((card: any, index: number) => {
                const cardStart = index * progressPerCard;
                let cardProgress = Math.min(Math.max((progress - cardStart) / progressPerCard, 0), 1);
                
                const earlyStart = Math.max(0, cardProgress - 0.1);
                
                let yPos = viewport.height * 0.5 * (1 - earlyStart);
                let xPos = 0;
                let opacity = earlyStart > 0 ? 1 : 0;
                let visibility = earlyStart > 0 ? 'visible' : 'hidden';
                
                if (cardProgress === 1 && index < totalCards - 1) {
                  const remainingProgress =
                    (progress - (cardStart + progressPerCard)) /
                    (1 - (cardStart + progressPerCard));
                  if (remainingProgress > 0) {
                    const distanceMultiplier = 1 - index * 0.15;
                    xPos = -viewport.width * 0.3 * distanceMultiplier * remainingProgress;
                    yPos = -viewport.height * 0.3 * distanceMultiplier * remainingProgress;
                  }
                }
                
                gsap.to(card, {
                  y: yPos,
                  x: xPos,
                  opacity: opacity,
                  visibility: visibility,
                  duration: 0,
                  ease: 'none',
                });
              });
            });
          },
        });
      };

      // Use RAF for initialization
      requestAnimationFrame(() => {
        requestAnimationFrame(initAnimations);
        // Force refresh after initialization
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      });

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        isInitializedRef.current = false;
      };
    },
    { scope: container, dependencies: [viewport] }
  );

  return (
    <div className="font-montserrat" ref={container}>
      {/* Initial spacer */}
      <section className='h-32 md:h-96 bg-secondary'></section>
      
      {/* First Section: Stacking Cards */}
      <section className="cards">
        {STACKING_CARDS.map((card, index) => (
          <Card key={index} {...card} index={index} />
        ))}
      </section>

      {/* Transition Section */}
      <section className="transition-section relative h-32 p-8 bg-accent flex items-center"></section>

      {/* Second Section: Rotating Cards */}
      <section className="sticky-cards w-full h-screen bg-accent relative">
        <h1 className='text-end uppercase text-3xl md:text-5xl custom:text-6xl text-white font-playfair lg:px-72 px-6 pt-20 font-bold'>
          Real Guests, Real Reviews, Real Trust
        </h1>
        <div className="flex justify-end lg:px-72 px-6">
          <p className="text-white text-left pt-10 text-xl md:text-3xl w-[650px] font-playfair">
            These places are getting buzz — check out what real guests had to say. Verified reviews from
            receipt-backed visits, updated in real time.
          </p>
        </div>
        {Array.from({ length: 6 }, (_, index) => (
          <RotatingCard key={index} index={index} />
        ))}
      </section>

      {/* Final outro section */}
      <section className="outro relative h-32 p-8 bg-accent flex items-center"></section>
    </div>
  );
}

// Utility function for debouncing
function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}