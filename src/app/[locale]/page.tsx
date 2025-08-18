import type { Metadata } from "next";
import FeaturedProducts from "@/components/FeaturedProducts";
import ModernEcommerceHero from "@/components/ModernEcommerceHero";

export const metadata: Metadata = {
  title: "Ana Sayfa - En İyi Ürünler",
  description:
    "ShopZone'da kaliteli ürünlerle en iyi fiyatlarla alışveriş yapın. Elektronik, giyim ve daha fazlası.",
  openGraph: {
    title: "Ana Sayfa - En İyi Ürünler",
    description: "ShopZone'da kaliteli ürünlerle alışveriş yapın",
  },
};

// ISR ile ürünleri server-side'da çek
async function getFeaturedProducts() {
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
          `https://fakestoreapi.com/products/category/${category}?limit=1`,
          {
            next: { revalidate: 3600 }, // ← ISR burada! 1 saatte bir güncelle
          }
        )
          .then((res) => res.json())
          .then((data) => data[0]) // Her kategoriden 1 ürün
    );

    const categoryProducts = await Promise.all(promises);
    const validProducts = categoryProducts.filter((product) => product); // null olanları filtrele

    return validProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
    // Fallback: İlk 4 ürünü çek
    try {
      const response = await fetch(
        "https://fakestoreapi.com/products?limit=4",
        {
          next: { revalidate: 3600 },
        }
      );
      const data = await response.json();
      return data;
    } catch (fallbackError) {
      console.error("Fallback fetch also failed:", fallbackError);
      return [];
    }
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div>
      <ModernEcommerceHero />
      <FeaturedProducts products={featuredProducts} />
    </div>
  );
}
