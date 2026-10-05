import type { Role } from "./characters.ts";

export type ResultStatus = "pass" | "fail";

/** About 40 tools. Verify against the backend registry (app/mcp/registry.py in akewops-be); keep "40+" only while true. */
export const TOOL_COUNT_LABEL = "40+";

/** Claims removed from the old page because the product code does not back them. */
export const BANNED_PHRASES = [
  "zero flake",
  "zero manual setup",
  "self-heal",
  "enterprise-grade",
  "advanced rag",
  "no credit card",
] as const;

export const HERO = {
  headline: ["Ask your agent.", "Max does the testing."] as [string, string],
  sub: "Maxtest is the test platform your AI agent can operate. Write cases, run suites and triage failures from Claude, Cursor or any MCP client.",
  prompt: "run the checkout suite",
  toolCalls: ["maxtest_run_suite", "maxtest_search_execution_history"],
  reply: "Found 3 failures. Filing Jira.",
  results: ["pass", "pass", "pass", "pass", "fail", "pass", "fail", "fail"] as ResultStatus[],
};

export function summarizeResults(results: readonly ResultStatus[]): string {
  const failed = results.filter((r) => r === "fail").length;
  return `${results.length - failed} passed, ${failed} failed`;
}

export const CONNECT = {
  tag: "Connect in a minute",
  title: "Plug Max into your agent.",
  body: `One command adds Maxtest's ${TOOL_COUNT_LABEL} tools to Claude Code. Tokens are personal access tokens you create in the dashboard.`,
  oauth: "Clients that support OAuth can connect with just the URL and a consent screen. No token to paste.",
};

export interface CastMember {
  role: Extract<Role, "writer" | "runner" | "detective" | "scribe" | "reporter">;
  name: string;
  job: string;
  tools: string[];
  prompt: string;
  response: string[];
}

export const DEFAULT_CAST_ROLE: CastMember["role"] = "runner";

export const CAST: CastMember[] = [
  {
    role: "writer",
    name: "The Writer",
    job: "Turns a Jira ticket into test cases and stages them for your review.",
    tools: ["maxtest_get_jira_issue", "maxtest_propose_test_cases", "maxtest_search_test_cases"],
    prompt: "write test cases for the checkout ticket",
    response: ["maxtest_get_jira_issue ✓", "maxtest_propose_test_cases ✓", "Drafts staged. Waiting for your approval."],
  },
  {
    role: "runner",
    name: "The Runner",
    job: "Runs a suite on the Pancake Runner and follows the executions.",
    tools: ["maxtest_find_suite", "maxtest_run_suite", "maxtest_run_execution"],
    prompt: "run the checkout suite",
    response: ["maxtest_find_suite ✓", "maxtest_run_suite ✓", "Run started. Polling executions."],
  },
  {
    role: "detective",
    name: "The Detective",
    job: "Searches past executions by meaning to find out why something failed.",
    tools: ["maxtest_search_execution_history", "maxtest_get_test_execution", "maxtest_search_executions"],
    prompt: "why did checkout fail last night?",
    response: ["maxtest_search_execution_history ✓", "maxtest_get_test_execution ✓", "Here are the failing attempts, with stage and error."],
  },
  {
    role: "scribe",
    name: "The Scribe",
    job: "Records results in bulk and attaches screenshots and logs as evidence.",
    tools: ["maxtest_update_execution_statuses", "maxtest_attach_to_execution", "maxtest_create_attachment_upload"],
    prompt: "mark the flaky ones skipped and attach the logs",
    response: ["maxtest_create_attachment_upload ✓", "maxtest_update_execution_statuses ✓", "Results and evidence recorded."],
  },
  {
    role: "reporter",
    name: "The Reporter",
    job: "Generates the report for a finished launch and finds earlier ones.",
    tools: ["maxtest_generate_report", "maxtest_get_report", "maxtest_list_reports"],
    prompt: "report on the last launch",
    response: ["maxtest_generate_report ✓", "maxtest_get_report ✓", "Report ready."],
  },
];

export const CONTROL = {
  tag: "You stay in control",
  title: "The Gatekeeper checks everything.",
  facts: [
    {
      title: "Drafts need your approval",
      body: "AI-written test cases are staged in a review queue. Nothing becomes a real test case until a person approves it.",
    },
    {
      title: "Risky tools start switched off",
      body: "Only read tools are on by default. Write, run and external tools stay off until a company admin enables them.",
    },
    {
      title: "Every call is audited",
      body: "Calls are logged, limited to read, write, execute or external scopes, and checked against your project permissions.",
    },
  ],
};

export const DASHBOARD = {
  tag: "Also in the dashboard",
  title: "Everything your agent touches, visible to your team.",
  items: [
    "AI test generation from your documents",
    "Visual workflows",
    "Test plans and launches",
    "QA metrics",
    "Jira and Slack integrations",
  ],
};

export const PRICING_TEASER = {
  line: "Free to start. Pay for what you run.",
  cta: "See pricing",
};

export const FINAL_CTA = {
  title: "Put Max to work.",
};

/** Every visitor-facing string, for the copy-rule test. */
export function allHomeCopy(): string[] {
  return [
    ...HERO.headline,
    HERO.sub,
    HERO.prompt,
    HERO.reply,
    CONNECT.tag,
    CONNECT.title,
    CONNECT.body,
    CONNECT.oauth,
    ...CAST.flatMap((c) => [c.name, c.job, c.prompt, ...c.response]),
    CONTROL.tag,
    CONTROL.title,
    ...CONTROL.facts.flatMap((f) => [f.title, f.body]),
    DASHBOARD.tag,
    DASHBOARD.title,
    ...DASHBOARD.items,
    PRICING_TEASER.line,
    PRICING_TEASER.cta,
    FINAL_CTA.title,
  ];
}
