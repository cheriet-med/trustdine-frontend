'use client'
import dynamic from 'next/dynamic';
import SearchHotelHero from "@/components/Data/searchHotelHero";
import HotelSearchCards from "@/components/Data/hotehlSearchCards";
import useFetchListing from "@/components/requests/fetchListings";
import RestaurantSearchCards from '@/components/Data/restaurantSearchCard';
import useFetchAllReviews from '@/components/requests/fetchAllReviews';
const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function Booking() {
  // Filter hotels that have valid coordinates
  const { listings, isLoading, error } = useFetchListing();
  const hotelsWithLocations = listings?.filter(hotel => 
    hotel.latitude && hotel.longtitude && hotel.category == "Restaurant"
  );
 const {AllReview} = useFetchAllReviews()

const hotelMarkers = hotelsWithLocations?.map(hotel => ({
  position: [hotel.latitude || 51.505, hotel.longtitude || -0.09] as [number, number],
  popup: `
    <div style="max-width: 700px; font-family: 'montserrat', sans-serif;">
      <img src="${process.env.NEXT_PUBLIC_IMAGE}/${hotel.image}" style="width: 100%; height: 150px; object-fit: cover; margin-bottom: 10px; border-radius: 4px;">
      <h3 style="margin: 0 0 5px 0; font-size: 18px; font-family: 'Playfair Display', serif; font-weight: 600; color: #785964;">
        ${hotel.name}
      </h3>
      <p style="margin: 0 0 5px 0; font-size: 14px; color: #785964;">${hotel.location}</p>
    <p style="margin: 0 0 5px 0; font-size: 14px; display: flex; align-items: center; gap: 4px; color: #4a5568;">
        <span style="color: #82A7A6;">★</span> ${AllReview?.filter(listing => +listing.product == hotel.id).length == 0 ? 0 : AllReview?.filter(listing => +listing.product == hotel.id).reduce((sum, r) => sum + +r.rating_global, 0) / AllReview?.filter(listing => +listing.product == hotel.id).length} / 5 • From $${hotel.price_per_night} per night
      </p>
      <p style="margin: 0 0 10px 0; font-size: 12px; color: #718096; text-transform: capitalize;">
        ${hotel.category}
      </p>
      <a href="/en/booking/${hotel.id}" target="_blank" 
         style="display: inline-block; background: #785964; color: white; padding: 6px 12px; 
                text-decoration: none; border-radius: 4px; font-size: 13px; font-weight: 500;">
        Book Now
      </a>
    </div>
  `
}));
  // Calculate center position if hotels exist, otherwise use default
  const hotels = hotelsWithLocations ?? [];

  const centerPosition = hotels.length > 0 
    ? [hotels[0].latitude || 51.505, hotels[0].longtitude || -0.09 ] as [number, number]
    : [51.505, -0.09] as [number, number];
  return (
    <div className="flex flex-col gap-4">
      <SearchHotelHero/>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-5 px-1 lg:px-6 mb-4">

   <RestaurantSearchCards/>


   <div className="sticky top-1 h-96 lg:h-screen">
  {hotels.length > 0 ? (
    <div className="rounded-2xl h-full">
      <Map
        center={centerPosition}
        zoom={5}
        height="100%"
        markers={hotelMarkers}
      />
    </div>
  ) : (
     <div className="sticky top-1 h-96 lg:h-screen bg-gray-200">
    </div>
  )}
</div>
</div>
    </div>
  )
}