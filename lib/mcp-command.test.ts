import test from "node:test";
import assert from "node:assert/strict";
import { buildConnectCommand, mcpEndpoint, MCP_PLACEHOLDER_HOST } from "./mcp-command.ts";

test("unset host shows an obvious placeholder and is not configured", () => {
  assert.deepEqual(mcpEndpoint(undefined), { endpoint: `${MCP_PLACEHOLDER_HOST}/mcp`, configured: false });
  assert.deepEqual(mcpEndpoint("   "), { endpoint: `${MCP_PLACEHOLDER_HOST}/mcp`, configured: false });
});

test("appends /mcp to a bare host", () => {
  assert.equal(mcpEndpoint("https://api.maxtest.id").endpoint, "https://api.maxtest.id/mcp");
});

test("trailing slashes are removed before appending", () => {
  assert.equal(mcpEndpoint("https://api.maxtest.id//").endpoint, "https://api.maxtest.id/mcp");
});

test("does not double /mcp, in any case", () => {
  assert.equal(mcpEndpoint("https://api.maxtest.id/mcp").endpoint, "https://api.maxtest.id/mcp");
  assert.equal(mcpEndpoint("https://api.maxtest.id/MCP/").endpoint, "https://api.maxtest.id/MCP");
});

test("adds https when the scheme is missing, keeps http for local dev", () => {
  assert.equal(mcpEndpoint("api.maxtest.id").endpoint, "https://api.maxtest.id/mcp");
  assert.equal(mcpEndpoint("http://localhost:8081").endpoint, "http://localhost:8081/mcp");
});

test("buildConnectCommand matches the app's own connect command", () => {
  const { command, configured } = buildConnectCommand("https://api.maxtest.id");
  assert.equal(
    command,
    'claude mcp add --transport http maxtest https://api.maxtest.id/mcp --header "Authorization: Bearer <your-token>"',
  );
  assert.equal(configured, true);
});
