import ToolsReference from "@/components/docs/ToolsReference";
import CopyCommand from "@/components/ui/CopyCommand";
import Eyebrow from "@/components/ui/Eyebrow";
import Icon from "@/components/ui/Icon";
import PageHeader from "@/components/ui/PageHeader";
import SectionRail from "@/components/ui/SectionRail";
import { DOCS, DOCS_SECTIONS, GUIDES_COMING, HELP_LINKS, SCOPES } from "@/lib/docs-content";
import { buildConnectCommand } from "@/lib/mcp-command";
import { MCP_TOOLS } from "@/lib/mcp-tools";
import { generateBreadcrumbSchema, generateMetadata as generateSEOMetadata } from "@/lib/seo";

export const metadata = generateSEOMetadata({
  title: "Documentation - Connect Your Agent to Maxtest",
  description:
    "Connect Claude, Cursor or any MCP client to Maxtest: quickstart, tools reference, scopes, approvals and audit.",
  path: "/documentation",
});

const h2 = "font-headline text-2xl font-extrabold tracking-tight text-paper";

export default function DocumentationPage() {
  const connect = buildConnectCommand(process.env.NEXT_PUBLIC_MCP_URL);
  if (!connect.configured) {
    console.warn("[docs] NEXT_PUBLIC_MCP_URL is not set; the quickstart command shows a placeholder host.");
  }
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Documentation", url: "/documentation" },
  ]);

  return (
    <div className="min-h-screen bg-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <PageHeader eyebrow={DOCS.eyebrow} title={DOCS.title} lede={DOCS.lede} />

      <div className="mx-auto grid max-w-6xl items-start gap-8 px-4 pb-20 sm:px-6 lg:grid-cols-[11rem_minmax(0,1fr)]">
        <SectionRail items={DOCS_SECTIONS} ariaLabel="On this page" />

        <div className="space-y-14">
          <section id="quickstart" className="scroll-mt-24">
            <h2 className={h2}>Quickstart</h2>
            <ol className="mt-4 list-decimal space-y-1 pl-5 text-paper/75">
              {DOCS.quickstart.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <div className="mt-4 max-w-3xl">
              <CopyCommand command={connect.command} />
            </div>
            <p className="mt-4 max-w-2xl text-sm text-paper/60">{DOCS.quickstart.oauth}</p>
          </section>

          <section id="tools" className="scroll-mt-24">
            <h2 className={h2}>
              Tools reference <span className="font-mono text-sm font-normal text-paper/45">{MCP_TOOLS.length} tools</span>
            </h2>
            <p className="mb-6 mt-3 max-w-2xl text-paper/70">{DOCS.toolsIntro}</p>
            <ToolsReference />
          </section>

          <section id="scopes" className="scroll-mt-24">
            <h2 className={h2}>Scopes</h2>
            <p className="mt-3 max-w-2xl text-paper/70">
              A token carries scopes. Every call is also checked against the user&apos;s project permissions.
            </p>
            <ul className="mt-4">
              {SCOPES.map((scope) => (
                <li key={scope.name} className="grid gap-1 border-t border-hairline py-2 md:grid-cols-[14rem_1fr] md:gap-4">
                  <code className="font-mono text-[13px] text-primary">{scope.name}</code>
                  <span className="text-sm text-paper/65">{scope.description}</span>
                </li>
              ))}
            </ul>
          </section>

          <section id="approvals" className="scroll-mt-24">
            <h2 className={h2}>Approvals and audit</h2>
            <ul className="mt-4 max-w-2xl space-y-2 text-paper/75">
              {DOCS.approvals.map((line) => (
                <li key={line} className="flex gap-2">
                  <span aria-hidden="true" className="text-primary">
                    ▸
                  </span>
                  {line}
                </li>
              ))}
            </ul>
          </section>

          <section id="guides" className="scroll-mt-24">
            <h2 className={h2}>More guides</h2>
            <ul className="mt-4 max-w-md">
              {GUIDES_COMING.map((guide) => (
                <li key={guide.title} className="flex items-baseline justify-between gap-4 border-t border-hairline py-2 text-paper/75">
                  {guide.title}
                  <Eyebrow className="text-paper/45">Coming soon</Eyebrow>
                </li>
              ))}
            </ul>
          </section>

          <section id="help" className="scroll-mt-24">
            <h2 className={h2}>Get help</h2>
            <ul className="mt-4 space-y-2">
              {HELP_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="inline-flex items-center gap-2 font-bold text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                  >
                    <Icon name={link.icon} />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
