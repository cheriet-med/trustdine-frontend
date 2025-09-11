'use client';
import useSWR from "swr";
// Explicitly define the fetcher's return type
const fetcher = async <T,>(url: string): Promise<T> => {
const controller = new AbortController();
//const timeoutId = setTimeout(() => controller.abort(), 20000); // 20-second timeout

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Token ${process.env.NEXT_PUBLIC_TOKEN}`,
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return (await response.json()) as T; // Explicit type assertion
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch data. Please try again later.");
  } 
};
interface Listing {
  id: number;
  user: any; // ForeignKey typically translates to the ID of the related model
  name: string | null;
  description: string | null;
  category: string | null;
  rating: string | null;
  price_per_night: string | null;
  currency: string | null;
  types: string | null;
  capacity: string | null;
  size: string | null;
  rooms_number:string;
  cancellation_policy: string | null;
  price_range: string | null;
  average_cost: string | null;
  established: string | null;
  chef: string | null;
  image: string | null; // Assuming CloudinaryField returns a string URL
  receipt: string | null;
  opening_hours_monday: string | null;
  opening_hours_tuesday: string | null;
  opening_hours_wednesday: string | null;
  opening_hours_thursday: string | null;
  opening_hours_friday: string | null;
  opening_hours_saturday: string | null;
  opening_hours_sunday: string | null;
  organic_ingredients: boolean;
  sustainable_seafood: boolean;
  latitude: string | null;
  longtitude: any; // Note: typo in original (should be longitude)
  location: any;
  is_inwishlist:boolean;
  created_at_meta: string | null;
  updated_at_meta: string | null;
}
const useFetchListing = () => {
  const { data, error, isLoading, mutate } = useSWR<Listing[]>(
    `${process.env.NEXT_PUBLIC_URL}product/`,
    fetcher // No need to explicitly pass generic here
  );

  return { 
    listings: data || null, // Return single user object instead of array
    error, 
    isLoading,
    mutate // Export mutate function for manual revalidation
  };
};

export default useFetchListing;