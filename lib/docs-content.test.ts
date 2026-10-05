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
