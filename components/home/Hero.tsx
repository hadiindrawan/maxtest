import Bubble from "@/components/ui/Bubble";
import Button from "@/components/ui/Button";
import Character from "@/components/ui/Character";
import ResultRow from "@/components/home/ResultRow";
import VideoPlayer from "@/components/VideoPlayer";
import { HERO } from "@/lib/home-content";

type CSSVars = React.CSSProperties & Record<`--${string}`, string>;

export default function Hero({ signupHref }: { signupHref: string }) {
  const typedWidth = `${HERO.prompt.length + 1}ch`;
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 md:pt-20">
      <div className="grid items-end gap-10 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h1 className="font-headline text-4xl font-extrabold leading-[1.02] tracking-tight text-paper sm:text-6xl">
            {HERO.headline[0]}
            <br />
            {HERO.headline[1]}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-paper/70">{HERO.sub}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={signupHref} external={signupHref.startsWith("http")}>
              Start free
            </Button>
            <Button href="/documentation" variant="ghost">
              Read the MCP docs
            </Button>
          </div>
        </div>

        <div className="flex min-w-0 flex-col items-start gap-4 sm:flex-row sm:items-end lg:col-span-6">
          <Character of={{ kind: "max", pose: "main" }} variant="exhaust" height={220} priority className="shrink-0" />
          <div className="w-full min-w-0 space-y-3 sm:flex-1">
            <Bubble className="overflow-hidden">
              <p>
                <span className="text-paper/50">you ›</span>{" "}
                <span
                  className="typed"
                  style={{ "--w": typedWidth, "--steps": String(HERO.prompt.length), "--d": "0.2s" } as CSSVars}
                >
                  {HERO.prompt}
                </span>
              </p>
              {HERO.toolCalls.map((tool, i) => (
                <p key={tool} className="reveal break-all" style={{ "--d": `${1.5 + i * 0.5}s` } as CSSVars}>
                  <span className="text-primary">{tool}</span> ✓
                </p>
              ))}
              <p className="reveal" style={{ "--d": "2.6s" } as CSSVars}>
                {HERO.reply}
              </p>
            </Bubble>
            <div className="reveal" style={{ "--d": "2.9s" } as CSSVars}>
              <ResultRow statuses={HERO.results} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-14 overflow-hidden rounded-xl border-2 border-paper/80 bg-panel shadow-[4px_4px_0_var(--color-primary)]">
        <div className="border-b border-hairline px-4 py-2 font-mono text-xs text-paper/60">demo · launch result</div>
        <VideoPlayer className="rounded-none border-0 shadow-none" />
      </div>
    </section>
  );
}
