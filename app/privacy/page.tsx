import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

export const metadata = generateSEOMetadata({
  title: "Privacy Policy",
  description:
    "Learn how Maxtest collects, uses, and protects your personal information. Our commitment to your privacy and data security.",
  path: "/privacy",
});

export default function PrivacyPage() {
  const lastUpdated = "January 22, 2026";

  return (
    <div className="flex flex-col min-h-screen bg-background-dark">
      <section className="relative py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-slate-400">
              Last updated: {lastUpdated}
            </p>
          </div>

          <div className="prose prose-invert prose-slate max-w-none">
            <div className="space-y-8 text-slate-300">
              {/* Introduction */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  1. Introduction
                </h2>
                <p className="leading-relaxed">
                  Maxtest AI Inc. ("we," "our," or "us") is committed to
                  protecting your privacy. This Privacy Policy explains how we
                  collect, use, disclose, and safeguard your information when
                  you use our AI-driven testing platform and website
                  (collectively, the "Service").
                </p>
                <p className="leading-relaxed mt-4">
                  Please read this privacy policy carefully. If you do not agree
                  with the terms of this privacy policy, please do not access
                  the Service.
                </p>
              </section>

              {/* Information We Collect */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  2. Information We Collect
                </h2>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  2.1 Personal Information
                </h3>
                <p className="leading-relaxed">
                  We may collect personal information that you voluntarily
                  provide to us when you:
                </p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>Register for an account</li>
                  <li>Use our Service</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Contact us for support</li>
                  <li>Participate in surveys or promotions</li>
                </ul>
                <p className="leading-relaxed mt-4">
                  This information may include: name, email address, company
                  name, job title, phone number, payment information, and any
                  other information you choose to provide.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  2.2 Automatically Collected Information
                </h3>
                <p className="leading-relaxed">
                  When you access the Service, we may automatically collect:
                </p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Usage data (pages visited, time spent, features used)</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Log data and analytics information</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  2.3 Test Data
                </h3>
                <p className="leading-relaxed">
                  When you use our AI testing platform, we collect:
                </p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>Test cases and scenarios you create</li>
                  <li>Application documentation you upload</li>
                  <li>Test execution results and logs</li>
                  <li>Generated automation scripts</li>
                </ul>
              </section>

              {/* How We Use Your Information */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  3. How We Use Your Information
                </h2>
                <p className="leading-relaxed">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>Provide, maintain, and improve our Service</li>
                  <li>Process transactions and send related information</li>
                  <li>Generate AI-powered test cases and automation</li>
                  <li>Send administrative information and updates</li>
                  <li>Respond to your comments and questions</li>
                  <li>Analyze usage patterns to improve user experience</li>
                  <li>Detect, prevent, and address technical issues</li>
                  <li>Comply with legal obligations</li>
                  <li>Send marketing communications (with your consent)</li>
                </ul>
              </section>

              {/* Data Sharing */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  4. How We Share Your Information
                </h2>
                <p className="leading-relaxed">
                  We may share your information in the following circumstances:
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  4.1 Service Providers
                </h3>
                <p className="leading-relaxed">
                  We may share your information with third-party service
                  providers who perform services on our behalf, such as:
                </p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>Cloud hosting and storage providers</li>
                  <li>AI model providers</li>
                  <li>Payment processors</li>
                  <li>Analytics providers</li>
                  <li>Email service providers</li>
                  <li>Customer support tools</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  4.2 Legal Requirements
                </h3>
                <p className="leading-relaxed">
                  We may disclose your information if required to do so by law or
                  in response to valid requests by public authorities.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  4.3 Business Transfers
                </h3>
                <p className="leading-relaxed">
                  If we are involved in a merger, acquisition, or sale of assets,
                  your information may be transferred as part of that transaction.
                </p>
              </section>

              {/* Data Security */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  5. Data Security
                </h2>
                <p className="leading-relaxed">
                  We implement appropriate technical and organizational security
                  measures to protect your personal information, including:
                </p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and audits</li>
                  <li>Access controls and authentication measures</li>
                  <li>Employee training on data protection</li>
                  <li>Incident response procedures</li>
                </ul>
                <p className="leading-relaxed mt-4">
                  However, no method of transmission over the Internet or
                  electronic storage is 100% secure. While we strive to use
                  commercially acceptable means to protect your information, we
                  cannot guarantee its absolute security.
                </p>
              </section>

              {/* Data Retention */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  6. Data Retention
                </h2>
                <p className="leading-relaxed">
                  We retain your personal information only for as long as
                  necessary to fulfill the purposes outlined in this Privacy
                  Policy, unless a longer retention period is required or
                  permitted by law. When we no longer need your information, we
                  will securely delete or anonymize it.
                </p>
              </section>

              {/* Your Rights */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  7. Your Privacy Rights
                </h2>
                <p className="leading-relaxed">
                  Depending on your location, you may have the following rights:
                </p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li><strong>Access:</strong> Request access to your personal information</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                  <li><strong>Objection:</strong> Object to processing of your personal information</li>
                  <li><strong>Restriction:</strong> Request restriction of processing</li>
                  <li><strong>Withdraw Consent:</strong> Withdraw consent at any time</li>
                </ul>
                <p className="leading-relaxed mt-4">
                  To exercise these rights, please contact us at{" "}
                  <a href="mailto:support@maxtest.id" className="text-primary hover:underline">
                    support@maxtest.id
                  </a>
                </p>
              </section>

              {/* Cookies */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  8. Cookies and Tracking Technologies
                </h2>
                <p className="leading-relaxed">
                  We use cookies and similar tracking technologies to track
                  activity on our Service and store certain information. You can
                  instruct your browser to refuse all cookies or indicate when a
                  cookie is being sent. However, if you do not accept cookies,
                  you may not be able to use some portions of our Service.
                </p>
              </section>

              {/* International Transfers */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  9. International Data Transfers
                </h2>
                <p className="leading-relaxed">
                  Your information may be transferred to and maintained on
                  computers located outside of your state, province, country, or
                  other governmental jurisdiction where data protection laws may
                  differ. We ensure appropriate safeguards are in place for such
                  transfers.
                </p>
              </section>

              {/* Children's Privacy */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  10. Children's Privacy
                </h2>
                <p className="leading-relaxed">
                  Our Service is not intended for individuals under the age of
                  18. We do not knowingly collect personal information from
                  children. If you become aware that a child has provided us with
                  personal information, please contact us.
                </p>
              </section>

              {/* Changes to Policy */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  11. Changes to This Privacy Policy
                </h2>
                <p className="leading-relaxed">
                  We may update our Privacy Policy from time to time. We will
                  notify you of any changes by posting the new Privacy Policy on
                  this page and updating the "Last updated" date. You are advised
                  to review this Privacy Policy periodically for any changes.
                </p>
              </section>

              {/* Contact */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  12. Contact Us
                </h2>
                <p className="leading-relaxed">
                  If you have any questions about this Privacy Policy, please
                  contact us:
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
