import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
}

interface BlogPageProps {
  params: Promise<{ locale: string }>;
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  // ✅ Server Components'te await kullan
  const t = await getTranslations("BlogPage");
  const tCommon = await getTranslations("Common");

  // Mock blog posts
  const posts: BlogPost[] = [
    {
      id: 1,
      slug: "first-post",
      title: `Sample Blog Post 1 (${locale})`,
      excerpt: "This is a sample blog post excerpt...",
      publishedAt: "2024-01-15",
    },
    {
      id: 2,
      slug: "second-post",
      title: `Sample Blog Post 2 (${locale})`,
      excerpt: "Another sample blog post excerpt...",
      publishedAt: "2024-01-10",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-xl text-gray-600">{t("description")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                {post.title}
              </h2>

              <p className="text-gray-600 mb-4">{post.excerpt}</p>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {t("publishedOn")}: {post.publishedAt}
                </span>

                <Link
                  href={`/blog/${post.slug}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  {t("readMore")}
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-block bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {tCommon("backHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
