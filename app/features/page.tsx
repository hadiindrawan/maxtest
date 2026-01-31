import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import AnimatedSection from "@/components/AnimatedSection";
import FeatureCard from "@/components/FeatureCard";
import CTAButton from "@/components/CTAButton";

export const metadata = generateSEOMetadata({
  title: "Features - AI-Powered Testing Platform",
  description:
    "Discover how Maxtest's AI test generation, RAG intelligence, and automation capabilities transform your testing workflow with unprecedented speed and accuracy.",
  path: "/features",
});

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-dark">
      {/* Hero Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6">
        <div className="fixed inset-0 pointer-events-none bg-grid opacity-10 z-0" />

        <div className="max-w-7xl mx-auto relative z-10">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-3 py-1 mb-4 rounded-full border border-primary/20 bg-primary/10">
              <span className="text-primary text-xs font-bold uppercase tracking-widest">
                Platform Capabilities
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">
              Architecture of <span className="text-primary">Intelligence</span>
            </h1>
            <p className="text-lg text-slate-400 font-normal leading-relaxed">
              A distinctive approach to quality assurance powered by
              context-aware models and adaptive execution engines.
            </p>
          </AnimatedSection>

          {/* Main Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-16">
            <AnimatedSection delay={0.1}>
              <FeatureCard
                icon={
                  <svg fill="none" viewBox="0 0 24 24" className="w-8 h-8">
                    <path
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                }
                title="AI Test Case Generator"
                description="Instantly convert raw requirements into comprehensive, structured test steps using advanced NLP models trained on QA best practices."
                accentColor="cyan"
              />
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <FeatureCard
                icon={
                  <svg fill="none" viewBox="0 0 24 24" className="w-8 h-8">
                    <path
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                }
                title="RAG Intelligence System"
                description="Context-aware testing that learns from your documentation, Jira tickets, and previous builds to provide smarter coverage and self-healing."
                accentColor="purple"
              />
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <FeatureCard
                icon={
                  <svg fill="none" viewBox="0 0 24 24" className="w-8 h-8">
                    <path
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                }
                title="Automation Generator"
                description="Zero-to-code execution. Generate reliable, idempotent Playwright scripts directly from natural language prompts."
                accentColor="blue"
              />
            </AnimatedSection>
          </div>

          {/* Additional Features */}
          <AnimatedSection className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
              Complete Testing Ecosystem
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {additionalFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-4 p-6 rounded-xl border border-border-dark bg-[#0f1f24]/50 hover:bg-[#0f1f24] transition-colors"
                >
                  <span className="text-primary text-[28px]">{feature.icon}</span>
                  <h2 className="text-white text-lg font-bold">
                    {feature.title}
                  </h2>
                  <p className="text-[#8dbece] text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* CTA Section */}
          <AnimatedSection className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Try Maxtest Today
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Experience AI-driven testing with our free tier
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton
                href={process.env.NEXT_PUBLIC_APP_URL || "/pricing"}
                variant="primary"
                size="lg"
              >
                Get Started Free
              </CTAButton>
              <CTAButton href="/documentation" variant="secondary" size="lg">
                View Documentation
              </CTAButton>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}

const additionalFeatures = [
  {
    icon: "🔄",
    title: "Smart Selectors",
    description:
      "Resilient CSS selectors identified via AI context that adapt to UI changes.",
  },
  {
    icon: "⚡",
    title: "Instant Refactoring",
    description:
      "Update test steps and code stays perfectly in sync automatically.",
  },
  {
    icon: "✨",
    title: "Auto-Heal",
    description:
      "Logic that adapts to UI changes without breaking your test suite.",
  },
  {
    icon: "📊",
    title: "Test Analytics",
    description:
      "Comprehensive dashboards and insights into test performance and coverage.",
  },
  {
    icon: "🔗",
    title: "CI/CD Integration",
    description:
      "Seamlessly integrate with GitHub Actions, Jenkins, and other CI/CD tools.",
  },
  {
    icon: "🎯",
    title: "Smart Test Plans",
    description:
      "Organize and execute tests with intelligent test planning and launch management.",
  },
];
