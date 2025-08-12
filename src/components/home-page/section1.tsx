'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugins once
gsap.registerPlugin(ScrollTrigger);

// Static breakpoints data to prevent recreation
const BREAKPOINTS = [
  { maxWidth: 1000, translateY: -135, movementMultiplier: 450 },
  { maxWidth: 1100, translateY: -130, movementMultiplier: 500 },
  { maxWidth: 1200, translateY: -125, movementMultiplier: 550 },
  { maxWidth: 1300, translateY: -120, movementMultiplier: 600 },
] as const;

// Default values for larger screens
const DEFAULT_VALUES = {
  translateY: -105,
  movementMultiplier: 650,
};

// Animation constants
const ANIMATION_CONFIG = {
  mouseInterpolation: 0.05,
  initialScale: 0.25,
  initialFontSize: 80,
  initialGap: 2,
  mediumFontSize: 40,
  finalFontSize: 20,
  fontSizeBreakpoint: 0.4,
  scaleThreshold: 0.95,
};

// Debounce utility function
function debounce<T extends (...args: any[]) => void>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

// Custom hook for screen size detection
function useScreenSize() {
  const [isDesktop, setIsDesktop] = useState(false);

  const checkScreenSize = useCallback(() => {
    setIsDesktop(window.innerWidth >= 900);
  }, []);

  useEffect(() => {
    checkScreenSize();
    const debouncedCheck = debounce(checkScreenSize, 100);
    window.addEventListener('resize', debouncedCheck);
    
    return () => {
      window.removeEventListener('resize', debouncedCheck);
    };
  }, [checkScreenSize]);

  return isDesktop;
}

// Animation state class for better organization
class AnimationState {
  scrollProgress = 0;
  initialTranslateY: number;
  currentTranslateY: number;
  movementMultiplier: number;
  scale = ANIMATION_CONFIG.initialScale;
  fontSize = ANIMATION_CONFIG.initialFontSize;
  gap = ANIMATION_CONFIG.initialGap;
  targetMouseX = 0;
  currentMouseX = 0;

  constructor(initialValues: { translateY: number; movementMultiplier: number }) {
    this.initialTranslateY = initialValues.translateY;
    this.currentTranslateY = initialValues.translateY;
    this.movementMultiplier = initialValues.movementMultiplier;
  }

  updateInitialValues(newValues: { translateY: number; movementMultiplier: number }) {
    this.initialTranslateY = newValues.translateY;
    this.movementMultiplier = newValues.movementMultiplier;
    
    if (this.scrollProgress === 0) {
      this.currentTranslateY = newValues.translateY;
    }
  }

  updateFromScrollProgress(progress: number) {
    this.scrollProgress = progress;
    
    this.currentTranslateY = gsap.utils.interpolate(
      this.initialTranslateY,
      0,
      progress
    );

    this.scale = gsap.utils.interpolate(
      ANIMATION_CONFIG.initialScale,
      1,
      progress
    );

    this.gap = gsap.utils.interpolate(
      ANIMATION_CONFIG.initialGap,
      1,
      progress
    );

    // Font size animation with two phases
    if (progress <= ANIMATION_CONFIG.fontSizeBreakpoint) {
      const firstPartProgress = progress / ANIMATION_CONFIG.fontSizeBreakpoint;
      this.fontSize = gsap.utils.interpolate(
        ANIMATION_CONFIG.initialFontSize,
        ANIMATION_CONFIG.mediumFontSize,
        firstPartProgress
      );
    } else {
      const secondPartProgress = (progress - ANIMATION_CONFIG.fontSizeBreakpoint) / 
        (1 - ANIMATION_CONFIG.fontSizeBreakpoint);
      this.fontSize = gsap.utils.interpolate(
        ANIMATION_CONFIG.mediumFontSize,
        ANIMATION_CONFIG.finalFontSize,
        secondPartProgress
      );
    }
  }

  updateMousePosition(targetX: number) {
    this.targetMouseX = targetX;
    
    const scaledMovementMultiplier = (1 - this.scale) * this.movementMultiplier;
    const maxHorizontalMovement = this.scale < ANIMATION_CONFIG.scaleThreshold 
      ? this.targetMouseX * scaledMovementMultiplier 
      : 0;

    this.currentMouseX = gsap.utils.interpolate(
      this.currentMouseX,
      maxHorizontalMovement,
      ANIMATION_CONFIG.mouseInterpolation
    );
  }
}

export default function ScrollAnimation() {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const animationStateRef = useRef<AnimationState | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const scrollTriggerRef = useRef<gsap.core.Timeline | null>(null);
  
  const isDesktop = useScreenSize();

  // Memoize initial values calculation
  const getInitialValues = useCallback(() => {
    const width = window.innerWidth;
    
    for (const bp of BREAKPOINTS) {
      if (width <= bp.maxWidth) {
        return {
          translateY: bp.translateY,
          movementMultiplier: bp.movementMultiplier,
        };
      }
    }
    
    return DEFAULT_VALUES;
  }, []);

  // Memoized mouse move handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!animationStateRef.current) return;
    
    const normalizedX = (e.clientX / window.innerWidth - 0.5) * 2;
    animationStateRef.current.updateMousePosition(normalizedX);
  }, []);

  // Optimized animation loop
  const animate = useCallback(() => {
    if (!isDesktop || !videoContainerRef.current || !animationStateRef.current) return;

    const state = animationStateRef.current;
    const videoContainer = videoContainerRef.current;
    const videoTitleElements = document.querySelectorAll<HTMLParagraphElement>('.video-title p');

    // Update mouse position with interpolation
    state.updateMousePosition(state.targetMouseX);

    // Batch DOM updates
    requestAnimationFrame(() => {
      // Update video container transform
      videoContainer.style.transform = 
        `translateY(${state.currentTranslateY}%) translateX(${state.currentMouseX}px) scale(${state.scale})`;
      videoContainer.style.gap = `${state.gap}em`;

      // Update font sizes
      videoTitleElements.forEach((element) => {
        element.style.fontSize = `${state.fontSize}px`;
      });
    });

    animationFrameIdRef.current = requestAnimationFrame(animate);
  }, [isDesktop]);

  // Resize handler
  const handleResize = useCallback(() => {
    if (!animationStateRef.current) return;
    
    const newValues = getInitialValues();
    animationStateRef.current.updateInitialValues(newValues);
  }, [getInitialValues]);

  // Main animation setup effect
  useEffect(() => {
    if (!isDesktop) return;

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    // Initialize animation state
    const initialValues = getInitialValues();
    animationStateRef.current = new AnimationState(initialValues);

    // Setup GSAP integration
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Create scroll trigger
    const scrollTrigger = gsap.timeline({
      scrollTrigger: {
        trigger: '.intro',
        start: 'top bottom',
        end: 'top 10%',
        scrub: true,
        onUpdate: (self) => {
          if (animationStateRef.current) {
            animationStateRef.current.updateFromScrollProgress(self.progress);
          }
        },
      },
    });
    scrollTriggerRef.current = scrollTrigger;

    // Add event listeners
    const debouncedResize = debounce(handleResize, 100);
    window.addEventListener('resize', debouncedResize);
    document.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Start animation loop
    animate();

    // Cleanup function
    return () => {
      // Cancel animation frame
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }

      // Remove event listeners
      window.removeEventListener('resize', debouncedResize);
      document.removeEventListener('mousemove', handleMouseMove);
      
      // Clean up GSAP
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
      
      // Clean up Lenis
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }

      // Clear refs
      animationStateRef.current = null;
      lenisRef.current = null;
      animationFrameIdRef.current = null;
      scrollTriggerRef.current = null;
    };
  }, [isDesktop, getInitialValues, handleMouseMove, handleResize, animate]);

  // Memoized video component to prevent unnecessary re-renders
  const VideoComponent = useMemo(() => {
    const Component = ({ src, className }: { src: string; className?: string }) => (
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className={`min-w-full min-h-full object-cover rounded-3xl ${className || ''}`}
        style={{ width: '100%', height: '100%' }}
        preload="metadata"
      >
        <source src={src} type="video/mp4" />
      </video>
    );
    
    Component.displayName = 'VideoComponent';
    return Component;
  }, []);

  return (
    <div className="text-secondary bg-background overflow-x-hidden">
      {/* Hero Section */}
      <section className="hero box-border h-screen p-6 md:p-10 pt-16 md:pt-16 flex flex-col justify-between md:justify-end gap-8 md:gap-0 hidden md:block">
        <h1 className="relative -left-1 uppercase font-bold text-[19vw] md:text-[12vw] leading-none tracking-tight font-playfair">
          Taste & Trust
        </h1>
        <div className="hero-copy flex justify-between items-end">
          <p className="text-xl font-medium">Where Trust Meets Taste</p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="intro box-border h-96 md:h-screen p-6 md:p-10">
        {/* Desktop Video Container */}
        <div 
          ref={videoContainerRef}
          className="video-container-desktop hidden md:flex flex-col gap-8 will-change-transform relative"
          style={{ transform: 'translateY(-105%) scale(0.25)' }}
        >
          <div className="video-preview relative box-border aspect-video rounded-3xl bg-[#b9b9b3] overflow-hidden">
            <div className="video-wrapper absolute top-0 left-0 box-border h-full rounded-3xl overflow-hidden">
              <VideoComponent src="/footer.mp4" />
            </div>
          </div>
          <div className="video-title">
            <p className="relative text-[78px] font-medium font-playfair">Dine at the Best</p>
          </div>
        </div>

        {/* Mobile Video Container */}
        <div className="video-container-mobile flex md:hidden flex-col gap-4 w-full max-w-[800px] mx-auto">
          <div className="video-preview relative box-border aspect-video rounded-3xl bg-[#b9b9b3] overflow-hidden">
            <div className="video-wrapper absolute top-0 left-0 box-border h-full rounded-3xl overflow-hidden">
              <VideoComponent src="/video.mp4" />
            </div>
          </div>
          <div className="video-title">
            <p className="text-xl font-medium">Dine at the Best</p>
          </div>
        </div>
      </section>

      {/* Outro Section */}
      <section className="outro box-border h-80 p-6 md:p-10 flex justify-center items-center hidden md:block">
      </section>
    </div>
  );
}