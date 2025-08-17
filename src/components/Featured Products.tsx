"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/cartSlice";
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

const FeaturedProducts: React.FC = () => {
  const t = useTranslations("BestSellers");
  const dispatch = useDispatch();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleAddToCart = (e: React.MouseEvent, product: Product): void => {
    e.stopPropagation(); // Ürün detay sayfasına gitmeyi engelle

    console.log("🛒 FeaturedProducts - Adding to cart:", product.title);

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

    // Kullanıcıya görsel feedback
    alert(`${product.title} sepete eklendi!`);
  };

  if (loading) {
    return (
      <section id="featured" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-lg text-gray-600">{t("loading")}</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="featured" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t("sectionTitle")}{" "}
            <span className="font-playfair italic text-black">
              {t("highlight")}
            </span>
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto"></div>
          <p className="text-xl text-gray-600 mt-6">
            En kaliteli ürünleri en uygun fiyatlarla keşfedin
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product: Product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
              onClick={() => handleProductClick(product.id)}
            >
              <div className="relative h-64 bg-gray-50">
                <SafeImage
                  src={product.image}
                  alt={product.title}
                  category={product.category}
                  className="w-full h-full object-contain p-4"
                  width={400}
                  height={400}
                />
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  ⭐ {product.rating.rate}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.title}
                </h3>
                <p className="text-sm text-gray-500 capitalize mb-4">
                  {product.category}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">
                    ${product.price}
                  </span>
                  <button
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
                    onClick={(e) => handleAddToCart(e, product)}
                  >
                    {t("addToCart")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => (window.location.href = "/products")}
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Tüm Ürünleri Görüntüle
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
