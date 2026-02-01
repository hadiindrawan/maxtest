import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";
import VideoPlayer from "@/components/VideoPlayer";
import CTAButton from "@/components/CTAButton";
import FeatureCard from "@/components/FeatureCard";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background-dark">
      {/* Hero Section */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center pt-16 pb-24 px-4 sm:px-6">
        {/* Background Effects */}
        <div
          className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-grid opacity-[0.07]" />
        </div>

        <div className="max-w-5xl w-full flex flex-col items-center text-center gap-10 relative z-10">
          {/* Badges */}
          <AnimatedSection className="flex flex-wrap justify-center gap-3">
            <div className="flex h-8 items-center justify-center gap-x-2 rounded-full border border-primary/20 bg-primary/5 pl-2 pr-4 backdrop-blur-sm shadow-[0_0_5px_rgba(0,191,255,0.4)]">
              <svg
                className="w-[18px] h-[18px] text-primary"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              <p className="text-primary/90 text-xs font-medium uppercase tracking-wider">
                Powered by Advanced RAG
              </p>
            </div>
            <div className="flex h-8 items-center justify-center gap-x-2 rounded-full border border-primary/20 bg-primary/5 pl-2 pr-4 backdrop-blur-sm shadow-[0_0_5px_rgba(0,191,255,0.4)]">
              <svg
                className="w-[18px] h-[18px] text-primary"
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
              <p className="text-primary/90 text-xs font-medium uppercase tracking-wider">
                Zero Manual Setup
              </p>
            </div>
          </AnimatedSection>

          {/* Hero Text */}
          <AnimatedSection delay={0.1} className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 text-glow">
              AI-Driven Testing for <br />
              <span className="text-white">High-Velocity Teams</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
              Maxtest autonomously generates, maintains, and repairs your
              end-to-end test suite. Ship code faster with zero flake.
            </p>
          </AnimatedSection>

          {/* CTA Buttons */}
          <AnimatedSection
            delay={0.2}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <CTAButton
              href="https://calendly.com/hadiindrawan157"
              variant="primary"
              size="lg"
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              }
            >
              Request Demo
            </CTAButton>
            <CTAButton href="/features" variant="secondary" size="lg">
              How it Works
            </CTAButton>
          </AnimatedSection>

          {/* Video Section */}
          <AnimatedSection
            delay={0.3}
            className="relative mt-12 w-full max-w-[900px]"
          >
            <VideoPlayer />
          </AnimatedSection>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <div className="inline-block px-3 py-1 mb-4 rounded-full border border-primary/20 bg-primary/10">
              <span className="text-primary text-xs font-bold uppercase tracking-widest">
                Platform Capabilities
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
              Why Choose <span className="text-primary">Maxtest AI</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Enterprise-grade testing infrastructure powered by AI
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Testing?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Start for free. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton
                href={`${process.env.NEXT_PUBLIC_APP_URL}/auth?action=signup` || "/pricing"}
                variant="primary"
                size="lg"
              >
                Start Testing Now
              </CTAButton>
              <CTAButton href="/documentation" variant="secondary" size="lg">
                Read Documentation
              </CTAButton>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}

