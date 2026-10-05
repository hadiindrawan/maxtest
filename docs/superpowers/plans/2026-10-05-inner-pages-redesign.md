# Inner Pages Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign Product (`/features`), Pricing (`/pricing`), Documentation (`/documentation`) and Blog (`/blog`, `/blog/[slug]`) in the ink/lime/rocket system, obeying the owner's four design rules, with a test that pins those rules.

**Architecture:** Shared primitives first (`Eyebrow`, `Icon` over Lucide, `PageHeader`, `Section`, `SectionRail`), then a design-rules test that each page task opts into (RED when the page is added to the list, GREEN after the rewrite), then one task per page. Page content lives in pure `lib/` modules with `node:test` tests (tools snapshot, product chapters, pricing ledger, docs content, blog read time). The last tasks delete the legacy components and CSS and run the end-to-end checks.

**Tech Stack:** Next.js 16, React 19, Tailwind v4, `lucide-react` (new), Node's built-in test runner (as set up by the home-page plan).

**Spec:** `docs/superpowers/specs/2026-10-05-inner-pages-redesign-design.md` (builds on `docs/superpowers/specs/2026-10-05-landing-redesign-design.md`)

## Global Constraints

Every task's requirements implicitly include these:

- **Rule 1, no notch/pill badges.** Section labels use `Eyebrow`: plain mono uppercase text, no background, border or radius.
- **Rule 2, no bordered card grids.** Content is chapters, ledgers, reference lists and editorial rows separated by hairlines (`border-hairline`). The only boxed surfaces are the shared `Bubble` and the video/screenshot frame.
- **Rule 3, no emoji.** Icons are Lucide through `components/ui/Icon.tsx` only, monochrome: `currentColor` (white on dark, black on lime), lime only for an active or accent state. This includes the blog post body (4 emoji list markers).
- **Rule 4, one shadow system.** Only `shadow-[3px_3px_0_var(--color-primary-dark)]` (lime buttons) and `shadow-[3px_3px_0_var(--color-primary)]` (bubbles). No glows, no blurs, no `rgba(` shadows, no gradients, no `glass-panel`.
- Colors: background `#0e0e10` (`bg-ink`), panel `#17171a` (`bg-panel`), hairline `#2e2e34`, text `#f2f2ee` (`text-paper`), accent lime `#c6f24a` (`text-primary`/`bg-primary`), dark lime `#6d8a1f` (`primary-dark`).
- Type: Bricolage Grotesque 800 for headlines (`font-headline font-extrabold`), Noto Sans body, monospace for tool names and code, Merriweather (`font-serif`) only for blog post body text.
- Signup always goes through `signupUrl()` from `lib/links.ts`. Never use a raw `NEXT_PUBLIC_APP_URL` template string.
- The MCP endpoint comes only from `NEXT_PUBLIC_MCP_URL` through `buildConnectCommand`.
- Copy rules from the home spec apply to all new content: no phrase from `BANNED_PHRASES` in `lib/home-content.ts` ("zero flake", "zero manual setup", "self-heal", "enterprise-grade", "advanced rag", "no credit card"). Tool names must exist in `lib/mcp-tools.ts`.
- Runner minutes count runs on Maxtest's runner only; results pushed in from the user's own CI or machine are unmetered (owner-provided wording, shown under the row and in the FAQ). Pricing meter values are visible placeholders written `[300]` (square brackets, dashed lime underline when rendered). Prices keep today's values: Free Rp 0; Pro Rp 1.199.999 monthly / Rp 959.999 yearly (about $71 / $57 USD); third plan "Team" with "Talk to us".
- Motion: only existing `.reveal` and `AnimatedSection` fades; nothing animates under `prefers-reduced-motion`.
- 360px to 1440px with no horizontal page scroll. One `h1` per page. Lime focus rings.
- Do not touch the home page except swapping `Tag` for `Eyebrow`. Do not touch the backend. Do not rewrite blog post prose.
- `npm run lint` must not add errors beyond the existing baseline (28 errors, all in `app/blog/[slug]`-era files that this plan rewrites or in `app/privacy`, `app/terms`, `lib/blog-data.ts`); the count may only go down.

## Review Focus

The spec is silent on these; each has a test or check in the named task:

1. The rails must not break without `IntersectionObserver` (old browsers, tests) or when no section is visible: the first item stays active and nothing throws (Task 3, `lib/rail.ts` tests and the `typeof IntersectionObserver` guard).
2. Pricing placeholders must be findable and must not look final: every meter cell for Free and Pro is bracketed, and the rendered HTML must contain them (Task 5 tests, Task 9 HTML check).
3. Blog post HTML is injected raw: long code lines and long words must scroll or wrap inside the 65-character column at 360px, and the post must contain no emoji (Task 7).
4. The pricing toggle and FAQ must work by keyboard, and the ledger must stay readable at 360px as stacked plans (Task 5, Task 9 manual pass).
5. The tools reference must not drift from what other pages claim: counts per risk class are pinned, and every tool named on the home, product or docs pages must exist in the snapshot (Tasks 2, 3, 4, 6).

Also covered: `NEXT_PUBLIC_MCP_URL` unset on `/documentation` (placeholder shown, no crash) in Task 9, and FAQ JSON-LD still valid on `/pricing` in Task 9.

## File Structure

```
package.json / package-lock.json     MOD  lucide-react
components/ui/Eyebrow.tsx            NEW  replaces Tag
components/ui/Icon.tsx               NEW  typed Lucide wrapper
components/ui/PageHeader.tsx         NEW
components/ui/Section.tsx            NEW
components/ui/SectionRail.tsx        NEW  sticky chapter / contents rail (client)
components/ui/CopyCommand.tsx        NEW  extracted from ConnectBlock
components/ui/Tag.tsx                DEL
components/home/{ConnectBlock,CastSection,ControlSection,DashboardSection}.tsx   MOD  Tag -> Eyebrow
lib/design-rules.ts (+ .test.ts)     NEW  the four rules as code + the list of compliant files
lib/rail.ts (+ .test.ts)             NEW  pickActiveId
lib/mcp-tools.ts (+ .test.ts)        NEW  snapshot of the 41 backend tools
lib/product-content.ts (+ .test.ts)  NEW  chapters + platform items
lib/pricing.ts (+ .test.ts)          NEW  plans, rows, FAQ
lib/docs-content.ts (+ .test.ts)     NEW  scopes, guides, help links, intro copy
lib/blog.ts (+ .test.ts)             NEW  readMinutes, formatReadTime
lib/blog-data.ts                     MOD  drop readingTime, drop emoji, cover image class
components/product/{Chapter}.tsx     NEW
components/pricing/{PricingLedger,Faq}.tsx   NEW
components/docs/ToolsReference.tsx   NEW
app/features/page.tsx                REWRITE
app/pricing/page.tsx                 REWRITE (server page + metadata + JSON-LD)
app/documentation/page.tsx           REWRITE
app/blog/page.tsx                    REWRITE
app/blog/[slug]/page.tsx             REWRITE
components/{FeatureCard,CTAButton}.tsx   DEL (when unused)
app/globals.css                      MOD  delete unused glow/glass/grid utilities and neon tokens
```

Node note: in a non-interactive shell run `source ~/.nvm/nvm.sh` (or `export PATH="$HOME/.nvm/versions/node/v24.21.0/bin:$PATH"`) before `node`/`npm`.

---

### Task 1: Branch, Lucide, shared primitives, Tag becomes Eyebrow

**Files:**
- Modify: `package.json`, `package-lock.json`, `components/home/ConnectBlock.tsx`, `components/home/CastSection.tsx`, `components/home/ControlSection.tsx`, `components/home/DashboardSection.tsx`
- Create: `components/ui/Eyebrow.tsx`, `components/ui/Icon.tsx`, `components/ui/PageHeader.tsx`, `components/ui/Section.tsx`
- Delete: `components/ui/Tag.tsx`

**Interfaces:**
- Produces: `<Eyebrow className?>`; `<Icon name size? label? className? />` with `IconName` and `ICON_NAMES`; `<PageHeader eyebrow title lede? children? />`; `<Section id? className?>`.

- [ ] **Step 1: Create the branch and commit the spec and plan**

```bash
cd /home/hadi/personal/maxtest
git switch feat/landing-redesign
git switch -c feat/inner-pages-redesign
git add docs/superpowers/specs/2026-10-05-inner-pages-redesign-design.md docs/superpowers/plans/2026-10-05-inner-pages-redesign.md
git commit -m "docs: add inner pages redesign spec and plan"
```

- [ ] **Step 2: Install Lucide**

```bash
npm install lucide-react
```

Expected: `lucide-react` appears in `dependencies`.

- [ ] **Step 3: Create `components/ui/Eyebrow.tsx`**

```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Section label: plain mono text. No background, border or radius (design rule 1). */
export default function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-primary", className)}>
      {children}
    </span>
  );
}
```

- [ ] **Step 4: Create `components/ui/Icon.tsx`**

```tsx
import {
  ArrowRight,
  Check,
  ChartColumn,
  Copy,
  Eye,
  FileText,
  ListChecks,
  Mail,
  MessageCircle,
  Minus,
  Pencil,
  Play,
  Plug,
  Plus,
  Search,
  Trash2,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS = {
  "arrow-right": ArrowRight,
  check: Check,
  "chart-column": ChartColumn,
  copy: Copy,
  eye: Eye,
  "file-text": FileText,
  "list-checks": ListChecks,
  mail: Mail,
  "message-circle": MessageCircle,
  minus: Minus,
  pencil: Pencil,
  play: Play,
  plug: Plug,
  plus: Plus,
  search: Search,
  "trash-2": Trash2,
  wrench: Wrench,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;
export const ICON_NAMES = Object.keys(ICONS) as IconName[];

type Props = {
  name: IconName;
  size?: number;
  /** Give the icon an accessible name only when it carries meaning on its own; otherwise it is hidden from assistive tech. */
  label?: string;
  className?: string;
};

/** The only way pages use icons: monochrome Lucide in `currentColor` (design rule 3). */
export default function Icon({ name, size = 16, label, className }: Props) {
  const Cmp = ICONS[name];
  return (
    <Cmp
      width={size}
      height={size}
      strokeWidth={2}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
      className={cn("shrink-0", className)}
    />
  );
}
```

- [ ] **Step 5: Create `components/ui/PageHeader.tsx` and `components/ui/Section.tsx`**

`PageHeader.tsx`:

```tsx
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
```

`Section.tsx`:

```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function Section({ id, className, children }: { id?: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={cn("mx-auto max-w-6xl scroll-mt-24 border-t border-hairline px-4 py-12 sm:px-6", className)}>
      {children}
    </section>
  );
}
```

- [ ] **Step 6: Swap `Tag` for `Eyebrow` on the home page and delete `Tag`**

```bash
for f in components/home/ConnectBlock.tsx components/home/CastSection.tsx components/home/ControlSection.tsx components/home/DashboardSection.tsx; do
  sed -i 's#import Tag from "@/components/ui/Tag";#import Eyebrow from "@/components/ui/Eyebrow";#; s#<Tag>#<Eyebrow>#g; s#</Tag>#</Eyebrow>#g' "$f"
done
grep -rn "ui/Tag\|<Tag" app components | head
git rm components/ui/Tag.tsx
```

Expected: the `grep` prints nothing.

- [ ] **Step 7: Verify and commit**

```bash
npx tsc --noEmit && npm test && npm run build
git add package.json package-lock.json components
git commit -m "feat: add Lucide icon wrapper, Eyebrow, PageHeader, Section; replace Tag"
```

Expected: no type errors (if `ChartColumn` is not exported by the installed Lucide, import `BarChart3` instead and keep the key `"chart-column"`), 31 tests pass, build succeeds.

---

### Task 2: Design-rules module and test

**Files:**
- Create: `lib/design-rules.ts`, `lib/design-rules.test.ts`

**Interfaces:**
- Produces: `violations(source: string): string[]` (each entry like `no emoji: 🚀`), `RULE_NAMES`.
- The test file owns `COMPLIANT_FILES: string[]`. Later page tasks add their files to it **before** rewriting them (RED), then rewrite until GREEN.

- [ ] **Step 1: Write the failing test**

Create `lib/design-rules.test.ts`:

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { violations } from "./design-rules.ts";

const root = path.resolve(import.meta.dirname, "..");

/** Files that must obey the owner's four design rules. Each page task appends its files here before rewriting them. */
const COMPLIANT_FILES: string[] = [
  "components/ui/Eyebrow.tsx",
  "components/ui/Icon.tsx",
  "components/ui/PageHeader.tsx",
  "components/ui/Section.tsx",
];

test("the rules catch each kind of violation", () => {
  assert.ok(violations("<p>🚀 fast</p>").some((v) => v.startsWith("no emoji")));
  assert.ok(violations('<span className="rounded-full border px-3">x</span>').some((v) => v.startsWith("no pills")));
  assert.ok(violations('<div className="rounded-xl border p-6">x</div>').some((v) => v.startsWith("no pills")));
  assert.ok(violations('<div className="bg-gradient-to-br">x</div>').some((v) => v.startsWith("no gradients")));
  assert.ok(violations('<div className="shadow-lg">x</div>').some((v) => v.startsWith("no soft shadows")));
  assert.ok(violations('<div className="shadow-[0_0_30px_-5px_rgba(0,191,255,0.6)]">x</div>').length > 0);
  assert.ok(violations('import FeatureCard from "@/components/FeatureCard";').some((v) => v.startsWith("no legacy")));
});

test("the hard offset shadow is the only allowed custom shadow", () => {
  assert.deepEqual(violations('<div className="shadow-[3px_3px_0_var(--color-primary)]">x</div>'), []);
  assert.deepEqual(violations('<a className="shadow-[3px_3px_0_var(--color-primary-dark)]">x</a>'), []);
  assert.ok(violations('<a className="shadow-[4px_4px_0_red]">x</a>').length > 0);
});

test("typographic symbols used by the site are not mistaken for emoji", () => {
  assert.deepEqual(violations("<p>Read → more ▸ list › item</p>"), []);
});

for (const file of COMPLIANT_FILES) {
  test(`${file} obeys the four design rules`, () => {
    const found = violations(readFileSync(path.join(root, file), "utf8"));
    assert.deepEqual(found, []);
  });
}
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test`
Expected: FAIL, `Cannot find module './design-rules.ts'`.

- [ ] **Step 3: Implement `lib/design-rules.ts`**

```ts
export const RULE_NAMES = [
  "no emoji",
  "no pills or card radii",
  "no gradients, glass or glow",
  "no soft shadows",
  "only the hard offset shadow",
  "no legacy card or badge components",
] as const;

const HARD_OFFSET = /^shadow-\[\d+px_\d+px_0_var\(--color-primary(-dark)?\)\]$/;

/** Returns one entry per breach of the owner's four design rules found in a source file. */
export function violations(source: string): string[] {
  const out: string[] = [];
  const add = (rule: (typeof RULE_NAMES)[number], hits: string[]) => hits.forEach((h) => out.push(`${rule}: ${h}`));

  add("no emoji", [...source.matchAll(/\p{Extended_Pictographic}/gu)].map((m) => m[0]));
  add("no pills or card radii", source.match(/rounded-(full|xl|2xl|3xl)\b/g) ?? []);
  add("no gradients, glass or glow", source.match(/bg-gradient|text-glow|glass-panel|bg-grid|backdrop-blur|drop-shadow|neon|\bblur-/g) ?? []);
  add("no soft shadows", [...(source.match(/shadow-(sm|md|lg|xl|2xl|inner)\b/g) ?? []), ...(source.match(/rgba\(/g) ?? [])]);
  add("only the hard offset shadow", (source.match(/shadow-\[[^\]]*\]/g) ?? []).filter((m) => !HARD_OFFSET.test(m)));
  add("no legacy card or badge components", source.match(/FeatureCard|CTAButton|components\/ui\/Tag/g) ?? []);
  return out;
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test`
Expected: PASS (the four new UI files comply). If the "typographic symbols" test fails because a symbol is classed as emoji, narrow the emoji regex in `violations` to `/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu` minus `✓`, and re-run.

- [ ] **Step 5: Commit**

```bash
git add lib/design-rules.ts lib/design-rules.test.ts
git commit -m "test: pin the four design rules as code"
```

---

### Task 3: Tools snapshot and the section rail

**Files:**
- Create: `lib/mcp-tools.ts`, `lib/mcp-tools.test.ts`, `lib/rail.ts`, `lib/rail.test.ts`, `components/ui/SectionRail.tsx`
- Modify: `lib/design-rules.test.ts` (add `components/ui/SectionRail.tsx`)

**Interfaces:**
- Produces: `RiskClass = "read" | "write" | "execution" | "destructive"`; `McpTool = { name: string; risk: RiskClass; title: string; description: string }`; `MCP_TOOLS: McpTool[]`; `RISK_GROUPS: { risk; label; icon: "eye" | "pencil" | "play" | "trash-2"; state: string }[]`; `toolsByRisk(risk)`; `pickActiveId(order, visible, previous)`; `<SectionRail items ariaLabel />` with `RailItem = { id; label; number? }`.

- [ ] **Step 1: Write the failing tests for the snapshot**

Create `lib/mcp-tools.test.ts`:

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { CAST, HERO } from "./home-content.ts";
import { MCP_TOOLS, RISK_GROUPS, toolsByRisk } from "./mcp-tools.ts";

test("the snapshot has 41 uniquely named tools", () => {
  assert.equal(MCP_TOOLS.length, 41);
  assert.equal(new Set(MCP_TOOLS.map((t) => t.name)).size, 41);
  for (const t of MCP_TOOLS) assert.match(t.name, /^maxtest_[a-z_]+$/, t.name);
});

test("risk class counts match the backend registry", () => {
  assert.equal(toolsByRisk("read").length, 21);
  assert.equal(toolsByRisk("write").length, 16);
  assert.equal(toolsByRisk("execution").length, 2);
  assert.equal(toolsByRisk("destructive").length, 2);
});

test("every tool has a short one-line description", () => {
  for (const t of MCP_TOOLS) {
    assert.ok(t.description.length >= 10 && t.description.length <= 90, `${t.name}: ${t.description.length}`);
    assert.ok(!t.description.includes("\n"));
  }
});

test("every risk group is described and non-empty", () => {
  assert.deepEqual(RISK_GROUPS.map((g) => g.risk), ["read", "write", "execution", "destructive"]);
  for (const g of RISK_GROUPS) assert.ok(toolsByRisk(g.risk).length > 0 && g.state.length > 5);
});

test("tools named on the home page exist in the snapshot", () => {
  const known = new Set(MCP_TOOLS.map((t) => t.name));
  for (const name of [...CAST.flatMap((c) => c.tools), ...HERO.toolCalls]) assert.ok(known.has(name), name);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test`
Expected: FAIL, `Cannot find module './mcp-tools.ts'`.

- [ ] **Step 3: Implement `lib/mcp-tools.ts`**

```ts
/**
 * Snapshot of the Maxtest MCP tool registry.
 * Source: akewops-be/app/mcp/tools/*.py (register_spec calls), taken 2026-10-05, 41 tools.
 * Descriptions are written for this site, not copied from the backend. When the backend adds or
 * renames a tool, update this file; the tests pin the counts so drift is noticed.
 * The backend also defines an "external" risk class and scope, but no tool uses it today.
 */
export type RiskClass = "read" | "write" | "execution" | "destructive";

export interface McpTool {
  name: string;
  risk: RiskClass;
  title: string;
  description: string;
}

const t = (risk: RiskClass, name: string, title: string, description: string): McpTool => ({ name, risk, title, description });

export const MCP_TOOLS: McpTool[] = [
  t("read", "maxtest_find_suite", "Find suite by name", "Find a test suite by name."),
  t("read", "maxtest_get_execution", "Get execution", "Get one execution with its status and results."),
  t("read", "maxtest_get_jira_issue", "Get Jira issue", "Read a Jira issue to use as test context."),
  t("read", "maxtest_get_report", "Get report", "Get one detailed test report."),
  t("read", "maxtest_get_test_case", "Get test case", "Get one test case with its steps."),
  t("read", "maxtest_get_test_execution", "Get test execution", "Get one test-case execution result in detail."),
  t("read", "maxtest_get_test_launch", "Get test launch", "Get one launch with its status."),
  t("read", "maxtest_get_test_plan", "Get test plan", "Get one test plan."),
  t("read", "maxtest_list_launch_executions", "List launch executions", "List the executions inside a launch."),
  t("read", "maxtest_list_projects", "List projects", "List the projects you are a member of."),
  t("read", "maxtest_list_reports", "List reports", "List test reports."),
  t("read", "maxtest_list_test_cases_by_suite", "List test cases in a suite", "List the test cases in a suite."),
  t("read", "maxtest_list_test_launches", "List test launches", "List test launches."),
  t("read", "maxtest_list_test_plans", "List test plans", "List test plans."),
  t("read", "maxtest_list_test_suites", "List test suites", "List test suites."),
  t("read", "maxtest_search_execution_history", "Search execution history", "Find past test-case results by meaning, failures first."),
  t("read", "maxtest_search_executions", "Search executions", "Search executions."),
  t("read", "maxtest_search_reports", "Search reports", "Search reports."),
  t("read", "maxtest_search_test_cases", "Search test cases", "Search test cases."),
  t("read", "maxtest_search_test_launches", "Search test launches", "Search test launches."),
  t("read", "maxtest_search_test_plans", "Search test plans", "Search test plans."),
  t("write", "maxtest_attach_to_execution", "Attach evidence to an execution", "Attach screenshots, logs or HAR files to an execution."),
  t("write", "maxtest_create_attachment_upload", "Create an attachment upload URL", "Get an upload URL for an attachment."),
  t("write", "maxtest_create_test_cases", "Create test cases", "Create test cases."),
  t("write", "maxtest_create_test_launch", "Create test launch", "Create a test launch."),
  t("write", "maxtest_create_test_plan", "Create test plan", "Create a test plan."),
  t("write", "maxtest_create_test_suite", "Create test suite", "Create a test suite."),
  t("write", "maxtest_delete_test_launch_preview", "Preview test launch deletion", "Preview what deleting a launch would remove."),
  t("write", "maxtest_delete_test_plan_preview", "Preview test plan deletion", "Preview what deleting a plan would remove."),
  t("write", "maxtest_fetch_new_test_cases", "Fetch new test cases into a launch", "Pull new test cases into a launch."),
  t("write", "maxtest_generate_report", "Generate report", "Generate the report for a finished launch."),
  t("write", "maxtest_propose_test_cases", "Propose test cases for review", "Stage AI-written test cases as drafts for human approval."),
  t("write", "maxtest_update_execution_status", "Update execution status", "Record the result of one execution."),
  t("write", "maxtest_update_execution_statuses", "Update many execution statuses", "Record results for up to 50 executions at once."),
  t("write", "maxtest_update_test_launch", "Update test launch", "Update a launch."),
  t("write", "maxtest_update_test_plan", "Update test plan", "Update a plan."),
  t("write", "maxtest_update_test_suite", "Update test suite", "Update a suite."),
  t("execution", "maxtest_run_execution", "Run single execution", "Run a single execution on the Pancake Runner."),
  t("execution", "maxtest_run_suite", "Run suite", "Run a whole suite on the Pancake Runner."),
  t("destructive", "maxtest_delete_test_launch", "Delete test launch", "Delete a launch (preview, then confirm)."),
  t("destructive", "maxtest_delete_test_plan", "Delete test plan", "Delete a plan (preview, then confirm)."),
];

export interface RiskGroup {
  risk: RiskClass;
  label: string;
  icon: "eye" | "pencil" | "play" | "trash-2";
  state: string;
}

export const RISK_GROUPS: RiskGroup[] = [
  { risk: "read", label: "Read", icon: "eye", state: "On by default" },
  { risk: "write", label: "Write", icon: "pencil", state: "Off until a company admin enables it" },
  { risk: "execution", label: "Execution", icon: "play", state: "Off until a company admin enables it" },
  { risk: "destructive", label: "Destructive", icon: "trash-2", state: "Off until enabled; preview, then confirm" },
];

export function toolsByRisk(risk: RiskClass): McpTool[] {
  return MCP_TOOLS.filter((tool) => tool.risk === risk);
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Write the failing test for the rail logic**

Create `lib/rail.test.ts`:

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { pickActiveId } from "./rail.ts";

const order = ["a", "b", "c"];

test("the first visible section in document order wins", () => {
  assert.equal(pickActiveId(order, new Set(["b", "c"]), "a"), "b");
});

test("document order decides, not the order sections became visible", () => {
  assert.equal(pickActiveId(order, new Set(["c", "a"]), "c"), "a");
});

test("when nothing is visible the previous section stays active", () => {
  assert.equal(pickActiveId(order, new Set(), "b"), "b");
});

test("an unknown visible id is ignored", () => {
  assert.equal(pickActiveId(order, new Set(["zzz"]), "a"), "a");
});
```

- [ ] **Step 6: Run to verify it fails, then implement `lib/rail.ts`**

Run: `npm test`
Expected: FAIL, `Cannot find module './rail.ts'`. Then create `lib/rail.ts`:

```ts
/** Which rail item is active: the first visible section in document order, else the previous one. */
export function pickActiveId(order: readonly string[], visible: ReadonlySet<string>, previous: string): string {
  for (const id of order) if (visible.has(id)) return id;
  return previous;
}
```

Run: `npm test`
Expected: PASS.

- [ ] **Step 7: Create `components/ui/SectionRail.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { pickActiveId } from "@/lib/rail";
import { cn } from "@/lib/utils";

export type RailItem = { id: string; label: string; number?: string };

/** Sticky rail on large screens, a horizontal anchor list on small ones. The first item is active until the page scrolls. */
export default function SectionRail({ items, ariaLabel }: { items: readonly RailItem[]; ariaLabel: string }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const order = items.map((item) => item.id);
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        setActive((previous) => pickActiveId(order, visible, previous));
      },
      { rootMargin: "-20% 0px -60% 0px" },
    );
    for (const id of order) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label={ariaLabel} className="lg:sticky lg:top-24">
      <ul className="flex gap-5 overflow-x-auto pb-2 font-mono text-xs lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <li key={item.id} className="shrink-0">
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "block border-b-2 py-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:border-b-0 lg:border-l-2 lg:pl-3",
                  isActive ? "border-primary text-primary" : "border-transparent text-paper/55 hover:text-paper",
                )}
              >
                {item.number && <span className="mr-2 text-paper/40">{item.number}</span>}
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
```

- [ ] **Step 8: Add `SectionRail` to the compliant list, verify and commit**

In `lib/design-rules.test.ts` add `"components/ui/SectionRail.tsx",` to `COMPLIANT_FILES`.

```bash
npm test && npx tsc --noEmit
git add lib components/ui/SectionRail.tsx
git commit -m "feat: add MCP tools snapshot and section rail"
```

Expected: all tests pass (including the new compliance entry), no type errors.

---

### Task 4: Product page

**Files:**
- Create: `lib/product-content.ts`, `lib/product-content.test.ts`, `components/product/Chapter.tsx`
- Modify: `lib/design-rules.test.ts`, `app/features/page.tsx` (full rewrite)

**Interfaces:**
- Consumes: `CAST` from `lib/home-content.ts`, `MCP_TOOLS`, `BANNED_PHRASES`, `PageHeader`, `Section`, `SectionRail`, `Icon`, `Character`, `Bubble`, `Button`, `signupUrl`.
- Produces: `CHAPTERS: ChapterData[]`, `ChapterData`, `PLATFORM_ITEMS`, `PRODUCT`; `<Chapter chapter />`.

- [ ] **Step 1: Write the failing tests**

Create `lib/product-content.test.ts`:

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { BANNED_PHRASES } from "./home-content.ts";
import { MCP_TOOLS } from "./mcp-tools.ts";
import { CHAPTERS, PLATFORM_ITEMS, PRODUCT } from "./product-content.ts";

test("there are four chapters in story order with unique ids", () => {
  assert.deepEqual(CHAPTERS.map((c) => c.id), ["write", "run", "triage", "report"]);
  assert.deepEqual(CHAPTERS.map((c) => c.number), ["01", "02", "03", "04"]);
});

test("every chapter has a body, tools, a prompt and a response", () => {
  for (const c of CHAPTERS) {
    assert.ok(c.body.length > 40, c.id);
    assert.ok(c.tools.length >= 3, c.id);
    assert.ok(c.prompt.length > 3 && c.response.length >= 2, c.id);
  }
});

test("every tool a chapter names exists in the tools snapshot", () => {
  const known = new Set(MCP_TOOLS.map((t) => t.name));
  for (const c of CHAPTERS) for (const tool of c.tools) assert.ok(known.has(tool), `${c.id}: ${tool}`);
});

test("platform items are verifiable features, each with an icon and text", () => {
  assert.ok(PLATFORM_ITEMS.length >= 3);
  for (const item of PLATFORM_ITEMS) assert.ok(item.title.length > 2 && item.text.length > 15, item.title);
  const titles = PLATFORM_ITEMS.map((i) => i.title.toLowerCase());
  for (const dropped of ["smart selectors", "instant refactoring", "ci/cd"]) {
    assert.ok(!titles.some((t) => t.includes(dropped)), `${dropped} cannot be verified and was dropped`);
  }
});

test("no copy on the page makes a banned claim", () => {
  const text = [
    PRODUCT.title,
    PRODUCT.lede,
    ...CHAPTERS.flatMap((c) => [c.title, c.body, c.prompt, ...c.response]),
    ...PLATFORM_ITEMS.flatMap((i) => [i.title, i.text]),
  ].join(" ").toLowerCase();
  for (const phrase of BANNED_PHRASES) assert.ok(!text.includes(phrase), phrase);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test`
Expected: FAIL, `Cannot find module './product-content.ts'`.

- [ ] **Step 3: Implement `lib/product-content.ts`**

```ts
import type { Role } from "./characters.ts";
import { CAST } from "./home-content.ts";

export interface ChapterData {
  id: "write" | "run" | "triage" | "report";
  number: string;
  title: string;
  icon: "pencil" | "play" | "search" | "file-text";
  role: Extract<Role, "writer" | "runner" | "detective" | "reporter">;
  body: string;
  tools: string[];
  prompt: string;
  response: string[];
}

function member(role: (typeof CAST)[number]["role"]) {
  const found = CAST.find((c) => c.role === role);
  if (!found) throw new Error(`cast member "${role}" is missing from home-content`);
  return found;
}

export const PRODUCT = {
  eyebrow: "Product",
  title: "From ticket to report, without leaving your editor.",
  lede: "One test's life in four chapters. Each one shows the real tool calls.",
  platformTitle: "Also in the platform",
  ctaTitle: "Try Maxtest today.",
};

export const CHAPTERS: ChapterData[] = [
  {
    id: "write",
    number: "01",
    title: "Write",
    icon: "pencil",
    role: "writer",
    body: "Point your agent at a Jira ticket. Maxtest turns it into test cases and stages them as drafts. Nothing becomes a real test case until a person approves it.",
    tools: member("writer").tools,
    prompt: member("writer").prompt,
    response: member("writer").response,
  },
  {
    id: "run",
    number: "02",
    title: "Run",
    icon: "play",
    role: "runner",
    body: "Find a suite by name and run it on the Pancake Runner. The run is asynchronous, so your agent follows the executions while you keep working.",
    tools: member("runner").tools,
    prompt: member("runner").prompt,
    response: member("runner").response,
  },
  {
    id: "triage",
    number: "03",
    title: "Triage",
    icon: "search",
    role: "detective",
    body: "Search past results by meaning to see why something failed, failures first. Record results in bulk and attach screenshots and logs as evidence.",
    tools: [...member("detective").tools.slice(0, 2), ...member("scribe").tools.slice(0, 2)],
    prompt: member("detective").prompt,
    response: member("detective").response,
  },
  {
    id: "report",
    number: "04",
    title: "Report",
    icon: "file-text",
    role: "reporter",
    body: "When a launch finishes, generate its report and find earlier ones. A report is generated once and returned as it is afterwards.",
    tools: member("reporter").tools,
    prompt: member("reporter").prompt,
    response: member("reporter").response,
  },
];

export interface PlatformItem {
  icon: "chart-column" | "list-checks" | "plug" | "wrench";
  title: string;
  text: string;
  href?: string;
}

/** Kept after checking the old feature list against the product. Dropped as unverifiable: Smart Selectors, Instant Refactoring, CI/CD Integration. */
export const PLATFORM_ITEMS: PlatformItem[] = [
  { icon: "chart-column", title: "QA metrics", text: "QA metrics for your launches and test results, in the dashboard." },
  { icon: "list-checks", title: "Test plans and launches", text: "Organize suites into test plans and run them as launches." },
  { icon: "plug", title: "Jira and Slack", text: "Connect Jira and Slack from the dashboard settings." },
  {
    icon: "wrench",
    title: "MaxHeal for Playwright",
    text: "An open-source Python wrapper that repairs broken selectors at runtime.",
    href: "/blog/introducing-max-heal-playwright-auto-heal",
  },
];
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Add the Product files to the compliant list (RED)**

In `lib/design-rules.test.ts` add to `COMPLIANT_FILES`:

```ts
  "app/features/page.tsx",
  "components/product/Chapter.tsx",
```

Run: `npm test`
Expected: FAIL for `app/features/page.tsx` (emoji, `FeatureCard`, `rounded-full`, gradients) and `Cannot find` or ENOENT for `components/product/Chapter.tsx`.

- [ ] **Step 6: Create `components/product/Chapter.tsx`**

```tsx
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
```

- [ ] **Step 7: Rewrite `app/features/page.tsx`**

```tsx
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";
import SectionRail from "@/components/ui/SectionRail";
import Chapter from "@/components/product/Chapter";
import Link from "next/link";
import { generateBreadcrumbSchema, generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { signupUrl } from "@/lib/links";
import { CHAPTERS, PLATFORM_ITEMS, PRODUCT } from "@/lib/product-content";

export const metadata = generateSEOMetadata({
  title: "Product - How Maxtest Works",
  description:
    "Write, run, triage and report on tests from your editor. Maxtest is the test platform your AI agent can operate through MCP.",
  path: "/features",
});

const RAIL_ITEMS = CHAPTERS.map((c) => ({ id: c.id, label: c.title, number: c.number }));

export default function FeaturesPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Product", url: "/features" },
  ]);
  const signup = signupUrl();

  return (
    <div className="min-h-screen bg-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <PageHeader eyebrow={PRODUCT.eyebrow} title={PRODUCT.title} lede={PRODUCT.lede} />

      <div className="mx-auto grid max-w-6xl items-start gap-8 px-4 pb-6 sm:px-6 lg:grid-cols-[9rem_minmax(0,1fr)]">
        <SectionRail items={RAIL_ITEMS} ariaLabel="Chapters" />
        <div>
          {CHAPTERS.map((chapter) => (
            <Chapter key={chapter.id} chapter={chapter} />
          ))}
        </div>
      </div>

      <Section>
        <h2 className="font-headline text-3xl font-extrabold tracking-tight text-paper">{PRODUCT.platformTitle}</h2>
        <ul className="mt-6 grid gap-x-12 gap-y-6 md:grid-cols-2">
          {PLATFORM_ITEMS.map((item) => (
            <li key={item.title} className="flex gap-3 border-t border-hairline pt-4">
              <Icon name={item.icon} size={20} className="mt-0.5 text-paper" />
              <div>
                <h3 className="font-bold text-paper">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-paper/65">
                  {item.text}
                  {item.href && (
                    <>
                      {" "}
                      <Link href={item.href} className="font-bold text-primary underline-offset-4 hover:underline">
                        Read more
                      </Link>
                    </>
                  )}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="pb-20">
        <h2 className="font-headline text-4xl font-extrabold tracking-tight text-paper">{PRODUCT.ctaTitle}</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={signup} external={signup.startsWith("http")}>
            Start free
          </Button>
          <Button href="/documentation" variant="ghost">
            Read the MCP docs
          </Button>
        </div>
      </Section>
    </div>
  );
}
```

- [ ] **Step 8: Verify GREEN, then commit**

```bash
npm test && npx tsc --noEmit && npm run lint 2>&1 | grep problems && npm run build 2>&1 | grep -E "Compiled|rror"
git add lib components app/features
git commit -m "feat: redesign Product page as a four-chapter workflow story"
```

Expected: all tests pass, no type errors, lint problems count not higher than before this task, build succeeds.

---

### Task 5: Pricing page

**Files:**
- Create: `lib/pricing.ts`, `lib/pricing.test.ts`, `components/pricing/PricingLedger.tsx`, `components/pricing/Faq.tsx`
- Modify: `lib/design-rules.test.ts`, `app/pricing/page.tsx` (full rewrite as a server page)

**Interfaces:**
- Consumes: `BANNED_PHRASES`, `PageHeader`, `Section`, `Button`, `Icon`, `signupUrl`, `generateFAQSchema`.
- Produces: `PLANS`, `ROWS`, `FAQ`, `YEARLY_DISCOUNT_LABEL`, `isPlaceholder(value)`, types `Plan`, `RowId`; `<PricingLedger signupHref />`, `<Faq items />`.

- [ ] **Step 1: Write the failing tests**

Create `lib/pricing.test.ts`:

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { BANNED_PHRASES } from "./home-content.ts";
import { FAQ, isPlaceholder, PLANS, ROWS } from "./pricing.ts";

test("there are three plans and exactly one is recommended", () => {
  assert.deepEqual(PLANS.map((p) => p.id), ["free", "pro", "team"]);
  assert.deepEqual(PLANS.filter((p) => p.recommended).map((p) => p.id), ["pro"]);
});

test("every plan has a value for every row", () => {
  for (const plan of PLANS) for (const row of ROWS) assert.ok(plan.values[row.id] !== undefined, `${plan.id}.${row.id}`);
});

test("the two meters come first", () => {
  assert.deepEqual(ROWS.slice(0, 2).map((r) => r.id), ["runnerMinutes", "testRuns"]);
});

test("the runner-minutes row says only Maxtest's runner is metered", () => {
  const note = ROWS.find((r) => r.id === "runnerMinutes")?.note ?? "";
  assert.match(note, /Maxtest's runner only/);
  assert.match(note, /own CI or machine are unmetered/);
  assert.equal(ROWS.filter((r) => r.note).length, 1);
});

test("the FAQ repeats that policy and is not left as a placeholder", () => {
  const item = FAQ.find((f) => f.question === "What counts as a runner minute?");
  assert.ok(item);
  assert.match(item!.answer, /unmetered/);
  assert.ok(!/\[[^\]]+\]/.test(item!.answer));
});

test("meter values for Free and Pro are visible placeholders; Team is custom", () => {
  for (const id of ["free", "pro"] as const) {
    const plan = PLANS.find((p) => p.id === id)!;
    assert.ok(isPlaceholder(plan.values.runnerMinutes), `${id} runner minutes`);
    assert.ok(isPlaceholder(plan.values.testRuns), `${id} test runs`);
  }
  const team = PLANS.find((p) => p.id === "team")!;
  assert.equal(team.values.runnerMinutes, "Custom");
  assert.equal(team.values.testRuns, "Custom");
});

test("isPlaceholder only matches a fully bracketed value", () => {
  assert.equal(isPlaceholder("[300]"), true);
  assert.equal(isPlaceholder("[3,000]"), true);
  assert.equal(isPlaceholder("300"), false);
  assert.equal(isPlaceholder("Custom [x]"), false);
  assert.equal(isPlaceholder(""), false);
});

test("prices keep today's values, yearly is cheaper than monthly for Pro", () => {
  const pro = PLANS.find((p) => p.id === "pro")!;
  assert.equal(pro.price.monthly, "Rp 1.199.999");
  assert.equal(pro.price.yearly, "Rp 959.999");
  assert.equal(PLANS.find((p) => p.id === "free")!.price.monthly, "Rp 0");
  assert.equal(PLANS.find((p) => p.id === "team")!.price.monthly, "Talk to us");
});

test("every plan has a call to action; only Team goes to email", () => {
  for (const plan of PLANS) assert.ok(plan.cta.label.length > 2 && plan.cta.href.length > 2, plan.id);
  assert.equal(PLANS.find((p) => p.id === "team")!.cta.href, "mailto:support@maxtest.id");
  assert.equal(PLANS.find((p) => p.id === "free")!.cta.href, "signup");
});

test("the FAQ describes the two meters and never repeats the old contradictory claims", () => {
  const text = FAQ.map((f) => `${f.question} ${f.answer}`).join(" ").toLowerCase();
  assert.ok(text.includes("runner minute") && text.includes("test run"));
  assert.ok(!text.includes("20 test generations") && !text.includes("unlimited"));
  for (const phrase of BANNED_PHRASES) assert.ok(!text.includes(phrase), phrase);
});

test("FAQ answers that still need a number are bracketed so they can be found", () => {
  const bracketed = FAQ.filter((f) => /\[[^\]]+\]/.test(f.answer));
  assert.ok(bracketed.length >= 2);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test`
Expected: FAIL, `Cannot find module './pricing.ts'`.

- [ ] **Step 3: Implement `lib/pricing.ts`**

```ts
export type PlanId = "free" | "pro" | "team";
export type RowId = "runnerMinutes" | "testRuns" | "users" | "integrations" | "support" | "ragTuning" | "sla";

export const YEARLY_DISCOUNT_LABEL = "−20%";

/** Meter cells written in square brackets are placeholders the owner replaces. */
export function isPlaceholder(value: string): boolean {
  return /^\[[^\]]+\]$/.test(value);
}

export const RUNNER_MINUTES_NOTE =
  "Runner minutes count runs on Maxtest's runner only. Results pushed in from your own CI or machine are unmetered.";

export const ROWS: { id: RowId; label: string; note?: string }[] = [
  { id: "runnerMinutes", label: "Runner minutes per month", note: RUNNER_MINUTES_NOTE },
  { id: "testRuns", label: "Test runs per month" },
  { id: "users", label: "Users" },
  { id: "integrations", label: "Third-party integrations" },
  { id: "support", label: "Support" },
  { id: "ragTuning", label: "Custom RAG tuning" },
  { id: "sla", label: "SLA guarantees" },
];

export interface Plan {
  id: PlanId;
  name: string;
  recommended: boolean;
  price: { monthly: string; yearly: string };
  usd?: { monthly: string; yearly: string };
  /** `href: "signup"` means the signup URL; anything else is used as is. */
  cta: { label: string; href: string };
  /** "yes" renders a check, "no" renders a dash, bracketed values are placeholders. */
  values: Record<RowId, string>;
}

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    recommended: false,
    price: { monthly: "Rp 0", yearly: "Rp 0" },
    usd: { monthly: "~$0 USD", yearly: "~$0 USD" },
    cta: { label: "Start free", href: "signup" },
    values: {
      runnerMinutes: "[300]",
      testRuns: "[500]",
      users: "3",
      integrations: "Limited",
      support: "Community",
      ragTuning: "no",
      sla: "no",
    },
  },
  {
    id: "pro",
    name: "Pro",
    recommended: true,
    price: { monthly: "Rp 1.199.999", yearly: "Rp 959.999" },
    usd: { monthly: "~$71 USD", yearly: "~$57 USD" },
    cta: { label: "Start Pro", href: "signup" },
    values: {
      runnerMinutes: "[3,000]",
      testRuns: "[10,000]",
      users: "10",
      integrations: "yes",
      support: "Priority",
      ragTuning: "no",
      sla: "no",
    },
  },
  {
    id: "team",
    name: "Team",
    recommended: false,
    price: { monthly: "Talk to us", yearly: "Talk to us" },
    cta: { label: "Contact us", href: "mailto:support@maxtest.id" },
    values: {
      runnerMinutes: "Custom",
      testRuns: "Custom",
      users: "Custom",
      integrations: "yes",
      support: "Dedicated account manager",
      ragTuning: "yes",
      sla: "yes",
    },
  },
];

export const PRICING = {
  eyebrow: "Pricing",
  title: "Pay for what you run.",
  lede: "Two meters: runner minutes on the Pancake Runner and test runs per month. Start free and move up when you need more.",
  faqTitle: "Questions",
};

export const FAQ = [
  {
    question: "Can I try Maxtest before paying?",
    answer: "Yes. The Free plan includes [300] runner minutes and [500] test runs per month. Start there and move to Pro when you need more.",
  },
  {
    question: "What counts as a runner minute?",
    answer: `${RUNNER_MINUTES_NOTE} The time a suite spends executing on the runner is what counts.`,
  },
  {
    question: "What counts as a test run?",
    answer: "[Define precisely]: one execution of a test case, whether you start it from the dashboard or from your agent.",
  },
  {
    question: "What happens when I reach a limit?",
    answer: "You'll be notified as you approach a limit and can move to Pro at any time. [Confirm what happens at the limit: runs pause or overage applies.]",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes. You can cancel Pro at any time and keep access until the end of your billing period.",
  },
  {
    question: "Do you offer a yearly discount?",
    answer: "Yes. Yearly billing saves 20% on paid plans.",
  },
];
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Add the Pricing files to the compliant list (RED)**

In `lib/design-rules.test.ts` add:

```ts
  "app/pricing/page.tsx",
  "components/pricing/PricingLedger.tsx",
  "components/pricing/Faq.tsx",
```

Run: `npm test`
Expected: FAIL for the old `app/pricing/page.tsx` (glows, gradients, `rounded-full`) and missing component files.

- [ ] **Step 6: Create `components/pricing/PricingLedger.tsx`**

```tsx
"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { isPlaceholder, PLANS, ROWS, YEARLY_DISCOUNT_LABEL, type Plan } from "@/lib/pricing";
import { cn } from "@/lib/utils";

function Cell({ value }: { value: string }) {
  if (value === "yes") return <Icon name="check" size={16} label="Included" className="text-primary" />;
  if (value === "no") return <span aria-label="Not included">-</span>;
  if (isPlaceholder(value)) {
    return (
      <span className="border-b border-dashed border-primary" title="Placeholder, to be confirmed">
        {value}
      </span>
    );
  }
  return <>{value}</>;
}

export default function PricingLedger({ signupHref }: { signupHref: string }) {
  const [yearly, setYearly] = useState(false);
  const period = yearly ? "yearly" : "monthly";
  const href = (plan: Plan) => (plan.cta.href === "signup" ? signupHref : plan.cta.href);
  const external = (plan: Plan) => /^(https?:|mailto:)/.test(href(plan));
  const priceUnit = (plan: Plan) => (plan.price.monthly.startsWith("Rp") ? "/mo" : "");

  return (
    <div>
      <div role="group" aria-label="Billing period" className="inline-flex overflow-hidden rounded-lg border-2 border-paper text-sm font-bold">
        <button
          type="button"
          aria-pressed={!yearly}
          onClick={() => setYearly(false)}
          className={cn("px-4 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary", !yearly ? "bg-paper text-ink" : "text-paper")}
        >
          Monthly
        </button>
        <button
          type="button"
          aria-pressed={yearly}
          onClick={() => setYearly(true)}
          className={cn("px-4 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary", yearly ? "bg-paper text-ink" : "text-paper")}
        >
          Yearly <span className={yearly ? "text-ink" : "text-primary"}>{YEARLY_DISCOUNT_LABEL}</span>
        </button>
      </div>

      {/* Wide screens: one comparison ledger */}
      <div className="mt-8 hidden grid-cols-[minmax(10rem,1.1fr)_repeat(3,minmax(0,1fr))] md:grid">
        <div />
        {PLANS.map((plan) => (
          <div key={plan.id} className={cn("px-4 pb-4 pt-3", plan.recommended ? "border-t-[3px] border-primary bg-panel" : "border-t-2 border-paper")}>
            <div className="flex items-baseline gap-2">
              <h3 className="font-bold text-paper">{plan.name}</h3>
              {plan.recommended && <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary">Most teams</span>}
            </div>
            <p className="mt-2 font-headline text-2xl font-extrabold tracking-tight text-paper">
              {plan.price[period]}
              <span className="font-body text-sm font-normal text-paper/55">{priceUnit(plan)}</span>
            </p>
            <p className="h-4 text-xs text-paper/50">{plan.usd?.[period]}</p>
          </div>
        ))}
        {ROWS.map((row) => (
          <div key={row.id} className="contents">
            <div className="border-t border-hairline py-3 pr-4 text-sm text-paper/75">
              {row.label}
              {row.note && <span className="mt-1 block text-xs leading-relaxed text-paper/50">{row.note}</span>}
            </div>
            {PLANS.map((plan) => (
              <div key={plan.id} className={cn("border-t border-hairline px-4 py-3 text-sm text-paper", plan.recommended && "bg-panel")}>
                <Cell value={plan.values[row.id]} />
              </div>
            ))}
          </div>
        ))}
        <div />
        {PLANS.map((plan) => (
          <div key={plan.id} className={cn("border-t border-hairline px-4 py-5", plan.recommended && "bg-panel")}>
            <Button href={href(plan)} external={external(plan)} variant={plan.recommended ? "primary" : "ghost"}>
              {plan.cta.label}
            </Button>
          </div>
        ))}
      </div>

      {/* Small screens: one stacked section per plan */}
      <div className="mt-8 space-y-8 md:hidden">
        {PLANS.map((plan) => (
          <section key={plan.id} className={cn("pt-3", plan.recommended ? "border-t-[3px] border-primary" : "border-t-2 border-paper")}>
            <div className="flex items-baseline gap-2">
              <h3 className="font-bold text-paper">{plan.name}</h3>
              {plan.recommended && <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary">Most teams</span>}
            </div>
            <p className="mt-2 font-headline text-3xl font-extrabold tracking-tight text-paper">
              {plan.price[period]}
              <span className="font-body text-sm font-normal text-paper/55">{priceUnit(plan)}</span>
            </p>
            {plan.usd && <p className="text-xs text-paper/50">{plan.usd[period]}</p>}
            <dl className="mt-4">
              {ROWS.map((row) => (
                <div key={row.id} className="flex items-baseline justify-between gap-4 border-t border-hairline py-2 text-sm">
                  <dt className="text-paper/70">
                    {row.label}
                    {row.note && <span className="mt-1 block text-xs leading-relaxed text-paper/50">{row.note}</span>}
                  </dt>
                  <dd className="text-right text-paper">
                    <Cell value={plan.values[row.id]} />
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-4">
              <Button href={href(plan)} external={external(plan)} variant={plan.recommended ? "primary" : "ghost"}>
                {plan.cta.label}
              </Button>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Create `components/pricing/Faq.tsx`**

```tsx
import Icon from "@/components/ui/Icon";

type Item = { question: string; answer: string };

/** Native <details>: keyboard accessible and works without JavaScript. */
export default function Faq({ items }: { items: readonly Item[] }) {
  return (
    <div className="max-w-3xl">
      {items.map((item) => (
        <details key={item.question} className="group border-t border-hairline py-4 last:border-b">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
            {item.question}
            <span className="text-primary">
              <Icon name="plus" className="group-open:hidden" />
              <Icon name="minus" className="hidden group-open:block" />
            </span>
          </summary>
          <p className="mt-3 max-w-2xl leading-relaxed text-paper/70">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
```

- [ ] **Step 8: Rewrite `app/pricing/page.tsx` (server page with metadata)**

```tsx
import Faq from "@/components/pricing/Faq";
import PricingLedger from "@/components/pricing/PricingLedger";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";
import { signupUrl } from "@/lib/links";
import { FAQ, PRICING } from "@/lib/pricing";
import { generateFAQSchema, generateMetadata as generateSEOMetadata } from "@/lib/seo";

export const metadata = generateSEOMetadata({
  title: "Pricing - Pay for What You Run",
  description: "Maxtest pricing is based on runner minutes and test runs. Start free and move up when you need more.",
  path: "/pricing",
});

export default function PricingPage() {
  const faqSchema = generateFAQSchema(FAQ);
  return (
    <div className="min-h-screen bg-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <PageHeader eyebrow={PRICING.eyebrow} title={PRICING.title} lede={PRICING.lede} />
      <div className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
        <PricingLedger signupHref={signupUrl()} />
      </div>
      <Section className="pb-20">
        <h2 className="mb-6 font-headline text-3xl font-extrabold tracking-tight text-paper">{PRICING.faqTitle}</h2>
        <Faq items={FAQ} />
      </Section>
    </div>
  );
}
```

- [ ] **Step 9: Verify GREEN, then commit**

```bash
npm test && npx tsc --noEmit && npm run lint 2>&1 | grep problems && npm run build 2>&1 | grep -E "Compiled|rror"
git add lib components app/pricing
git commit -m "feat: redesign Pricing as a ledger with runner-minute and test-run meters"
```

Expected: all tests pass, build succeeds, and `/pricing` is a static route. If the compliance test flags `-` or other characters, fix the file, not the test.

---

### Task 6: Documentation page

**Files:**
- Create: `lib/docs-content.ts`, `lib/docs-content.test.ts`, `components/ui/CopyCommand.tsx`, `components/docs/ToolsReference.tsx`
- Modify: `components/home/ConnectBlock.tsx` (use `CopyCommand`, becomes a server component), `lib/design-rules.test.ts`, `app/documentation/page.tsx` (full rewrite)

**Interfaces:**
- Consumes: `buildConnectCommand`, `MCP_TOOLS`, `RISK_GROUPS`, `toolsByRisk`, `copyText`, `Bubble`, `Icon`, `PageHeader`, `SectionRail`, `BANNED_PHRASES`.
- Produces: `DOCS_SECTIONS`, `SCOPES`, `GUIDES_COMING`, `HELP_LINKS`, `DOCS`; `<CopyCommand command />`; `<ToolsReference />`.

- [ ] **Step 1: Write the failing tests**

Create `lib/docs-content.test.ts`:

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { DOCS, DOCS_SECTIONS, GUIDES_COMING, HELP_LINKS, SCOPES } from "./docs-content.ts";
import { BANNED_PHRASES } from "./home-content.ts";

test("sections have unique ids and the expected order", () => {
  assert.deepEqual(DOCS_SECTIONS.map((s) => s.id), ["quickstart", "tools", "scopes", "approvals", "guides", "help"]);
});

test("scopes use the backend vocabulary", () => {
  assert.deepEqual(SCOPES.map((s) => s.name), ["maxtest:read", "maxtest:write", "maxtest:execute", "maxtest:external"]);
  for (const s of SCOPES) assert.ok(s.description.length > 15, s.name);
});

test("unwritten guides are labeled coming soon and never link anywhere", () => {
  assert.ok(GUIDES_COMING.length >= 4);
  for (const g of GUIDES_COMING) assert.ok(g.title.length > 3 && !("href" in g), g.title);
});

test("help links are the existing Discord and support email", () => {
  assert.deepEqual(HELP_LINKS.map((l) => l.href), ["https://discord.gg/hHqVWYgp", "mailto:support@maxtest.id"]);
});

test("no docs copy makes a banned claim", () => {
  const text = [
    DOCS.title,
    DOCS.lede,
    DOCS.quickstart.steps.join(" "),
    DOCS.quickstart.oauth,
    DOCS.approvals.join(" "),
    ...SCOPES.map((s) => s.description),
  ].join(" ").toLowerCase();
  for (const phrase of BANNED_PHRASES) assert.ok(!text.includes(phrase), phrase);
});
```

- [ ] **Step 2: Run to verify it fails, then implement `lib/docs-content.ts`**

Run: `npm test`
Expected: FAIL, `Cannot find module './docs-content.ts'`. Then create `lib/docs-content.ts`:

```ts
export const DOCS_SECTIONS = [
  { id: "quickstart", label: "Quickstart" },
  { id: "tools", label: "Tools reference" },
  { id: "scopes", label: "Scopes" },
  { id: "approvals", label: "Approvals and audit" },
  { id: "guides", label: "More guides" },
  { id: "help", label: "Get help" },
] as const;

export const DOCS = {
  eyebrow: "Documentation",
  title: "Connect your agent to Maxtest.",
  lede: "Add the Maxtest MCP server to Claude Code, Cursor or any MCP client, then let your agent write, run and triage tests.",
  quickstart: {
    steps: [
      "Create a personal access token in the Maxtest dashboard. Tokens last 90 days by default.",
      "Run the command below, with your token in place of <your-token>.",
    ],
    oauth: "Clients that support OAuth 2.1 can connect with just the server URL: add it, then approve the consent screen in the dashboard. No token to paste.",
  },
  toolsIntro: "Tools are grouped by risk class. Only read tools are on by default; a company admin enables the rest.",
  approvals: [
    "AI-written test cases are staged as drafts in a review queue. Nothing becomes a real test case until a person approves it in the dashboard.",
    "Destructive tools use a preview step and a confirmation before anything is deleted.",
    "Every call is audited and checked against the user's project permissions.",
  ],
};

export const SCOPES = [
  { name: "maxtest:read", description: "Read projects, test cases, launches, executions and reports." },
  { name: "maxtest:write", description: "Create and update test assets, record results and stage drafts. Includes read." },
  { name: "maxtest:execute", description: "Start real runs on the Pancake Runner. Includes read." },
  { name: "maxtest:external", description: "Reserved for tools that reach outside Maxtest. No tool uses it today." },
] as const;

export const GUIDES_COMING = [
  { title: "Core concepts" },
  { title: "AI test generation" },
  { title: "API reference" },
  { title: "Integrations" },
  { title: "Analytics and reporting" },
] as const;

export const HELP_LINKS = [
  { label: "Join the Discord", href: "https://discord.gg/hHqVWYgp", icon: "message-circle" },
  { label: "Email support", href: "mailto:support@maxtest.id", icon: "mail" },
] as const;
```

Run: `npm test`
Expected: PASS.

- [ ] **Step 3: Extract `CopyCommand` from `ConnectBlock`**

Create `components/ui/CopyCommand.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Bubble from "@/components/ui/Bubble";
import { copyText, type CopyResult } from "@/lib/clipboard";

/** A command in a bubble with a copy button that fails gracefully and leaves the text selected. */
export default function CopyCommand({ command }: { command: string }) {
  const [status, setStatus] = useState<CopyResult | "idle">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  async function onCopy() {
    const result = await copyText(command);
    if (result === "failed") {
      const node = codeRef.current;
      if (node) {
        const range = document.createRange();
        range.selectNodeContents(node);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
    setStatus(result);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 2500);
  }

  return (
    <Bubble className="p-4">
      <pre className="overflow-x-auto pb-1 leading-relaxed">
        <code ref={codeRef} className="select-all whitespace-pre">
          {command}
        </code>
      </pre>
      <div className="mt-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onCopy}
          className="h-9 rounded-lg border-2 border-paper bg-primary px-4 font-body text-sm font-bold text-ink shadow-[3px_3px_0_var(--color-primary-dark)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          {status === "copied" ? "Copied" : "Copy command"}
        </button>
        <span role="status" aria-live="polite" className="font-body text-sm text-paper/60">
          {status === "copied" && "Copied to your clipboard."}
          {status === "failed" && "Couldn't copy. The command is selected, press Ctrl+C."}
        </span>
      </div>
    </Bubble>
  );
}
```

Replace `components/home/ConnectBlock.tsx` with (no longer a client component):

```tsx
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
```

- [ ] **Step 4: Add the Docs files to the compliant list (RED)**

In `lib/design-rules.test.ts` add:

```ts
  "app/documentation/page.tsx",
  "components/docs/ToolsReference.tsx",
  "components/ui/CopyCommand.tsx",
```

Run: `npm test`
Expected: FAIL for the old `app/documentation/page.tsx` and the missing `ToolsReference.tsx`.

- [ ] **Step 5: Create `components/docs/ToolsReference.tsx`**

```tsx
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
```

- [ ] **Step 6: Rewrite `app/documentation/page.tsx`**

```tsx
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
```

- [ ] **Step 7: Verify GREEN, then commit**

```bash
npm test && npx tsc --noEmit && npm run lint 2>&1 | grep problems && npm run build 2>&1 | grep -E "Compiled|rror"
git add lib components app/documentation
git commit -m "feat: redesign Documentation as real MCP docs with a tools reference"
```

Expected: all tests pass, build succeeds. The home page still builds (`ConnectBlock` is now a server component).

---

### Task 7: Blog

**Files:**
- Create: `lib/blog.ts`, `lib/blog.test.ts`
- Modify: `lib/blog-data.ts`, `lib/design-rules.test.ts`, `app/blog/page.tsx` (rewrite), `app/blog/[slug]/page.tsx` (rewrite)

**Interfaces:**
- Produces: `readMinutes(html): number` (minimum 1), `formatReadTime(minutes): string`.

- [ ] **Step 1: Write the failing tests**

Create `lib/blog.test.ts`:

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { blogPosts } from "./blog-data.ts";
import { formatReadTime, readMinutes } from "./blog.ts";

const words = (n: number) => Array.from({ length: n }, (_, i) => `w${i}`).join(" ");

test("empty content still reads as one minute", () => {
  assert.equal(readMinutes(""), 1);
  assert.equal(readMinutes("<p></p>"), 1);
});

test("200 words per minute, rounded up", () => {
  assert.equal(readMinutes(words(200)), 1);
  assert.equal(readMinutes(words(201)), 2);
  assert.equal(readMinutes(words(400)), 2);
});

test("HTML tags do not count as words", () => {
  assert.equal(readMinutes(`<p>${words(200)}</p><h2></h2><ul><li></li></ul>`), 1);
});

test("formatReadTime", () => {
  assert.equal(formatReadTime(1), "1 min read");
  assert.equal(formatReadTime(7), "7 min read");
});

test("blog posts no longer carry a hard-coded reading time", () => {
  for (const post of blogPosts) assert.ok(!("readingTime" in post), post.slug);
});

test("blog post bodies contain no emoji", () => {
  for (const post of blogPosts) assert.deepEqual([...post.content.matchAll(/\p{Extended_Pictographic}/gu)].map((m) => m[0]), [], post.slug);
});

test("posts are valid: slug, title, ISO date, content", () => {
  for (const post of blogPosts) {
    assert.match(post.slug, /^[a-z0-9-]+$/);
    assert.ok(post.title.length > 5 && post.content.length > 200);
    assert.match(post.date, /^\d{4}-\d{2}-\d{2}$/);
  }
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test`
Expected: FAIL, `Cannot find module './blog.ts'`.

- [ ] **Step 3: Implement `lib/blog.ts` and clean `lib/blog-data.ts`**

`lib/blog.ts`:

```ts
/** Reading time from the post HTML: tags are ignored, 200 words per minute, never below one minute. */
export function readMinutes(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function formatReadTime(minutes: number): string {
  return `${minutes} min read`;
}
```

In `lib/blog-data.ts`:

1. Remove `readingTime: string;` from the `BlogPost` interface and both `readingTime: "..."` lines.
2. Remove the four emoji markers: change `<li>🔧 <strong>`, `<li>🔁 <strong>`, `<li>🪶 <strong>`, `<li>⚡ <strong>` to `<li><strong>`:

```bash
sed -i 's#<li>🔧 <strong>#<li><strong>#; s#<li>🔁 <strong>#<li><strong>#; s#<li>🪶 <strong>#<li><strong>#; s#<li>⚡ <strong>#<li><strong>#' lib/blog-data.ts
sed -i '/readingTime/d' lib/blog-data.ts
sed -i 's#class="w-full rounded-xl my-10 border border-white/10"#class="my-10 w-full rounded-lg border-2 border-paper/80"#' lib/blog-data.ts
grep -n "readingTime\|rounded-xl" lib/blog-data.ts
```

Expected: the `grep` prints nothing. Run `npm test` and expect PASS.

- [ ] **Step 4: Add the Blog files to the compliant list (RED)**

In `lib/design-rules.test.ts` add:

```ts
  "app/blog/page.tsx",
  "app/blog/[slug]/page.tsx",
```

Run: `npm test`
Expected: FAIL for both old blog pages (`rounded-full`, `rounded-xl`, gradient/hover lift classes). The content also checks `blog-data.ts` separately in `lib/blog.test.ts`.

- [ ] **Step 5: Rewrite `app/blog/page.tsx`**

```tsx
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";
import { formatReadTime, readMinutes } from "@/lib/blog";
import { blogPosts } from "@/lib/blog-data";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = generateSEOMetadata({
  title: "Blog - AI Testing Insights",
  description:
    "Latest insights on AI-driven testing, test automation trends, and how to eliminate flaky tests with RAG technology.",
  path: "/blog",
});

export default function BlogListingPage() {
  const posts = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div className="min-h-screen bg-ink">
      <PageHeader
        eyebrow="Blog"
        title="Notes from the test bench."
        lede="Insights, guides, and stories about the future of autonomous testing."
      />
      <Section className="pb-20">
        {posts.map((post, index) => (
          <article key={post.slug} className="border-t border-hairline py-8 first:border-t-0 first:pt-0">
            <Link href={`/blog/${post.slug}`} className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
              <p className="font-mono text-xs text-paper/55">
                {post.date} · {formatReadTime(readMinutes(post.content))}
              </p>
              <h2
                className={cn(
                  "mt-2 max-w-3xl font-headline font-extrabold leading-tight tracking-tight text-paper transition-colors group-hover:text-primary",
                  index === 0 ? "text-3xl sm:text-4xl" : "text-2xl",
                )}
              >
                {post.title}
              </h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-paper/70">{post.excerpt}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary">
                Read <Icon name="arrow-right" size={14} />
              </span>
            </Link>
          </article>
        ))}
      </Section>
    </div>
  );
}
```

- [ ] **Step 6: Rewrite `app/blog/[slug]/page.tsx`**

```tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { formatReadTime, readMinutes } from "@/lib/blog";
import { blogPosts } from "@/lib/blog-data";
import { signupUrl } from "@/lib/links";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return;
  return generateSEOMetadata({ title: post.title, description: post.excerpt, path: `/blog/${slug}` });
}

const content = [
  "blog-content min-w-0 break-words",
  "[&>h2]:mb-5 [&>h2]:mt-14 [&>h2]:font-headline [&>h2]:text-3xl [&>h2]:font-extrabold [&>h2]:leading-tight [&>h2]:tracking-tight [&>h2]:text-paper",
  "[&>h3]:mb-4 [&>h3]:mt-10 [&>h3]:font-headline [&>h3]:text-2xl [&>h3]:font-extrabold [&>h3]:text-paper",
  "[&>p]:mb-6 [&>p]:font-serif [&>p]:text-lg [&>p]:leading-[1.75] [&>p]:text-paper/85",
  "[&>ul]:my-8 [&>ul]:space-y-3",
  "[&>ul>li]:relative [&>ul>li]:pl-6 [&>ul>li]:font-serif [&>ul>li]:text-lg [&>ul>li]:leading-[1.75] [&>ul>li]:text-paper/85",
  "[&>ul>li]:before:absolute [&>ul>li]:before:left-0 [&>ul>li]:before:text-primary [&>ul>li]:before:content-['▸']",
  "[&>ul>li>strong]:font-bold [&>ul>li>strong]:text-paper",
  "[&>pre]:my-8 [&>pre]:overflow-x-auto [&>pre]:rounded-lg [&>pre]:border-2 [&>pre]:border-paper [&>pre]:bg-panel [&>pre]:p-5 [&>pre]:shadow-[3px_3px_0_var(--color-primary)]",
  "[&>pre>code]:block [&>pre>code]:font-mono [&>pre>code]:text-[14px] [&>pre>code]:leading-[1.7] [&>pre>code]:text-paper/90",
  "[&>blockquote]:my-8 [&>blockquote]:border-l-2 [&>blockquote]:border-primary [&>blockquote]:pl-5 [&>blockquote]:font-serif [&>blockquote]:text-lg [&>blockquote]:italic [&>blockquote]:text-paper/70",
  "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4",
  "[&_code:not(pre_code)]:font-mono [&_code:not(pre_code)]:text-[0.9em] [&_code:not(pre_code)]:text-primary",
].join(" ");

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: `${process.env.NEXT_PUBLIC_SITE_URL}/favicon-img-w.png`,
    datePublished: post.date,
    author: { "@type": "Organization", name: "Maxtest AI" },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}` },
  };
  const signup = signupUrl();

  return (
    <div className="min-h-screen bg-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <article className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-[680px]">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-paper/55 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <Icon name="arrow-right" size={14} className="rotate-180" />
            Blog
          </Link>

          <h1 className="mt-8 font-headline text-4xl font-extrabold leading-[1.08] tracking-tight text-paper sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-6 border-b border-hairline pb-8 font-mono text-xs text-paper/55">
            Maxtest AI Team · {post.date} · {formatReadTime(readMinutes(post.content))}
          </p>

          <div className={`mt-10 ${content}`} dangerouslySetInnerHTML={{ __html: post.content }} />

          <p className="mt-14 border-t border-hairline pt-6 font-mono text-xs text-paper/50">{post.tags.join(" · ")}</p>
        </div>
      </article>

      <section className="border-t border-hairline px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-[680px]">
          <h2 className="font-headline text-3xl font-extrabold tracking-tight text-paper">Ready to try it?</h2>
          <p className="mt-3 text-paper/70">Start with Maxtest and let your agent run your tests.</p>
          <div className="mt-6">
            <Button href={signup} external={signup.startsWith("http")}>
              Start free
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 7: Verify GREEN, then commit**

```bash
npm test && npx tsc --noEmit && npm run lint 2>&1 | grep problems && npm run build 2>&1 | grep -E "Compiled|rror|blog"
git add lib app/blog
git commit -m "feat: redesign Blog as an editorial list and a reading column; drop emoji and hard-coded read time"
```

Expected: all tests pass, build succeeds and both blog posts are still prerendered. The lint problem count drops (the old blog page had unescaped-entity errors).

---

### Task 8: Remove legacy components and unused CSS

**Files:**
- Delete: `components/FeatureCard.tsx`, `components/CTAButton.tsx` (only if unused)
- Modify: `app/globals.css`

- [ ] **Step 1: Confirm nothing imports the legacy components**

```bash
grep -rn "FeatureCard\|CTAButton\|AnimatedSection" app components lib --include=*.tsx --include=*.ts | grep -v "^components/FeatureCard.tsx\|^components/CTAButton.tsx\|^components/AnimatedSection.tsx"
```

Expected: no `FeatureCard` or `CTAButton` lines. (`AnimatedSection` may still be imported by `app/privacy` and `app/terms`; keep it.) If anything still imports `FeatureCard` or `CTAButton`, migrate that file to `Button` first.

- [ ] **Step 2: Delete them and find unused CSS**

```bash
git rm components/FeatureCard.tsx components/CTAButton.tsx
for c in glass-panel text-glow neon-glow-cyan neon-glow-purple neon-glow-blue card-hover-effect bg-grid syntax-keyword syntax-string syntax-function syntax-comment syntax-constant shadow-neon neon-cyan neon-purple neon-blue background-light; do
  echo "$c: $(grep -rln -- "$c" app components lib --include=*.tsx --include=*.ts | grep -v globals.css | wc -l) uses"
done
```

Expected: a count per name. Delete from `app/globals.css` every rule or token whose count is `0`: `.glass-panel`, `.text-glow`, `.neon-glow-*`, `.card-hover-effect`, `.bg-grid`, `--shadow-neon*`, `--color-neon-*`, `--neon-*`. Keep any name with a non-zero count. The `.syntax-*` classes may be used by blog HTML strings in `lib/blog-data.ts` (the grep covers `lib`); keep them if so.

- [ ] **Step 3: Verify and commit**

```bash
npx tsc --noEmit && npm test && npm run build 2>&1 | grep -E "Compiled|rror"
git add -A components app/globals.css
git commit -m "chore: remove legacy FeatureCard, CTAButton and unused glow utilities"
```

Expected: no type errors, all tests pass, build succeeds. If the build fails because a page still uses a deleted class, restore that single rule and note it.

---

### Task 9: End-to-end verification

**Files:** none (fixes found here go in the file that owns the problem, with a commit per fix).

Run each command block in a single shell call; servers are started in the background and stopped with `pkill -f "[n]ext-server"` at the end of the block that started them.

- [ ] **Step 1: Build with realistic env vars and check the served HTML**

```bash
export NEXT_PUBLIC_APP_URL=https://app.maxtest.id NEXT_PUBLIC_MCP_URL=https://api.maxtest.id
npm run build >/dev/null 2>&1
(npm run start -- -p 3100 >/tmp/next.log 2>&1 &); sleep 5
for p in features pricing documentation blog blog/introducing-max-heal-playwright-auto-heal blog/stop-flaky-tests-rag-ai; do
  h=$(curl -s localhost:3100/$p)
  echo "$p h1=$(echo "$h" | grep -o '<h1' | wc -l) undefined/auth=$(echo "$h" | grep -c 'undefined/auth') status=$(curl -s -o /dev/null -w '%{http_code}' localhost:3100/$p)"
done
echo "pricing placeholders: $(curl -s localhost:3100/pricing | grep -o '\[300\]\|\[500\]\|\[3,000\]\|\[10,000\]' | sort -u | tr '\n' ' ')"
echo "pricing faq jsonld:   $(curl -s localhost:3100/pricing | grep -c 'FAQPage')"
echo "docs command:         $(curl -s localhost:3100/documentation | grep -c 'claude mcp add --transport http maxtest https://api.maxtest.id/mcp')"
echo "docs tools shown:     $(curl -s localhost:3100/documentation | grep -o 'maxtest_[a-z_]*' | sort -u | wc -l)"
echo "emoji anywhere:       $(for p in features pricing documentation blog blog/introducing-max-heal-playwright-auto-heal; do curl -s localhost:3100/$p; done | grep -cP '[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]')"
echo "banned claims:        $(for p in features pricing documentation blog; do curl -s localhost:3100/$p; done | grep -ciE 'zero flake|zero manual setup|enterprise-grade|advanced rag')"
pkill -f "[n]ext-server"
```

Expected: every page `h1=1`, `undefined/auth=0`, `status=200`; the four placeholders present; `FAQPage` count at least 1; the docs command found; the docs page lists 41 tool names (the count may include a few names mentioned in prose, so at least 41); `emoji anywhere: 0`; `banned claims: 0`. The blog post pages may legitimately contain "self-heal" wording (authored content), which is not in the banned regex used here.

- [ ] **Step 2: Unset-env fallback for Documentation**

```bash
unset NEXT_PUBLIC_APP_URL NEXT_PUBLIC_MCP_URL
npm run build >/dev/null 2>&1
(npm run start -- -p 3100 >/tmp/next.log 2>&1 &); sleep 5
echo "placeholder host: $(curl -s localhost:3100/documentation | grep -c 'your-maxtest-host')"
echo "pricing signup fallback: $(curl -s localhost:3100/pricing | grep -c 'href="/pricing"')"
echo "undefined/auth anywhere: $(for p in features pricing documentation blog; do curl -s localhost:3100/$p; done | grep -c 'undefined/auth')"
pkill -f "[n]ext-server"
```

Expected: placeholder host at least 1, signup fallback at least 1, `undefined/auth` 0.

- [ ] **Step 3: Manual browser pass (dev server)**

Run `npm run dev` and open each page at 360, 768, 1280 and 1440px. Check and fix anything off before continuing:

1. **No horizontal page scroll** on any page at 360px. The docs command and tool names scroll or wrap inside their panels; the pricing ledger is stacked per plan; blog code blocks scroll inside the column.
2. **Rules by eye:** no pills or badges anywhere; no bordered card grids; no emoji; the only shadows are hard lime offsets (buttons, bubbles, code blocks in posts); no glow.
3. **Product:** the rail highlights the chapter in view and its links jump to chapters; on small screens it is a horizontal list. Each chapter shows its character and bubble.
4. **Pricing:** the toggle changes prices (monthly and yearly) and is reachable and operable by keyboard; the Pro column has a lime top rule and a panel tint; placeholders are visibly dashed; FAQ items open and close by keyboard (Enter and Space).
5. **Docs:** the contents rail highlights the section in view; Copy command works; over plain `http://<LAN-IP>:3000` it fails gracefully and leaves the command selected.
6. **Blog:** the newest post has the larger headline; read times look plausible; post body lists use the lime marker; the cover image has a light border with no rounded-xl.
7. **Reduced motion:** with "prefers-reduced-motion: reduce" emulated, nothing fades or animates.
8. **Contrast:** `text-paper/55` captions and mono eyebrows are readable on `bg-ink` (at least 4.5:1; raise the opacity where not).

- [ ] **Step 4: Final checks and wrap-up**

```bash
npm test && npm run lint 2>&1 | grep problems && npm run build 2>&1 | grep -E "Compiled|rror"
git status --short
git log --oneline feat/landing-redesign..HEAD
```

Expected: all green, a clean tree, one commit per task. Report results (including anything skipped, such as Lighthouse or the manual pass) to the user, list the placeholder values still to fill in `lib/pricing.ts` (`grep -n '\[' lib/pricing.ts`), then use `superpowers:finishing-a-development-branch`.
