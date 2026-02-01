import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { blogPosts, BlogPost } from "@/lib/blog-data";
import { notFound } from "next/navigation";
import Link from "next/link";
import CTAButton from "@/components/CTAButton";

// SSG: Generate params for all posts
export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

// Metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return;

  return generateSEOMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
    // In a real app, you'd add: type: "article", publishedTime: post.date, etc.
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Generate Article Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: `${process.env.NEXT_PUBLIC_SITE_URL}/favicon-img-w.png`, // Placeholder
    datePublished: post.date,
    author: {
      "@type": "Organization",
      name: "Maxtest AI",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`,
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-dark">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <article className="relative py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-[680px] mx-auto">
          {/* Header */}
          <div className="mb-16">
            <Link
              href="/blog"
              className="inline-flex items-center text-sm text-slate-500 hover:text-primary mb-10 transition-colors group"
            >
              <svg
                className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M15 19l-7-7 7-7"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              Back to Blog
            </Link>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-8">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 pb-10 border-b border-white/5">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                M
              </div>
              <div className="flex flex-col">
                <span className="text-white font-medium">Maxtest AI Team</span>
                <div className="flex items-center text-sm text-slate-500 gap-2 mt-1">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readingTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div
            className="
              blog-content
              [&>h2]:text-white [&>h2]:text-3xl [&>h2]:sm:text-4xl [&>h2]:font-bold [&>h2]:mb-6 [&>h2]:mt-16 [&>h2]:leading-tight
              [&>h3]:text-white [&>h3]:text-2xl [&>h3]:font-bold [&>h3]:mb-4 [&>h3]:mt-12
              [&>p]:text-gray-300 [&>p]:text-xl [&>p]:leading-[1.75] [&>p]:mb-6 [&>p]:font-serif
              [&>ul]:my-8 [&>ul]:space-y-3
              [&>ul>li]:text-gray-300 [&>ul>li]:text-xl [&>ul>li]:leading-[1.75] [&>ul>li]:pl-2 [&>ul>li]:font-serif
              [&>ul>li>strong]:text-white [&>ul>li>strong]:font-bold
              [&>pre]:bg-[#0d1117] [&>pre]:border [&>pre]:border-white/5 [&>pre]:rounded-lg [&>pre]:p-6 [&>pre]:my-10 [&>pre]:overflow-x-auto
              [&>pre>code]:text-gray-300 [&>pre>code]:text-[15px] [&>pre>code]:leading-[1.7] [&>pre>code]:font-mono [&>pre>code]:block
              [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-6 [&>blockquote]:my-10 [&>blockquote]:italic [&>blockquote]:text-gray-400 [&>blockquote]:text-xl
              [&_code:not(pre_code)]:text-primary [&_code:not(pre_code)]:bg-primary/10 [&_code:not(pre_code)]:px-1.5 [&_code:not(pre_code)]:py-0.5 [&_code:not(pre_code)]:rounded [&_code:not(pre_code)]:text-sm [&_code:not(pre_code)]:font-mono
            "
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          <div className="mt-20 pt-10 border-t border-white/5">
            <div className="flex flex-wrap gap-3">
              {post.tags.map(tag => (
                <span key={tag} className="text-sm font-medium text-slate-500 bg-white/5 px-4 py-2 rounded-full hover:bg-white/10 hover:text-slate-400 transition-colors cursor-default">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </article>

      {/* CTA */}
      <section className="py-20 px-4 mt-8 bg-surface-dark border-y border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to implement this solution?
          </h2>
          <p className="text-slate-400 mb-8">
            Start using Maxtest AI today and ship quality code faster.
          </p>
          <div className="flex justify-center">
            <CTAButton
              href={`${process.env.NEXT_PUBLIC_APP_URL}/auth?action=signup` || "/pricing"}
              variant="primary"
              size="lg"
            >
              Start for Free
            </CTAButton>
          </div>
        </div>
      </section>
    </div>
  );
}
