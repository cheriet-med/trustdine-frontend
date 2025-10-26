"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import StarRating from "../starsComponent";

export const InfiniteMovingCardsItems = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    quote: string;
    rating: number,
    name: string;
    title: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);


useEffect(() => {
  if (typeof window === "undefined") return;
  addAnimation();
}, []);


  useEffect(() => {
    addAnimation();
  }, []);
  const [start, setStart] = useState(false);
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards",
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse",
        );
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };
  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl xl:max-w-[1600px] overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
      >
        {items.map((item, idx) => (
          <li
            className="relative w-[350px] max-w-full shrink-0 rounded-2xl border border-b-0 border-zinc-200 bg-secondary p-2 md:w-[450px] dark:border-zinc-700 dark:bg-secondary"
            key={item.title}
          >
            <blockquote>
              <div
                aria-hidden="true"
                className="user-select-none pointer-events-none absolute -top-0.5 -left-0.5 -z-1 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
              ></div>       
              <span className="flex flex-col gap-2">
                {item.name ? (
      <div className="relative h-80 w-full rounded-md overflow-hidden">
        <Image
          src={item.name}
          alt={item.title || "User image"}
          fill
          className="object-cover "
          sizes="128px"
          priority
        />
      </div>
    ) : null}

               <span className="text-2xl leading-[1.6] font-bold font-playfair text-neutral-500 dark:text-white">
                    {item.title}
                  </span>
                               <div className='flex gap-1'>
<StarRating rating={item.rating} size={18}/>
                       <p className="text-sm text-white">{item.rating}</p>
                    </div>
                </span>
              <div className="relative z-20 flex flex-row items-center">
                    <span className="relative z-20  leading-[1.6] font-normal text-neutral-800 dark:text-gray-100">
                {item.quote}
              </span>
            
              </div>
          
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};
