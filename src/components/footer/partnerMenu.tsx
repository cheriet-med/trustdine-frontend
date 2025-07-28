"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { 
  FaQrcode,
  FaLayerGroup,
  FaUser,
  FaGlobe,
  FaChartLine,
  FaBookReader,
  FaTh,
  FaChevronUp,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";

import { AiFillFacebook } from "react-icons/ai";
import { RiTwitterXFill } from "react-icons/ri";
import { LuInstagram } from "react-icons/lu";
import { IoLogoYoutube } from "react-icons/io5";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa6";
import { IoRestaurant } from "react-icons/io5";
import { FaHandsHelping } from "react-icons/fa";
import { MdOutlineCreditScore } from "react-icons/md";
import { RiMenu3Fill } from "react-icons/ri";
import { useLinkStatus } from "next/link";
import { useSession } from "next-auth/react";
import { AppPathname } from "@/i18n/routing";
import Link from 'next/link';
import {useLocale} from "next-intl";
import { MdOutlineRateReview } from "react-icons/md";
import { FaHeartCircleCheck } from "react-icons/fa6";
import { MdOutlineTravelExplore } from "react-icons/md";
import { TiBusinessCard } from "react-icons/ti";
import { IoMdAnalytics } from "react-icons/io";
import { FaHotel } from "react-icons/fa";
import { MdLocalOffer } from "react-icons/md";




interface MenuItem {
  label: string;
  icon: any,
  href: string ;
}

export default function PartnerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuAnimating, setIsMenuAnimating] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Audio refs
  const menuOpenSound = useRef<HTMLAudioElement | null>(null);
  const menuCloseSound = useRef<HTMLAudioElement | null>(null);
  const menuSelectSound = useRef<HTMLAudioElement | null>(null);
  const { data: session, status } = useSession();
  
  const menuItems: MenuItem[] = [
    { label: "List Your Business", icon: <TiBusinessCard />, href: "/en/partner" },
    { label: "Business Dashboard", icon: <IoMdAnalytics />, href: status === "authenticated" ? "/en/account" :"/en/login" },
    { label: "Submit a Venue", icon: <FaHotel />, href: status === "authenticated" ? "/en/account" :"/en/login" },
    { label: "Pricing for Ads", icon: <MdLocalOffer />, href: "/en/partner" },
  ];

  const menuRef = useRef<HTMLDivElement>(null);
  const joystickRef = useRef<HTMLDivElement>(null);
  const menuOverlayRef = useRef<HTMLDivElement>(null);
  const menuOverlayNavRef = useRef<HTMLDivElement>(null);
  const menuOverlayFooterRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const isDraggingRef = useRef(false);
  const currentYRef = useRef(0);
  const targetYRef = useRef(0);

  useEffect(() => {
    // Initialize audio elements
    menuOpenSound.current = new Audio('/menu-open.mp3');
    menuCloseSound.current = new Audio('/menu-close.mp3');
    menuSelectSound.current = new Audio('/menu-select.mp3');
  }, []);

  useEffect(() => {
    if (menuRef.current && joystickRef.current) {
      gsap.set(joystickRef.current, { scale: 0 });
      gsap.set([menuOverlayNavRef.current, menuOverlayFooterRef.current], {
        opacity: 0,
      });
      gsap.set(menuItemsRef.current, { x: -100, opacity: 0 });

      initJoystickDrag();
    }
  }, []);

  const toggleMenu = () => {
    if (isMenuAnimating) return;
  
    setIsMenuAnimating(true);
  
    if (!isOpen) {
      setIsOpen(true);
      menuOpenSound.current?.play().catch(e => console.error("Audio play failed:", e));
      
      gsap.to(menuOverlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
        onStart: () => {
          if (menuOverlayRef.current) {
            menuOverlayRef.current.style.pointerEvents = "all";
          }
        }
      });
  
      gsap.to(joystickRef.current, {
        scale: 1,
        duration: 0.4,
        delay: 0.2,
        ease: "back.out(1.7)"
      });
  
      // Animate navigation and footer
      gsap.set([menuOverlayNavRef.current, menuOverlayFooterRef.current], { opacity: 0 });
      gsap.to([menuOverlayNavRef.current, menuOverlayFooterRef.current], {
        opacity: 1,
        duration: 0.075,
        delay: 0.3,
        repeat: 3,
        yoyo: true,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.set([menuOverlayNavRef.current, menuOverlayFooterRef.current], { opacity: 1 });
        }
      });
  
      // Animate menu items with stagger effect
      const shuffledIndices = [...Array(menuItems.length).keys()]
        .sort(() => Math.random() - 0.5);
  
      shuffledIndices.forEach((originalIndex, shuffledPosition) => {
        const menuItem = menuItemsRef.current[originalIndex];
        if (!menuItem) return;
        
        gsap.fromTo(menuItem, 
          { x: -100, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.5,
            delay: 0.4 + (shuffledPosition * 0.1),
            ease: "back.out(1.7)",
            onComplete: () => {
              if (originalIndex === shuffledIndices[shuffledIndices.length - 1]) {
                setIsMenuAnimating(false);
              }
            }
          }
        );
      });
    } else {
      setIsOpen(false);
      menuCloseSound.current?.play().catch(e => console.error("Audio play failed:", e));
      
      // Hide navigation and footer
      gsap.to([menuOverlayNavRef.current, menuOverlayFooterRef.current], {
        opacity: 0,
        duration: 0.05,
        repeat: 2,
        yoyo: true,
        ease: "power2.inOut",
        onComplete: () => {
          if (menuOverlayNavRef.current && menuOverlayFooterRef.current) {
            gsap.set([menuOverlayNavRef.current, menuOverlayFooterRef.current], { 
              opacity: 0 
            });
          }
        }
      });
  
      // Hide joystick
      gsap.to(joystickRef.current, {
        scale: 0,
        duration: 0.3,
        delay: 0.2,
        ease: "back.in(1.7)"
      });
  
      // Hide menu items
      const shuffledIndices = [...Array(menuItems.length).keys()]
        .sort(() => Math.random() - 0.5);
  
      shuffledIndices.forEach((originalIndex, shuffledPosition) => {
        const menuItem = menuItemsRef.current[originalIndex];
        if (!menuItem) return;
        
        gsap.to(menuItem, {
          x: -100,
          opacity: 0,
          duration: 0.3,
          delay: shuffledPosition * 0.05,
          ease: "power2.in"
        });
      });
  
      // Hide overlay
      gsap.to(menuOverlayRef.current, {
        opacity: 0,
        duration: 0.3,
        delay: 0.6,
        ease: "power2.out",
        onComplete: () => {
          if (menuOverlayRef.current) {
            menuOverlayRef.current.style.pointerEvents = "none";
          }
          setIsMenuAnimating(false);
          setActiveIndex(null);
        }
      });
    }
  };

  const playSelectSound = () => {
    if (isOpen) {
      menuSelectSound.current?.play().catch(e => console.error("Audio play failed:", e));
    }
  };

  const initJoystickDrag = () => {
    const animate = () => {
      currentYRef.current += (targetYRef.current - currentYRef.current) * 0.15;

      if (joystickRef.current) {
        gsap.set(joystickRef.current, {
          y: currentYRef.current,
        });
      }

      // Calculate active menu item based on joystick position
      if (isDraggingRef.current && Math.abs(currentYRef.current) > 10) {
        const itemHeight = 80; // Approximate height of each menu item
        const menuStartY = -((menuItems.length - 1) * itemHeight) / 2;
        const relativeY = currentYRef.current - menuStartY;
        const newActiveIndex = Math.max(0, Math.min(menuItems.length - 1, 
          Math.floor(relativeY / itemHeight)));

        if (newActiveIndex !== activeIndex) {
          setActiveIndex(newActiveIndex);
          playSelectSound();
        }
      } else if (!isDraggingRef.current) {
        setActiveIndex(null);
      }

      requestAnimationFrame(animate);
    };

    if (joystickRef.current) {
      joystickRef.current.addEventListener("mousedown", (e) => {
        isDraggingRef.current = true;
        const rect = joystickRef.current?.getBoundingClientRect();
        if (!rect) return;

        const centerY = rect.top + rect.height / 2;

        const drag = (e: MouseEvent | TouchEvent) => {
          if (!isDraggingRef.current) return;
          const clientY = "clientY" in e ? e.clientY : e.touches[0]?.clientY ?? 0;
          const deltaY = clientY - centerY;
          const maxDrag = 150;

          if (Math.abs(deltaY) <= 10) {
            targetYRef.current = 0;
          } else if (Math.abs(deltaY) > maxDrag) {
            targetYRef.current = deltaY > 0 ? maxDrag : -maxDrag;
          } else {
            targetYRef.current = deltaY;
          }
          e.preventDefault();
        };

        const endDrag = () => {
          isDraggingRef.current = false;
          targetYRef.current = 0;
          setActiveIndex(null);
          document.removeEventListener("mousemove", drag);
          document.removeEventListener("mouseup", endDrag);
        };

        document.addEventListener("mousemove", drag);
        document.addEventListener("mouseup", endDrag);
        e.preventDefault();
      });

      animate();
    }
  };

  return (
    <>
      {/* Menu Toggle Button */}

<p className=" hover:underline cursor-pointer" onClick={toggleMenu}>For Business Owners</p>
      {/* Menu Overlay */}
      <div
        ref={menuOverlayRef}
        className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center overflow-hidden z-[100] opacity-0 pointer-events-none font-montserrat"
      >
        {/* Background with menu.jpg */}
        <div 
          className="absolute w-full h-full bg-[url('/03.webp')] bg-no-repeat bg-center bg-cover"
        />

        {/* Menu Overlay Nav */}
        <div
          ref={menuOverlayNavRef}
          className="absolute top-0 w-screen px-6 flex justify-between items-center p-10"
        >
          <div className="flex gap-4">
            <a href="#"><AiFillFacebook size={24} className="text-white" /></a>
            <a href="#"><RiTwitterXFill size={24} className="text-white" /></a>
            <a href="#"><LuInstagram size={24} className="text-white" /></a>
            <a href="#"><IoLogoYoutube size={24} className="text-white" /></a>
            <a href="#"><FaTiktok size={24} className="text-white" /></a>
          </div>

          <button className="relative w-6 h-6 cursor-pointer" onClick={toggleMenu}>
            <div className="absolute top-1/2 w-6 h-0.5 bg-white transform rotate-45"></div>
            <div className="absolute top-1/2 w-6 h-0.5 bg-white transform -rotate-45"></div>
          </button>
        </div>

        {/* Vertical Menu Container */}
        <div className="flex items-center justify-center gap-12">
          {/* Menu Items */}
          <div
            ref={menuRef}
            className="flex flex-col gap-4"
          >
            {menuItems.map((item, index) => (
              <Link
                key={index}
                ref={(el) => {
                  if (el) {
                    menuItemsRef.current[index] = el;
                  }
                }}
                href={item.href}
                className={`group relative flex items-center gap-6 px-8 py-4 text-white bg-white/10 backdrop-blur-md border border-white/20 cursor-pointer transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:scale-105 ${
                  activeIndex === index ? 'bg-white/30 border-white/60 scale-105 shadow-lg' : ''
                }`}
                onMouseEnter={() => {
                  playSelectSound();
                  setActiveIndex(index);
                }}
                onMouseLeave={() => setActiveIndex(null)}
                onClick={toggleMenu}
                style={{
                  borderRadius: '12px',
                  minWidth: '280px'
                }}
              >
                <div className="text-3xl group-hover:text-primary transition-colors duration-300">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="text-lg font-semibold group-hover:text-primary transition-colors duration-300">
                    {item.label}
                  </div>
                </div>
                <div className="opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                  <FaChevronRight size={16} />
                </div>
              </Link>
            ))}
          </div>


        </div>

        {/* Menu Overlay Footer */}
        <div
          ref={menuOverlayFooterRef}
          className="absolute bottom-0 w-screen px-6 flex justify-between items-center pb-2"
        >
          <p className="text-white uppercase font-montserrat text-xs">
            Copyright &copy; 2025 All Rights Reserved
          </p>
          <div className="flex gap-4">
            <Link href="/en/cookies-policy" className="text-white uppercase font-montserrat text-xs hover:text-primary transition-colors">Cookie Settings</Link>
            <Link href="/en/privacy-policy" className="text-white uppercase font-montserrat text-xs hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/en/terms-and-conditions" className="text-white uppercase font-montserrat text-xs hover:text-primary transition-colors">Terms and Conditions</Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes flickerHover {
          0%, 100% { background-color: rgba(255, 255, 255, 0.1); }
          50% { background-color: rgba(255, 255, 255, 0.3); }
        }
        
        @keyframes contentFlickerHover {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.05); }
        }
        
        .joystick:active {
          cursor: grabbing;
        }
      `}</style>
    </>
  );
}