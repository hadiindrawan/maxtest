import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

export const metadata = generateSEOMetadata({
  title: "Terms & Conditions",
  description:
    "Read Maxtest's Terms and Conditions. Understand your rights and responsibilities when using our AI-driven testing platform.",
  path: "/terms",
});

export default function TermsPage() {
  const lastUpdated = "January 22, 2026";

  return (
    <div className="flex flex-col min-h-screen bg-background-dark">
      <section className="relative py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Terms & Conditions
            </h1>
            <p className="text-slate-400">
              Last updated: {lastUpdated}
            </p>
          </div>

          <div className="prose prose-invert prose-slate max-w-none">
            <div className="space-y-8 text-slate-300">
              {/* Agreement to Terms */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  1. Agreement to Terms
                </h2>
                <p className="leading-relaxed">
                  These Terms and Conditions ("Terms") constitute a legally
                  binding agreement between you and Maxtest AI Inc. ("Maxtest,"
                  "we," "us," or "our") concerning your access to and use of the
                  Maxtest platform and services (the "Service").
                </p>
                <p className="leading-relaxed mt-4">
                  By accessing or using the Service, you agree to be bound by
                  these Terms. If you do not agree with these Terms, you must not
                  access or use the Service.
                </p>
              </section>

              {/* Use of Service */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  2. Use of Service
                </h2>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  2.1 Eligibility
                </h3>
                <p className="leading-relaxed">
                  You must be at least 18 years old and have the legal capacity
                  to enter into these Terms. By using the Service, you represent
                  and warrant that you meet these requirements.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  2.2 Account Registration
                </h3>
                <p className="leading-relaxed">
                  To access certain features of the Service, you must register
                  for an account. You agree to:
                </p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized access</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  2.3 Acceptable Use
                </h3>
                <p className="leading-relaxed">
                  You agree not to:
                </p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>Use the Service for any illegal purpose or in violation of any laws</li>
                  <li>Interfere with or disrupt the Service or servers</li>
                  <li>Attempt to gain unauthorized access to any part of the Service</li>
                  <li>Use the Service to transmit malware or malicious code</li>
                  <li>Reverse engineer, decompile, or disassemble the Service</li>
                  <li>Use automated tools to access the Service without permission</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe upon the rights of others</li>
                </ul>
              </section>

              {/* Subscription and Payment */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  3. Subscription and Payment
                </h2>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  3.1 Subscription Plans
                </h3>
                <p className="leading-relaxed">
                  We offer various subscription plans, including free and paid
                  tiers. The features, limitations, and pricing of each plan are
                  described on our pricing page.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  3.2 Payment Terms
                </h3>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>Subscription fees are billed in advance on a monthly or annual basis</li>
                  <li>All fees are non-refundable except as required by law</li>
                  <li>You authorize us to charge your payment method automatically</li>
                  <li>Failure to pay may result in suspension or termination of your account</li>
                  <li>We reserve the right to modify pricing with 30 days' notice</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  3.3 Free Trial
                </h3>
                <p className="leading-relaxed">
                  We may offer a free trial period. After the trial period ends,
                  you will be automatically charged unless you cancel before the
                  trial expires.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  3.4 Cancellation
                </h3>
                <p className="leading-relaxed">
                  You may cancel your subscription at any time. Cancellation will
                  take effect at the end of your current billing period. You will
                  not receive a refund for the remainder of your subscription
                  period.
                </p>
              </section>

              {/* Intellectual Property */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  4. Intellectual Property Rights
                </h2>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  4.1 Our Rights
                </h3>
                <p className="leading-relaxed">
                  The Service and its entire contents, features, and
                  functionality are owned by Maxtest and are protected by
                  copyright, trademark, and other intellectual property laws.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  4.2 Your Rights
                </h3>
                <p className="leading-relaxed">
                  You retain all rights to the content you upload to the Service,
                  including test cases, documentation, and data. By using the
                  Service, you grant us a limited license to:
                </p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>Process your content to provide the Service</li>
                  <li>Use aggregated, anonymized data to improve our AI models</li>
                  <li>Display your content as necessary to provide the Service</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  4.3 Generated Content
                </h3>
                <p className="leading-relaxed">
                  You own the test cases and automation scripts generated by our
                  AI. However, we retain the right to the underlying AI models
                  and algorithms.
                </p>
              </section>

              {/* Service Availability */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  5. Service Availability and Modifications
                </h2>
                <p className="leading-relaxed">
                  We strive to provide continuous service availability, but we:
                </p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>Do not guarantee uninterrupted or error-free service</li>
                  <li>May modify, suspend, or discontinue features at any time</li>
                  <li>May perform scheduled maintenance with notice</li>
                  <li>Reserve the right to change these Terms with notice</li>
                </ul>
              </section>

              {/* Data and Privacy */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  6. Data and Privacy
                </h2>
                <p className="leading-relaxed">
                  Your use of the Service is also governed by our Privacy Policy.
                  By using the Service, you consent to our collection and use of
                  your information as described in the Privacy Policy.
                </p>
                <p className="leading-relaxed mt-4">
                  You are responsible for ensuring that any data you upload to
                  the Service complies with applicable laws and does not violate
                  any third-party rights.
                </p>
              </section>

              {/* Warranties and Disclaimers */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  7. Warranties and Disclaimers
                </h2>
                <p className="leading-relaxed uppercase">
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY
                  WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING
                  BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
                  PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                </p>
                <p className="leading-relaxed mt-4">
                  We do not warrant that:
                </p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>The Service will meet your requirements</li>
                  <li>The Service will be uninterrupted, timely, secure, or error-free</li>
                  <li>The results obtained from using the Service will be accurate</li>
                  <li>Any errors in the Service will be corrected</li>
                </ul>
              </section>

              {/* Limitation of Liability */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  8. Limitation of Liability
                </h2>
                <p className="leading-relaxed uppercase">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, MAXTEST SHALL NOT BE
                  LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
                  PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER
                  INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE,
                  GOODWILL, OR OTHER INTANGIBLE LOSSES.
                </p>
                <p className="leading-relaxed mt-4">
                  Our total liability to you for any claims arising from your use
                  of the Service shall not exceed the amount you paid us in the
                  twelve (12) months preceding the claim.
                </p>
              </section>

              {/* Indemnification */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  9. Indemnification
                </h2>
                <p className="leading-relaxed">
                  You agree to indemnify, defend, and hold harmless Maxtest and
                  its officers, directors, employees, and agents from any claims,
                  liabilities, damages, losses, and expenses arising from:
                </p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>Your use of the Service</li>
                  <li>Your violation of these Terms</li>
                  <li>Your violation of any rights of another party</li>
                  <li>Your content or data uploaded to the Service</li>
                </ul>
              </section>

              {/* Termination */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  10. Termination
                </h2>
                <p className="leading-relaxed">
                  We may terminate or suspend your account and access to the
                  Service immediately, without prior notice, for any reason,
                  including if you breach these Terms.
                </p>
                <p className="leading-relaxed mt-4">
                  Upon termination:
                </p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>Your right to use the Service will cease immediately</li>
                  <li>We may delete your account and data</li>
                  <li>You remain liable for all amounts due</li>
                  <li>Sections that should survive termination will continue to apply</li>
                </ul>
              </section>

              {/* Governing Law */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  11. Governing Law and Dispute Resolution
                </h2>
                <p className="leading-relaxed">
                  These Terms shall be governed by and construed in accordance
                  with the laws of [Your Jurisdiction], excluding its conflicts
                  of law provisions.
                </p>
                <p className="leading-relaxed mt-4">
                  Any disputes arising from these Terms or the Service shall be
                  resolved through binding arbitration in accordance with the
                  rules of [Arbitration Organization], except that either party
                  may seek injunctive relief in court.
                </p>
              </section>

              {/* General Provisions */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  12. General Provisions
                </h2>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  12.1 Entire Agreement
                </h3>
                <p className="leading-relaxed">
                  These Terms, together with our Privacy Policy, constitute the
                  entire agreement between you and Maxtest regarding the Service.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  12.2 Severability
                </h3>
                <p className="leading-relaxed">
                  If any provision of these Terms is found to be unenforceable,
                  the remaining provisions will remain in full effect.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  12.3 Waiver
                </h3>
                <p className="leading-relaxed">
                  Our failure to enforce any right or provision of these Terms
                  will not be considered a waiver of those rights.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  12.4 Assignment
                </h3>
                <p className="leading-relaxed">
                  You may not assign or transfer these Terms without our prior
                  written consent. We may assign these Terms without restriction.
                </p>
              </section>

              {/* Contact */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  13. Contact Information
                </h2>
                <p className="leading-relaxed">
                  If you have any questions about these Terms, please contact us:
                </p>
                <ul className="list-none mt-4 space-y-2">
                  <li>Email:{" "}
                    <a href="mailto:support@maxtest.id" className="text-primary hover:underline">
                      support@maxtest.id
                    </a>
                  </li>
                  <li>Address: Maxtest AI Inc., [Your Address]</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
