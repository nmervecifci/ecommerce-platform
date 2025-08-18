"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/cartSlice";

// Product type tanımı
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

interface Props {
  products: Product[];
  categories: string[];
}

// Sıralama seçenekleri
type SortOption = "price-asc" | "price-desc" | "name-asc" | "name-desc";

export default function ProductsPageClient({ products, categories }: Props) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");

  // next-intl hooks
  const t = useTranslations("products");
  const tFilters = useTranslations("filters");
  const tSorting = useTranslations("sorting");
  const tCategories = useTranslations("categories");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  // İlk yükleme için fiyat aralığını ayarla
  useEffect(() => {
    if (products.length > 0) {
      const maxPrice = Math.max(...products.map((p) => p.price));
      setPriceRange([0, Math.ceil(maxPrice)]);
    }
  }, [products]);

  const handleProductClick = (productId: number) => {
    router.push(`/products/${productId}`);
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation(); // Ürün detayına gitmeyi engelle

    console.log("🛒 Products page - Adding to Redux store:", product.title);

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

    // Kullanıcıya feedback
    alert(`${product.title} sepete eklendi!`);
  };

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
      return `https://via.placeholder.com/300x300/${colorScheme}?text=${encodeURIComponent(
        categoryDisplay
      )}`;
    }

    return imageUrl;
  };

  // Filtreleme ve sıralama
  useEffect(() => {
    let filtered = [...products];

    // Kategori filtresi
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Fiyat aralığı filtresi
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sıralama
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name-asc":
          return a.title.localeCompare(b.title);
        case "name-desc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, selectedCategory, priceRange, sortBy]);

  // Fiyat formatı
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === "tr" ? "tr-TR" : "en-US", {
      style: "currency",
      currency: locale === "tr" ? "TRY" : "USD",
    }).format(price);
  };

  // Kategori adını çevir
  const translateCategory = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      electronics: "electronics",
      jewelery: "jewelery",
      "men's clothing": "mens_clothing",
      "women's clothing": "womens_clothing",
    };

    const mappedKey = categoryMap[category];
    if (mappedKey) {
      try {
        return tCategories(mappedKey);
      } catch (error) {
        return category;
      }
    }
    return category;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tüm Ürünler</h1>
      </div>

      {/* Filtreler */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Kategori Filtresi */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Kategori
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tüm Kategoriler</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {translateCategory(category)}
                </option>
              ))}
            </select>
          </div>

          {/* Fiyat Aralığı */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fiyat Aralığı: ${priceRange[0]} - ${priceRange[1]}
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min Fiyat"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([Number(e.target.value), priceRange[1]])
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="number"
                placeholder="Max Fiyat"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], Number(e.target.value)])
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Sıralama */}
          <div>
            <label
              htmlFor="sort"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Sıralama
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="name-asc">İsim A-Z</option>
              <option value="name-desc">İsim Z-A</option>
              <option value="price-asc">Fiyat Artan</option>
              <option value="price-desc">Fiyat Azalan</option>
            </select>
          </div>
        </div>

        {/* Sonuç Sayısı */}
        <div className="mt-4 text-sm text-gray-600">
          {filteredProducts.length} ürün bulundu
        </div>
      </div>

      {/* Ürün Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Ürün bulunamadı</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
              onClick={() => handleProductClick(product.id)}
            >
              {/* Ürün Resmi */}
              <div className="aspect-square relative bg-white p-4">
                <img
                  src={getImageSrc(product)}
                  alt={product.title}
                  className="w-full h-full object-contain"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://via.placeholder.com/300x300/6b7280/ffffff?text=No+Image`;
                  }}
                />
              </div>

              {/* Ürün Bilgileri */}
              <div className="p-4">
                <div className="mb-2">
                  <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                    {translateCategory(product.category)}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.title}
                </h3>

                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mb-3">
                  <div className="text-xl font-bold text-blue-600">
                    ${product.price.toFixed(2)}
                  </div>

                  <div className="flex items-center">
                    <span className="text-yellow-400 text-sm">★</span>
                    <span className="text-sm text-gray-600 ml-1">
                      {product.rating.rate} ({product.rating.count} yorum)
                    </span>
                  </div>
                </div>

                {/* Sepete Ekle Butonu */}
                <button
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300 font-medium"
                  onClick={(e) => handleAddToCart(e, product)}
                >
                  Sepete Ekle
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
