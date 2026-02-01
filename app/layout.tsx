import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  generateOrganizationSchema,
  generateSoftwareApplicationSchema,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    default: "Maxtest - AI-Driven Testing Platform",
    template: "%s | Maxtest AI",
  },
  description:
    "Maxtest autonomously generates, maintains, and repairs your end-to-end test suite with AI-powered RAG intelligence. Ship code faster with zero flake.",
  keywords: [
    "Maxtest AI",
    "TestOps",
    "Autonomous Testing",
    "AI testing",
    "test automation",
    "Playwright",
    "QA automation",
    "test generation",
    "RAG",
    "test management",
    "end-to-end testing",
    "automated testing",
    "quality assurance",
  ],
  authors: [{ name: "Maxtest AI" }],
  creator: "Maxtest AI",
  publisher: "Maxtest AI",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://maxtest.id"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Maxtest",
    title: "Maxtest - AI-Driven Testing Platform",
    description:
      "Maxtest autonomously generates, maintains, and repairs your end-to-end test suite. Ship code faster with zero flake.",
    images: [
      {
        url: "/favicon-img-w.png",
        width: 512,
        height: 512,
        alt: "Maxtest AI-Driven Testing Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maxtest - AI-Driven Testing Platform",
    description:
      "AI-driven testing that autonomously generates, maintains, and repairs your end-to-end test suite.",
    images: ["/favicon-img-w.png"],
    creator: "@maxtestai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = generateOrganizationSchema();
  const softwareSchema = generateSoftwareApplicationSchema();

  return (
    <html lang="en" className="dark">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Noto+Sans:wght@400;500;700&family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&display=swap"
          rel="stylesheet"
        />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(softwareSchema),
          }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

