'use client'
import HotelCards from "@/components/Data/hotelCards"
import ResCards from "@/components/Data/resCards"
import dynamic from 'next/dynamic';
import { Hotels } from "@/components/Data/hotels";
import SearchHero from "@/components/Data/searchHero";


const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function Booking() {
  // Filter hotels that have valid coordinates
  const hotelsWithLocations = Hotels.filter(hotel => 
    hotel.latitude && hotel.longitude
  );

const hotelMarkers = hotelsWithLocations.map(hotel => ({
  position: [hotel.latitude, hotel.longitude] as [number, number],
  popup: `
    <div style="max-width: 700px; font-family: 'montserrat', sans-serif;">
      <img src="${hotel.images[0]}" style="width: 100%; height: 150px; object-fit: cover; margin-bottom: 10px; border-radius: 4px;">
      <h3 style="margin: 0 0 5px 0; font-size: 18px; font-family: 'Playfair Display', serif; font-weight: 600; color: #785964;">
        ${hotel.name}
      </h3>
      <p style="margin: 0 0 5px 0; font-size: 14px; color: #785964;">${hotel.city}, ${hotel.country}</p>
      <p style="margin: 0 0 5px 0; font-size: 14px; display: flex; align-items: center; gap: 4px; color: #4a5568;">
        <span style="color: #82A7A6;">★</span> ${hotel.rating} / 5 • From $${hotel.price_per_night} per night
      </p>
      <p style="margin: 0 0 10px 0; font-size: 12px; color: #718096; text-transform: capitalize;">
        ${hotel.category.replace(/_/g, ' ')}
      </p>
      <a href="${hotel.website}" target="_blank" 
         style="display: inline-block; background: #785964; color: white; padding: 6px 12px; 
                text-decoration: none; border-radius: 4px; font-size: 13px; font-weight: 500;">
        Book Now
      </a>
    </div>
  `
}));
  // Calculate center position if hotels exist, otherwise use default
  const centerPosition = hotelsWithLocations.length > 0 
    ? [hotelsWithLocations[0].latitude, hotelsWithLocations[0].longitude] as [number, number]
    : [51.505, -0.09] as [number, number];

  return (
    <div className="flex flex-col gap-4">
      <SearchHero/>
      <HotelCards/>
      <hr className="mx-2 custom:mx-40"/>
      <ResCards/>
      <hr className="mx-2 custom:mx-40"/>
      <h1 className="text-4xl font-playfair mx-2 custom:mx-40">
        Locations
      </h1>
      
      {hotelsWithLocations.length > 0 ? (
        <div className="rounded-2xl mx-2 custom:mx-40 mb-6">
          <Map
            center={centerPosition}
            zoom={5}
            height="500px"
            markers={hotelMarkers}
          />
        </div>
      ) : (
        <div className="mx-2 custom:mx-40 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">No location data available for the current selection.</p>
        </div>
      )}
    </div>
  )
}