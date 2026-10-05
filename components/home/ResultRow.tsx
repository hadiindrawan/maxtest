import Character from "@/components/ui/Character";
import { summarizeResults, type ResultStatus } from "@/lib/home-content";

export default function ResultRow({ statuses }: { statuses: readonly ResultStatus[] }) {
  return (
    <div role="img" aria-label={summarizeResults(statuses)} className="flex items-end gap-1">
      {statuses.map((status, i) => (
        <span
          key={i}
          className={status === "fail" ? "wobble-once" : undefined}
          style={status === "fail" ? ({ "--d": `${2.6 + i * 0.05}s` } as React.CSSProperties) : undefined}
        >
          <Character of={{ kind: "cast", role: status }} variant="noexhaust" height={38} decorative />
        </span>
      ))}
    </div>
  );
}
