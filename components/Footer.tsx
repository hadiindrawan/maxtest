"use client";

import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const [currentYear] = useState<number>(new Date().getFullYear());

  return (
    <footer className="border-t border-white/5 bg-background-dark py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
        {/* Brand */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-center md:justify-start gap-2 text-white">
            <img
              src="/favicon-img-w.png"
              alt="Maxtest Logo"
              width={24}
              height={24}
              className="w-6 h-6"
            />
            <span className="text-lg font-bold">Maxtest</span>
          </div>
          <p className="text-slate-500 text-sm">
            © {currentYear || new Date().getFullYear()} Maxtest AI Inc. All rights reserved.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-8">
          <Link
            className="text-slate-400 hover:text-primary text-sm transition-colors"
            href="/privacy"
          >
            Privacy Policy
          </Link>
          <Link
            className="text-slate-400 hover:text-primary text-sm transition-colors"
            href="/terms"
          >
            Terms
          </Link>
          <a
            className="text-slate-400 hover:text-primary text-sm transition-colors"
            href="https://linkedin.com/company/maxtestai"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
