import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://shopzone-ecommerce.onrender.com";

  // Ürünleri getir
  const products = await fetch("https://fakestoreapi.com/products", {
    next: { revalidate: 86400 }, // Günde bir güncelle
  })
    .then((res) => res.json())
    .catch(() => []);

  // Kategorileri getir
  const categories = await fetch(
    "https://fakestoreapi.com/products/categories",
    {
      next: { revalidate: 86400 },
    }
  )
    .then((res) => res.json())
    .catch(() => []);

  // Ana sayfalar
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "hourly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    },
  ];

  // Ürün sayfaları
  const productPages = products.map((product: { id: number }) => ({
    url: `${baseUrl}/products/${product.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Kategori sayfaları (gelecekte eklenirse)
  const categoryPages = categories.map((category: string) => ({
    url: `${baseUrl}/categories/${encodeURIComponent(category)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Çok dilli sayfalar için TR versiyonları
  const trPages = [
    {
      url: `${baseUrl}/tr`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/tr/products`,
      lastModified: new Date(),
      changeFrequency: "hourly" as const,
      priority: 0.9,
    },
  ];

  // TR ürün sayfaları
  const trProductPages = products.map((product: { id: number }) => ({
    url: `${baseUrl}/tr/products/${product.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    ...staticPages,
    ...productPages,
    ...categoryPages,
    ...trPages,
    ...trProductPages,
  ];
}
