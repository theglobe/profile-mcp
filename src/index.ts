/**
 * Cloudflare Worker entry point. Bridges the Workers fetch API to the
 * transport-agnostic handler in protocol.ts.
 */

import { handle } from "./protocol.js";

const MCP_PATH = "/mcp";

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname !== MCP_PATH) {
      return new Response(
        JSON.stringify({ error: "Not found", mcpEndpoint: MCP_PATH }),
        { status: 404, headers: { "content-type": "application/json" } },
      );
    }

    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => { headers[key] = value; });

    const body = request.method === "POST" ? await request.text() : "";
    const result = handle({ method: request.method, headers, body });

    return new Response(result.body === "" ? null : result.body, {
      status: result.status,
      headers: result.headers,
    });
  },
} satisfies ExportedHandler;
