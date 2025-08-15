"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";

export default function LanguageChanger() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const toggleLanguage = () => {
    const isEnglish = locale === "en";
    const newLocale = isEnglish ? "tr" : "en";
    const currentPath = pathname.replace(/^\/(tr|en|fr|de)/, "");
    const newPath = `/${newLocale}${currentPath}`;

    router.push(newPath);
  };

  return toggleLanguage;
}
