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

interface verify {
  id: number;
  full_name: string; // Added this since you're using it in the component
  document_type: string;
  document_number: string | number;
  document_photo: string;
  
  selfie_document: string;
  status: string;
  date: string;
  time: string;
  user: number;
}

const useFetchVerificationDocs = () => {
  const { data, error, isLoading, mutate } = useSWR<verify[]>(
    `${process.env.NEXT_PUBLIC_URL}verify/`,
    fetcher // No need to explicitly pass generic here
  );

  return { 
    Allverifications: data || [], // Return single user object instead of array
    error, 
    isLoading,
    mutate // Export mutate function for manual revalidation
  };
};

export default useFetchVerificationDocs;