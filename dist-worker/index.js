var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/content.ts
var SERVER_NAME = "jaroslavkazejev-profile";
var SERVER_VERSION = "0.3.1";
var INSTRUCTIONS = "This server is read-only. It gives the professional profile of Jaroslav Kazejev, a software engineer who moves into AI engineering. get_profile_summary returns the complete profile in one response. query_profile takes a topic and returns the matching projects, skills and education.";
var HEADLINE = "Software engineer moving into AI engineering. Builds LLM agents, bots and the MCP tooling that agents use. Physics background from KTH.";
var LOCATION = "Stockholm, Sweden";
var AVAILABILITY = "Open to AI engineering and agent infrastructure roles.";
var BIO = `Jaroslav Kazejev is a software engineer in Stockholm, Sweden.

His background is C# and .NET, Java on Android, Python and shell scripting. He
holds a master's degree in physics from KTH.

He now moves into AI engineering. He works on the layer between models and the
systems they operate on: tools, protocols, memory and the interfaces that
agents use.

He builds LLM agents that run unattended. Sprout Buddy is a Telegram bot with a
tool-calling agent, fifteen tools, persistent memory and a reminder loop that
sends messages without a prompt from the user.

He also builds the tooling that agents consume. The server that answers this
request is his own work. It follows the MCP 2026-07-28 revision, and he wrote
it in the weeks after that revision was published.

He works with AI coding agents daily, and both projects above were built that
way.`;
var SKILLS = [
  { name: "LLM agents and tool calling", category: "ai", evidence: "Sprout Buddy" },
  { name: "Model Context Protocol (MCP)", category: "ai", evidence: "profile-mcp" },
  { name: "Agent tooling and tool design", category: "ai", evidence: "profile-mcp, Sprout Buddy" },
  { name: "Agent memory and scheduled autonomy", category: "ai", evidence: "Sprout Buddy" },
  { name: "Work with AI coding agents", category: "ai", evidence: "profile-mcp, Sprout Buddy" },
  { name: "Conversational bots", category: "ai", evidence: "Sprout Buddy" },
  { name: "Python", category: "language" },
  { name: "C#", category: "language", evidence: "MandelbrotSIMD" },
  { name: ".NET", category: "platform", evidence: "MandelbrotSIMD" },
  { name: "TypeScript", category: "language", evidence: "profile-mcp" },
  { name: "Cloudflare Workers", category: "platform", evidence: "profile-mcp" },
  { name: "SIMD and vectorisation", category: "performance", evidence: "MandelbrotSIMD" },
  { name: "Applied cryptography", category: "security", evidence: "cryptopals-challenges" },
  { name: "Java", category: "language" },
  { name: "Android", category: "platform" },
  { name: "Shell scripting", category: "language" }
];
var PROJECTS = [
  {
    name: "Sprout Buddy",
    year: "2026",
    summary: "A Telegram bot that looks after a person's houseplants through ordinary conversation. An LLM agent with fifteen tools, memory and reminders.",
    detail: "TypeScript, Express and Zod on Node, with PostgreSQL on Neon, deployed on Fly.io. A tool-calling agent gives the model fifteen tools: plants, care history, reminders and a small per-user memory that survives between conversations. A background loop checks each minute and sends a due reminder to the user without a prompt. The reminders keep the clock at the user's home through a daylight-saving change, and an occurrence missed during a deploy is skipped and not replayed. The agent has a per-user quota and a tool that sends the privacy notice. The model endpoint is any OpenAI-compatible provider.",
    url: "https://t.me/sproutbuddy_bot",
    tags: [
      "ai",
      "agents",
      "llm",
      "tool-calling",
      "bots",
      "telegram",
      "typescript",
      "postgres",
      "memory",
      "automation"
    ]
  },
  {
    name: "profile-mcp",
    year: "2026",
    summary: "An MCP server that makes this profile readable by AI agents. It is the server that answers this request.",
    detail: "A dependency-free MCP server on Cloudflare Workers. The MCP 2026-07-28 revision removed the initialize handshake and protocol-level sessions, thus it needs a different architecture from earlier revisions. This server supports both eras on one endpoint and selects the era for each request. It implements server/discover, per-request _meta, the mirrored header validation with the base64 sentinel format, and the cache fields on list results. The site also publishes a SEP-1649 server card at /.well-known/mcp/server-card.json for agent discovery.",
    url: "https://github.com/theglobe/profile-mcp",
    tags: [
      "ai",
      "mcp",
      "agents",
      "typescript",
      "cloudflare",
      "protocol",
      "api",
      "tool-calling"
    ]
  },
  {
    name: "MandelbrotSIMD",
    year: "2024",
    summary: "A fast Mandelbrot generator in C# that uses the SIMD instructions of the processor.",
    detail: "Managed code cannot call the intrinsic SSE and AVX functions directly. This project uses System.Numerics.Vectors to reach them, together with multiprocessing. The library reports the number of values that one instruction can calculate, thus one code path serves each SIMD level. Vectorisation of this kind is the same technique that numerical and machine learning workloads depend on.",
    url: "https://github.com/theglobe/MandelbrotSIMD",
    tags: ["performance", "simd", "csharp", "dotnet", "numerical"]
  },
  {
    name: "cryptopals-challenges",
    year: "2025",
    summary: "Solutions to the Cryptopals cryptographic challenges.",
    detail: "The Cryptopals set is a sequence of attacks on real cryptographic errors. The work needs exact bit-level handling and careful reasoning about failure.",
    url: "https://github.com/theglobe/cryptopals-challenges",
    tags: ["security", "cryptography", "algorithms"]
  }
];
var EDUCATION = [
  {
    qualification: "Master's degree, physics",
    institution: "KTH Royal Institute of Technology, Stockholm",
    year: "2007",
    detail: "Thesis: Studies of Neutron Backgrounds for PoGOLite, a Balloon-borne Gamma-ray Polarimeter (TRITA-FYS-2007:62). The work modelled the neutron background of a balloon-borne astrophysics instrument. It gives a quantitative and experimental foundation for numerical work.",
    url: "https://kazejev.com/thesis.pdf",
    tags: ["education", "physics", "kth", "numerical", "research"]
  }
];
var CONTACT = [
  { kind: "website", value: "https://kazejev.com" },
  { kind: "linkedin", value: "https://www.linkedin.com/in/jaroslavkazejev/" },
  { kind: "github", value: "https://github.com/theglobe" },
  { kind: "blog", value: "http://kazzapp.com" }
];
var PROFILE_URI = "kazejev://profile";

// src/protocol.ts
var MODERN_VERSIONS = ["2026-07-28"];
var LEGACY_VERSIONS = ["2025-11-25", "2025-06-18", "2025-03-26"];
var SUPPORTED_VERSIONS = [...MODERN_VERSIONS, ...LEGACY_VERSIONS];
var DEFAULT_LEGACY_VERSION = "2025-06-18";
var HEADER_MISMATCH = -32020;
var UNSUPPORTED_PROTOCOL_VERSION = -32022;
var PARSE_ERROR = -32700;
var INVALID_REQUEST = -32600;
var METHOD_NOT_FOUND = -32601;
var INVALID_PARAMS = -32602;
var META_PROTOCOL_VERSION = "io.modelcontextprotocol/protocolVersion";
var META_SERVER_INFO = "io.modelcontextprotocol/serverInfo";
var TTL_MS = 36e5;
var SERVER_INFO = { name: SERVER_NAME, version: SERVER_VERSION };
var JSON_HEADERS = { "content-type": "application/json" };
var CORS_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers": "content-type, mcp-protocol-version, mcp-method, mcp-name, authorization",
  "access-control-max-age": "86400"
};
var TOOLS = [
  {
    name: "get_bio",
    title: "Get biography",
    description: "The short professional biography of Jaroslav Kazejev.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false }
  },
  {
    name: "get_contact_info",
    title: "Get contact info",
    description: "The public contact details and the profile links.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false }
  },
  {
    name: "get_profile_summary",
    title: "Get the profile summary",
    description: "The complete profile in one response: headline, location, work status, focus, the strongest work, the main skills, education and links.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false }
  },
  {
    name: "list_projects",
    title: "List projects",
    description: "The projects and the work.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false }
  },
  {
    name: "list_skills",
    title: "List skills",
    description: "The technical and professional skills.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false }
  },
  {
    name: "query_profile",
    title: "Query the profile",
    description: 'Searches the profile for a topic and returns the evidence behind it. The topic is a subject, a technology or a skill, for example "MCP", "C# performance", "cryptography" or "physics". The result gives the projects, skills and education that match, with the detail.',
    inputSchema: {
      type: "object",
      properties: {
        topic: {
          type: "string",
          description: "The subject, technology or skill to search for."
        }
      },
      required: ["topic"],
      additionalProperties: false
    }
  }
];
var RESOURCES = [
  {
    uri: PROFILE_URI,
    name: "profile",
    title: "Full profile",
    description: "The biography, the skills, the projects and the contact links in one JSON document.",
    mimeType: "application/json"
  }
];
function profileDocument() {
  return {
    name: "Jaroslav Kazejev",
    headline: HEADLINE,
    location: LOCATION,
    availability: AVAILABILITY,
    bio: BIO,
    skills: SKILLS,
    projects: PROJECTS,
    education: EDUCATION,
    contact: CONTACT
  };
}
__name(profileDocument, "profileDocument");
function profileSummary() {
  return {
    name: "Jaroslav Kazejev",
    headline: HEADLINE,
    location: LOCATION,
    availability: AVAILABILITY,
    focus: "AI engineering and agent infrastructure",
    highlights: PROJECTS.map((p) => ({
      name: p.name,
      year: p.year,
      summary: p.summary,
      url: p.url
    })),
    topSkills: SKILLS.filter((s) => s.category === "ai" || s.evidence !== void 0).map((s) => s.name),
    education: EDUCATION.map((e) => ({
      qualification: e.qualification,
      institution: e.institution,
      year: e.year
    })),
    links: CONTACT,
    note: "query_profile takes a topic and returns the evidence behind any item."
  };
}
__name(profileSummary, "profileSummary");
function searchProfile(topic) {
  const terms = topic.toLowerCase().split(/[^a-z0-9#+.]+/i).filter((t) => t.length > 1);
  if (terms.length === 0) return [];
  const score = /* @__PURE__ */ __name((hay, weight) => {
    let total = 0;
    hay.forEach((field, i) => {
      const f = field.toLowerCase();
      for (const t of terms) if (f.includes(t)) total += weight[i];
    });
    return total;
  }, "score");
  const out = [];
  for (const p of PROJECTS) {
    const n = score([p.name, p.tags.join(" "), p.summary, p.detail], [6, 5, 3, 1]);
    if (n > 0) out.push({ kind: "project", title: `${p.name} (${p.year})`, detail: p.detail, url: p.url, score: n });
  }
  for (const e of EDUCATION) {
    const n = score([e.qualification, e.tags.join(" "), e.institution, e.detail], [5, 5, 3, 1]);
    if (n > 0) out.push({ kind: "education", title: `${e.qualification}, ${e.institution} (${e.year})`, detail: e.detail, url: e.url, score: n });
  }
  for (const s of SKILLS) {
    const n = score([s.name, s.category, s.evidence ?? ""], [6, 3, 2]);
    if (n > 0) {
      const ev = s.evidence ? ` Evidence: ${s.evidence}.` : "";
      out.push({ kind: "skill", title: s.name, detail: `Category: ${s.category}.${ev}`, score: n });
    }
  }
  return out.sort((a, b) => b.score - a.score);
}
__name(searchProfile, "searchProfile");
function callTool(name, args) {
  switch (name) {
    case "get_bio":
      return { text: BIO, structured: { bio: BIO } };
    case "list_skills":
      return { text: JSON.stringify(SKILLS, null, 2), structured: { skills: SKILLS } };
    case "list_projects":
      return { text: JSON.stringify(PROJECTS, null, 2), structured: { projects: PROJECTS } };
    case "get_contact_info":
      return { text: JSON.stringify(CONTACT, null, 2), structured: { contact: CONTACT } };
    case "get_profile_summary": {
      const s = profileSummary();
      return { text: JSON.stringify(s, null, 2), structured: s };
    }
    case "query_profile": {
      const topic = typeof args.topic === "string" ? args.topic : "";
      const matches = searchProfile(topic);
      if (matches.length === 0) {
        const topics = [...new Set(PROJECTS.flatMap((p) => p.tags).concat(EDUCATION.flatMap((e) => e.tags)))].sort();
        const text = `No match for "${topic}". Known topics: ${topics.join(", ")}.`;
        return { text, structured: { topic, matches: [], knownTopics: topics } };
      }
      const lines = matches.map((m) => {
        const url = m.url ? `
  ${m.url}` : "";
        return `[${m.kind}] ${m.title}
  ${m.detail}${url}`;
      });
      return {
        text: `Matches for "${topic}":

${lines.join("\n\n")}`,
        structured: { topic, matches: matches.map(({ score: _s, ...m }) => m) }
      };
    }
    default:
      return null;
  }
}
__name(callTool, "callTool");
function ok(id, result) {
  return { jsonrpc: "2.0", id, result };
}
__name(ok, "ok");
function err(id, code, message, data) {
  const error = { code, message };
  if (data !== void 0) error.data = data;
  return { jsonrpc: "2.0", id, error };
}
__name(err, "err");
function unsupportedVersion(id, requested) {
  return err(id, UNSUPPORTED_PROTOCOL_VERSION, "Unsupported protocol version", {
    supported: SUPPORTED_VERSIONS,
    requested
  });
}
__name(unsupportedVersion, "unsupportedVersion");
function decodeHeaderValue(value) {
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
__name(decodeHeaderValue, "decodeHeaderValue");
function nameSourceFor(method, params) {
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
__name(nameSourceFor, "nameSourceFor");
function modernResult(result) {
  return { resultType: "complete", ...result, _meta: { [META_SERVER_INFO]: SERVER_INFO } };
}
__name(modernResult, "modernResult");
function cacheable(result) {
  return modernResult({ ...result, ttlMs: TTL_MS, cacheScope: "public" });
}
__name(cacheable, "cacheable");
function handleModern(id, method, params) {
  switch (method) {
    case "server/discover":
      return {
        status: 200,
        body: ok(id, cacheable({
          supportedVersions: SUPPORTED_VERSIONS,
          capabilities: { tools: {}, resources: {} },
          instructions: INSTRUCTIONS
        }))
      };
    case "tools/list":
      return { status: 200, body: ok(id, cacheable({ tools: TOOLS })) };
    case "tools/call": {
      const name = typeof params.name === "string" ? params.name : "";
      const args = typeof params.arguments === "object" && params.arguments !== null ? params.arguments : {};
      const called = callTool(name, args);
      if (!called) {
        return { status: 200, body: err(id, INVALID_PARAMS, `Unknown tool: ${name}`) };
      }
      return {
        status: 200,
        body: ok(id, modernResult({
          content: [{ type: "text", text: called.text }],
          structuredContent: called.structured,
          isError: false
        }))
      };
    }
    case "resources/list":
      return { status: 200, body: ok(id, cacheable({ resources: RESOURCES })) };
    case "resources/templates/list":
      return { status: 200, body: ok(id, cacheable({ resourceTemplates: [] })) };
    case "resources/read": {
      const uri = typeof params.uri === "string" ? params.uri : "";
      if (uri !== PROFILE_URI) {
        return { status: 200, body: err(id, INVALID_PARAMS, `Resource not found: ${uri}`) };
      }
      return {
        status: 200,
        body: ok(id, cacheable({
          contents: [{
            uri,
            mimeType: "application/json",
            text: JSON.stringify(profileDocument(), null, 2)
          }]
        }))
      };
    }
    case "prompts/list":
      return { status: 200, body: ok(id, cacheable({ prompts: [] })) };
    default:
      return { status: 404, body: err(id, METHOD_NOT_FOUND, `Method not found: ${method}`) };
  }
}
__name(handleModern, "handleModern");
function handleLegacy(id, method, params) {
  switch (method) {
    case "initialize": {
      const requested = typeof params.protocolVersion === "string" ? params.protocolVersion : null;
      const negotiated = requested && LEGACY_VERSIONS.includes(requested) ? requested : DEFAULT_LEGACY_VERSION;
      return {
        status: 200,
        body: ok(id, {
          protocolVersion: negotiated,
          capabilities: { tools: {}, resources: {} },
          serverInfo: SERVER_INFO,
          instructions: INSTRUCTIONS
        })
      };
    }
    case "ping":
      return { status: 200, body: ok(id, {}) };
    case "tools/list":
      return { status: 200, body: ok(id, { tools: TOOLS }) };
    case "tools/call": {
      const name = typeof params.name === "string" ? params.name : "";
      const args = typeof params.arguments === "object" && params.arguments !== null ? params.arguments : {};
      const called = callTool(name, args);
      if (!called) {
        return { status: 200, body: err(id, INVALID_PARAMS, `Unknown tool: ${name}`) };
      }
      return {
        status: 200,
        body: ok(id, {
          content: [{ type: "text", text: called.text }],
          structuredContent: called.structured,
          isError: false
        })
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
            text: JSON.stringify(profileDocument(), null, 2)
          }]
        })
      };
    }
    case "prompts/list":
      return { status: 200, body: ok(id, { prompts: [] }) };
    default:
      return { status: 200, body: err(id, METHOD_NOT_FOUND, `Method not found: ${method}`) };
  }
}
__name(handleLegacy, "handleLegacy");
function jsonResponse(status, body) {
  return {
    status,
    headers: { ...JSON_HEADERS, ...CORS_HEADERS },
    body: JSON.stringify(body)
  };
}
__name(jsonResponse, "jsonResponse");
function handle(req) {
  const headers = {};
  for (const [k, v] of Object.entries(req.headers)) headers[k.toLowerCase()] = v;
  if (req.method === "OPTIONS") {
    return { status: 204, headers: { ...CORS_HEADERS }, body: "" };
  }
  if (req.method !== "POST") {
    return {
      status: 405,
      headers: { ...JSON_HEADERS, ...CORS_HEADERS, allow: "POST, OPTIONS" },
      body: JSON.stringify(err(null, INVALID_REQUEST, "Only POST is supported"))
    };
  }
  let message;
  try {
    message = JSON.parse(req.body);
  } catch {
    return jsonResponse(400, err(null, PARSE_ERROR, "Parse error"));
  }
  if (typeof message !== "object" || message === null || Array.isArray(message)) {
    return jsonResponse(400, err(null, INVALID_REQUEST, "Expected a single JSON-RPC message"));
  }
  const method = typeof message.method === "string" ? message.method : "";
  const params = typeof message.params === "object" && message.params !== null ? message.params : {};
  const id = "id" in message ? message.id : null;
  if (!("id" in message) || message.id === null || message.id === void 0) {
    return { status: 202, headers: { ...CORS_HEADERS }, body: "" };
  }
  const versionHeader = headers["mcp-protocol-version"] ?? null;
  const isModern = versionHeader !== null && MODERN_VERSIONS.includes(versionHeader);
  if (!isModern) {
    if (versionHeader !== null && !LEGACY_VERSIONS.includes(versionHeader)) {
      return jsonResponse(400, unsupportedVersion(id, versionHeader));
    }
    const { body: body2, status: status2 } = handleLegacy(id, method, params);
    return jsonResponse(status2, body2);
  }
  const meta = typeof params._meta === "object" && params._meta !== null ? params._meta : {};
  const metaVersion = typeof meta[META_PROTOCOL_VERSION] === "string" ? meta[META_PROTOCOL_VERSION] : null;
  if (metaVersion !== null && metaVersion !== versionHeader) {
    return jsonResponse(400, err(
      id,
      HEADER_MISMATCH,
      `Header mismatch: MCP-Protocol-Version '${versionHeader}' does not match body value '${metaVersion}'`
    ));
  }
  const methodHeader = headers["mcp-method"];
  if (methodHeader === void 0) {
    return jsonResponse(400, err(id, HEADER_MISMATCH, "Missing required header: Mcp-Method"));
  }
  if (methodHeader !== method) {
    return jsonResponse(400, err(
      id,
      HEADER_MISMATCH,
      `Header mismatch: Mcp-Method '${methodHeader}' does not match body value '${method}'`
    ));
  }
  const nameSource = nameSourceFor(method, params);
  if (nameSource !== null) {
    const nameHeader = headers["mcp-name"];
    if (nameHeader === void 0) {
      return jsonResponse(400, err(id, HEADER_MISMATCH, "Missing required header: Mcp-Name"));
    }
    if (decodeHeaderValue(nameHeader) !== nameSource) {
      return jsonResponse(400, err(
        id,
        HEADER_MISMATCH,
        `Header mismatch: Mcp-Name '${nameHeader}' does not match body value '${nameSource}'`
      ));
    }
  }
  const { body, status } = handleModern(id, method, params);
  return jsonResponse(status, body);
}
__name(handle, "handle");

// src/index.ts
var MCP_PATH = "/mcp";
var index_default = {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname !== MCP_PATH) {
      return new Response(
        JSON.stringify({ error: "Not found", mcpEndpoint: MCP_PATH }),
        { status: 404, headers: { "content-type": "application/json" } }
      );
    }
    const headers = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });
    const body = request.method === "POST" ? await request.text() : "";
    const result = handle({ method: request.method, headers, body });
    return new Response(result.body === "" ? null : result.body, {
      status: result.status,
      headers: result.headers
    });
  }
};
export {
  index_default as default
};
//# sourceMappingURL=index.js.map
