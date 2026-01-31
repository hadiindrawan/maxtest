import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import AnimatedSection from "@/components/AnimatedSection";
import CTAButton from "@/components/CTAButton";

export const metadata = generateSEOMetadata({
  title: "Documentation - Getting Started with Maxtest",
  description:
    "Learn how to get started with Maxtest AI-driven testing platform. Explore guides, API references, and integration documentation.",
  path: "/documentation",
});

export default function DocumentationPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-dark">
      <section className="relative py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
              Documentation
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed">
              Everything you need to get started with Maxtest and build powerful
              AI-driven tests.
            </p>
          </AnimatedSection>

          {/* Quick Start */}
          <AnimatedSection delay={0.1} className="mb-16">
            <div className="bg-surface-dark border border-white/10 rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl font-bold text-white mb-6">
                Quick Start
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Sign Up
                    </h3>
                    <p className="text-slate-400">
                      Create your free account and access the dashboard.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Create a Project
                    </h3>
                    <p className="text-slate-400">
                      Set up your first testing project with just a few clicks.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Generate Tests
                    </h3>
                    <p className="text-slate-400">
                      Use AI to generate test cases from your requirements or
                      documentation.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Run & Monitor
                    </h3>
                    <p className="text-slate-400">
                      Execute tests and monitor results in real-time with
                      detailed analytics.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Documentation Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {docSections.map((section, index) => (
              <AnimatedSection key={index} delay={0.1 + index * 0.05}>
                <div className="h-full bg-card-dark border border-white/5 rounded-xl p-6 hover:border-primary/20 transition-colors">
                  <div className="mb-4 text-primary text-3xl">{section.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {section.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">
                    {section.description}
                  </p>
                  <a
                    href={section.link}
                    className="text-primary text-sm font-medium hover:underline inline-flex items-center gap-1"
                  >
                    Learn more
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <path
                        d="M9 5l7 7-7 7"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </a>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* CTA */}
          <AnimatedSection className="text-center">
            <div className="bg-gradient-to-br from-primary/10 to-purple/10 border border-primary/20 rounded-2xl p-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Need Help?
              </h2>
              <p className="text-slate-400 mb-8">
                Join our community or contact support for assistance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <CTAButton
                  href="https://discord.gg/hHqVWYgp"
                  variant="primary"
                  size="lg"
                  external
                >
                  Join Discord
                </CTAButton>
                <CTAButton
                  href="mailto:support@maxtest.ai"
                  variant="secondary"
                  size="lg"
                  external
                >
                  Contact Support
                </CTAButton>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}

const docSections = [
  {
    icon: "📚",
    title: "Core Concepts",
    description:
      "Understand the fundamental concepts of AI-driven testing and how Maxtest approaches quality assurance.",
    link: "#",
  },
  {
    icon: "🚀",
    title: "Getting Started",
    description:
      "Step-by-step guide to set up your first project and generate your first test cases.",
    link: "#",
  },
  {
    icon: "🤖",
    title: "AI Test Generation",
    description:
      "Learn how to use AI to automatically generate comprehensive test cases from requirements.",
    link: "#",
  },
  {
    icon: "⚙️",
    title: "API Reference",
    description:
      "Complete API documentation for integrating Maxtest into your workflow programmatically.",
    link: "#",
  },
  {
    icon: "🔗",
    title: "Integrations",
    description:
      "Connect Maxtest with your CI/CD pipeline, Jira, GitHub, and other tools.",
    link: "#",
  },
  {
    icon: "📊",
    title: "Analytics & Reporting",
    description:
      "Understand test analytics, coverage metrics, and generate comprehensive reports.",
    link: "#",
  },
];
