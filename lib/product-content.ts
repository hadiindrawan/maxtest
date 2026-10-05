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
