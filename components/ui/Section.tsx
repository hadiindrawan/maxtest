import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function Section({ id, className, children }: { id?: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={cn("mx-auto max-w-6xl scroll-mt-24 border-t border-hairline px-4 py-12 sm:px-6", className)}>
      {children}
    </section>
  );
}
