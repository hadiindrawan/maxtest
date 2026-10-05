import type { ReactNode } from "react";
import Eyebrow from "@/components/ui/Eyebrow";

type Props = { eyebrow: string; title: string; lede?: string; children?: ReactNode };

export default function PageHeader({ eyebrow, title, lede, children }: Props) {
  return (
    <header className="mx-auto max-w-6xl px-4 pb-10 pt-14 sm:px-6 md:pt-20">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="mt-3 max-w-3xl font-headline text-4xl font-extrabold leading-[1.05] tracking-tight text-paper sm:text-5xl">
        {title}
      </h1>
      {lede && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-paper/70">{lede}</p>}
      {children}
    </header>
  );
}
