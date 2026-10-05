import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";
import SectionRail from "@/components/ui/SectionRail";
import Chapter from "@/components/product/Chapter";
import Link from "next/link";
import { generateBreadcrumbSchema, generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { signupUrl } from "@/lib/links";
import { CHAPTERS, PLATFORM_ITEMS, PRODUCT } from "@/lib/product-content";

export const metadata = generateSEOMetadata({
  title: "Product - How Maxtest Works",
  description:
    "Write, run, triage and report on tests from your editor. Maxtest is the test platform your AI agent can operate through MCP.",
  path: "/features",
});

const RAIL_ITEMS = CHAPTERS.map((c) => ({ id: c.id, label: c.title, number: c.number }));

export default function FeaturesPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Product", url: "/features" },
  ]);
  const signup = signupUrl();

  return (
    <div className="min-h-screen bg-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <PageHeader eyebrow={PRODUCT.eyebrow} title={PRODUCT.title} lede={PRODUCT.lede} />

      <div className="mx-auto grid max-w-6xl items-start gap-8 px-4 pb-6 sm:px-6 lg:grid-cols-[9rem_minmax(0,1fr)]">
        <SectionRail items={RAIL_ITEMS} ariaLabel="Chapters" />
        <div>
          {CHAPTERS.map((chapter) => (
            <Chapter key={chapter.id} chapter={chapter} />
          ))}
        </div>
      </div>

      <Section>
        <h2 className="font-headline text-3xl font-extrabold tracking-tight text-paper">{PRODUCT.platformTitle}</h2>
        <ul className="mt-6 grid gap-x-12 gap-y-6 md:grid-cols-2">
          {PLATFORM_ITEMS.map((item) => (
            <li key={item.title} className="flex gap-3 border-t border-hairline pt-4">
              <Icon name={item.icon} size={20} className="mt-0.5 text-paper" />
              <div>
                <h3 className="font-bold text-paper">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-paper/65">
                  {item.text}
                  {item.href && (
                    <>
                      {" "}
                      <Link href={item.href} className="font-bold text-primary underline-offset-4 hover:underline">
                        Read more
                      </Link>
                    </>
                  )}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="pb-20">
        <h2 className="font-headline text-4xl font-extrabold tracking-tight text-paper">{PRODUCT.ctaTitle}</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={signup} external={signup.startsWith("http")}>
            Start free
          </Button>
          <Button href="/documentation" variant="ghost">
            Read the MCP docs
          </Button>
        </div>
      </Section>
    </div>
  );
}
