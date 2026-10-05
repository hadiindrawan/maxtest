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
