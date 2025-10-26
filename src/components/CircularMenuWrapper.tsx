"use client";

import dynamic from "next/dynamic";

const CircularMenu = dynamic(
  () => import("./CircularMenu"),
  { 
    ssr: false,
  
  }
);

export default function CircularMenuWrapper() {
  return <CircularMenu />;
}