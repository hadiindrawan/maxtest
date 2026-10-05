import Button from "@/components/ui/Button";
import Character from "@/components/ui/Character";
import { FINAL_CTA } from "@/lib/home-content";

export default function FinalCta({ signupHref }: { signupHref: string }) {
  return (
    <section className="mx-auto max-w-6xl border-t border-hairline px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-end gap-8">
        <Character of={{ kind: "max", pose: "smile" }} variant="exhaust" height={170} decorative />
        <div>
          <h2 className="font-headline text-4xl font-extrabold tracking-tight text-paper">{FINAL_CTA.title}</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href={signupHref} external={signupHref.startsWith("http")}>
              Start free
            </Button>
            <Button href="/documentation" variant="ghost">
              Read the MCP docs
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
