import Image from "next/image";
import Eyebrow from "@/components/ui/Eyebrow";
import { DASHBOARD } from "@/lib/home-content";

/** Pass `screenshotSrc` once the owner supplies a screenshot; until then a labeled placeholder shows. */
export default function DashboardSection({ screenshotSrc }: { screenshotSrc?: string }) {
  return (
    <section className="mx-auto max-w-6xl border-t border-hairline px-4 py-14 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Eyebrow>{DASHBOARD.tag}</Eyebrow>
          <h2 className="mt-3 font-headline text-3xl font-extrabold tracking-tight text-paper">{DASHBOARD.title}</h2>
          <ul className="mt-5 space-y-2 text-paper/75">
            {DASHBOARD.items.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden="true" className="text-primary">
                  ▸
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-7">
          <div className="overflow-hidden rounded-xl border-2 border-paper/80 bg-panel">
            {screenshotSrc ? (
              <Image src={screenshotSrc} alt="The Maxtest dashboard" width={1600} height={1000} className="h-auto w-full" />
            ) : (
              <div className="flex aspect-[16/10] items-center justify-center font-mono text-sm text-paper/40">
                Screenshot coming
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
