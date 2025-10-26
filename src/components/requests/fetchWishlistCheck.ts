'use client';

import useSWR from "swr";

// POST fetcher with explicit typing
const fetcher = async <T,>([url, userId]: [string, number]): Promise<T> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${process.env.NEXT_PUBLIC_TOKEN}`,
      },
      body: JSON.stringify({ user_id: userId }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch data. Please try again later.");
  } finally {
    clearTimeout(timeoutId);
  }
};

interface WishlistCheck {
  is_in_wishlist: boolean; // assuming API returns { exists: true/false }
}

const useWishlistCheck = (id: number, userId?: number) => {
  const shouldFetch = !!id && !!userId;

  const { data, error, isLoading, mutate } = useSWR<WishlistCheck>(
    shouldFetch ? [`${process.env.NEXT_PUBLIC_URL}wishlist/check/${id}/`, userId] : null,
    fetcher
  );

  return { wishlistStatus: data, error, isLoading, mutate };
};

export default useWishlistCheck;
