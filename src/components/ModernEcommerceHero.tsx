"use client";

import { Link } from "@/i18n/navigation";
import React, { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, loadCart } from "@/store/cartSlice";
import { RootState } from "@/store/store";
import SafeImage from "./SafeImage";

// Fake Store API Product Type
interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

const ModernEcommerceHero: React.FC = () => {
  const locale = useLocale();
  const t = useTranslations();
  const dispatch = useDispatch();

  // Redux store'dan cart quantity'yi al
  const cartQuantity = useSelector((state: RootState) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0)
  );

  const [featuredProduct, setFeaturedProduct] = useState<Product | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isEnglish = locale === "en";

  // Component mount olduğunda localStorage'dan cart'ı yükle
  useEffect(() => {
    dispatch(loadCart());
  }, [dispatch]);

  // Mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Link için handler (MouseEvent<HTMLAnchorElement>)
  const handleBestSellersLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    e.preventDefault();
    setIsMobileMenuOpen(false); // Mobile menu'yu kapat

    setTimeout(() => {
      const element = document.getElementById("featured");
      if (element) {
        const elementTop = element.offsetTop - 100;
        window.scrollTo({
          top: elementTop,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  // Button için handler (MouseEvent<HTMLButtonElement>)
  const handleBestSellersButtonClick = () => {
    setTimeout(() => {
      const element = document.getElementById("featured");
      if (element) {
        const elementTop = element.offsetTop - 100;
        window.scrollTo({
          top: elementTop,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  const handleAddToCart = (product: Product): void => {
    console.log("🛒 Hero - Adding featured product to cart:", product.title);

    // Redux store'a ürün ekle
    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category,
      })
    );

    alert(`${product.title} sepete eklendi!`);
  };

  const handleCartClick = (): void => {
    window.location.href = "/cart";
  };

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const fetchFeaturedProduct = async () => {
      try {
        const response = await fetch(
          "https://fakestoreapi.com/products/category/electronics"
        );
        const products = await response.json();
        const bestRated = products.sort(
          (a: Product, b: Product) => b.rating.rate - a.rating.rate
        )[0];
        setFeaturedProduct(bestRated);
      } catch (error) {
        console.error("Error fetching featured product:", error);
      }
    };

    fetchFeaturedProduct();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Modern geometric background */}
      <div className="absolute inset-0 opacity-20">
        {/* Floating shapes */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `linear-gradient(${Math.random() * 360}deg, 
                rgba(59, 130, 246, 0.1), 
                rgba(147, 51, 234, 0.1))`,
              borderRadius: Math.random() > 0.5 ? "50%" : "0%",
              transform: `rotate(${Math.random() * 360}deg)`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* Responsive Navbar */}
      <nav className="relative z-20 bg-white/80 backdrop-blur-sm px-4 sm:px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo - Always visible */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wider bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ModernStore
            </h1>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden lg:flex gap-6 text-gray-700 font-medium">
            <Link
              href="/shop"
              className="hover:text-blue-600 transition-colors"
            >
              {t("Navigation.shop")}
            </Link>
            <Link
              href="/#featured"
              onClick={handleBestSellersLinkClick}
              className="hover:text-blue-600 transition-colors"
            >
              {t("Navigation.bestsellers")}
            </Link>
            <Link
              href="/products"
              className="hover:text-blue-600 transition-colors"
            >
              {t("Navigation.products")}
            </Link>
          </div>

          {/* Right side - Icons and Language Switcher */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Language Switcher - Responsive */}
            <div className="flex items-center gap-1 sm:gap-2">
              <span
                className={`text-xs sm:text-sm font-medium ${
                  !isEnglish ? "text-gray-900" : "text-gray-500"
                }`}
              >
                TR
              </span>
              <Link
                href="/"
                locale={isEnglish ? "tr" : "en"}
                className="relative w-10 sm:w-12 h-5 sm:h-6 bg-gray-200 rounded-full transition-colors hover:bg-gray-300 block"
              >
                <div
                  className={`absolute top-0.5 w-4 sm:w-5 h-4 sm:h-5 bg-blue-600 rounded-full shadow transition-transform ${
                    isEnglish
                      ? "translate-x-5 sm:translate-x-6"
                      : "translate-x-0.5"
                  }`}
                />
              </Link>
              <span
                className={`text-xs sm:text-sm font-medium ${
                  isEnglish ? "text-gray-900" : "text-gray-500"
                }`}
              >
                EN
              </span>
            </div>

            {/* Desktop Icons */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {/* Cart Icon - Always visible */}
            <div
              className="relative w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={handleCartClick}
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              {cartQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {cartQuantity}
                </span>
              )}
            </div>

            {/* Mobile Menu Button - Only visible on mobile/tablet */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu - Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-sm shadow-lg border-t border-gray-200">
            <div className="flex flex-col p-4 space-y-4">
              <Link
                href="/shop"
                onClick={handleMobileLinkClick}
                className="text-gray-700 font-medium hover:text-blue-600 transition-colors py-2"
              >
                {t("Navigation.shop")}
              </Link>
              <Link
                href="/#featured"
                onClick={handleBestSellersLinkClick}
                className="text-gray-700 font-medium hover:text-blue-600 transition-colors py-2"
              >
                {t("Navigation.bestsellers")}
              </Link>
              <Link
                href="/products"
                onClick={handleMobileLinkClick}
                className="text-gray-700 font-medium hover:text-blue-600 transition-colors py-2"
              >
                {t("Navigation.products")}
              </Link>

              {/* Mobile User Icon */}
              <div className="sm:hidden flex items-center gap-3 pt-2 border-t border-gray-200">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-gray-600 text-sm">Profile</span>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-7xl w-full mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left side - Content */}
            <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight text-gray-900">
                  {t("HomePage.title")}
                </h2>
                <div className="h-1 w-16 sm:w-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto lg:mx-0"></div>
              </div>

              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {t("HomePage.description")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => (window.location.href = "/products")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  {t("HomePage.shopNow")}
                </button>
                <button
                  onClick={handleBestSellersButtonClick}
                  className="border-2 border-gray-300 text-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all"
                >
                  {t("HomePage.exploreCollections")}
                </button>
              </div>

              {/* Features - Responsive grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-6 lg:pt-8">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    {t("HomePage.premiumQuality")}
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-purple-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    {t("HomePage.securePayment")}
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      <path d="M3 4a1 1 0 00-1 1v1a1 1 0 001 1h1l.94 3.76A2 2 0 006.88 12h4.24a2 2 0 001.94-1.24L14 8h3a1 1 0 001-1V6a1 1 0 00-1-1H3z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    {t("HomePage.fastShipping")}
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Featured Product */}
            <div className="relative mt-8 lg:mt-0">
              <div className="relative bg-white rounded-2xl shadow-2xl p-6 sm:p-8 transform hover:rotate-0 lg:rotate-3 transition-transform duration-500">
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg transform rotate-45"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-green-500 to-blue-500 rounded-full"></div>

                {featuredProduct ? (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="relative h-48 sm:h-64 bg-gray-50 rounded-xl overflow-hidden">
                      <SafeImage
                        src={featuredProduct.image}
                        alt={featuredProduct.title}
                        category={featuredProduct.category}
                        fill
                        className="object-contain p-4"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                        ⭐ {featuredProduct.rating.rate}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                        {t("HomePage.featuredProduct")}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {featuredProduct.title}
                      </p>
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <span className="text-xl sm:text-2xl font-bold text-blue-600">
                          ${featuredProduct.price}
                        </span>
                        <button
                          onClick={() => handleAddToCart(featuredProduct)}
                          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                        >
                          {t("HomePage.buyNow")}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-48 sm:h-64 flex items-center justify-center">
                    <div className="animate-pulse text-gray-500">
                      {t("HomePage.loadingProduct")}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }
      `}</style>
    </div>
  );
};

export default ModernEcommerceHero;
