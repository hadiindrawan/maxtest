"use client";

import { useEffect, useState } from "react";
import { pickActiveId } from "@/lib/rail";
import { cn } from "@/lib/utils";

export type RailItem = { id: string; label: string; number?: string };

/** Sticky rail on large screens, a horizontal anchor list on small ones. The first item is active until the page scrolls. */
export default function SectionRail({ items, ariaLabel }: { items: readonly RailItem[]; ariaLabel: string }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const order = items.map((item) => item.id);
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        setActive((previous) => pickActiveId(order, visible, previous));
      },
      { rootMargin: "-20% 0px -60% 0px" },
    );
    for (const id of order) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label={ariaLabel} className="lg:sticky lg:top-24">
      <ul className="flex gap-5 overflow-x-auto pb-2 font-mono text-xs lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <li key={item.id} className="shrink-0">
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "block border-b-2 py-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:border-b-0 lg:border-l-2 lg:pl-3",
                  isActive ? "border-primary text-primary" : "border-transparent text-paper/55 hover:text-paper",
                )}
              >
                {item.number && <span className="mr-2 text-paper/40">{item.number}</span>}
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
