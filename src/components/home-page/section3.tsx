'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface ImageData {
  src: string;
  alt: string;
  origin: 'left' | 'right';
}

const ScrollAnimationGallery = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
   // Sample images - replace with your actual images
  const images: ImageData[] = [
    { src: '/assets/image-1.avif', alt: 'Image 1', origin: 'right' },
    { src: '/assets/image-2.avif', alt: 'Image 2', origin: 'left' },
    { src: '/assets/image-3.avif', alt: 'Image 3', origin: 'left' },
    { src: '/assets/image-4.avif', alt: 'Image 4', origin: 'right' },
    { src: '/assets/image-5.avif', alt: 'Image 5', origin: 'left' },
    { src: '/assets/image-6.avif', alt: 'Image 6', origin: 'left' },
    { src: '/assets/image-7.avif', alt: 'Image 7', origin: 'right' },
    { src: '/assets/image-8.avif', alt: 'Image 8', origin: 'left' },
    { src: '/assets/image-9.avif', alt: 'Image 9', origin: 'left' },
    { src: '/assets/image-10.avif', alt: 'Image 10', origin: 'left' },
    { src: '/assets/image-11.avif', alt: 'Image 11', origin: 'left' },
    { src: '/assets/image-12.avif', alt: 'Image 12', origin: 'left' },
    { src: '/assets/image-13.avif', alt: 'Image 13', origin: 'right' },
    { src: '/assets/image-14.avif', alt: 'Image 14', origin: 'left' },
    { src: '/assets/image-15.avif', alt: 'Image 15', origin: 'left' },
    { src: '/assets/image-16.avif', alt: 'Image 16', origin: 'right' },
    { src: '/assets/image-17.avif', alt: 'Image 17', origin: 'left' },
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
    <div ref={containerRef} className="relative">
     
      <section className="relative box-border overflow-hidden bg-secondary">
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
                    <img
                      src={images[imageIndex].src}
                      alt={images[imageIndex].alt}
                      className="w-full h-full object-cover rounded-xl"
                    />
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
  );
};

export default ScrollAnimationGallery;