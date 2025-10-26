'use client';

import useSWR from "swr";
import { useSearchParams } from 'next/navigation';

const fetcher = async <T>(url: string): Promise<T> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000); // 10-second timeout

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Token ${process.env.NEXT_PUBLIC_TOKEN}`,
      },
      signal: controller.signal, // Pass the AbortController signal
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch data. Please try again later.");
  } finally {
    clearTimeout(timeoutId); // Clear the timeout
  }
};

interface Post {
  id: number;
  title_en: string;
  title_ar: string;
  title_fr: string;
  title_de: string;
  title_es: string;
  title_it: string;
  title_pt: string;
  title_nl: string;
  title_ru: string;
  title_sv: string;
  image_en: string;
  image_ar: string;
  image_fr: string;
  image_de: string;
  image_es: string;
  image_it: string;
  image_pt: string;
  image_nl: string;
  image_ru: string;
  image_sv: string;
  description_en: string;
  description_ar: string;
  description_fr: string;
  description_de: string;
  description_es: string;
  description_it: string;
  description_pt: string;
  description_nl: string;
  description_ru: string;
  description_sv: string;
}

const useFetchPostsSearch = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get('q'); // Get the search query from the URL
  const { data, error, isLoading } = useSWR<Post[]>(
    `${process.env.NEXT_PUBLIC_URL}post/?search=${query}`,
    fetcher<Post[]>
  );

  return { posts: data || [], error, isLoading };
};

export default useFetchPostsSearch;