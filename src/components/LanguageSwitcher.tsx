"use client";

import { useRouter } from "@/i18n/navigation";

import { usePathname } from "next/navigation";

interface LanguageSwitcherProps {
  isEnglish: boolean;
}

export default function LanguageSwitcher({ isEnglish }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = () => {
    const newLocale = isEnglish ? "tr" : "en";
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-2">
      <span
        className={`text-sm font-medium ${
          !isEnglish ? "text-black" : "text-black/60"
        }`}
      >
        TR
      </span>
      <button
        onClick={handleLanguageChange}
        className="relative w-12 h-6 bg-black/20 rounded-full transition-colors hover:bg-black/30"
      >
        <div
          className={`absolute top-0.5 w-5 h-5 bg-black rounded-full shadow transition-transform ${
            isEnglish ? "translate-x-6" : "translate-x-0.5"
          }`}
        />
      </button>
      <span
        className={`text-sm font-medium ${
          isEnglish ? "text-black" : "text-black/60"
        }`}
      >
        EN
      </span>
    </div>
  );
}
