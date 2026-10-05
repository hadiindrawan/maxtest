import CopyCommand from "@/components/ui/CopyCommand";
import Eyebrow from "@/components/ui/Eyebrow";
import { CONNECT } from "@/lib/home-content";

type Props = { command: string; endpoint: string };

export default function ConnectBlock({ command, endpoint }: Props) {
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
          <CopyCommand command={command} />
        </div>
      </div>
    </section>
  );
}
