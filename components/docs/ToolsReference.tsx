import Icon from "@/components/ui/Icon";
import { RISK_GROUPS, toolsByRisk } from "@/lib/mcp-tools";

export default function ToolsReference() {
  return (
    <div className="space-y-10">
      {RISK_GROUPS.map((group) => {
        const tools = toolsByRisk(group.risk);
        return (
          <div key={group.risk}>
            <h3 className="flex flex-wrap items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-paper">
              <Icon name={group.icon} size={16} className="text-primary" />
              {group.label}
              <span className="text-paper/45">· {tools.length} tools · {group.state}</span>
            </h3>
            <ul className="mt-3">
              {tools.map((tool) => (
                <li key={tool.name} className="grid gap-1 border-t border-hairline py-2 md:grid-cols-[minmax(0,19rem)_1fr] md:gap-4">
                  <code className="break-all font-mono text-[13px] text-primary">{tool.name}</code>
                  <span className="text-sm text-paper/65">{tool.description}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
