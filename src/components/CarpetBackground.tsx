import Image from "next/image";
import { Link } from "@/i18n/navigation";
import React from "react";
import { useLocale, useTranslations } from "next-intl";

const CarpetBackground: React.FC = () => {
  const locale = useLocale();
  const t = useTranslations();

  const isEnglish = locale === "en";

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Ana halı arka planı */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: `
            linear-gradient(45deg, 
              #8B4513 0%, #CD853F 25%, 
              #2F4F4F 50%, #DAA520 75%, 
              #8B4513 100%
            ),
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(139, 69, 19, 0.1) 10px,
              rgba(139, 69, 19, 0.1) 20px
            ),
            repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 15px,
              rgba(47, 79, 79, 0.1) 15px,
              rgba(47, 79, 79, 0.1) 30px
            )
          `,
          backgroundSize: "200px 200px, 40px 40px, 60px 60px",
        }}
      />

      {/* Halı deseni katmanları */}
      <div className="absolute inset-0">
        {/* Geometrik desenler */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute border-2 opacity-20 rotate-45"
            style={{
              width: `${Math.random() * 150 + 100}px`,
              height: `${Math.random() * 150 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              borderColor: ["#8B4513", "#CD853F", "#2F4F4F", "#DAA520"][
                Math.floor(Math.random() * 4)
              ],
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        ))}

        {/* Çiçek/rozet desenleri */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`flower-${i}`}
            className="absolute w-16 h-16 opacity-30"
            style={{
              left: `${Math.random() * 90 + 5}%`,
              top: `${Math.random() * 90 + 5}%`,
              background: `radial-gradient(circle, 
                #DAA520 0%, 
                transparent 30%, 
                #8B4513 50%, 
                transparent 70%
              )`,
              borderRadius: "50%",
            }}
          />
        ))}
      </div>

      {/* Navbar */}
      <nav className="relative z-20 bg-transparent/90 backdrop-blur-sm px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left - Navigation Links */}
          <div className="flex gap-6 text-black font-medium">
            <Link
              href="/shop"
              className="hover:text-yellow-300 transition-colors"
            >
              {t("Navigation.shop")}
            </Link>
            <Link
              href="/bestsellers"
              className="hover:text-yellow-300 transition-colors"
            >
              {t("Navigation.bestsellers")}
            </Link>
            <Link
              href="/gallery"
              className="hover:text-yellow-300 transition-colors"
            >
              {t("Navigation.gallery")}
            </Link>
            <Link
              href="/about"
              className="hover:text-yellow-300 transition-colors"
            >
              {t("Navigation.about")}
            </Link>
          </div>

          {/* Center - Logo/Title */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h1 className="text-black text-4xl font-serif tracking-wider">
              ShahRug
            </h1>
          </div>

          {/* Right - Language Switcher and Icons */}
          <div className="flex items-center gap-4">
            {/* Dil Değiştirici - Link versiyonu */}
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-medium ${
                  !isEnglish ? "text-black" : "text-black/60"
                }`}
              >
                TR
              </span>
              <Link
                href="/"
                locale={isEnglish ? "tr" : "en"}
                className="relative w-12 h-6 bg-black/20 rounded-full transition-colors hover:bg-black/30 block"
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-black rounded-full shadow transition-transform ${
                    isEnglish ? "translate-x-6" : "translate-x-0.5"
                  }`}
                />
              </Link>
              <span
                className={`text-sm font-medium ${
                  isEnglish ? "text-black" : "text-black/60"
                }`}
              >
                EN
              </span>
            </div>

            {/* İkonlar */}
            <div className="flex items-center gap-3">
              <div
                className="w-6 h-6 cursor-pointer bg-cover bg-center"
                style={{ backgroundImage: "url(/assets/profile_icon.png)" }}
              ></div>
              <div
                className="w-6 h-6 cursor-pointer bg-cover bg-center"
                style={{ backgroundImage: "url(/assets/cart_icon.png)" }}
              ></div>
            </div>
          </div>
        </div>
      </nav>

      {/* Ana içerik alanı */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-6xl w-full mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Sol taraf - İçerik */}
            <div className="space-y-8">
              <h2 className="text-5xl font-serif leading-tight text-gray-900">
                {t("HomePage.title")}
              </h2>

              <p className="text-lg text-gray-600 leading-relaxed">
                {t("HomePage.description")}
              </p>

              <div className="flex space-x-4">
                <button className="bg-black text-white px-8 py-3 rounded-none font-medium hover:bg-gray-800 transition-colors">
                  {t("HomePage.shopNow")}
                </button>
                <button className="border border-gray-300 px-8 py-3 rounded-none font-medium hover:bg-gray-50 transition-colors">
                  {t("HomePage.exploreCollections")}
                </button>
              </div>

              {/* Özellikler */}
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-gray-400"></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {t("HomePage.premiumQuality")}
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-gray-400 rounded-full"></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {t("HomePage.handmade")}
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-gray-400"></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {t("HomePage.expressShipping")}
                  </p>
                </div>
              </div>
            </div>

            {/* Sağ taraf - Halı görseli */}
            <div className="relative">
              <div className="relative">
                {/* Çerçeve katmanları */}
                <div className="absolute -inset-4 bg-gradient-to-r from-yellow-600 via-yellow-700 to-yellow-800 rounded-lg shadow-2xl transform rotate-1"></div>
                <div className="absolute -inset-2 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 rounded-lg shadow-xl"></div>

                {/* Halı görseli */}
                <div className="relative aspect-square rounded-lg overflow-hidden shadow-xl">
                  <Image
                    src="/assets/carpet_main.jpg"
                    alt="Persian Carpet"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />

                  {/* Çerçeve köşe süsleri (resmin üzerinde durur) */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Sol üst köşe */}
                    <div className="absolute top-2 left-2 w-8 h-8">
                      <div className="w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-sm"></div>
                      <div className="w-1 h-full bg-gradient-to-b from-yellow-400 to-yellow-600 shadow-sm"></div>
                    </div>

                    {/* Sağ üst köşe */}
                    <div className="absolute top-2 right-2 w-8 h-8">
                      <div className="w-full h-1 bg-gradient-to-r from-yellow-600 to-yellow-400 shadow-sm"></div>
                      <div className="absolute right-0 w-1 h-full bg-gradient-to-b from-yellow-400 to-yellow-600 shadow-sm"></div>
                    </div>

                    {/* Sol alt köşe */}
                    <div className="absolute bottom-2 left-2 w-8 h-8">
                      <div className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-sm"></div>
                      <div className="w-1 h-full bg-gradient-to-b from-yellow-600 to-yellow-400 shadow-sm"></div>
                    </div>

                    {/* Sağ alt köşe */}
                    <div className="absolute bottom-2 right-2 w-8 h-8">
                      <div className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-yellow-600 to-yellow-400 shadow-sm"></div>
                      <div className="absolute right-0 w-1 h-full bg-gradient-to-b from-yellow-600 to-yellow-400 shadow-sm"></div>
                    </div>

                    {/* Köşe elmas süsleri */}
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-3 h-3 bg-yellow-500 opacity-80 shadow-sm transform rotate-45"
                        style={{
                          [i < 2 ? "top" : "bottom"]: "6px",
                          [i % 2 === 0 ? "left" : "right"]: "6px",
                        }}
                      />
                    ))}
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-yellow-900/10 pointer-events-none"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarpetBackground;
