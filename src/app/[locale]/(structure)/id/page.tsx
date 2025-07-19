'use client'
import dynamic from 'next/dynamic';
import { Hotels } from "@/components/Data/hotels";
import Idcomponent from "@/components/Data/idComponent";

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function Booking() {
  // Filter hotels that have valid coordinates
  const hotelsWithLocations = Hotels.filter(hotel => 
    hotel.latitude && hotel.longitude
  );

const hotelMarkers = hotelsWithLocations.map(hotel => ({
  position: [51.505, -0.09] as [number, number],
  
  
}));
  // Calculate center position if hotels exist, otherwise use default
  const centerPosition = 
    [51.505, -0.09] as [number, number];

  return (
    <div className="flex flex-col gap-4">
     
      
      {hotelsWithLocations.length > 0 ? (
        <div className="rounded-2xl m-1 sm:m-2 md:m-3 relative">
          <Map
            center={centerPosition}
            zoom={9}
            height="400px"
            markers={hotelMarkers}
          />
        </div>
      ) : (
        <div className="mx-2 custom:mx-40 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">No location data available for the current selection.</p>
        </div>
      )}


     <Idcomponent id={12} imageUrl={"/sgdfsg"} address={"hello"} price={250} averageRating={4.5} lengtReviews={"hello"} location={"hello"}/>
    </div>
  )
}


