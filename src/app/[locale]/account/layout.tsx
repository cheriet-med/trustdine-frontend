import type { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import {getLocale } from "next-intl/server";


export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Layout'); // Fixed namespace
  const locale = await getLocale(); 
  return {
    title: "My Goamico Dashboard",
    description: t('Dashboard-description'),
 
    robots: {
      index: false, // Most dashboards should NOT be indexed
      follow: false,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true, // Hide images from search
      },
    },

    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_HOME}/${locale}/account`,
      languages: {
        'en': `${process.env.NEXT_PUBLIC_HOME}/en/account`,
        'fr': `${process.env.NEXT_PUBLIC_HOME}/fr/compte`,
        'ar': `${process.env.NEXT_PUBLIC_HOME}/ar/الحساب`,
        'nl': `${process.env.NEXT_PUBLIC_HOME}/nl/account`,
        'de': `${process.env.NEXT_PUBLIC_HOME}/de/konto`,
        'pt': `${process.env.NEXT_PUBLIC_HOME}/pt/conta`,
        'sv': `${process.env.NEXT_PUBLIC_HOME}/sv/konto`,
        'ru': `${process.env.NEXT_PUBLIC_HOME}/ru/аккаунт`,
        'it': `${process.env.NEXT_PUBLIC_HOME}/it/account`,
        'es': `${process.env.NEXT_PUBLIC_HOME}/es/cuenta`,
        'x-default': `${process.env.NEXT_PUBLIC_HOME}/en/account`, // Fallback to English
      },
    },
    openGraph: {
      title: t('Dashboard-og-title'),
      description: t('Dashboard-og-description'),
      images: [{
        url: `${process.env.NEXT_PUBLIC_HOME}/og/og.png`,
        width: 1200,
        height: 630,
        alt: t('Dashboard-og-title')
      }]
    },
    twitter: {
      card: "summary_large_image", // Best for engagement
      title: t('Dashboard-og-title'),
      description: t('Dashboard-og-description'),
     // creator: "@TwitterHandle",
     images: [
      {
        url: `${process.env.NEXT_PUBLIC_HOME}/og/og.png`,
        width: 1200,
        height: 630,
        alt: t('Dashboard-og-title'),
      },
    ],
    },
   
  };
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {

  const t = await getTranslations('Layout'); // Fixed namespace
  const locale = await getLocale();

  return (
    <div >
      {children}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": t('Dashboard-name'),
          "url": `${process.env.NEXT_PUBLIC_HOME}/${locale}/account`,
          "description": t('Dashboard-name-description'),
          "isAccessibleForFree": false, // Indicates paywalled/private content
          "significantLink": [
            `${process.env.NEXT_PUBLIC_HOME}/`,
          ]
        })}
      </script>
    </div>
  );
}