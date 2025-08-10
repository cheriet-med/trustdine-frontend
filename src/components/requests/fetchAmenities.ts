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

interface Amenitie {
  id: number;
  name: string;                   
  categoty: string;               
  amenitie: number;            
 
}

const useFetchAmenities = (id:any) => {
  const { data, error, isLoading } = useSWR<Amenitie[]>(
    `${process.env.NEXT_PUBLIC_URL}amenities/?user=${id}`,
    fetcher // No need to explicitly pass generic here
  );

  return { Amenitie: data || [], error, isLoading };
};

export default useFetchAmenities;