
import {
  BIO, CONTACT, INSTRUCTIONS, PROFILE_URI, PROJECTS,
  SERVER_NAME, SERVER_VERSION, SKILLS,
} from "./content.js";

export const MODERN_VERSIONS = ["2026-07-28"] as const;
export const LEGACY_VERSIONS = ["2025-11-25", "2025-06-18", "2025-03-26"] as const;
export const SUPPORTED_VERSIONS: string[] = [...MODERN_VERSIONS, ...LEGACY_VERSIONS];

const DEFAULT_LEGACY_VERSION = "2025-06-18";

const HEADER_MISMATCH = -32020;
const UNSUPPORTED_PROTOCOL_VERSION = -32022;
const PARSE_ERROR = -32700;
const INVALID_REQUEST = -32600;
const METHOD_NOT_FOUND = -32601;
const INVALID_PARAMS = -32602;

const META_PROTOCOL_VERSION = "io.modelcontextprotocol/protocolVersion";
const META_SERVER_INFO = "io.modelcontextprotocol/serverInfo";

const TTL_MS = 3_600_000;

type Json = Record<string, unknown>;

export interface HttpLike {
  method: string;
  headers: Record<string, string>;
  body: string;
}

export interface HttpResult {
  status: number;
  headers: Record<string, string>;
  body: string;
}

const SERVER_INFO = { name: SERVER_NAME, version: SERVER_VERSION };

const JSON_HEADERS = { "content-type": "application/json" };

const CORS_HEADERS: Record<string, string> = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers":
    "content-type, mcp-protocol-version, mcp-method, mcp-name, authorization",
  "access-control-max-age": "86400",
};

const TOOLS = [
  {
    name: "get_bio",
    title: "Get biography",
    description: "The short professional biography of Jaroslav Kazejev.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_contact_info",
    title: "Get contact info",
    description: "The public contact details and the profile links.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "list_projects",
    title: "List projects",
    description: "The projects and the work.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "list_skills",
    title: "List skills",
    description: "The technical and professional skills.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
] as const;
// Keep this alphabetical order. The specification needs a constant order.

const RESOURCES = [
  {
    uri: PROFILE_URI,
    name: "profile",
    title: "Full profile",
    description: "The biography, the skills, the projects and the contact links in one JSON document.",
    mimeType: "application/json",
  },
] as const;

function profileDocument(): Json {
  return { bio: BIO, skills: SKILLS, projects: PROJECTS, contact: CONTACT };
}

function callTool(name: string): { text: string; structured: Json } | null {
  switch (name) {
    case "get_bio":
      return { text: BIO, structured: { bio: BIO } };
    case "list_skills":
      return { text: JSON.stringify(SKILLS, null, 2), structured: { skills: SKILLS } };
    case "list_projects":
      return { text: JSON.stringify(PROJECTS, null, 2), structured: { projects: PROJECTS } };
    case "get_contact_info":
      return { text: JSON.stringify(CONTACT, null, 2), structured: { contact: CONTACT } };
    default:
      return null;
  }
}

function ok(id: unknown, result: Json): Json {
  return { jsonrpc: "2.0", id, result };
}

function err(id: unknown, code: number, message: string, data?: Json): Json {
  const error: Json = { code, message };
  if (data !== undefined) error.data = data;
  return { jsonrpc: "2.0", id, error };
}

function unsupportedVersion(id: unknown, requested: string | null): Json {
  return err(id, UNSUPPORTED_PROTOCOL_VERSION, "Unsupported protocol version", {
    supported: SUPPORTED_VERSIONS,
    requested,
  });
}

export function decodeHeaderValue(value: string): string {
  if (value.startsWith("=?base64?") && value.endsWith("?=")) {
    const encoded = value.slice("=?base64?".length, -"?=".length);
    try {
      const bytes = Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0));
      return new TextDecoder().decode(bytes);
    } catch {
      return value;
    }
  }
  return value;
}

function nameSourceFor(method: string, params: Json): string | null {
  switch (method) {
    case "tools/call":
    case "prompts/get":
      return typeof params.name === "string" ? params.name : null;
    case "resources/read":
      return typeof params.uri === "string" ? params.uri : null;
    default:
      return null;
  }
}

function modernResult(result: Json): Json {
  return { resultType: "complete", ...result, _meta: { [META_SERVER_INFO]: SERVER_INFO } };
}

function cacheable(result: Json): Json {
  return modernResult({ ...result, ttlMs: TTL_MS, cacheScope: "public" });
}

function handleModern(id: unknown, method: string, params: Json): { body: Json; status: number } {
  switch (method) {
    case "server/discover":
      return {
        status: 200,
        body: ok(id, cacheable({
          supportedVersions: SUPPORTED_VERSIONS,
          capabilities: { tools: {}, resources: {} },
          instructions: INSTRUCTIONS,
        })),
      };

    case "tools/list":
      return { status: 200, body: ok(id, cacheable({ tools: TOOLS })) };

    case "tools/call": {
      const name = typeof params.name === "string" ? params.name : "";
      const called = callTool(name);
      if (!called) {
        return { status: 200, body: err(id, INVALID_PARAMS, `Unknown tool: ${name}`) };
      }
      return {
        status: 200,
        body: ok(id, modernResult({
          content: [{ type: "text", text: called.text }],
          structuredContent: called.structured,
          isError: false,
        })),
      };
    }

    case "resources/list":
      return { status: 200, body: ok(id, cacheable({ resources: RESOURCES })) };

    case "resources/templates/list":
      return { status: 200, body: ok(id, cacheable({ resourceTemplates: [] })) };

    case "resources/read": {
      const uri = typeof params.uri === "string" ? params.uri : "";
      if (uri !== PROFILE_URI) {
        // -32602 is correct. The 2026-07-28 revision replaced -32002.
        return { status: 200, body: err(id, INVALID_PARAMS, `Resource not found: ${uri}`) };
      }
      return {
        status: 200,
        body: ok(id, cacheable({
          contents: [{
            uri,
            mimeType: "application/json",
            text: JSON.stringify(profileDocument(), null, 2),
          }],
        })),
      };
    }

    case "prompts/list":
      return { status: 200, body: ok(id, cacheable({ prompts: [] })) };

    default:
      // Keep the 404 status. A client uses it to identify a modern server.
      return { status: 404, body: err(id, METHOD_NOT_FOUND, `Method not found: ${method}`) };
  }
}

function handleLegacy(id: unknown, method: string, params: Json): { body: Json; status: number } {
  switch (method) {
    case "initialize": {
      const requested = typeof params.protocolVersion === "string" ? params.protocolVersion : null;
      const negotiated =
        requested && (LEGACY_VERSIONS as readonly string[]).includes(requested)
          ? requested
          : DEFAULT_LEGACY_VERSION;
      return {
        status: 200,
        body: ok(id, {
          protocolVersion: negotiated,
          capabilities: { tools: {}, resources: {} },
          serverInfo: SERVER_INFO,
          instructions: INSTRUCTIONS,
        }),
      };
    }

    case "ping":
      return { status: 200, body: ok(id, {}) };

    case "tools/list":
      return { status: 200, body: ok(id, { tools: TOOLS }) };

    case "tools/call": {
      const name = typeof params.name === "string" ? params.name : "";
      const called = callTool(name);
      if (!called) {
        return { status: 200, body: err(id, INVALID_PARAMS, `Unknown tool: ${name}`) };
      }
      return {
        status: 200,
        body: ok(id, {
          content: [{ type: "text", text: called.text }],
          structuredContent: called.structured,
          isError: false,
        }),
      };
    }

    case "resources/list":
      return { status: 200, body: ok(id, { resources: RESOURCES }) };

    case "resources/templates/list":
      return { status: 200, body: ok(id, { resourceTemplates: [] }) };

    case "resources/read": {
      const uri = typeof params.uri === "string" ? params.uri : "";
      if (uri !== PROFILE_URI) {
        return { status: 200, body: err(id, INVALID_PARAMS, `Resource not found: ${uri}`) };
      }
      return {
        status: 200,
        body: ok(id, {
          contents: [{
            uri,
            mimeType: "application/json",
            text: JSON.stringify(profileDocument(), null, 2),
          }],
        }),
      };
    }

    case "prompts/list":
      return { status: 200, body: ok(id, { prompts: [] }) };

    default:
      return { status: 200, body: err(id, METHOD_NOT_FOUND, `Method not found: ${method}`) };
  }
}

function jsonResponse(status: number, body: Json): HttpResult {
  return {
    status,
    headers: { ...JSON_HEADERS, ...CORS_HEADERS },
    body: JSON.stringify(body),
  };
}

export function handle(req: HttpLike): HttpResult {
  const headers: Record<string, string> = {};
  for (const [k, v] of Object.entries(req.headers)) headers[k.toLowerCase()] = v;

  if (req.method === "OPTIONS") {
    return { status: 204, headers: { ...CORS_HEADERS }, body: "" };
  }
  if (req.method !== "POST") {
    // Keep the 405 status. The 2026-07-28 revision removed GET and DELETE.
    return {
      status: 405,
      headers: { ...JSON_HEADERS, ...CORS_HEADERS, allow: "POST, OPTIONS" },
      body: JSON.stringify(err(null, INVALID_REQUEST, "Only POST is supported")),
    };
  }

  let message: Json;
  try {
    message = JSON.parse(req.body) as Json;
  } catch {
    return jsonResponse(400, err(null, PARSE_ERROR, "Parse error"));
  }
  if (typeof message !== "object" || message === null || Array.isArray(message)) {
    return jsonResponse(400, err(null, INVALID_REQUEST, "Expected a single JSON-RPC message"));
  }

  const method = typeof message.method === "string" ? message.method : "";
  const params: Json =
    typeof message.params === "object" && message.params !== null
      ? (message.params as Json)
      : {};
  const id = "id" in message ? message.id : null;

  if (!("id" in message) || message.id === null || message.id === undefined) {
    return { status: 202, headers: { ...CORS_HEADERS }, body: "" };
  }

  const versionHeader = headers["mcp-protocol-version"] ?? null;
  const isModern = versionHeader !== null &&
    (MODERN_VERSIONS as readonly string[]).includes(versionHeader);

  if (!isModern) {
    if (versionHeader !== null && !(LEGACY_VERSIONS as readonly string[]).includes(versionHeader)) {
      return jsonResponse(400, unsupportedVersion(id, versionHeader));
    }
    const { body, status } = handleLegacy(id, method, params);
    return jsonResponse(status, body);
  }

  const meta = typeof params._meta === "object" && params._meta !== null
    ? (params._meta as Json)
    : {};
  const metaVersion = typeof meta[META_PROTOCOL_VERSION] === "string"
    ? (meta[META_PROTOCOL_VERSION] as string)
    : null;

  if (metaVersion !== null && metaVersion !== versionHeader) {
    return jsonResponse(400, err(id, HEADER_MISMATCH,
      `Header mismatch: MCP-Protocol-Version '${versionHeader}' does not match body value '${metaVersion}'`));
  }

  const methodHeader = headers["mcp-method"];
  if (methodHeader === undefined) {
    return jsonResponse(400, err(id, HEADER_MISMATCH, "Missing required header: Mcp-Method"));
  }
  if (methodHeader !== method) {
    return jsonResponse(400, err(id, HEADER_MISMATCH,
      `Header mismatch: Mcp-Method '${methodHeader}' does not match body value '${method}'`));
  }

  const nameSource = nameSourceFor(method, params);
  if (nameSource !== null) {
    const nameHeader = headers["mcp-name"];
    if (nameHeader === undefined) {
      return jsonResponse(400, err(id, HEADER_MISMATCH, "Missing required header: Mcp-Name"));
    }
    if (decodeHeaderValue(nameHeader) !== nameSource) {
      return jsonResponse(400, err(id, HEADER_MISMATCH,
        `Header mismatch: Mcp-Name '${nameHeader}' does not match body value '${nameSource}'`));
    }
  }

  const { body, status } = handleModern(id, method, params);
  return jsonResponse(status, body);
}
