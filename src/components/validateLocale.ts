// components/validateLocale.ts
import { routing, Locale } from "@/i18n/routing";

export function validateLocale(locale: string): asserts locale is Locale {
  if (!routing.locales.includes(locale as Locale)) {
    throw new Error(`Invalid locale: ${locale}`);
  }
}
