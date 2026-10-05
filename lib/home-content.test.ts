import test from "node:test";
import assert from "node:assert/strict";
import {
  allHomeCopy,
  BANNED_PHRASES,
  CAST,
  DEFAULT_CAST_ROLE,
  HERO,
  summarizeResults,
  TOOL_COUNT_LABEL,
} from "./home-content.ts";

test("no copy contains an unverifiable claim", () => {
  for (const text of allHomeCopy()) {
    for (const phrase of BANNED_PHRASES) {
      assert.ok(!text.toLowerCase().includes(phrase), `"${phrase}" found in: ${text}`);
    }
  }
});

test("every tool name looks like a real maxtest_ tool", () => {
  const names = [...CAST.flatMap((c) => c.tools), ...HERO.toolCalls];
  assert.ok(names.length > 0);
  for (const name of names) assert.match(name, /^maxtest_[a-z_]+$/, name);
});

test("each cast member has a job, at least two tools, a prompt and a response", () => {
  assert.equal(CAST.length, 5);
  for (const c of CAST) {
    assert.ok(c.job.length > 10 && c.prompt.length > 3 && c.response.length >= 2, c.role);
    assert.ok(c.tools.length >= 2, c.role);
  }
  assert.equal(new Set(CAST.map((c) => c.role)).size, CAST.length);
});

test("the default selected cast member exists", () => {
  assert.ok(CAST.some((c) => c.role === DEFAULT_CAST_ROLE));
});

test("tool count is a conservative round label", () => {
  assert.equal(TOOL_COUNT_LABEL, "40+");
});

test("summarizeResults counts passes and failures", () => {
  assert.equal(summarizeResults(HERO.results), "5 passed, 3 failed");
  assert.equal(summarizeResults(["pass", "pass"]), "2 passed, 0 failed");
  assert.equal(summarizeResults(["fail"]), "0 passed, 1 failed");
  assert.equal(summarizeResults([]), "0 passed, 0 failed");
});

test("the hero bubble's failure count matches the result row", () => {
  const failed = HERO.results.filter((r) => r === "fail").length;
  assert.match(HERO.reply, new RegExp(`${failed} failures`));
});
