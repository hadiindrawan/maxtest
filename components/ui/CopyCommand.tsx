"use client";

import { useEffect, useRef, useState } from "react";
import Bubble from "@/components/ui/Bubble";
import { copyText, type CopyResult } from "@/lib/clipboard";

/** A command in a bubble with a copy button that fails gracefully and leaves the text selected. */
export default function CopyCommand({ command }: { command: string }) {
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
    <Bubble className="p-4">
      <pre className="overflow-x-auto pb-1 leading-relaxed">
        <code ref={codeRef} className="select-all whitespace-pre">
          {command}
        </code>
      </pre>
      <div className="mt-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onCopy}
          className="h-9 rounded-lg border-2 border-paper bg-primary px-4 font-body text-sm font-bold text-ink shadow-[3px_3px_0_var(--color-primary-dark)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          {status === "copied" ? "Copied" : "Copy command"}
        </button>
        <span role="status" aria-live="polite" className="font-body text-sm text-paper/60">
          {status === "copied" && "Copied to your clipboard."}
          {status === "failed" && "Couldn't copy. The command is selected, press Ctrl+C."}
        </span>
      </div>
    </Bubble>
  );
}
