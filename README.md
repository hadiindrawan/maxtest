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
NEXT_PUBLIC_MCP_URL=https://api.maxtest.ai
```

See `.env.example`.

- `NEXT_PUBLIC_SITE_URL`: public URL of this marketing site (metadata, sitemap).
- `NEXT_PUBLIC_APP_URL`: dashboard URL; "Start free" and "Sign in" link here. If unset, signup falls back to `/pricing`.
- `NEXT_PUBLIC_MCP_URL`: public API host serving the MCP endpoint (`/mcp` is appended). If unset, the home page shows a `<your-maxtest-host>` placeholder.

## Design System

The landing page uses a custom design system based on:

- **Colors**: ink background (#0e0e10), lime (#c6f24a) as the only accent
- **Fonts**: Bricolage Grotesque (headlines), Noto Sans (body), monospace for tool calls
- **Characters**: Max the rocket and a cast of role characters (`public/characters`, built by `scripts/build-characters.mjs`)
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
