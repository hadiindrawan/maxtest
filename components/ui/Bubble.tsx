import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function Bubble({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border-2 border-paper bg-panel p-3 font-mono text-[13px] leading-relaxed text-paper/90 shadow-[3px_3px_0_var(--color-primary)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
