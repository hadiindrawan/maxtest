import Bubble from "@/components/ui/Bubble";
import Character from "@/components/ui/Character";
import Icon from "@/components/ui/Icon";
import type { ChapterData } from "@/lib/product-content";

export default function Chapter({ chapter }: { chapter: ChapterData }) {
  return (
    <article id={chapter.id} className="scroll-mt-24 border-t border-hairline py-10 first:border-t-0 first:pt-0">
      <div className="flex items-start gap-5">
        <span
          aria-hidden="true"
          className="font-headline text-6xl font-extrabold leading-none text-transparent [-webkit-text-stroke:1.5px_var(--color-paper)]"
        >
          {chapter.number}
        </span>
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 font-headline text-2xl font-extrabold tracking-tight text-paper">
            <Icon name={chapter.icon} size={20} className="text-primary" />
            {chapter.title}
          </h2>
          <p className="mt-2 max-w-xl leading-relaxed text-paper/70">{chapter.body}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <ul className="space-y-1 font-mono text-[13px] lg:col-span-5">
          {chapter.tools.map((tool) => (
            <li key={tool} className="break-all text-primary">
              {tool}
            </li>
          ))}
        </ul>
        <div className="flex min-w-0 items-end gap-3 lg:col-span-7">
          <Character of={{ kind: "cast", role: chapter.role }} variant="noexhaust" height={84} decorative />
          <Bubble className="min-w-0 flex-1">
            <p>
              <span className="text-paper/50">you ›</span> {chapter.prompt}
            </p>
            {chapter.response.map((line) => (
              <p key={line} className="break-words">
                {line}
              </p>
            ))}
          </Bubble>
        </div>
      </div>
    </article>
  );
}
