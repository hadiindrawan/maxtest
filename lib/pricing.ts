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
