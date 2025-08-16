"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "@deemlol/next-icons";
import { useTranslations } from "next-intl";

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

const BestSellers: React.FC = () => {
  const t = useTranslations("BestSellers");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Daha profesyonel placeholder generator (URL encoded)
  const getPlaceholderImage = (category: string) => {
    const categoryConfig = {
      electronics: {
        color1: "#667eea",
        color2: "#764ba2",
        icon: "⚡",
        text: "Electronics",
      },
      "men's clothing": {
        color1: "#f093fb",
        color2: "#f5576c",
        icon: "👤",
        text: "Men's Fashion",
      },
      "women's clothing": {
        color1: "#4facfe",
        color2: "#00f2fe",
        icon: "👥",
        text: "Women's Fashion",
      },
      jewelery: {
        color1: "#43e97b",
        color2: "#38f9d7",
        icon: "💍",
        text: "Jewelry",
      },
    };

    const config = categoryConfig[category as keyof typeof categoryConfig] || {
      color1: "#a8edea",
      color2: "#fed6e3",
      icon: "🛍",
      text: "Product",
    };

    // SVG without btoa - direct URL encoding
    const svg = `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${config.color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${config.color2};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#grad)"/>
      <circle cx="200" cy="150" r="40" fill="rgba(255,255,255,0.2)"/>
      <text x="200" y="160" text-anchor="middle" fill="white" font-size="40">${config.icon}</text>
      <text x="200" y="250" text-anchor="middle" fill="white" font-family="Arial" font-size="18" font-weight="600">${config.text}</text>
      <text x="200" y="280" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-family="Arial" font-size="14">Coming Soon</text>
    </svg>`;

    // URL encode instead of btoa
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  };

  // Safe image source - broken URL'leri baştan placeholder yap
  const getSafeImageSrc = (product: Product) => {
    // GEÇICI TEST: Bazı working URL'ler var mı kontrol edelim
    const workingPatterns = [
      "photo-1517841905240",
      "photo-1571019613454",
      "photo-1555041469-a586c61ea9bc",
    ];

    const imageUrl = product.image || "";
    const hasWorkingPattern = workingPatterns.some((pattern) =>
      imageUrl.includes(pattern)
    );

    console.log(`Product ${product.id}: ${imageUrl}`);
    console.log(`Working pattern found: ${hasWorkingPattern}`);

    // Test: Eğer working pattern varsa original kullan, yoksa placeholder
    if (hasWorkingPattern) {
      return product.image;
    }

    // Console'dan görünen broken pattern'ler
    const brokenPatterns = [
      "71kWymZ+c+L._AC_SX679_",
      "71pWzhdJNwL._AC_UL640_QL65_ML3_",
      "61IBBVJvSDL._AC_SY879_",
      "81fPKd-2AYL._AC_SL1500_",
      "51Y5NI-I5jL._AC_UX679_",
      // Genel Amazon pattern'ler
      "._AC_SX679_",
      "._AC_UL640_",
      "._AC_SY879_",
      "._AC_SL1500_",
      "._AC_UX679_",
    ];

    const isBroken = brokenPatterns.some((pattern) =>
      imageUrl.includes(pattern)
    );

    console.log(
      `Using: ${isBroken ? "PLACEHOLDER" : "ORIGINAL"} for ${product.category}`
    );

    return isBroken ? getPlaceholderImage(product.category) : product.image;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Farklı kategorilerden ürünler çekelim
        const categories = [
          "electronics",
          "men's clothing",
          "women's clothing",
          "jewelery",
        ];
        const promises = categories.map(
          (category) =>
            fetch(
              `https://fakestoreapi.com/products/category/${category}?limit=1`
            )
              .then((res) => res.json())
              .then((data) => data[0]) // Her kategoriden 1 ürün
        );

        const categoryProducts = await Promise.all(promises);
        const validProducts = categoryProducts.filter((product) => product); // null olanları filtrele

        setProducts(validProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        // Fallback: İlk 4 ürünü çek
        try {
          const response = await fetch(
            "https://fakestoreapi.com/products?limit=4"
          );
          const data = await response.json();
          setProducts(data);
        } catch (fallbackError) {
          console.error("Fallback fetch also failed:", fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (productId: number): void => {
    // Router kullanarak ürün detay sayfasına yönlendir
    window.location.href = `/products/${productId}`;
  };

  const handlePrevClick = (): void => {
    console.log("Previous products");
  };

  const handleNextClick = (): void => {
    console.log("Next products");
  };

  if (loading) {
    return (
      <div className="px-6 py-12">
        <div className="flex items-center justify-center h-96">
          <div className="text-lg">{t("loading")}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-12">
      <h2 className="text-3xl text-gray-600 mb-8">
        {t("sectionTitle")}{" "}
        <span className="font-playfair italic text-black">
          {t("highlight")}
        </span>
      </h2>

      <div className="relative">
        <button
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all"
          onClick={handlePrevClick}
          aria-label="Previous products"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>

        <button
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all"
          onClick={handleNextClick}
          aria-label="Next products"
        >
          <ArrowRight size={20} className="text-gray-700" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product: Product) => (
            <div
              key={product.id}
              className="relative h-96 rounded-2xl overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300 bg-white shadow-lg"
              onClick={() => handleProductClick(product.id)}
            >
              <div className="relative h-64 bg-gray-100">
                <img
                  src={getSafeImageSrc(product)}
                  alt={product.title}
                  className="w-full h-full object-contain p-4"
                  loading="lazy"
                />
              </div>

              <div className="p-4 h-32 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
                    {product.title}
                  </h3>
                  <p className="text-xs text-gray-500 capitalize mb-2">
                    {product.category}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    ${product.price}
                  </span>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(product.id);
                    }}
                  >
                    {t("addToCart")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestSellers;
