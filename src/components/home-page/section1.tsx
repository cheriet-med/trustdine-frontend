'use client';

import { useEffect, useRef, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollAnimation() {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 900);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    const lenis = new Lenis();
    const videoContainer = videoContainerRef.current;
    const videoTitleElements = document.querySelectorAll<HTMLParagraphElement>('.video-title p');

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    const breakpoints = [
      { maxWidth: 1000, translateY: -135, movementMultiplier: 450 },
      { maxWidth: 1100, translateY: -130, movementMultiplier: 500 },
      { maxWidth: 1200, translateY: -125, movementMultiplier: 550 },
      { maxWidth: 1300, translateY: -120, movementMultiplier: 600 },
    ];

    const getInitialValues = () => {
      const width = window.innerWidth;

      for (const bp of breakpoints) {
        if (width <= bp.maxWidth) {
          return {
            translateY: bp.translateY,
            movementMultiplier: bp.movementMultiplier,
          };
        }
      }

      return {
        translateY: -105,
        movementMultiplier: 650,
      };
    };

    const initialValues = getInitialValues();

    const animationState = {
      scrollProgress: 0,
      initialTranslateY: initialValues.translateY,
      currentTranslateY: initialValues.translateY,
      movementMultiplier: initialValues.movementMultiplier,
      scale: 0.25,
      fontSize: 80,
      gap: 2,
      targetMouseX: 0,
      currentMouseX: 0,
    };

    const handleResize = () => {
      const newValues = getInitialValues();
      animationState.initialTranslateY = newValues.translateY;
      animationState.movementMultiplier = newValues.movementMultiplier;

      if (animationState.scrollProgress === 0) {
        animationState.currentTranslateY = newValues.translateY;
      }
    };

    window.addEventListener('resize', handleResize);

    const scrollTrigger = gsap.timeline({
      scrollTrigger: {
        trigger: '.intro',
        start: 'top bottom',
        end: 'top 10%',
        scrub: true,
        onUpdate: (self) => {
          animationState.scrollProgress = self.progress;

          animationState.currentTranslateY = gsap.utils.interpolate(
            animationState.initialTranslateY,
            0,
            animationState.scrollProgress
          );

          animationState.scale = gsap.utils.interpolate(
            0.25,
            1,
            animationState.scrollProgress
          );

          animationState.gap = gsap.utils.interpolate(
            2,
            1,
            animationState.scrollProgress
          );

          if (animationState.scrollProgress <= 0.4) {
            const firstPartProgress = animationState.scrollProgress / 0.4;
            animationState.fontSize = gsap.utils.interpolate(
              80,
              40,
              firstPartProgress
            );
          } else {
            const secondPartProgress =
              (animationState.scrollProgress - 0.4) / 0.6;
            animationState.fontSize = gsap.utils.interpolate(
              40,
              20,
              secondPartProgress
            );
          }
        },
      },
    });

    const handleMouseMove = (e: MouseEvent) => {
      animationState.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    };

    document.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;

    const animate = () => {
      if (!isDesktop || !videoContainer) return;

      const {
        scale,
        targetMouseX,
        currentMouseX,
        currentTranslateY,
        fontSize,
        gap,
        movementMultiplier,
      } = animationState;

      const scaledMovementMultiplier = (1 - scale) * movementMultiplier;

      const maxHorizontalMovement =
        scale < 0.95 ? targetMouseX * scaledMovementMultiplier : 0;

      animationState.currentMouseX = gsap.utils.interpolate(
        currentMouseX,
        maxHorizontalMovement,
        0.05
      );

      if (videoContainer) {
        videoContainer.style.transform = `translateY(${currentTranslateY}%) translateX(${animationState.currentMouseX}px) scale(${scale})`;
        videoContainer.style.gap = `${gap}em`;
      }

      videoTitleElements.forEach((element) => {
        element.style.fontSize = `${fontSize}px`;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      scrollTrigger.kill();
      lenis.destroy();
    };
  }, [isDesktop]);

  return (
    <div className=" text-secondary bg-background overflow-x-hidden">
      <section className="hero box-border h-screen p-6 md:p-10 pt-16 md:pt-16  flex-col justify-between md:justify-end gap-8 md:gap-0 hidden md:block">
        <h1 className="relative -left-1 uppercase font-bold text-[19vw] md:text-[12vw] leading-none tracking-tight font-playfair">
         Taste & Trust
        </h1>

        <div className="hero-copy flex justify-between items-end">
          <p className="text-xl font-medium">Where Trust Meets Taste</p>
         
        </div>
      </section>

      <section className="intro box-border h-96 md:h-screen p-6 md:p-10">
        <div 
          ref={videoContainerRef}
          className="video-container-desktop hidden md:flex flex-col gap-8 will-change-transform relative"
          style={{ transform: 'translateY(-105%) scale(0.25)' }}
        >
          <div className="video-preview relative box-border aspect-video rounded-3xl bg-[#b9b9b3] overflow-hidden">
            <div className="video-wrapper absolute top-0 left-0 box-border h-full rounded-3xl overflow-hidden">
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
            <source src="/footer.mp4" type="video/mp4" />
          
          </video>
            
            </div>
          </div>
          <div className="video-title">
            <p className="relative text-[78px] font-medium font-playfair">Dine at the Best</p>
            
          </div>
        </div>

        <div className="video-container-mobile md:hidden flex  flex-col gap-4 w-full max-w-[800px] mx-auto ">
          <div className="video-preview relative box-border aspect-video rounded-3xl bg-[#b9b9b3] overflow-hidden">
            <div className="video-wrapper absolute top-0 left-0 w-full h-full rounded-3xl overflow-hidden">
              <video 
            autoPlay 
            loop 
            muted 
            playsInline 
             preload="auto"
            className=" min-w-full min-h-full object-cover  rounded-3xl"
            style={{ 
             
              width: '100%',
              height: '100%'
            }}
          >
            <source src="/footer.mp4" type="video/mp4" />
          
          </video>
            </div>
          </div>
          <div className="video-title">
            <p className="text-xl font-medium">Dine at the Best</p>
         
          </div>
        </div>
      </section>
      <section className="outro box-border h-60 p-6 md:p-10  justify-center items-center hidden md:block">
      </section>
    </div>
  );
}