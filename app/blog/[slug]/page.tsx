import Link from "next/link";
import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { formatReadTime, readMinutes } from "@/lib/blog";
import { blogPosts } from "@/lib/blog-data";
import { signupUrl } from "@/lib/links";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return;
  return generateSEOMetadata({ title: post.title, description: post.excerpt, path: `/blog/${slug}` });
}

const content = [
  "blog-content min-w-0 break-words",
  "[&>h2]:mb-5 [&>h2]:mt-14 [&>h2]:font-headline [&>h2]:text-3xl [&>h2]:font-extrabold [&>h2]:leading-tight [&>h2]:tracking-tight [&>h2]:text-paper",
  "[&>h3]:mb-4 [&>h3]:mt-10 [&>h3]:font-headline [&>h3]:text-2xl [&>h3]:font-extrabold [&>h3]:text-paper",
  "[&>p]:mb-6 [&>p]:font-serif [&>p]:text-lg [&>p]:leading-[1.75] [&>p]:text-paper/85",
  "[&>ul]:my-8 [&>ul]:space-y-3",
  "[&>ul>li]:relative [&>ul>li]:pl-6 [&>ul>li]:font-serif [&>ul>li]:text-lg [&>ul>li]:leading-[1.75] [&>ul>li]:text-paper/85",
  "[&>ul>li]:before:absolute [&>ul>li]:before:left-0 [&>ul>li]:before:text-primary [&>ul>li]:before:content-['▸']",
  "[&>ul>li>strong]:font-bold [&>ul>li>strong]:text-paper",
  "[&>pre]:my-8 [&>pre]:overflow-x-auto [&>pre]:rounded-lg [&>pre]:border-2 [&>pre]:border-paper [&>pre]:bg-panel [&>pre]:p-5 [&>pre]:shadow-[3px_3px_0_var(--color-primary)]",
  "[&>pre>code]:block [&>pre>code]:font-mono [&>pre>code]:text-[14px] [&>pre>code]:leading-[1.7] [&>pre>code]:text-paper/90",
  "[&>blockquote]:my-8 [&>blockquote]:border-l-2 [&>blockquote]:border-primary [&>blockquote]:pl-5 [&>blockquote]:font-serif [&>blockquote]:text-lg [&>blockquote]:italic [&>blockquote]:text-paper/70",
  "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4",
  "[&_code:not(pre_code)]:font-mono [&_code:not(pre_code)]:text-[0.9em] [&_code:not(pre_code)]:text-primary",
].join(" ");

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: `${process.env.NEXT_PUBLIC_SITE_URL}/favicon-img-w.png`,
    datePublished: post.date,
    author: { "@type": "Organization", name: "Maxtest AI" },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}` },
  };
  const signup = signupUrl();

  return (
    <div className="min-h-screen bg-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <article className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-[680px]">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-paper/55 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <Icon name="arrow-right" size={14} className="rotate-180" />
            Blog
          </Link>

          <h1 className="mt-8 font-headline text-4xl font-extrabold leading-[1.08] tracking-tight text-paper sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-6 border-b border-hairline pb-8 font-mono text-xs text-paper/55">
            Maxtest AI Team · {post.date} · {formatReadTime(readMinutes(post.content))}
          </p>

          <div className={`mt-10 ${content}`} dangerouslySetInnerHTML={{ __html: post.content }} />

          <p className="mt-14 border-t border-hairline pt-6 font-mono text-xs text-paper/50">{post.tags.join(" · ")}</p>
        </div>
      </article>

      <section className="border-t border-hairline px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-[680px]">
          <h2 className="font-headline text-3xl font-extrabold tracking-tight text-paper">Ready to try it?</h2>
          <p className="mt-3 text-paper/70">Start with Maxtest and let your agent run your tests.</p>
          <div className="mt-6">
            <Button href={signup} external={signup.startsWith("http")}>
              Start free
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
