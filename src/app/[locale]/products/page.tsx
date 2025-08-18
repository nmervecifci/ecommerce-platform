import type { Metadata } from "next";
import ProductsPageClient from "@/components/ProductsPageClient";

export const metadata: Metadata = {
  title: "Tüm Ürünler",
  description:
    "Geniş ürün yelpazemizi keşfedin. Elektronik, giyim, aksesuarlar ve daha fazlası uygun fiyatlarla.",
  openGraph: {
    title: "Tüm Ürünler - ShopZone",
    description: "Geniş ürün yelpazesi ile online alışveriş",
  },
};

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

// ISR ile ürünleri ve kategorileri server-side'da çek
async function getProductsData() {
  try {
    const [productsResponse, categoriesResponse] = await Promise.all([
      fetch("https://fakestoreapi.com/products", {
        next: { revalidate: 1800 }, // 30 dakikada bir güncelle
      }),
      fetch("https://fakestoreapi.com/products/categories", {
        next: { revalidate: 3600 }, // 1 saatte bir güncelle
      }),
    ]);

    if (!productsResponse.ok || !categoriesResponse.ok) {
      throw new Error("API isteği başarısız oldu");
    }

    const productsData: Product[] = await productsResponse.json();
    const categoriesData: string[] = await categoriesResponse.json();

    return {
      products: productsData,
      categories: categoriesData,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      products: [],
      categories: [],
    };
  }
}

export default async function ProductsPage() {
  const { products, categories } = await getProductsData();

  return <ProductsPageClient products={products} categories={categories} />;
}
