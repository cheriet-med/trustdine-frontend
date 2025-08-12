import PostId from "@/components/post/postid";
import { validateLocale } from "@/components/validateLocale";
import { IoTelescope } from "react-icons/io5";
import { getTranslations } from 'next-intl/server';
import { getLocale } from 'next-intl/server';
import type { Metadata } from "next";
import { htmlToText } from "@/components/parser";
import { routing } from '@/i18n/routing';
import Idcomponent from "@/components/Data/idComponent";


// This function generates static paths at build time
export async function generateStaticParams() {
  // You should fetch all possible post IDs here and return them
  // Example:
  const posts = await fetch(`${process.env.NEXT_PUBLIC_URL}product/`, {
    headers: {
      Authorization: `Token ${process.env.NEXT_PUBLIC_TOKEN}`,
    },
  }).then((res) => res.json());

  // Define all supported locales
  const supportedLocales = ['en', 'fr', 'ar', 'it', 'ru', 'de', 'sv', 'nl', 'es', 'pt'];

  // Generate all combinations of posts and locales
  return posts.flatMap((post: any) =>
    supportedLocales.map(locale => ({
      id: post.id.toString(),
      locale: locale
    }))
  );
}

export default async function Page({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const t = await getTranslations('Not-found');

  if (!id) {
    return (
      <div>
        <h1>Error: Missing Cart ID</h1>
        <p>The page requires a valid cart ID.</p>
      </div>
    );
  }

  try {
    validateLocale(locale);
  } catch (error) {
    return (
      <div>
        <h1>Error: Invalid Locale</h1>
        <p>{(error as Error).message}</p>
      </div>
    );
  }

  // Fetch the post data using the `id`
  const listing = await fetch(`${process.env.NEXT_PUBLIC_URL}productid/${id}`, {
    headers: {
      Authorization: `Token ${process.env.NEXT_PUBLIC_TOKEN}`,
    },
  }).then((res) => res.json());




  // Fallback if the post is not found
  if (!listing) {
  
    return (
      <div className="py-40 mx-auto items-center container flex justify-center flex-col space-y-4">
        <IoTelescope size={96}/>
        <div className="flex justify-center flex-col items-center">
          <h1 className="text-4xl font-bold capitalize">{t('Page-not-found')}</h1>
          <p className="text-lg font-medium capitalize">{t('Page-not-found-description')}</p>
        </div>
      </div>
    );
  }

  return(
       <Idcomponent data={listing}/>

    )
}