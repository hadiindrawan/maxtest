import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Section label: plain mono text. No background, border or radius (design rule 1). */
export default function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-primary", className)}>
      {children}
    </span>
  );
}
