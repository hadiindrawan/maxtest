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
