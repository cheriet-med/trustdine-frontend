// app/layout.tsx or a provider component
'use client';

import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { usePathname } from 'next/navigation';
import HomeNav from '@/components/header/Home-Nav';
import Footer from '@/components/footer/footer';
import End from '@/components/footer/end';
import ScrollToTopButton from '@/components/home-page/TopButton';


export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>
    <HomeNav />
             
  {children}
     <Footer/>
                <End/>
                <ScrollToTopButton/>
  </>;
}