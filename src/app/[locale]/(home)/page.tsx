'use client'


import CombatLanding from "@/components/home-page/hero"
import ScrollAnimationGallery from "@/components/home-page/section3"
import CombinedScrollAnimation from "@/components/home-page/section4"
import ScrollAnimation from "@/components/home-page/section1"
import FullscreenSlider from "@/components/home-page/sectionTop"

export default function Home () {

  return(
    <div>

      
<FullscreenSlider/>
   <div className=' flex gap-10 lg:gap-20 flex-wrap lg:flex-nowrap bg-secondary px-6 lg:px-60 py-20  lg:py-32 text-white '>
   <h1 className=' font-extratbold lg:flex-1 font-playfair uppercase text-3xl md:text-5xl font-bold'>Real Places, Real Reviews</h1>
        <p className='lg:flex-1 text-2xl md:text-4xl font-playfair'>Dive into trending restaurants and hotels, rated by real diners and travelers.

</p>
</div>

<ScrollAnimationGallery/>

 <div className='flex gap-20 flex-wrap lg:flex-nowrap flex-col justify-center px-6 lg:px-72 pt-36 pb-24 lg:pb-2 lg:pt-32 text-white bg-secondary ' >
  <h1 className='uppercase text-3xl md:text-5xl  font-bold flex-2 font-playfair text-center'>Skip the Fake, Trust the Verified

</h1>
    <p className=" mx-auto text-center text-2xl md:text-4xl font-playfair">
 No bots. No paid reviews. Every rating you see is backed by a receipt, booking, or visit.
We cut the noise — so you can nd real places people actually loved.
</p>
</div> 

<CombinedScrollAnimation/>
<ScrollAnimation/>
    </div>
  )
}




/**
 * import dynamic from 'next/dynamic';
const CombatLanding = dynamic(() => import("@/components/home-page/hero"), {
  ssr: false,
});

const ScrollAnimation = dynamic(() => import("@/components/home-page/section1"), {
 ssr: false,
});

const CombinedScrollAnimation = dynamic(() => import("@/components/home-page/section4"), {
  ssr: false,
});

const ScrollAnimationGallery = dynamic(() => import("@/components/home-page/section3"), {
 ssr: false,
});

 */