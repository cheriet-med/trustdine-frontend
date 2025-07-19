import CircularMenuWrapper from "@/components/CircularMenuWrapper";
import CombatLanding from "@/components/home-page/hero";
import CombinedScrollAnimation from "@/components/home-page/section4";
import ScrollAnimationGallery from "@/components/home-page/section3";
import ScrollAnimation from "@/components/home-page/section1";


export default function Home() {
  return (
    <main >
  <CombatLanding/>
   <div className=' flex gap-10 lg:gap-20 flex-wrap lg:flex-nowrap bg-secondary px-6 lg:px-60 py-20  lg:py-32 text-white '>
   <h1 className=' font-extratbold lg:flex-1 font-playfair uppercase text-3xl md:text-5xl font-bold'>Explore a World of Flavors & Stays</h1>
        <p className='lg:flex-1 md:text-xl '>Discover an unbeatable variety of restaurants, cozy cafes, luxury hotels, and local food experiences all in one place. Whether you're planning a weekend getaway, a romantic dinner, or a family feast, find trusted spots that match your taste, mood, and budget.

</p>
</div>

  <ScrollAnimationGallery/>
 <div className='flex gap-20 flex-wrap lg:flex-nowrap flex-col justify-center px-6 lg:px-72 pt-36 pb-24 lg:pb-2 lg:pt-48 text-white bg-secondary ' >
  <h1 className='uppercase text-3xl md:text-5xl  font-bold flex-2 font-playfair text-center'>Boost Your Score with Trusted Reviews

</h1>
    <p className=" mx-auto text-center md:text-xl ">
 Build your reputation and stand out by collecting authentic, high-quality reviews from real customers. Every positive review not only increases your trust score but also helps attract more attention, more credibility, and more opportunities. Let your happy customers speak for you.
</p>
</div> 

<CombinedScrollAnimation/>
<ScrollAnimation/>
    </main>
  );
}
/**
 *  
 *  
 */