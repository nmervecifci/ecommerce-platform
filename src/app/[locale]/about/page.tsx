// src/app/[locale]/about/page.tsx
import { getTranslations } from "next-intl/server"; // ✅ Server için getTranslations
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  // ✅ Server Components'te getTranslations kullan
  const t = await getTranslations("AboutPage");
  const tCommon = await getTranslations("Common");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {t("title")}
          </h1>

          <p className="text-xl text-gray-600 mb-8">{t("description")}</p>

          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed mb-8">{t("content")}</p>
          </div>

          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {tCommon("backHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
