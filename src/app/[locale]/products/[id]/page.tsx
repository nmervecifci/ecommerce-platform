"use client";

import React, { useEffect, useState, use } from "react";

import { useDispatch } from "react-redux";
import { addToCart } from "@/store/cartSlice";
import { ArrowLeft, Star, ShoppingCart, Heart } from "lucide-react";
import Image from "next/image";

// Fake Store API Product Type
interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
}

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  // const t = useTranslations("ProductDetail");
  const dispatch = useDispatch();
  const resolvedParams = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [addingToCart, setAddingToCart] = useState(false);

  // Placeholder image function
  const getImageSrc = (product: Product) => {
    const brokenPatterns = [
      "71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
      "61IBBVJvSDL._AC_SY879_.jpg",
      "81fPKd-2AYL._AC_SL1500_.jpg",
      "51Y5NI-I5jL._AC_UX679_.jpg",
      "71kWymZ+c+L._AC_SX679_.jpg",
    ];

    const imageUrl = product.image || "";
    const isBrokenUrl = brokenPatterns.some((pattern) =>
      imageUrl.includes(pattern)
    );

    if (isBrokenUrl || !imageUrl) {
      const colors = {
        electronics: "1f2937/f3f4f6",
        "men's clothing": "3b82f6/ffffff",
        "women's clothing": "ec4899/ffffff",
        jewelery: "f59e0b/ffffff",
      };
      const colorScheme =
        colors[product.category as keyof typeof colors] || "6b7280/ffffff";
      const categoryDisplay =
        product.category.charAt(0).toUpperCase() + product.category.slice(1);
      return `https://via.placeholder.com/500x500/${colorScheme}?text=${encodeURIComponent(
        categoryDisplay
      )}`;
    }

    return imageUrl;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://fakestoreapi.com/products/${resolvedParams.id}`
        );
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [resolvedParams.id]);

  const handleAddToCart = async () => {
    if (!product) return;

    setAddingToCart(true);

    try {
      console.log("🛒 Product Detail - Adding to Redux store:", {
        id: product.id,
        title: product.title,
        quantity: quantity,
      });

      // Redux store'a ürün ekle (quantity kadar)
      for (let i = 0; i < quantity; i++) {
        dispatch(
          addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            category: product.category,
          })
        );
      }

      // Kullanıcıya feedback
      alert(`${quantity} adet ${product.title} sepete eklendi!`);

      // Quantity'i 1'e reset et
      setQuantity(1);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Sepete eklerken bir hata oluştu!");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!product) return;

    handleAddToCart();

    // Sepete ekledikten sonra cart sayfasına yönlendir
    setTimeout(() => {
      window.location.href = "/cart";
    }, 1000);
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Ürün yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Ürün bulunamadı
          </h1>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Ürünlere Dön
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Ürün Detayı</h1>
            <button
              onClick={() => (window.location.href = "/cart")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              Sepet
            </button>
          </div>
        </div>
      </div>

      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-2xl shadow-lg overflow-hidden">
              <Image
                src={getImageSrc(product)}
                alt={product.title}
                width={300}
                height={300}
                className="w-full h-full object-contain p-8"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = getImageSrc(product);
                }}
              />

              {/* Wishlist Button */}
              <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
              </button>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center"
                >
                  <span className="text-gray-400 text-xs">
                    Resim {index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full capitalize">
                {product.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              {product.title}
            </h1>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {renderStars(product.rating.rate)}
                </div>
                <span className="text-gray-600">
                  {product.rating.rate.toFixed(1)} ({product.rating.count}{" "}
                  değerlendirme)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-xl text-gray-500 line-through">
                ${(product.price * 1.2).toFixed(2)}
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded">
                17% İndirim
              </span>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Ürün Açıklaması
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Specifications */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Ürün Özellikleri
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Ürün ID:</span>
                  <span className="text-sm font-medium">#{product.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Kategori:</span>
                  <span className="text-sm font-medium capitalize">
                    {product.category}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Stok Durumu:</span>
                  <span className="text-sm font-medium text-green-600">
                    Stokta
                  </span>
                </div>
                {product.rating && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Müşteri Puanı:
                    </span>
                    <span className="text-sm font-medium">
                      {product.rating.rate}/5 ⭐
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Size Selection (only for clothing categories) */}
            {(product.category === "men's clothing" ||
              product.category === "women's clothing") && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Beden Seçimi
                </h3>
                <div className="flex gap-2">
                  {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                        selectedSize === size
                          ? "border-blue-600 bg-blue-50 text-blue-600"
                          : "border-gray-300 text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-2 hover:bg-gray-100 transition-colors rounded-l-lg"
                    disabled={addingToCart}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-medium border-x border-gray-300">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-2 hover:bg-gray-100 transition-colors rounded-r-lg"
                    disabled={addingToCart}
                  >
                    +
                  </button>
                </div>

                <span className="text-gray-600">Stokta: 23 adet</span>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addingToCart ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Ekleniyor...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Sepete Ekle
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={addingToCart}
                  className="bg-gray-900 text-white py-3 px-8 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Hemen Al
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="border-t pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <span className="text-sm text-gray-600">Ücretsiz Kargo</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm">🔒</span>
                  </div>
                  <span className="text-sm text-gray-600">Güvenli Ödeme</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 text-sm">↩</span>
                  </div>
                  <span className="text-sm text-gray-600">Kolay İade</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 text-sm">📞</span>
                  </div>
                  <span className="text-sm text-gray-600">7/24 Destek</span>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-900">
                  Sepet Bilgisi
                </span>
              </div>
              <p className="text-sm text-blue-800">
                Bu ürünü sepete ekleyerek hemen satın alabilir veya diğer
                ürünlerle birlikte toplu sipariş verebilirsiniz.
              </p>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Benzer Ürünler
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="aspect-square bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Benzer Ürün {index + 1}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Benzer Ürün Başlığı
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-blue-600">
                      ${(Math.random() * 100 + 20).toFixed(2)}
                    </span>
                    <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors">
                      Sepete Ekle
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
