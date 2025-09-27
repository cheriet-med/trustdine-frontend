
import { useRef, useEffect, useState } from 'react';


export default function VideoSection () {

 const videoRef = useRef<HTMLVideoElement | null>(null);

  // Ensure autoplay works (muted is required for most browsers)
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.warn('Autoplay prevented:', err);
      });
    }
  }, []);


    return(

 <section className="relative h-screen">
      {/* Video background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src="/footer.mp4" // ✅ replace with your video path
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        //poster="/footer.jpg" // ✅ optional poster
      />
    </section>
    )
}