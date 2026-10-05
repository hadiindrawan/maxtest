"use client";

import { useRef, useState } from "react";
import Bubble from "@/components/ui/Bubble";
import Character from "@/components/ui/Character";
import Tag from "@/components/ui/Tag";
import { CAST, DEFAULT_CAST_ROLE } from "@/lib/home-content";
import { nextTabIndex } from "@/lib/tabs";
import { cn } from "@/lib/utils";

export default function CastSection() {
  const [index, setIndex] = useState(Math.max(0, CAST.findIndex((c) => c.role === DEFAULT_CAST_ROLE)));
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const active = CAST[index];

  function onKeyDown(event: React.KeyboardEvent, current: number) {
    const next = nextTabIndex(current, event.key, CAST.length);
    if (next === null) return;
    event.preventDefault();
    setIndex(next);
    tabs.current[next]?.focus();
  }

  return (
    <section className="mx-auto max-w-6xl border-t border-hairline px-4 py-14 sm:px-6">
      <Tag>Meet the cast</Tag>
      <h2 className="mt-3 font-headline text-3xl font-extrabold tracking-tight text-paper">
        Five jobs, about 40 real tools.
      </h2>

      <div role="tablist" aria-label="What your agent can do" className="mt-8 flex gap-3 overflow-x-auto pb-2">
        {CAST.map((member, i) => (
          <button
            key={member.role}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            id={`cast-tab-${member.role}`}
            role="tab"
            type="button"
            aria-selected={i === index}
            aria-controls="cast-panel"
            tabIndex={i === index ? 0 : -1}
            onClick={() => setIndex(i)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              "flex w-28 shrink-0 flex-col items-center gap-1 rounded-xl border-2 p-2 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary",
              i === index ? "border-primary bg-panel text-paper" : "border-hairline text-paper/60 hover:border-paper/50",
            )}
          >
            <Character of={{ kind: "cast", role: member.role }} variant="noexhaust" height={64} decorative />
            {member.name}
          </button>
        ))}
      </div>

      <div
        key={active.role}
        id="cast-panel"
        role="tabpanel"
        aria-labelledby={`cast-tab-${active.role}`}
        className="reveal mt-6 grid gap-6 lg:grid-cols-12"
      >
        <div className="lg:col-span-5">
          <p className="text-lg text-paper/80">{active.job}</p>
          <ul className="mt-4 space-y-1 font-mono text-[13px] text-paper/70">
            {active.tools.map((tool) => (
              <li key={tool} className="break-all">
                <span className="text-primary">{tool}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="min-w-0 lg:col-span-7">
          <p className="mb-2 text-xs uppercase tracking-[0.12em] text-paper/45">Example</p>
          <Bubble>
            <p>
              <span className="text-paper/50">you ›</span> {active.prompt}
            </p>
            {active.response.map((line) => (
              <p key={line} className="break-words">
                {line}
              </p>
            ))}
          </Bubble>
        </div>
      </div>
    </section>
  );
}
