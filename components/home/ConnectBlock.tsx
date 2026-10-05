"use client";

import { useEffect, useRef, useState } from "react";
import Eyebrow from "@/components/ui/Eyebrow";
import { copyText, type CopyResult } from "@/lib/clipboard";
import { CONNECT } from "@/lib/home-content";

type Props = { command: string; endpoint: string };

export default function ConnectBlock({ command, endpoint }: Props) {
  const [status, setStatus] = useState<CopyResult | "idle">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  async function onCopy() {
    const result = await copyText(command);
    if (result === "failed") {
      // Fall back to a visible selection so Ctrl+C still works.
      const node = codeRef.current;
      if (node) {
        const range = document.createRange();
        range.selectNodeContents(node);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
    setStatus(result);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 2500);
  }

  return (
    <section className="mx-auto max-w-6xl border-t border-hairline px-4 py-14 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Eyebrow>{CONNECT.tag}</Eyebrow>
          <h2 className="mt-3 font-headline text-3xl font-extrabold tracking-tight text-paper">{CONNECT.title}</h2>
          <p className="mt-3 text-paper/70">{CONNECT.body}</p>
          <p className="mt-3 text-sm text-paper/55">
            {CONNECT.oauth} <span className="break-all font-mono text-paper/70">{endpoint}</span>
          </p>
        </div>

        <div className="min-w-0 lg:col-span-7">
          <div className="rounded-xl border-2 border-paper bg-panel p-4 shadow-[3px_3px_0_var(--color-primary)]">
            <pre className="overflow-x-auto pb-1 font-mono text-[13px] leading-relaxed text-paper/90">
              <code ref={codeRef} className="select-all whitespace-pre">
                {command}
              </code>
            </pre>
            <div className="mt-3 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onCopy}
                className="h-9 rounded-lg border-2 border-paper bg-primary px-4 text-sm font-bold text-ink shadow-[2px_2px_0_var(--color-primary-dark)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                {status === "copied" ? "Copied" : "Copy command"}
              </button>
              <span role="status" aria-live="polite" className="text-sm text-paper/60">
                {status === "copied" && "Copied to your clipboard."}
                {status === "failed" && "Couldn't copy. The command is selected, press Ctrl+C."}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
