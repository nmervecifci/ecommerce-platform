import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import type { Locale } from "@/i18n/routing";

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  const slugs = ["first-post", "second-post"];
  const locales = ["tr", "en", "fr", "de"];

  const params = [];
  for (const locale of locales) {
    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }

  return params;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale as Locale);

  // ✅ Server Components'te await kullan
  const t = await getTranslations("BlogPage");
  const tCommon = await getTranslations("Common");

  // Mock post data
  const mockPosts = {
    "first-post": {
      title: `First Blog Post (${locale})`,
      content: `This is the content of the first blog post in ${locale} locale. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
      publishedAt: "2024-01-15",
    },
    "second-post": {
      title: `Second Blog Post (${locale})`,
      content: `This is the content of the second blog post in ${locale} locale. Ut enim ad minim veniam, quis nostrud exercitation.`,
      publishedAt: "2024-01-10",
    },
  };

  const post = mockPosts[slug as keyof typeof mockPosts];

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <article className="bg-white rounded-lg shadow-lg p-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            <p className="text-gray-600">
              {t("publishedOn")}: {post.publishedAt}
            </p>
          </header>

          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">{post.content}</p>
          </div>

          <footer className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex space-x-4">
              <Link
                href="/blog"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                ← {t("title")}
              </Link>

              <Link
                href="/"
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                {tCommon("backHome")}
              </Link>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}
