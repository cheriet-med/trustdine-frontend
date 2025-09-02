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

interface Bookings {
    id: number;
    product: string;                   
    user: string;               
    status: string;            
    created_at: string;     
    updated_at: string;     
    image: string;     
    check_in_date: string;     
    check_out_date: string;     
    total_guests: string;     
    adults: string;     
    children: string;     
    room_quantity: string;     
    base_price: string;     
    tax_amount: string;     
    service_fee: string;     
    discount_amount: string;     
    total_price: string;     
    payment_method: string;     
    cancellation_date: string;     
    refund_amount: string;     
    restaurat_check_in_date: string;     
    restaurat_check_in_time: string;
    name:string;
    category:string;
    cancellation_policy:string;
    location:string;   
    user_owner:string;
    receipt:string
}

const useFetchBooking = (id:any) => {
  const { data, error, isLoading, mutate } = useSWR<Bookings[]>(
    `${process.env.NEXT_PUBLIC_URL}order/?product=${id}`,
    fetcher // No need to explicitly pass generic here
  );

  return { Booking: data || [], error, isLoading, mutate  };
};

export default useFetchBooking;