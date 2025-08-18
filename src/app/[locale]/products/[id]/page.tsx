import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/ProductDetailClient";

// Product interface
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
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

// ISR ile ürün verisini getir
async function getProduct(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`https://fakestoreapi.com/products/${id}`, {
      next: { revalidate: 3600 }, // 1 saatte bir güncelle
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

// Benzer ürünleri getir
async function getSimilarProducts(
  category: string,
  currentId: number
): Promise<Product[]> {
  try {
    const response = await fetch(
      `https://fakestoreapi.com/products/category/${category}`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      return [];
    }

    const products = await response.json();
    // Mevcut ürünü hariç tut ve ilk 4'ünü al
    return products.filter((p: Product) => p.id !== currentId).slice(0, 4);
  } catch (error) {
    console.error("Error fetching similar products:", error);
    return [];
  }
}

// Dynamic metadata generation
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const product = await getProduct(id);

  if (!product) {
    return {
      title: "Ürün Bulunamadı",
      description: "Aradığınız ürün bulunamadı.",
    };
  }

  // Ürün başlığını SEO için optimize et
  const cleanTitle =
    product.title.length > 60
      ? product.title.substring(0, 57) + "..."
      : product.title;

  const cleanDescription =
    product.description.length > 160
      ? product.description.substring(0, 157) + "..."
      : product.description;

  return {
    title: `${cleanTitle} - $${product.price} | ShopZone`,
    description: cleanDescription,
    keywords: [
      product.category,
      "online alışveriş",
      "ürün",
      product.title.split(" ").slice(0, 3),
    ].flat(),
    openGraph: {
      title: cleanTitle,
      description: cleanDescription,
      images: [
        {
          url: product.image,
          width: 800,
          height: 600,
          alt: product.title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: cleanTitle,
      description: cleanDescription,
      images: [product.image],
    },
    // Product specific metadata
    other: {
      "product:price:amount": product.price.toString(),
      "product:price:currency": "USD",
      "product:availability": "instock",
      "product:condition": "new",
    },
  };
}

// Static params generation (SSG)
export async function generateStaticParams() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    const products = await response.json();

    return products.map((product: Product) => ({
      id: product.id.toString(),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    notFound();
  }

  // Benzer ürünleri paralel olarak getir
  const similarProducts = await getSimilarProducts(
    product.category,
    product.id
  );

  // Structured Data (JSON-LD) for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.image,
    sku: product.id.toString(),
    mpn: product.id.toString(),
    brand: {
      "@type": "Brand",
      name: "ShopZone",
    },
    category: product.category,
    offers: {
      "@type": "Offer",
      url: `https://shopzone-ecommerce.onrender.com/products/${product.id}`,
      priceCurrency: "USD",
      price: product.price,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "ShopZone",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating.rate,
      reviewCount: product.rating.count,
      bestRating: 5,
      worstRating: 1,
    },
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Client Component'e veri geç */}
      <ProductDetailClient
        product={product}
        similarProducts={similarProducts}
        locale={resolvedParams.locale}
      />
    </>
  );
}
