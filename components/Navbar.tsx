"use client";

import Link from "next/link";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Character from "@/components/ui/Character";
import { loginUrl, signupUrl } from "@/lib/links";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/features", label: "Product" },
  { href: "/documentation", label: "Docs" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const signup = signupUrl();
  const login = loginUrl();
  const isExternal = (url: string) => url.startsWith("http");

  return (
    <nav className="relative z-50 w-full border-b border-hairline bg-ink">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
          <Character of={{ kind: "max", pose: "idle" }} variant="noexhaust" height={32} decorative />
          <span className="font-headline text-xl font-extrabold tracking-tight">maxtest</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-paper/65 transition-colors hover:text-paper">
              {link.label}
            </Link>
          ))}
          <a href={login} className="text-sm font-bold text-paper hover:text-primary">
            Sign in
          </a>
          <Button href={signup} external={isExternal(signup)} className="h-9">
            Start free
          </Button>
        </div>

        <button
          type="button"
          className="p-2 text-paper md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      <div
        id="mobile-menu"
        inert={!open}
        className={cn(
          "absolute left-0 right-0 top-full overflow-hidden border-b border-hairline bg-ink transition-all duration-200 md:hidden",
          open ? "max-h-96 opacity-100" : "max-h-0 border-b-0 opacity-0",
        )}
      >
        <div className="space-y-1 px-4 py-4">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm font-medium text-paper/70 hover:text-paper"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-3">
            <a href={login} className="flex h-11 flex-1 items-center justify-center rounded-lg border-2 border-hairline text-sm font-bold text-paper">
              Sign in
            </a>
            <Button href={signup} external={isExternal(signup)} className="flex-1">
              Start free
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
