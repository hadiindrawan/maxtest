import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import AnimatedSection from "@/components/AnimatedSection";
import { blogPosts } from "@/lib/blog-data";
import Link from "next/link";

export const metadata = generateSEOMetadata({
  title: "Blog - AI Testing Insights",
  description:
    "Latest insights on AI-driven testing, test automation trends, and how to eliminate flaky tests with RAG technology.",
  path: "/blog",
});

export default function BlogListingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-dark">
      <section className="relative py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
              Engineering <span className="text-primary">Blog</span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed">
              Insights, guides, and stories about the future of autonomous testing.
            </p>
          </AnimatedSection>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <AnimatedSection key={post.slug} delay={index * 0.1}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col h-full bg-surface-dark border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                        {post.tags[0]}
                      </span>
                      <span className="text-xs text-slate-500">{post.date}</span>
                    </div>

                    <h2 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>

                    <p className="text-slate-400 text-sm mb-6 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="mt-auto flex items-center text-sm text-primary font-medium">
                      Read Article
                      <svg
                        className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M9 5l7 7-7 7"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
