import type { Metadata } from "next";

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://maxtest.ai";

/**
 * Generate metadata for a page with SEO optimization
 */
export function generateMetadata({
  title,
  description,
  path = "",
  image = "/og-image.png",
}: SEOProps): Metadata {
  const url = `${baseUrl}${path}`;
  const fullTitle = `${title} | Maxtest`;

  return {
    title: fullTitle,
    description,
    keywords: [
      "AI testing",
      "test automation",
      "Playwright",
      "QA automation",
      "test generation",
      "RAG",
      "test management",
      "end-to-end testing",
    ],
    authors: [{ name: "Maxtest AI" }],
    creator: "Maxtest AI",
    publisher: "Maxtest AI",
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: "Maxtest",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
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
  };
}

/**
 * Generate structured data (JSON-LD) for organization
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Maxtest AI",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description:
      "AI-driven testing platform that autonomously generates, maintains, and repairs end-to-end test suites",
    sameAs: [
      "https://twitter.com/maxtestai",
      "https://linkedin.com/company/maxtestai",
    ],
  };
}

/**
 * Generate structured data (JSON-LD) for software application
 */
export function generateSoftwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Maxtest",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "127",
    },
  };
}
