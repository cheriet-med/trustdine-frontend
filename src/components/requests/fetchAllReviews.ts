'use client';

import useSWR from "swr";

// Explicitly define the fetcher's return type
const fetcher = async <T,>(url: string): Promise<T> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000); // 20-second timeout

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
  } finally {
    clearTimeout(timeoutId);
  }
};

interface Reviews {
  id: number;
  product: string;                   
  title: string;               
  description: string;            
  rating_global:string;
  location:string;
  room:string;
  restaurant_space:string;
  value:string;
  clearliness:string;
  service:string;
  created_at:string;
  updated_at:string;
  stay_date:string;
  trip_type:string;
  user:string;
  
}

const useFetchAllReviews = () => {
  const { data, error, isLoading } = useSWR<Reviews[]>(
    `${process.env.NEXT_PUBLIC_URL}productreviews/`,
    fetcher // No need to explicitly pass generic here
  );

  return { AllReview: data || [], error, isLoading };
};

export default useFetchAllReviews;
