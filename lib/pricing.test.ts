import test from "node:test";
import assert from "node:assert/strict";
import { BANNED_PHRASES } from "./home-content.ts";
import { FAQ, isPlaceholder, PLANS, publishableFaq, ROWS } from "./pricing.ts";

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

test("structured data only includes FAQ answers with no unfilled placeholder", () => {
  const items = publishableFaq(FAQ);
  assert.ok(items.length >= 3 && items.length < FAQ.length);
  for (const item of items) assert.ok(!/\[[^\]]+\]/.test(`${item.question} ${item.answer}`), item.question);
  assert.ok(items.some((i) => i.question === "What counts as a runner minute?"));
});
