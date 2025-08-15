import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {};

export default withNextIntl(nextConfig);

// src/i18n/routing.ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Desteklenen tüm diller
  locales: ["tr", "en", "fr", "de"],

  // Varsayılan dil
  defaultLocale: "tr",

  // Locale prefix stratejisi
  localePrefix: "as-needed", // 'always', 'as-needed', 'never'

  // Pathnames (opsiyonel - her dil için farklı URL'ler)
  pathnames: {
    "/": "/",
    "/about": {
      tr: "/hakkimizda",
      en: "/about",
      fr: "/a-propos",
      de: "/uber-uns",
    },
    "/blog": "/blog",
    "/contact": {
      tr: "/iletisim",
      en: "/contact",
      fr: "/contact",
      de: "/kontakt",
    },
  },
});

export type Locale = (typeof routing.locales)[number];
export type Pathnames = keyof typeof routing.pathnames;
