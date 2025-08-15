import "../globals.css";
import { Playfair_Display } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, isValidLocale } from "../../i18n/routing";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "../../i18n/routing";

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
        <NextIntlClientProvider messages={messages} locale={locale}>
          {/* CarpetBackground kaldırıldı */}
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
