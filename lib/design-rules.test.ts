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
  "components/ui/SectionRail.tsx",
  "app/features/page.tsx",
  "components/product/Chapter.tsx",
  "app/pricing/page.tsx",
  "components/pricing/PricingLedger.tsx",
  "components/pricing/Faq.tsx",
  "app/documentation/page.tsx",
  "components/docs/ToolsReference.tsx",
  "components/ui/CopyCommand.tsx",
  "app/blog/page.tsx",
  "app/blog/[slug]/page.tsx",
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
