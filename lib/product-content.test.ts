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
