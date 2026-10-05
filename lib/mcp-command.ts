export const MCP_PLACEHOLDER_HOST = "<your-maxtest-host>";

export interface ConnectInfo {
  endpoint: string;
  command: string;
  configured: boolean;
}

/** Normalises the configured MCP host into a single `/mcp` endpoint URL. */
export function mcpEndpoint(raw: string | undefined): { endpoint: string; configured: boolean } {
  const base = (raw ?? "").trim().replace(/\/+$/, "");
  if (!base) return { endpoint: `${MCP_PLACEHOLDER_HOST}/mcp`, configured: false };
  const withScheme = /^https?:\/\//i.test(base) ? base : `https://${base}`;
  const endpoint = /\/mcp$/i.test(withScheme) ? withScheme : `${withScheme}/mcp`;
  return { endpoint, configured: true };
}

export function buildConnectCommand(raw?: string): ConnectInfo {
  const { endpoint, configured } = mcpEndpoint(raw);
  return {
    endpoint,
    configured,
    command: `claude mcp add --transport http maxtest ${endpoint} --header "Authorization: Bearer <your-token>"`,
  };
}
