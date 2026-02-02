"use client";

import { useState } from "react";
import { generateFAQSchema } from "@/lib/seo";
import AnimatedSection from "@/components/AnimatedSection";
import { cn } from "@/lib/utils";

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const faqSchema = generateFAQSchema(faqs);

  return (
    <div className="flex flex-col min-h-screen bg-background-dark">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <section className="flex-grow flex flex-col relative py-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow flex flex-col justify-center">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            {/* Try First Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              <span className="text-primary font-bold text-sm uppercase tracking-wider">
                Try First, Pay Later • No Credit Card Required
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-white via-slate-200 to-slate-400 bg-clip-text text-transparent pb-1">
              Choose Your Power Level
            </h1>
            <p className="text-lg text-slate-400">
              Start free and experience the power of AI-driven testing. Upgrade
              only when you&apos;re ready for unlimited scale.
            </p>

            {/* Toggle */}
            <div className="flex justify-center mt-8">
              <div className="bg-surface-dark border border-slate-800 p-1 rounded-xl inline-flex">
                <button
                  onClick={() => setIsYearly(false)}
                  className={cn(
                    "px-6 py-2 rounded-lg text-sm font-medium transition-all",
                    !isYearly
                      ? "bg-slate-800 text-white shadow-sm"
                      : "text-slate-400 hover:text-white",
                  )}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setIsYearly(true)}
                  className={cn(
                    "px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                    isYearly
                      ? "bg-slate-800 text-white shadow-sm"
                      : "text-slate-400 hover:text-white",
                  )}
                >
                  Yearly{" "}
                  <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                    -20%
                  </span>
                </button>
              </div>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-center max-w-6xl mx-auto w-full">
            {/* Free Tier */}
            <AnimatedSection delay={0.1}>
              <div className="group relative bg-surface-dark/40 border border-slate-800 hover:border-slate-700 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1">
                <div className="mb-6 mt-2">
                  <h3 className="text-lg font-medium text-slate-300">Free</h3>
                  <div className="mt-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-white">
                        Rp 0
                      </span>
                      <span className="text-slate-500 font-medium">/mo</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">~$0 USD</p>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Perfect to get started
                  </p>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <svg
                      className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                    <span>3 users</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <svg
                      className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                    <span>50.000 tokens / month</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <svg
                      className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                    <span>Community support</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <svg
                      className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                    <span>Limited third-party integrations</span>
                  </li>
                </ul>
                <a
                  href={`${process.env.NEXT_PUBLIC_APP_URL}/auth?action=signup` || "#"}
                  className="w-full py-3 px-4 rounded-xl border border-primary/50 bg-primary/5 text-primary font-bold hover:bg-primary/10 hover:border-primary transition-colors flex items-center justify-center gap-2"
                >
                  Start Free
                </a>
              </div>
            </AnimatedSection>

            {/* Pro Tier */}
            <AnimatedSection delay={0.2}>
              <div className="relative md:-my-4 z-10">
                <div className="absolute -inset-[1px] bg-gradient-to-b from-primary to-cyan-700 rounded-2xl blur-sm opacity-60" />
                <div className="relative bg-surface-dark border border-primary/50 rounded-2xl p-8 md:p-10 shadow-[0_0_30px_-5px_rgba(0,191,255,0.6)] transform scale-100 md:scale-105 transition-transform">
                  <div className="absolute top-0 right-0 -mt-3 mr-4">
                    <span className="bg-primary text-background-dark text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                      Recommended
                    </span>
                  </div>
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      Pro{" "}
                      <svg
                        className="w-5 h-5 text-primary animate-pulse"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                    </h3>
                    <div className="mt-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-bold text-white">
                          Rp {isYearly ? "959.999" : "1.199.999"}
                        </span>
                        <span className="text-slate-500 font-medium">/mo</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        ~${isYearly ? "57" : "71"} USD
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3 text-sm font-medium text-white">
                      <svg
                        className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>10 users</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-medium text-white">
                      <svg
                        className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>500.000 tokens / month</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-medium text-white">
                      <svg
                        className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Unlimited automation output</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-medium text-white">
                      <svg
                        className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Priority support</span>
                    </li>

                    <li className="flex items-start gap-3 text-sm font-medium text-white">
                      <svg
                        className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Third-party integrations</span>
                    </li>
                  </ul>
                  <a
                    href={`${process.env.NEXT_PUBLIC_APP_URL}/auth?action=signup` || "#"}
                    className="w-full py-4 px-4 rounded-xl bg-primary text-background-dark font-extrabold text-lg hover:bg-cyan-300 transition-colors shadow-[0_0_10px_rgba(0,191,255,0.5),0_0_20px_rgba(0,191,255,0.3)] flex items-center justify-center"
                  >
                    Sign Up
                  </a>
                </div>
              </div>
            </AnimatedSection>

            {/* Enterprise Tier */}
            <AnimatedSection delay={0.3}>
              <div className="group relative bg-surface-dark/40 border border-slate-800 hover:border-slate-700 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-slate-300">Custom</h3>
                  <div className="mt-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-white">
                        Self-hosted
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Contact us for pricing
                    </p>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <svg
                      className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                    <span>Custom RAG tuning</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <svg
                      className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                    <span>SLA guarantees</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <svg
                      className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                    <span>Dedicated account manager</span>
                  </li>
                </ul>
                <a
                  href="mailto:support@maxtest.id"
                  className="w-full py-3 px-4 rounded-xl bg-white text-background-dark font-bold hover:bg-slate-200 transition-colors flex items-center justify-center"
                >
                  Contact Us
                </a>
              </div>
            </AnimatedSection>
          </div>

          {/* FAQ Section */}
          <AnimatedSection className="mt-24 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-white/10 rounded-xl p-6 bg-surface-dark/30"
                >
                  <h3 className="text-lg font-bold text-white mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-slate-400">{faq.answer}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}

const faqs = [
  {
    question: "Can I try Maxtest before paying?",
    answer:
      "Absolutely! Start with our free tier offering 20 test generations per month. No credit card required. Upgrade when you're ready for unlimited testing.",
  },
  {
    question: "What happens if I exceed the free limit?",
    answer:
      "You'll receive a notification when approaching your limit. You can upgrade to Pro anytime for unlimited test generation and automation.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, you can cancel your Pro or Enterprise subscription at any time. Your access continues until the end of your billing period.",
  },
  {
    question: "Do you offer discounts for annual billing?",
    answer:
      "Yes! Save 20% with annual billing on all paid plans. That's 2 months free every year.",
  },
];
