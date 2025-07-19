'use client';

import Script from 'next/script';
import { useEffect } from 'react';

export default function YandexMetrika() {
  useEffect(() => {
    // Initialize YM function if it doesn't exist
    if (typeof window.ym !== 'function') {
      window.ym = function(...args: unknown[]) {
        (window.ym.a = window.ym.a || []).push(args);
      } as typeof window.ym;
    }
    
    // Set load time
    window.ym.l = Date.now();

    // Initialize counter
    window.ym(102609630, 'init', {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true,
      ecommerce: "dataLayer",
      trackHash: true
    });

    // Optional: SPA route tracking
    const handleRouteChange = (url: string) => {
      window.ym(102609630, 'hit', url);
    };

    window.addEventListener('hashchange', () => 
      handleRouteChange(window.location.href)
    );

    return () => {
      window.removeEventListener('hashchange', () => 
        handleRouteChange(window.location.href)
      );
    };
  }, []);

  return (
    <>
      <Script
        id="yandex-metrica"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {
                if (document.scripts[j].src === r) return;
              }
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
          `
        }}
      />
      <noscript>
        <div>
          <img 
            src="https://mc.yandex.ru/watch/102609630" 
            style={{ position: 'absolute', left: '-9999px' }} 
            alt="" 
          />
        </div>
      </noscript>
    </>
  );
}