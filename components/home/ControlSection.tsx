import Character from "@/components/ui/Character";
import Eyebrow from "@/components/ui/Eyebrow";
import { CONTROL } from "@/lib/home-content";

export default function ControlSection() {
  return (
    <section className="mx-auto max-w-6xl border-t border-hairline px-4 py-14 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="flex items-end gap-4 lg:col-span-5">
          <Character of={{ kind: "cast", role: "guard" }} variant="noexhaust" height={110} decorative />
          <div>
            <Eyebrow>{CONTROL.tag}</Eyebrow>
            <h2 className="mt-3 font-headline text-3xl font-extrabold tracking-tight text-paper">{CONTROL.title}</h2>
          </div>
        </div>
        <ul className="grid gap-6 sm:grid-cols-3 lg:col-span-7">
          {CONTROL.facts.map((fact) => (
            <li key={fact.title} className="border-t-2 border-paper pt-3">
              <h3 className="font-bold text-paper">{fact.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-paper/65">{fact.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
