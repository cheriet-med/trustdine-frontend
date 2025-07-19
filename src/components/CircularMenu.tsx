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


interface MenuItem {
  label: string;
  icon: any,
  href: string ;
}

export default function CircularMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuAnimating, setIsMenuAnimating] = useState(false);
  const [responsiveConfig, setResponsiveConfig] = useState({
    menuSize: 600,
    center: 300,
    innerRadius: 48,
    outerRadius: 252,
    contentRadius: 168,
  });

  // Audio refs
  const menuOpenSound = useRef<HTMLAudioElement | null>(null);
  const menuCloseSound = useRef<HTMLAudioElement | null>(null);
  const menuSelectSound = useRef<HTMLAudioElement | null>(null);
  const { data: session, status } = useSession();
  const menuItems: MenuItem[] = [
    { label: "Booke", icon: <IoRestaurant />, href: "/en/booking" },
    { label: "Be partner", icon: <FaPeopleGroup />, href: "/en/partner" },
    { label: status === "authenticated" ? "My Account" :"Sign in", icon: <FaUser />, href: status === "authenticated" ? "/en/account" :"/en/login" },
    { label: "Trust Score", icon: <MdOutlineCreditScore />, href: "/en/trust-score" },
    { label: "Help Center", icon: <FaHandsHelping />, href: "/en/help-center" },
    { label: "About Us", icon: <FaBookReader />, href: "/en/about-us" },
  ];

  const menuRef = useRef<HTMLDivElement>(null);
  const joystickRef = useRef<HTMLDivElement>(null);
  const menuOverlayRef = useRef<HTMLDivElement>(null);
  const menuOverlayNavRef = useRef<HTMLDivElement>(null);
  const menuOverlayFooterRef = useRef<HTMLDivElement>(null);
  const segmentsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const activeSegmentRef = useRef<HTMLAnchorElement | null>(null);
  const isDraggingRef = useRef(false);
  const currentXRef = useRef(0);
  const currentYRef = useRef(0);
  const targetXRef = useRef(0);
  const targetYRef = useRef(0);

  useEffect(() => {
    // Initialize audio elements
    menuOpenSound.current = new Audio('/menu-open.mp3');
    menuCloseSound.current = new Audio('/menu-close.mp3');
    menuSelectSound.current = new Audio('/menu-select.mp3');

    updateResponsiveConfig();
    window.addEventListener("resize", updateResponsiveConfig);

    return () => {
      window.removeEventListener("resize", updateResponsiveConfig);
    };
  }, []);

  useEffect(() => {
    if (menuRef.current && joystickRef.current) {
      gsap.set(joystickRef.current, { scale: 0 });
      gsap.set([menuOverlayNavRef.current, menuOverlayFooterRef.current], {
        opacity: 0,
      });

      initCenterDrag();
    }
  }, []);

  const updateResponsiveConfig = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const isMobile = viewportWidth < 1000;

    const maxSize = Math.min(viewportWidth * 0.9, viewportHeight * 0.9);
    const menuSize = isMobile ? Math.min(maxSize, 480) : 700;

    setResponsiveConfig({
      menuSize,
      center: menuSize / 2,
      innerRadius: menuSize * 0.08,
      outerRadius: menuSize * 0.42,
      contentRadius: menuSize * 0.28,
    });
  };

  const createSegmentPathData = (index: number, total: number) => {
    const { center, innerRadius, outerRadius } = responsiveConfig;

    const anglePerSegment = 360 / total;
    const baseStartAngle = anglePerSegment * index;
    const startAngle = baseStartAngle + 0.19;
    const endAngle = baseStartAngle + anglePerSegment - 0.19;

    const innerStartX = center + innerRadius * Math.cos(((startAngle - 90) * Math.PI) / 180);
    const innerStartY = center + innerRadius * Math.sin(((startAngle - 90) * Math.PI) / 180);
    const outerStartX = center + outerRadius * Math.cos(((startAngle - 90) * Math.PI) / 180);
    const outerStartY = center + outerRadius * Math.sin(((startAngle - 90) * Math.PI) / 180);
    const innerEndX = center + innerRadius * Math.cos(((endAngle - 90) * Math.PI) / 180);
    const innerEndY = center + innerRadius * Math.sin(((endAngle - 90) * Math.PI) / 180);
    const outerEndX = center + outerRadius * Math.cos(((endAngle - 90) * Math.PI) / 180);
    const outerEndY = center + outerRadius * Math.sin(((endAngle - 90) * Math.PI) / 180);

    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    return [
      `M ${innerStartX} ${innerStartY}`,
      `L ${outerStartX} ${outerStartY}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEndX} ${outerEndY}`,
      `L ${innerEndX} ${innerEndY}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY}`,
      "Z",
    ].join(" ");
  };

  const getSegmentContentPosition = (index: number, total: number) => {
    const { center, contentRadius } = responsiveConfig;
    const anglePerSegment = 360 / total;
    const centerAngle = anglePerSegment * index + anglePerSegment / 2;
  
    return {
      x: center + contentRadius * Math.cos(((centerAngle - 90) * Math.PI) / 180),
      y: center + contentRadius * Math.sin(((centerAngle - 90) * Math.PI) / 180),
    };
  };

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
  
      const shuffledIndices = [...Array(menuItems.length).keys()]
        .sort(() => Math.random() - 0.5);
  
      shuffledIndices.forEach((originalIndex, shuffledPosition) => {
        const segment = segmentsRef.current[originalIndex];
        if (!segment) return;
        
        gsap.set(segment, { opacity: 0 });
        gsap.to(segment, {
          opacity: 1,
          duration: 0.075,
          delay: shuffledPosition * 0.075,
          repeat: 3,
          yoyo: true,
          ease: "power2.inOut",
          onComplete: () => {
            gsap.set(segment, { opacity: 1 });
            if (originalIndex === shuffledIndices[shuffledIndices.length - 1]) {
              setIsMenuAnimating(false);
            }
          }
        });
      });
    } else {
      setIsOpen(false);
      menuCloseSound.current?.play().catch(e => console.error("Audio play failed:", e));
      
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
  
      gsap.to(joystickRef.current, {
        scale: 0,
        duration: 0.3,
        delay: 0.2,
        ease: "back.in(1.7)"
      });
  
      const shuffledIndices = [...Array(menuItems.length).keys()]
        .sort(() => Math.random() - 0.5);
  
      shuffledIndices.forEach((originalIndex, shuffledPosition) => {
        const segment = segmentsRef.current[originalIndex];
        if (!segment) return;
        
        gsap.to(segment, {
          opacity: 0,
          duration: 0.05,
          delay: shuffledPosition * 0.05,
          repeat: 2,
          yoyo: true,
          ease: "power2.inOut",
          onComplete: () => {
            gsap.set(segment, { opacity: 0 });
          }
        });
      });
  
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
        }
      });
    }
  };

  const playSelectSound = () => {
    if (isOpen) {
      menuSelectSound.current?.play().catch(e => console.error("Audio play failed:", e));
    }
  };

  const initCenterDrag = () => {
    const animate = () => {
      currentXRef.current += (targetXRef.current - currentXRef.current) * 0.15;
      currentYRef.current += (targetYRef.current - currentYRef.current) * 0.15;

      if (joystickRef.current) {
        gsap.set(joystickRef.current, {
          x: currentXRef.current,
          y: currentYRef.current,
        });
      }

      if (
        isDraggingRef.current &&
        Math.sqrt(
          currentXRef.current * currentXRef.current +
            currentYRef.current * currentYRef.current
        ) > 20
      ) {
        const angle =
          Math.atan2(currentYRef.current, currentXRef.current) * (180 / Math.PI);
        const segmentIndex =
          Math.floor(((angle + 90 + 360) % 360) / (360 / menuItems.length)) %
          menuItems.length;
        const segment = segmentsRef.current[segmentIndex];

        if (segment && segment !== activeSegmentRef.current) {
          if (activeSegmentRef.current) {
            activeSegmentRef.current.style.animation = "";
            const content = activeSegmentRef.current.querySelector(
              ".segment-content"
            ) as HTMLElement;
            if (content) content.style.animation = "";
            activeSegmentRef.current.style.zIndex = "";
          }
          activeSegmentRef.current = segment;
          segment.style.animation = "flickerHover 350ms ease-in-out forwards";
          const content = segment.querySelector(
            ".segment-content"
          ) as HTMLElement;
          if (content) {
            content.style.animation =
              "contentFlickerHover 350ms ease-in-out forwards";
          }
          segment.style.zIndex = "10";
          playSelectSound();
        }
      } else {
        if (activeSegmentRef.current) {
          activeSegmentRef.current.style.animation = "";
          const content = activeSegmentRef.current.querySelector(
            ".segment-content"
          ) as HTMLElement;
          if (content) content.style.animation = "";
          activeSegmentRef.current.style.zIndex = "";
          activeSegmentRef.current = null;
        }
      }

      requestAnimationFrame(animate);
    };

    if (joystickRef.current) {
      joystickRef.current.addEventListener("mousedown", (e) => {
        isDraggingRef.current = true;
        const rect = joystickRef.current?.getBoundingClientRect();
        if (!rect) return;

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const drag = (e: MouseEvent | TouchEvent) => {
          if (!isDraggingRef.current) return;
          const clientX =
            "clientX" in e ? e.clientX : e.touches[0]?.clientX ?? 0;
          const clientY =
            "clientY" in e ? e.clientY : e.touches[0]?.clientY ?? 0;
          const deltaX = clientX - centerX;
          const deltaY = clientY - centerY;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
          const maxDrag = 100 * 0.25;

          if (distance <= 20) {
            targetXRef.current = targetYRef.current = 0;
          } else if (distance > maxDrag) {
            const ratio = maxDrag / distance;
            targetXRef.current = deltaX * ratio;
            targetYRef.current = deltaY * ratio;
          } else {
            targetXRef.current = deltaX;
            targetYRef.current = deltaY;
          }
          e.preventDefault();
        };

        const endDrag = () => {
          isDraggingRef.current = false;
          targetXRef.current = targetYRef.current = 0;
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
      
      <button
        className="cursor-pointer"
        onClick={toggleMenu}
      >
     
        <RiMenu3Fill size={32} className="hover:text-secondary text-white"/>
      </button>

      {/* Menu Overlay */}
      <div
        ref={menuOverlayRef}
        className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center overflow-hidden z-[100] opacity-0 pointer-events-none font-montserrat"
      >
        {/* Background with menu.jpg */}
        <div 
          className="absolute w-full h-full bg-[url('/01.webp')] bg-no-repeat bg-center bg-cover"
        />

        {/* Menu Overlay Nav */}
        <div
          ref={menuOverlayNavRef}
          className="absolute top-0 w-screen px-6 flex justify-between items-center p-10"
        >
 <div className="flex gap-4">
            <a href="#"><AiFillFacebook size={24}  className="text-white" /></a>
            <a href="#"><RiTwitterXFill size={24}  className="text-white" /></a>
            <a href="#"><LuInstagram size={24}  className="text-white" /></a>
            <a href="#"><IoLogoYoutube size={24}  className="text-white" /></a>
            <a href="#"><FaTiktok size={24}  className="text-white" /></a>
          </div>


          <button className="relative w-6 h-6 cursor-pointer" onClick={toggleMenu}>
            <div className="absolute top-1/2 w-6 h-0.5 bg-white transform rotate-45"></div>
            <div className="absolute top-1/2 w-6 h-0.5 bg-white transform -rotate-45"></div>
          </button>

         
        </div>

        {/* Menu Segments */}
        <div
          ref={menuRef}
          className="relative z-10 "
          style={{
            width: `${responsiveConfig.menuSize}px`,
            height: `${responsiveConfig.menuSize}px`,
          }}
        >
          {menuItems.map((item, index) => {
            const pathData = createSegmentPathData(index, menuItems.length);
            const contentPos = getSegmentContentPosition(index, menuItems.length);

            return (
              <Link
                key={index}
                ref={(el) => {
                  if (el) {
                    segmentsRef.current[index] = el;
                  }
                }}
                href={item.href}
                className="absolute w-full h-full text-white bg-white/5 backdrop-blur-md cursor-pointer hover:animate-flickerHover  hover:text-primary hover:z-10"
                style={{
                  clipPath: `path('${pathData}')`,
                  width: `${responsiveConfig.menuSize}px`,
                  height: `${responsiveConfig.menuSize}px`,
                }}
                onMouseEnter={playSelectSound}
                onClick={toggleMenu}
              >
                <div
                  className="segment-content absolute flex flex-col items-center justify-center font-semibold text-center hover:animate-contentFlickerHover "
                  style={{
                    left: `${contentPos.x}px`,
                    top: `${contentPos.y}px`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="text-4xl mb-2.5">
                    {item.icon}
                  </div>
                  <div className="normal-case font-sans text-sm font-medium">
                    {item.label}
                  </div>
                </div>
              </Link>
            );
          })}

          {/* Joystick */}
          <div
            ref={joystickRef}
            className="joystick absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-full flex items-center justify-center select-none cursor-grab z-[100]"
          >
            <FaTh className="absolute text-secondary text-3xl" />
            <FaChevronUp className="absolute text-secondary text-xs top-3 left-1/2 transform -translate-x-1/2" />
            <FaChevronDown className="absolute text-secondary text-xs bottom-3 left-1/2 transform -translate-x-1/2" />
            <FaChevronLeft className="absolute text-secondary text-xs left-3 top-1/2 transform -translate-y-1/2" />
            <FaChevronRight className="absolute text-secondary text-xs right-3 top-1/2 transform -translate-y-1/2" />
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
            <Link href="/en/cookies-policy" className="text-white uppercase font-montserrat text-xs">Cookie Settings</Link>
            <Link href="/en/privacy-policy" className="text-white uppercase font-montserrat text-xs">Privacy Policy</Link>
            <Link href="/en/terms-and-conditions" className="text-white uppercase font-montserrat text-xs">Terms and Conditions</Link>
          </div>
        </div>
      </div>
    </>
  );
}