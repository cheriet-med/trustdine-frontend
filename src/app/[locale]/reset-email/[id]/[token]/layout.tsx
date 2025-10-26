import type { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import {getLocale } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Layout'); // Fixed namespace
  const locale = await getLocale();
  return {
    title:  t('update-title'),
    description:  t('update-description'),
    robots: {
      index: false,
      follow: false,
      noarchive: true, // Add this to prevent caching
      nosnippet: true, // Prevent text snippets in search results
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
        'max-video-preview': -1, // Extra precaution
        'max-image-preview': 'none'
      }
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_HOME}/${locale}/reset-email`,
      languages: {
        'en': `${process.env.NEXT_PUBLIC_HOME}/en/reset-email`,
        'fr': `${process.env.NEXT_PUBLIC_HOME}/fr/reinitialiser-email`,
        'ar': `${process.env.NEXT_PUBLIC_HOME}/ar/إعادة-تعيين-البريد`,
        'nl': `${process.env.NEXT_PUBLIC_HOME}/nl/reset-email`,
        'de': `${process.env.NEXT_PUBLIC_HOME}/de/email-zurücksetzen`,
        'pt': `${process.env.NEXT_PUBLIC_HOME}/pt/redefinir-email`,
        'sv': `${process.env.NEXT_PUBLIC_HOME}/sv/aterstall-losenord`,
        'ru': `${process.env.NEXT_PUBLIC_HOME}/ru/aterstall-e-post`,
        'it': `${process.env.NEXT_PUBLIC_HOME}/it/reimposta-email`,
        'es': `${process.env.NEXT_PUBLIC_HOME}/es/restablecer-correo`,
        'x-default': `${process.env.NEXT_PUBLIC_HOME}/en/reset-email`, // Fallback to English
      },
    },
    openGraph: {
      title: t('update-og-title'),
      description: t('update-og-description'),
      images: [{
        url: `${process.env.NEXT_PUBLIC_HOME}/og/og.png`,
        width: 1200,
        height: 630,
        alt: t('update-og-title')
      }]
    },
    twitter: {
      card: "summary_large_image", // Best for engagement
      title: t('update-og-title'),
      description: t('update-og-description'),
     // creator: "@TwitterHandle",
     images: [
      {
        url: `${process.env.NEXT_PUBLIC_HOME}/og/og.png`,
        width: 1200,
        height: 630,
        alt: t('update-og-title'),
      },
    ],
    },
  };
}

export default async function ResetPasswordLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const t = await getTranslations('Layout'); // Fixed namespace
  const locale = await getLocale();
  return (
    <div className="auth-page">
      {children}
      
      {/* Security-focused schema markup */}
      <script type="application/ld+json">
        {JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name":  t('update-name'),
  "url": `${process.env.NEXT_PUBLIC_HOME}/${locale}/reset-email`,
  "description":  t('update-name-description'),
  "isAccessibleForFree": false,
  "security": ["HTTPS", "SameOrigin"],
  "significantLink": [
    `${process.env.NEXT_PUBLIC_HOME}/${locale}/login-signin`,
    `${process.env.NEXT_PUBLIC_HOME}/${locale}/account`
  ],
  "publisher": {
    "@type": "Organization",
    "name": "Padlev",
    "logo": {
      "@type": "ImageObject",
      "url": `${process.env.NEXT_PUBLIC_HOME}/logo.png`,
      "width": 300,
      "height": 60
    }
  }
})}
      </script>
    </div>
  );
}