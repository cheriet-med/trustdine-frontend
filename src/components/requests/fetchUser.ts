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

interface Users {
  id: number;
  name: string;
  username?: string; 
  full_name?:string;// Added this since you're using it in the component
  title?: string; // Added this since you're using it in the component
  category: string;
  amenities: string;
  email: string;
  location: string;
  profile_image: string;
  identity_verified: boolean;
  about?: string;
  website?: string;
  joined?: string;
  phoneNumber?: string; // Added this since you're using it in the component
  address_line_1?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  countryCode?: string;
  latitude?: string;
  longtitude?: string;
  is_staff?:boolean;
  hotel_stars:string;
  is_email_verified?:boolean;
  is_phone_number_verified?:boolean;
}

const useFetchUser = (id: any) => {
  const { data, error, isLoading, mutate } = useSWR<Users>(
    `${process.env.NEXT_PUBLIC_URL}infoid/${id}`,
    fetcher // No need to explicitly pass generic here
  );

  return { 
    Users: data || null, // Return single user object instead of array
    error, 
    isLoading,
    mutate // Export mutate function for manual revalidation
  };
};

export default useFetchUser;