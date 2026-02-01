"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="relative z-50 w-full border-b border-white/10 glass-panel">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-white">
          <img
            src="/favicon-img-w.png"
            alt="Maxtest Logo"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <h2 className="text-white text-lg font-bold tracking-tight">
            Maxtest
          </h2>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            <Link
              className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
              href="/features"
            >
              Features
            </Link>
            <Link
              className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
              href="/documentation"
            >
              Docs
            </Link>
            <Link
              className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
              href="/pricing"
            >
              Pricing
            </Link>
          </div>
          <div className="flex gap-3">
            <a
              href={`${process.env.NEXT_PUBLIC_APP_URL}/auth?action=login` || "#"}
              className="px-4 h-9 flex items-center justify-center text-sm font-bold text-white transition hover:text-primary"
            >
              Sign In
            </a>
            <a
              href={`${process.env.NEXT_PUBLIC_APP_URL}/auth?action=signup` || "#"}
              className="flex items-center justify-center h-9 px-4 bg-primary/10 hover:bg-primary/20 border border-primary/50 text-primary text-sm font-bold rounded transition-all shadow-[0_0_5px_rgba(0,191,255,0.4)] hover:shadow-[0_0_10px_rgba(0,191,255,0.5),0_0_20px_rgba(0,191,255,0.3)]"
            >
              Get Started
            </a>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden absolute top-full left-0 right-0 glass-panel border-t border-white/10 transition-all duration-300 overflow-hidden",
          mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-6 py-4 space-y-4">
          <Link
            className="block text-gray-400 hover:text-white text-sm font-medium transition-colors py-2"
            href="/features"
            onClick={() => setMobileMenuOpen(false)}
          >
            Features
          </Link>
          <Link
            className="block text-gray-400 hover:text-white text-sm font-medium transition-colors py-2"
            href="/documentation"
            onClick={() => setMobileMenuOpen(false)}
          >
            Docs
          </Link>
          <Link
            className="block text-gray-400 hover:text-white text-sm font-medium transition-colors py-2"
            href="/pricing"
            onClick={() => setMobileMenuOpen(false)}
          >
            Pricing
          </Link>
          <div className="pt-4 space-y-3 border-t border-white/10">
            <a
              href={`${process.env.NEXT_PUBLIC_APP_URL}/auth?action=login`}
              className="block w-full px-4 h-10 flex items-center justify-center text-sm font-bold text-white border border-white/20 rounded transition-all hover:border-white/50 hover:bg-white/5"
            >
              Sign In
            </a>
            <a
              href={`${process.env.NEXT_PUBLIC_APP_URL}/auth?action=signup`}
              className="block w-full px-4 h-10 flex items-center justify-center bg-primary/10 hover:bg-primary/20 border border-primary/50 text-primary text-sm font-bold rounded transition-all shadow-[0_0_5px_rgba(0,191,255,0.4)]"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
