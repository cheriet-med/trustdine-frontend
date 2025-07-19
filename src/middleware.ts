import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { AppLocale } from './i18n/routing';


export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split('/');
  const locale = segments[1];

  // Allow dynamic paths (e.g., /cart/[id])
  const isDynamicPath = segments.length > 2 && segments[2].startsWith('[') && segments[2].endsWith(']');

  // Redirect if locale is invalid
  if (!routing.locales.includes(locale as AppLocale) && !isDynamicPath) {
    const url = new URL(`/${routing.defaultLocale}${pathname}`, request.nextUrl.origin);
    return NextResponse.redirect(url);
  }

  // Apply next-intl middleware while preserving headers
  const response = createMiddleware(routing)(request);

 // Clone headers to avoid mutating the original response
 const headers = new Headers(response.headers);



  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}


export const config = {
  matcher: ['/', '/(fr|en|de|ar|it|ru|nl|pt|es|sv)/:path*'],
};



/**
 * 
  // Clone headers to avoid mutating the original response
  const headers = new Headers(response.headers);

  // Optionally, add global X-Robots-Tag (e.g., for all /account pages)
  if (pathname.includes('/account', )) {
    headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  }

 */