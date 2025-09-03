import PostId from "@/components/post/postid";
import { validateLocale } from "@/components/validateLocale";
import { IoTelescope } from "react-icons/io5";
import { getTranslations } from "next-intl/server";
import { getLocale } from "next-intl/server";
import type { Metadata } from "next";
import { htmlToText } from "@/components/parser";
import { routing } from "@/i18n/routing";
import Idcomponent from "@/components/Data/idComponent";

// This function generates static paths at build time
export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}product/`, {
      headers: {
        Authorization: `Token ${process.env.NEXT_PUBLIC_TOKEN}`,
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch products:", res.statusText);
      return [];
    }

    const posts = await res.json();

    // Define all supported locales
    const supportedLocales = [
      "en",
      "fr",
      "ar",
      "it",
      "ru",
      "de",
      "sv",
      "nl",
      "es",
      "pt",
    ];

    // Generate all combinations of posts and locales
    return posts.flatMap((post: any) =>
      supportedLocales.map((locale) => ({
        id: post.id.toString(),
        locale: locale,
      }))
    );
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    return []; // fallback → no pages generated
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations("Not-found");

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

  let listing: any = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}productid/${id}`, {
      headers: {
        Authorization: `Token ${process.env.NEXT_PUBLIC_TOKEN}`,
      },
      cache: "no-store", // 👈 avoids Next.js build-time caching errors
    });

    if (res.ok) {
      listing = await res.json();
    } else {
      console.error("Failed to fetch product:", res.status, res.statusText);
    }
  } catch (error) {
    console.error("Error fetching product data:", error);
  }

  // Fallback if the post is not found or fetch failed
  if (!listing) {
    return (
      <div className="py-40 mx-auto items-center container flex justify-center flex-col space-y-4">
        <IoTelescope size={96} />
        <div className="flex justify-center flex-col items-center">
          <h1 className="text-4xl font-bold capitalize">{t("Page-not-found")}</h1>
          <p className="text-lg font-medium capitalize">
            {t("Page-not-found-description")}
          </p>
        </div>
      </div>
    );
  }

  return <Idcomponent data={listing} />;
}
