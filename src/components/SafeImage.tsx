"use client";

import Image from "next/image";
import { useState } from "react";

// Kategorilere göre placeholder üreten yardımcı fonksiyon
const getPlaceholderImage = (category?: string) => {
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

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

// Default blur placeholder for better UX
const getBlurDataURL = () => {
  return "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjBDMn//2Q==";
};

// SafeImage component interface
interface SafeImageProps {
  src: string;
  alt: string;
  category?: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  loading?: "lazy" | "eager";
  quality?: number;
  placeholder?: "blur" | "empty";
  onLoad?: () => void;
  onError?: () => void;
}

export default function SafeImage({
  src,
  alt,
  category,
  className = "",
  fill = false,
  width = 400,
  height = 400,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority = false,
  loading = "lazy",
  quality = 85,
  placeholder = "blur",
  onLoad,
  onError,
}: SafeImageProps) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Broken image patterns
  const brokenPatterns = [
    "71kWymZ+c+L._AC_SX679_",
    "71pWzhdJNwL._AC_UL640_QL65_ML3_",
    "61IBBVJvSDL._AC_SY879_",
    "81fPKd-2AYL._AC_SL1500_",
    "51Y5NI-I5jL._AC_UX679_",
    "._AC_SX679_",
    "._AC_UL640_",
    "._AC_SY879_",
    "._AC_SL1500_",
    "._AC_UX679_",
  ];

  const isBroken = brokenPatterns.some((pattern) => src.includes(pattern));
  const finalSrc =
    error || isBroken || !src ? getPlaceholderImage(category) : src;

  const handleImageLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleImageError = () => {
    console.warn(`Image failed to load: ${src}`);
    setError(true);
    setIsLoading(false);
    onError?.();
  };

  // Performance optimization: Use eager loading for priority images
  const optimizedLoading = priority ? "eager" : loading;

  const imageProps = {
    src: finalSrc,
    alt: alt || "Product image",
    className: `transition-opacity duration-300 ${
      isLoading ? "opacity-0" : "opacity-100"
    } ${className}`,
    sizes,
    priority,
    loading: optimizedLoading,
    quality,
    placeholder: placeholder,
    blurDataURL: getBlurDataURL(),
    onLoad: handleImageLoad,
    onError: handleImageError,
  };

  if (fill) {
    return (
      <div className="relative overflow-hidden">
        <Image {...imageProps} fill alt={alt || "Product image"} />
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <Image
        {...imageProps}
        width={width}
        height={height}
        alt={alt || "Product image"}
      />
      {isLoading && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
          style={{ width, height }}
        >
          <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
