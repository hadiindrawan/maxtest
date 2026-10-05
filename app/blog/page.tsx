import Link from "next/link";
import Icon from "@/components/ui/Icon";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";
import { formatReadTime, readMinutes } from "@/lib/blog";
import { blogPosts } from "@/lib/blog-data";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = generateSEOMetadata({
  title: "Blog - AI Testing Insights",
  description:
    "Latest insights on AI-driven testing, test automation trends, and how to eliminate flaky tests with RAG technology.",
  path: "/blog",
});

export default function BlogListingPage() {
  const posts = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div className="min-h-screen bg-ink">
      <PageHeader
        eyebrow="Blog"
        title="Notes from the test bench."
        lede="Insights, guides, and stories about the future of autonomous testing."
      />
      <Section className="pb-20">
        {posts.map((post, index) => (
          <article key={post.slug} className="border-t border-hairline py-8 first:border-t-0 first:pt-0">
            <Link href={`/blog/${post.slug}`} className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
              <p className="font-mono text-xs text-paper/55">
                {post.date} · {formatReadTime(readMinutes(post.content))}
              </p>
              <h2
                className={cn(
                  "mt-2 max-w-3xl font-headline font-extrabold leading-tight tracking-tight text-paper transition-colors group-hover:text-primary",
                  index === 0 ? "text-3xl sm:text-4xl" : "text-2xl",
                )}
              >
                {post.title}
              </h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-paper/70">{post.excerpt}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary">
                Read <Icon name="arrow-right" size={14} />
              </span>
            </Link>
          </article>
        ))}
      </Section>
    </div>
  );
}
