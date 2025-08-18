# 🛍️ ShopZone - Modern E-commerce Platform

> Next.js tabanlı, SEO optimizasyonlu, çok dilli e-ticaret platformu

[![Live Demo](https://img.shields.io/badge/Live%20Demo-ShopZone-blue)](https://shopzone-ecommerce.onrender.com)
[![Lighthouse Performance](https://img.shields.io/badge/Lighthouse%20Performance-100/100-green)](https://pagespeed.web.dev/analysis/https-shopzone-ecommerce-onrender-com-products/zpmbgmg6da?form_factor=desktop)
[![Lighthouse SEO](https://img.shields.io/badge/Lighthouse%20SEO-100/100-green)](https://pagespeed.web.dev/analysis/https-shopzone-ecommerce-onrender-com-products/zpmbgmg6da?form_factor=desktop)

## 📋 İçindekiler

- [🚀 Canlı Demo](#-canlı-demo)
- [✨ Özellikler](#-özellikler)
- [🏆 Lighthouse Skorları](#-lighthouse-skorları)
- [🛠️ Teknolojiler](#️-teknolojiler)
- [⚡ Performance Optimizasyonları](#-performance-optimizasyonları)
- [🔍 SEO Optimizasyonları](#-seo-optimizasyonları)
- [🖼️ Resim Yönetimi](#️-resim-yönetimi)
- [🌐 Çok Dilli Destek](#-çok-dilli-destek)
- [📁 Proje Yapısı](#-proje-yapısı)
- [🚀 Kurulum](#-kurulum)
- [📊 Test Sonuçları](#-test-sonuçları)
- [🔧 Bilinen Sorunlar](#-bilinen-sorunlar)

## 🚀 Canlı Demo

**Ana Site:** [https://shopzone-ecommerce.onrender.com](https://shopzone-ecommerce.onrender.com)

**Test Sayfaları:**
- 🏠 Ana Sayfa: [/](https://shopzone-ecommerce.onrender.com)
- 📦 Ürün Listesi: [/products](https://shopzone-ecommerce.onrender.com/products)
- 🔍 Ürün Detayı: [/products/1](https://shopzone-ecommerce.onrender.com/products/1)
- 🛒 Sepet: [/cart](https://shopzone-ecommerce.onrender.com/cart)

## ✨ Özellikler

### 🎯 Ana Özellikler
- ✅ **Modern E-ticaret UI/UX** - Responsive ve kullanıcı dostu tasarım
- ✅ **Ürün Kataloğu** - Grid view, filtreleme ve sıralama
- ✅ **Ürün Detay Sayfaları** - Dinamik meta taglar ve structured data
- ✅ **Sepet Yönetimi** - Redux ile state management
- ✅ **Çok Dilli Destek** - Türkçe/İngilizce (next-intl)
- ✅ **Responsive Tasarım** - Mobil-first yaklaşım

### ⚡ Performance Özellikler
- 🚀 **ISR (Incremental Static Regeneration)** - 1 saatte bir otomatik güncelleme
- 🖼️ **Akıllı Resim Yönetimi** - Lazy loading ve fallback sistemi
- 📱 **Progressive Enhancement** - Core Web Vitals optimizasyonu
- 🗂️ **Dynamic Sitemap** - SEO için otomatik sayfa indeksleme

## 🏆 Lighthouse Skorları

### Desktop Performans Sonuçları

| Sayfa | Performance | Accessibility | Best Practices | SEO |
|-------|-------------|---------------|----------------|-----|
| **Ana Sayfa** | 80/100 | 91/100 | 96/100 | 92/100 |
| **Ürün Listesi** | **100/100** 🏆 | 89/100 | 96/100 | **100/100** 🏆 |

### Core Web Vitals Metrikleri

```
✅ First Contentful Paint (FCP): 1.2s (Hedef: <1.8s)
✅ Largest Contentful Paint (LCP): 1.8s (Hedef: <2.5s)  
✅ Total Blocking Time (TBT): 130ms (Hedef: <200ms)
✅ Speed Index: 1.9s (Hedef: <3.4s)
⚠️ Cumulative Layout Shift (CLS): 0.374 (Hedef: <0.1)
```

## 🛠️ Teknolojiler

### Frontend Stack
```json
{
  "framework": "Next.js 14+ (App Router)",
  "language": "TypeScript",
  "styling": "TailwindCSS",
  "state": "Redux Toolkit (RTK)",
  "i18n": "next-intl",
  "deployment": "Render"
}
```

### API & Data
- **Data Source:** [Fake Store API](https://fakestoreapi.com/)
- **Rendering:** ISR (Incremental Static Regeneration)
- **Caching:** Next.js Built-in Cache + Custom Revalidation

## ⚡ Performance Optimizasyonları

### 1. ISR (Incremental Static Regeneration)

```typescript
// Sayfa seviyesinde ISR
const products = await fetch('https://fakestoreapi.com/products', {
  next: { revalidate: 1800 } // 30 dakikada bir güncelle
})

// Dinamik sayfa oluşturma
export async function generateStaticParams() {
  const products = await fetch('https://fakestoreapi.com/products')
  return products.map(product => ({ id: product.id.toString() }))
}
```

**Faydaları:**
- 🚀 İlk yükleme: ~100ms (server-side hazır)
- 🔄 Otomatik güncelleme: 30-60 dakikada bir
- 📈 SEO dostu: Crawler'lar için hazır HTML

### 2. Akıllı Image Loading

```typescript
// SafeImage component ile lazy loading
<SafeImage
  src={product.image}
  alt={product.title}
  category={product.category}
  loading="lazy"          // Scroll'da yükle
  priority={false}        // Ana resimler için true
  placeholder="blur"      // Smooth transition
/>
```

**Stratejiler:**
- 🖼️ **Priority Images:** Ana sayfa hero, ürün detay ana resmi
- 🔄 **Lazy Loading:** Grid'deki ürün resimleri
- 🎨 **Category Placeholders:** Broken image'lar için fallback

### 3. Bundle Optimization

- **Dynamic Imports:** Modal'lar için code splitting
- **Image Optimization:** WebP/AVIF format desteği
- **CSS Optimization:** Critical CSS inline, rest lazy

## 🔍 SEO Optimizasyonları

### 1. Dynamic Metadata

```typescript
// Ürün detay sayfası için dinamik meta
export async function generateMetadata({ params }) {
  const product = await getProduct(params.id)
  
  return {
    title: `${product.title} - $${product.price} | ShopZone`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.title,
      description: product.description,
      images: [product.image]
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      images: [product.image]
    }
  }
}
```

### 2. Structured Data (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "iPhone 14 Pro",
  "image": "https://example.com/iphone.jpg",
  "offers": {
    "@type": "Offer",
    "price": "999",
    "priceCurrency": "USD",
    "availability": "InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "1247"
  }
}
```

### 3. Sitemap & Robots

**Otomatik Sitemap Oluşturma:**
```typescript
// app/sitemap.ts
export default async function sitemap() {
  const products = await fetch('https://fakestoreapi.com/products')
  
  return [
    { url: 'https://shopzone.com', priority: 1 },
    { url: 'https://shopzone.com/products', priority: 0.9 },
    ...products.map(p => ({
      url: `https://shopzone.com/products/${p.id}`,
      priority: 0.8,
      changeFrequency: 'weekly'
    }))
  ]
}
```

**SEO URL'leri:**
- 🌐 Sitemap: `/sitemap.xml`
- 🤖 Robots: `/robots.txt`
- 🔗 Canonical URLs: Her sayfada unique

## 🖼️ Resim Yönetimi

### Broken Image Sorunu

**Problem:** Fake Store API'deki bazı resim URL'leri çalışmıyor (404 hatası)

```
❌ Bozuk: https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_.jpg
❌ Bozuk: https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_.jpg
```

### Çözüm: SafeImage Component

```typescript
const SafeImage = ({ src, category, ...props }) => {
  const [error, setError] = useState(false)
  
  // Broken URL'leri yakala ve placeholder göster
  const handleError = () => setError(true)
  
  if (error) {
    return <CategoryPlaceholder category={category} />
  }
  
  return <Image src={src} onError={handleError} {...props} />
}
```

### Category-Based Placeholders

```typescript
const placeholders = {
  'electronics': { icon: '⚡', color: '#667eea' },
  'jewelery': { icon: '💍', color: '#43e97b' },
  "men's clothing": { icon: '👤', color: '#f093fb' },
  "women's clothing": { icon: '👥', color: '#4facfe' }
}
```

**Görsel Sonuç:**
- 📱 Electronics → ⚡ Mavi gradient
- 💍 Jewelery → 💍 Yeşil gradient  
- 👔 Men's Fashion → 👤 Pink gradient
- 👗 Women's Fashion → 👥 Blue gradient

### Image Performance

- **Lazy Loading:** Grid'de scroll-based yükleme
- **Priority Loading:** Ana resimler için eager loading
- **Blur Placeholder:** Yüklenme sırasında smooth transition
- **Format Optimization:** WebP/AVIF desteği

## 🌐 Çok Dilli Destek

### next-intl Implementation

```typescript
// i18n/routing.ts
export const routing = defineRouting({
  locales: ['tr', 'en'],
  defaultLocale: 'tr'
})

// Usage in components
const t = useTranslations('HomePage')
return <h1>{t('title')}</h1>
```

**Desteklenen Diller:**
- 🇹🇷 Türkçe (varsayılan)
- 🇬🇧 İngilizce

**URL Yapısı:**
- `/` → Türkçe ana sayfa
- `/en` → İngilizce ana sayfa
- `/products/1` → Türkçe ürün detayı
- `/en/products/1` → İngilizce ürün detayı

## 📁 Proje Yapısı

```
shopzone-ecommerce/
├── 📁 src/
│   ├── 📁 app/                    # Next.js App Router
│   │   ├── 📁 [locale]/          # Çok dilli routing
│   │   │   ├── 📄 page.tsx       # Ana sayfa (ISR)
│   │   │   ├── 📁 products/      # Ürün sayfaları
│   │   │   │   ├── 📄 page.tsx   # Ürün listesi (ISR)
│   │   │   │   └── 📁 [id]/      # Dinamik ürün detayı
│   │   │   │       └── 📄 page.tsx # Ürün detayı (ISR + Metadata)
│   │   │   └── 📁 cart/          # Sepet sayfası
│   │   ├── 📄 sitemap.ts         # Dinamik sitemap
│   │   ├── 📄 robots.ts          # SEO robots.txt
│   │   └── 📄 layout.tsx         # Ana layout + metadata
│   ├── 📁 components/            # React components
│   │   ├── 📄 SafeImage.tsx      # Akıllı resim component'i
│   │   ├── 📄 FeaturedProducts.tsx # Öne çıkan ürünler
│   │   ├── 📄 ProductDetailClient.tsx # Ürün detay client
│   │   └── 📄 ProductsPageClient.tsx # Ürün listesi client
│   ├── 📁 store/                 # Redux store
│   │   ├── 📄 store.ts           # Store configuration
│   │   └── 📄 cartSlice.ts       # Sepet state management
│   └── 📁 i18n/                  # Çok dilli konfigürasyon
├── 📄 next.config.js             # Next.js konfigürasyonu
├── 📄 tailwind.config.js         # TailwindCSS ayarları
└── 📄 package.json               # Dependencies
```

## 🚀 Kurulum

### Prerequisites
- Node.js 18+
- npm veya yarn

### Kurulum Adımları

1. **Repository'yi klonlayın**
```bash
git clone https://github.com/username/shopzone-ecommerce.git
cd .
```

2. **Dependencies'leri yükleyin**
```bash
npm install
# veya
yarn install
```

3. **Development server'ı başlatın**
```bash
npm run dev
# veya
yarn dev
```

4. **Tarayıcıda açın**
```
http://localhost:3000
```

### Build ve Deploy

```bash
# Production build
npm run build

# Production preview
npm run start

# Deploy to Render/Vercel/Netlify
# Git push otomatik deploy tetikler
```

## 📊 Test Sonuçları

### Lighthouse Audit Detayları

**Performance Metrics (Products Page):**
- ✅ First Contentful Paint: 0.8s
- ✅ Speed Index: 1.1s  
- ✅ Largest Contentful Paint: 1.3s
- ✅ Time to Interactive: 1.1s
- ✅ Total Blocking Time: 0ms
- ✅ Cumulative Layout Shift: 0.006

**SEO Checklist:**
- ✅ Meta description
- ✅ Page title
- ✅ Crawlable links
- ✅ Valid HTML
- ✅ Image alt attributes
- ✅ Internal linking
- ✅ Structured data

### Performance Test URL'leri

**PageSpeed Insights:**
- [Ana Sayfa Test]([https-shopzone-ecommerce-onrender-com/xmg1v7rond?form_factor=desktop](https://pagespeed.web.dev/analysis/https-shopzone-ecommerce-onrender-com/xmg1v7rond?form_factor=desktop))
- [Products Sayfa Test]([https://pagespeed.web.dev/analysis/https-shopzone-ecommerce-onrender-com-products/](https://pagespeed.web.dev/analysis/https-shopzone-ecommerce-onrender-com-products/zpmbgmg6da?form_factor=desktop))

## 🔧 Bilinen Sorunlar

### 1. Fake Store API Image Issues

**Sorun:** API'den gelen bazı resim URL'leri 404 hatası veriyor

**Etkilenen URL'ler:**
```
❌ https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_.jpg
❌ https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_.jpg
❌ https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg
```

**Çözüm:** SafeImage component otomatik olarak category-based placeholder gösteriyor

**Neden Bu Durum Normal:**
- Fake Store API test amaçlı tasarlanmış
- Broken image handling skill'lerini test ediyor
- Production'da kendi resim CDN'iniz olur

### 2. Console Warnings

**Next.js Image Optimization Warnings:**
```
⨯ upstream image response failed for https://fakestoreapi.com/img/... 404
```

**Açıklama:** Bu warning'ler normal ve beklenen
- Next.js resmi optimize etmeye çalışıyor
- 404 alınca SafeImage devreye giriyor
- User experience etkilenmiyor

### 3. CLS (Cumulative Layout Shift)

**Skor:** 0.374 (Hedef: <0.1)

**Sebep:** Dynamic content loading
**Çözüm:** Gelecek versiyonlarda skeleton loading eklenebilir

## 🎯 Gelecek Geliştirmeler

### v2.0 Roadmap
- [ ] **Skeleton Loading** - CLS skorunu iyileştirme
- [ ] **PWA Support** - Offline çalışma
- [ ] **Real Image CDN** - Cloudinary/ImageKit entegrasyonu
- [ ] **User Authentication** - NextAuth.js
- [ ] **Payment Integration** - Stripe/PayPal
- [ ] **Admin Panel** - Ürün yönetimi
- [ ] **Analytics** - Google Analytics 4
- [ ] **Search Functionality** - Algolia/Elasticsearch

### Performance Targets v2.0
- 🎯 Performance: 95+ (tüm sayfalarda)
- 🎯 CLS: <0.1 (layout shift düzeltme)
- 🎯 TTI: <1.5s (time to interactive)

## 📞 İletişim

**Developer:** Merve Nur Çifci
**Email:** mervenurcfc42@gmail.com
**LinkedIn:** www.linkedin.com/in/mervenurcifci
**GitHub:** https://github.com/nmervecifci

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

---

⭐ **Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!**

**Live Demo:** [https://shopzone-ecommerce.onrender.com](https://shopzone-ecommerce.onrender.com)
