'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/all';
import { LiaStarSolid } from "react-icons/lia";



gsap.registerPlugin(useGSAP, ScrollTrigger);

type CardProps = {
  title: string;
  copy: string;
  index: number;
  imageUrl?: string;
};

const Card = ({ title, copy, index, imageUrl }: CardProps) => {
  const bgColors = [
    'bg-background',
    'bg-highlights',
    'bg-secondary text-white',
    'bg-a text-white',
  ];
  const bgColor = bgColors[index % bgColors.length];

  return (
    <div id={`card-${index + 1}`} className="relative card">
      <div
        className={`relative w-full h-full p-8 flex flex-col md:flex-row gap-8 md:gap-16 ${bgColor} will-change-transform card-inner`}
      >
        <div className="flex-[1] md:flex-[2] custom:flex-[3] card-content ">
          <h1 className="text-4xl md:text-6xl font-montserrat leading-none mb-10 md:mb-[2.5em] font-playfair font-bold">
            {title}
          </h1>
          <p className="text-base md:text-xl font-medium w-2/3 custom:w-1/2">{copy}</p>
        </div>
        <div className="flex-1 aspect-video rounded-lg overflow-hidden card-img">
         <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className=" min-w-full min-h-full object-cover  rounded-3xl"
            style={{ 
            
              width: '100%',
              height: '100%'
            }}
          >
            <source src={`/assets/videos/vi-${index + 1}.mp4`} type="video/mp4" />
          
          </video>
        </div>
      </div>
    </div>
  );
};

const RotatingCard = ({ index }: { index: number }) => {
  const cardTexts = [
    'The dinner exceeded all expectations. The ingredients were fresh, the presentation was beautiful, and each bite was perfectly seasoned. You can tell the chef truly cares about quality.',
    'We came here to celebrate our anniversary, and it couldn’t have been more perfect. The staff went above and beyond to make us feel special, and the food was absolutely delicious.',
    'What a pleasant surprise! The dinner was superb—especially the main course. Everything was served hot and fresh. Definitely coming back with friends next time.',
    'The dinner exceeded all expectations. The ingredients were fresh, the presentation was beautiful, and each bite was perfectly seasoned. You can tell the chef truly cares about quality.',
    'Cozy atmosphere, hearty meals, and friendly service. It felt like a home-cooked dinner but elevated. The kind of place that leaves you full and happy.',
    "From the moment we walked in, everything was perfect. The ambiance was warm and inviting, the service was outstanding, and every dish was full of flavor. Easily one of the best dinners we've had in a long time."
  ];

   const cardName = [
    'Aine Walls',
    'Charlie Bryant',
    'Joel Rubio',
    'Emilia Hodge',
    'Simon Stevens',
    'Izabella Proctor'
  ];

  return (
    <div 
      className="rotating-card absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform w-64 custom:w-80 h-1/2 p-2 flex flex-col gap-2 bg-[#202020] text-white opacity-0 invisible rounded-xl"
    >
      <div className="flex-1 min-h-0 box-border">
        <img 
          src={`/asset/card-${index + 1}.avif`}
          alt={`Card ${index + 1}`}
          className="box-border h-full object-cover rounded-lg"
          loading="lazy"
        />
      </div>
      <div className="flex-none flex flex-col flex-wrap">
        <div className='flex gap-3 item-center py-3'>
<p> {cardName[index]}</p>
<div className='flex gap-1'>
  <LiaStarSolid className='text-yellow-500'/>
   <LiaStarSolid className='text-yellow-500'/>
    <LiaStarSolid className='text-yellow-500'/>
     <LiaStarSolid className='text-yellow-500'/>
      <LiaStarSolid className='text-yellow-500'/>
</div>
        </div>
        

        <p className=" font-montserrat text-sm">
          {cardTexts[index]}
        </p>
      </div>
    </div>
  );
};

export default function CombinedScrollAnimation() {
  const container = useRef<HTMLDivElement>(null);

  // Data for the first section (stacking cards)
  const stackingCards = [
    {
      title: 'AI-Powered Receipt Verification',
      copy: 'Advanced OCR technology validates every receipt in seconds, ensuring 100% authentic reviews from real diners.',
    },
    {
      title: 'Trust Score System',
      copy: 'Build your reputation with every verified review and completed booking. Higher trust scores unlock premium benefits.',
    },
    {
      title: 'Smart Booking Priority',
      copy: 'Trusted users get priority access to prime reservation slots and exclusive restaurant offers.',
    },
    {
      title: 'AI Content Moderation',
      copy: 'Automated content filtering ensures all reviews meet quality standards while maintaining authentic voices.',
    },
  ];

  useGSAP(
    () => {
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
      const rotations = [-12, 10, -5, 5, -5, -2];
      
      // Set initial state for rotating cards
      rotatingCards.forEach((card: any, index: number) => {
        gsap.set(card, {
          y: window.innerHeight * 0.1,
          rotate: rotations[index],
          opacity: 0,
          visibility: 'hidden'
        });
      });

      ScrollTrigger.create({
        trigger: '.sticky-cards',
        start: 'top top',
        end: `+=${window.innerHeight * 2}px`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const totalCards = rotatingCards.length;
          const progressPerCard = 1 / totalCards;
          
          rotatingCards.forEach((card: any, index: number) => {
            const cardStart = index * progressPerCard;
            let cardProgress = (progress - cardStart) / progressPerCard;
            cardProgress = Math.min(Math.max(cardProgress, 0), 1);
            
            const earlyStart = Math.max(0, cardProgress - 0.1);
            
            let yPos = window.innerHeight * 0.5 * (1 - earlyStart);
            let xPos = 0;
            let opacity = earlyStart > 0 ? 1 : 0;
            let visibility = earlyStart > 0 ? 'visible' : 'hidden';
            
            if (cardProgress === 1 && index < totalCards - 1) {
              const remainingProgress =
                (progress - (cardStart + progressPerCard)) /
                (1 - (cardStart + progressPerCard));
              if (remainingProgress > 0) {
                const distanceMultiplier = 1 - index * 0.15;
                xPos =
                  -window.innerWidth * 0.3 * distanceMultiplier * remainingProgress;
                yPos =
                  -window.innerHeight *
                  0.3 *
                  distanceMultiplier *
                  remainingProgress;
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
        },
      });

      // Force ScrollTrigger to recalculate everything after DOM is stable
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: container }
  );

  return (
    <div className="app font-montserrat" ref={container}>
      {/* Initial spacer */}
        <section className='h-32 md:h-96  bg-secondary '>

      </section>
      
      {/* First Section: Stacking Cards */}
      <section className="cards">
        {stackingCards.map((card, index) => (
          <Card key={index} {...card} index={index} />
        ))}
      </section>

      {/* Transition Section */}
      <section className="transition-section relative w-full h-32 p-8 bg-accent flex items-center">
      
      </section>

      {/* Second Section: Rotating Cards */}
      <section className="sticky-cards w-screen h-screen overflow-hidden bg-accent -pt-2">
       {/** <div >
          <h1 className='text-center text-6xl text-white font-playfair px-72 pt-20'>Get More Trust</h1>
        </div> */}
        <h1 className='text-end  uppercase text-4xl md:text-6xl custom:text-7xl text-white font-playfair lg:px-72 px-6 pt-20 font-bold'>Build More Trust</h1>

      <div className="w-full flex justify-end lg:px-72 px-6">
  <p className="text-white text-left pt-10 md:text-xl w-[500px] font-montserrat">
    Boost your brand’s credibility and increase customer confidence by gathering more genuine reviews each one builds trust, enhances visibility, and drives more conversions.
  </p>
</div>
        {[1, 2, 3, 4, 5, 6].map((card, index) => (
          <RotatingCard key={index} index={index} />
        ))}
      </section>

      {/* Final outro section */}
      <section className="outro relative w-full h-32 p-8 bg-accent flex items-center">
      
      </section>
    </div>
  );
}