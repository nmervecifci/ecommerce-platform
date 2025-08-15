import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Sadece Türkçe ve İngilizce
  locales: ["tr", "en"] as const,

  // Varsayılan dil (Türkçe)
  defaultLocale: "tr",
});

export type Locale = (typeof routing.locales)[number];

export function isValidLocale(locale: string): locale is Locale {
  return routing.locales.includes(locale as Locale);
}
