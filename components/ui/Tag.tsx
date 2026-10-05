import type { ReactNode } from "react";

export default function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-sm bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-ink">
      {children}
    </span>
  );
}
