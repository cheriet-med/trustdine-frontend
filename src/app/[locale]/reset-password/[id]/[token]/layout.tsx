import type { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import {getLocale } from "next-intl/server";
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Layout'); // Fixed namespace
  const locale = await getLocale();
  return {
    title: t('Reset-password-title'),
    description: t('Reset-password-description'),
    robots: {
      index: false, // Never index password reset pages
      follow: false, // Prevent crawling of sensitive flows
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      }
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_HOME}/${locale}/reset-password`,
      languages: {
        'en': `${process.env.NEXT_PUBLIC_HOME}/en/reset-password`,
        'fr': `${process.env.NEXT_PUBLIC_HOME}/fr/reinitialiser-mot-de-passe`,
        'ar': `${process.env.NEXT_PUBLIC_HOME}/ar/إعادة-تعيين-كلمة-المرور`,
        'nl': `${process.env.NEXT_PUBLIC_HOME}/nl/reset-wachtwoord`,
        'de': `${process.env.NEXT_PUBLIC_HOME}/de/passwort-zurücksetzen`,
        'pt': `${process.env.NEXT_PUBLIC_HOME}/pt/redefinir-senha`,
        'sv': `${process.env.NEXT_PUBLIC_HOME}/sv/aterstall-losenord`,
        'ru': `${process.env.NEXT_PUBLIC_HOME}/ru/сброс-пароля`,
        'it': `${process.env.NEXT_PUBLIC_HOME}/it/reimposta-password`,
        'es': `${process.env.NEXT_PUBLIC_HOME}/es/restablecer-contrasena`,
        'x-default': `${process.env.NEXT_PUBLIC_HOME}/en/reset-password`, // Fallback to English
      },
    },
    openGraph: {
      title: t('Reset-password-og-title'),
      description: t('Reset-password-og-description'),
      images: [{
        url: `${process.env.NEXT_PUBLIC_HOME}/og/og.png`,
        width: 1200,
        height: 630,
        alt: t('Reset-password-og-title')
      }]
    },
    twitter: {
      card: "summary_large_image", // Best for engagement
      title: t('Reset-password-og-title'),
      description: t('Reset-password-og-description'),
     // creator: "@TwitterHandle",
     images: [
      {
        url: `${process.env.NEXT_PUBLIC_HOME}/og/og.png`,
        width: 1200,
        height: 630,
        alt: t('Reset-password-og-title'),
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
          "name": t('Reset-password-name'),
          "url": `${process.env.NEXT_PUBLIC_HOME}/${locale}/reset-password`,
          "description": t('Reset-password-name-description'),
          "isAccessibleForFree": false,
          "security": "HTTPS required",
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