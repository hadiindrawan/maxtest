import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  /** Render a plain <a> (other origin or full navigation) instead of next/link. */
  external?: boolean;
  className?: string;
};

const base =
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg border-2 border-paper px-5 text-sm font-bold transition-transform duration-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";

const variants = {
  primary:
    "bg-primary text-ink shadow-[3px_3px_0_var(--color-primary-dark)] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0_var(--color-primary-dark)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
  ghost: "bg-transparent text-paper hover:bg-paper/10",
};

export default function Button({ href, children, variant = "primary", external = false, className }: Props) {
  const classes = cn(base, variants[variant], className);
  if (external) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
