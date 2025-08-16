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

// Ortak SafeImage component
interface SafeImageProps {
  src: string;
  alt: string;
  category?: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
}

export default function SafeImage({
  src,
  alt,
  category,
  className,
  fill,
  width,
  height,
  sizes,
}: SafeImageProps) {
  const [error, setError] = useState(false);

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

  const finalSrc = error || isBroken ? getPlaceholderImage(category) : src;

  return (
    <Image
      src={finalSrc}
      alt={alt}
      className={className}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      sizes={sizes}
      onError={() => setError(true)}
    />
  );
}
