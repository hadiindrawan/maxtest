# Maxtest Landing Page

Modern, SEO-optimized landing page for Maxtest - AI-Driven Testing Platform.

## Features

- ⚡ **Next.js 14+** with App Router
- 🎨 **Tailwind CSS v4** for styling
- ✨ **Framer Motion** for smooth animations
- 🚀 **SEO Optimized** with meta tags, structured data, and sitemap
- 📱 **Fully Responsive** design
- 🌙 **Dark Theme** with modern aesthetics
- ♿ **Accessible** with semantic HTML

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your configuration
```

### Development

```bash
# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
landingpage/
├── app/                    # Next.js App Router pages
│   ├── features/          # Features page
│   ├── documentation/     # Documentation page
│   ├── pricing/           # Pricing page
│   ├── layout.tsx         # Root layout with SEO
│   ├── page.tsx           # Homepage
│   ├── globals.css        # Global styles & design system
│   ├── sitemap.ts         # Dynamic sitemap
│   └── robots.ts          # Robots.txt configuration
├── components/            # Reusable React components
│   ├── Navbar.tsx         # Navigation component
│   ├── Footer.tsx         # Footer component
│   ├── FeatureCard.tsx    # Feature card component
│   ├── CTAButton.tsx      # CTA button component
│   ├── AnimatedSection.tsx # Scroll animation wrapper
│   └── VideoPlayer.tsx    # Video player component
├── lib/                   # Utility functions
│   ├── utils.ts           # Helper utilities
│   └── seo.ts             # SEO utilities & metadata
└── public/                # Static assets
    └── manifest.json      # PWA manifest
```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_SITE_URL=https://maxtest.ai
NEXT_PUBLIC_APP_URL=https://app.maxtest.ai
```

## Design System

The landing page uses a custom design system based on:

- **Colors**: Neon cyan (#00bfff) primary, dark backgrounds
- **Fonts**: Space Grotesk (display), Noto Sans (body)
- **Effects**: Glassmorphism, neon glows, smooth animations
- **Components**: Modular, reusable React components

## SEO Features

- ✅ Optimized meta tags (title, description, keywords)
- ✅ Open Graph tags for social sharing
- ✅ Twitter Card metadata
- ✅ Structured data (JSON-LD) for rich snippets
- ✅ Dynamic sitemap.xml
- ✅ Robots.txt configuration
- ✅ Semantic HTML structure
- ✅ Fast Core Web Vitals

## Performance

- Lighthouse Score: 90+
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

## License

Proprietary - Maxtest AI Inc.
