import type { Metadata } from "next";
import "../globals.css";
import { Playfair_Display } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, isValidLocale } from "../../i18n/routing";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "../../i18n/routing";
import { StoreProvider } from "@/store/providers";
export const metadata: Metadata = {
  title: {
    default: "ShopZone - Online Alışveriş",
    template: "%s | ShopZone",
  },
  description:
    "Kaliteli ürünlerle dolu online alışveriş platformu. Elektronik, giyim, aksesuar ve daha fazlası uygun fiyatlarla.",
  keywords: [
    "online alışveriş",
    "e-ticaret",
    "elektronik",
    "giyim",
    "aksesuar",
  ],
  authors: [{ name: "ShopZone" }],
  creator: "ShopZone",
  metadataBase: new URL("https://shopzone-demo.vercel.app"), // Deploy sonrası gerçek URL olacak
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://shopzone-demo.vercel.app",
    title: "ShopZone - Online Alışveriş Platformu",
    description: "Kaliteli ürünlerle online alışveriş deneyimi",
    siteName: "ShopZone",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShopZone - Online Alışveriş",
    description: "Kaliteli ürünlerle online alışveriş platformu",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-playfair-display",
});

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams(): { locale: Locale }[] {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={playfairDisplay.variable}>
      <body className="min-h-screen bg-gray-50">
        <StoreProvider>
          <NextIntlClientProvider messages={messages} locale={locale}>
            {children}
          </NextIntlClientProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
