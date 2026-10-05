import Faq from "@/components/pricing/Faq";
import PricingLedger from "@/components/pricing/PricingLedger";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";
import { signupUrl } from "@/lib/links";
import { FAQ, PRICING } from "@/lib/pricing";
import { generateFAQSchema, generateMetadata as generateSEOMetadata } from "@/lib/seo";

export const metadata = generateSEOMetadata({
  title: "Pricing - Pay for What You Run",
  description: "Maxtest pricing is based on runner minutes and test runs. Start free and move up when you need more.",
  path: "/pricing",
});

export default function PricingPage() {
  const faqSchema = generateFAQSchema(FAQ);
  return (
    <div className="min-h-screen bg-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <PageHeader eyebrow={PRICING.eyebrow} title={PRICING.title} lede={PRICING.lede} />
      <div className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
        <PricingLedger signupHref={signupUrl()} />
      </div>
      <Section className="pb-20">
        <h2 className="mb-6 font-headline text-3xl font-extrabold tracking-tight text-paper">{PRICING.faqTitle}</h2>
        <Faq items={FAQ} />
      </Section>
    </div>
  );
}
