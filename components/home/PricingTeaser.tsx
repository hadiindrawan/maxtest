import Link from "next/link";
import { PRICING_TEASER } from "@/lib/home-content";

export default function PricingTeaser() {
  return (
    <section className="mx-auto max-w-6xl border-t border-hairline px-4 py-10 sm:px-6">
      <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1 font-headline text-2xl font-extrabold tracking-tight text-paper">
        {PRICING_TEASER.line}
        <Link
          href="/pricing"
          className="font-body text-base font-bold text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          {PRICING_TEASER.cta} →
        </Link>
      </p>
    </section>
  );
}
