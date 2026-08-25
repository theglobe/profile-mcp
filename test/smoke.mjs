
import assert from "node:assert/strict";
import { handle } from "../dist/protocol.js";

let passed = 0;
const check = (name, fn) => {
  fn();
  passed++;
  console.log(`  ok  ${name}`);
};

const MODERN = "2026-07-28";
const meta = { "io.modelcontextprotocol/protocolVersion": MODERN };

const post = (headers, body) =>
  handle({ method: "POST", headers, body: JSON.stringify(body) });

const json = (res) => JSON.parse(res.body);

console.log("modern (2026-07-28)");

check("server/discover sends the versions and the capabilities", () => {
  const res = post(
    { "MCP-Protocol-Version": MODERN, "Mcp-Method": "server/discover" },
    { jsonrpc: "2.0", id: 1, method: "server/discover", params: { _meta: meta } },
  );
  assert.equal(res.status, 200);
  const r = json(res).result;
  assert.equal(r.resultType, "complete");
  assert.ok(r.supportedVersions.includes(MODERN));
  assert.deepEqual(r.capabilities, { tools: {}, resources: {} });
  assert.equal(r._meta["io.modelcontextprotocol/serverInfo"].name, "kazejev-personal");
  assert.equal(typeof r.ttlMs, "number");
  assert.equal(r.cacheScope, "public");
});

check("get_profile_summary gives the triage fields", () => {
  const res = post(
    { "MCP-Protocol-Version": MODERN, "Mcp-Method": "tools/call", "Mcp-Name": "get_profile_summary" },
    { jsonrpc: "2.0", id: 20, method: "tools/call",
      params: { name: "get_profile_summary", arguments: {}, _meta: meta } },
  );
  const s = json(res).result.structuredContent;
  for (const k of ["name", "headline", "location", "availability", "focus", "highlights", "topSkills", "education", "links"]) {
    assert.ok(k in s, `summary must have ${k}`);
  }
  assert.ok(s.highlights.length > 0);
});

check("query_profile finds the MCP work", () => {
  const res = post(
    { "MCP-Protocol-Version": MODERN, "Mcp-Method": "tools/call", "Mcp-Name": "query_profile" },
    { jsonrpc: "2.0", id: 21, method: "tools/call",
      params: { name: "query_profile", arguments: { topic: "MCP" }, _meta: meta } },
  );
  const r = json(res).result;
  const m = r.structuredContent.matches;
  assert.ok(m.length > 0, "must find a match for MCP");
  assert.equal(m[0].title.startsWith("profile-mcp"), true, "profile-mcp must rank first");
  assert.ok(r.content[0].text.includes("profile-mcp"));
});

check("query_profile ranks C# performance onto MandelbrotSIMD", () => {
  const res = post(
    { "MCP-Protocol-Version": MODERN, "Mcp-Method": "tools/call", "Mcp-Name": "query_profile" },
    { jsonrpc: "2.0", id: 22, method: "tools/call",
      params: { name: "query_profile", arguments: { topic: "simd performance" }, _meta: meta } },
  );
  const m = json(res).result.structuredContent.matches;
  assert.ok(m.some((x) => x.title.startsWith("MandelbrotSIMD")));
});

check("query_profile with no match lists the known topics", () => {
  const res = post(
    { "MCP-Protocol-Version": MODERN, "Mcp-Method": "tools/call", "Mcp-Name": "query_profile" },
    { jsonrpc: "2.0", id: 23, method: "tools/call",
      params: { name: "query_profile", arguments: { topic: "underwater basket weaving" }, _meta: meta } },
  );
  const s = json(res).result.structuredContent;
  assert.deepEqual(s.matches, []);
  assert.ok(s.knownTopics.includes("mcp"));
});

check("tools/list sends a cache time and a constant order", () => {
  const res = post(
    { "MCP-Protocol-Version": MODERN, "Mcp-Method": "tools/list" },
    { jsonrpc: "2.0", id: 2, method: "tools/list", params: { _meta: meta } },
  );
  const r = json(res).result;
  const names = r.tools.map((t) => t.name);
  assert.deepEqual(names, ["get_bio", "get_contact_info", "get_profile_summary", "list_projects", "list_skills", "query_profile"]);
  assert.deepEqual(names, [...names].sort());
  assert.equal(typeof r.ttlMs, "number");
});

check("tools/call sends the content", () => {
  const res = post(
    { "MCP-Protocol-Version": MODERN, "Mcp-Method": "tools/call", "Mcp-Name": "get_bio" },
    { jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "get_bio", _meta: meta } },
  );
  const r = json(res).result;
  assert.equal(r.resultType, "complete");
  assert.equal(r.content[0].type, "text");
  assert.ok(r.content[0].text.length > 0);
});

check("the server rejects a request that has no Mcp-Method header", () => {
  const res = post(
    { "MCP-Protocol-Version": MODERN },
    { jsonrpc: "2.0", id: 4, method: "tools/list", params: { _meta: meta } },
  );
  assert.equal(res.status, 400);
  assert.equal(json(res).error.code, -32020);
});

check("the server rejects an Mcp-Name header that disagrees with the body", () => {
  const res = post(
    { "MCP-Protocol-Version": MODERN, "Mcp-Method": "tools/call", "Mcp-Name": "wrong" },
    { jsonrpc: "2.0", id: 5, method: "tools/call", params: { name: "get_bio", _meta: meta } },
  );
  assert.equal(res.status, 400);
  assert.equal(json(res).error.code, -32020);
});

check("the server decodes a base64 Mcp-Name header before the comparison", () => {
  const encoded = "=?base64?" + Buffer.from("kazejev://profile", "utf8").toString("base64") + "?=";
  const res = post(
    { "MCP-Protocol-Version": MODERN, "Mcp-Method": "resources/read", "Mcp-Name": encoded },
    { jsonrpc: "2.0", id: 6, method: "resources/read", params: { uri: "kazejev://profile", _meta: meta } },
  );
  assert.equal(res.status, 200);
  assert.ok(json(res).result.contents[0].text.includes("bio"));
});

check("the server rejects a _meta version that disagrees with the header", () => {
  const res = post(
    { "MCP-Protocol-Version": MODERN, "Mcp-Method": "tools/list" },
    {
      jsonrpc: "2.0", id: 7, method: "tools/list",
      params: { _meta: { "io.modelcontextprotocol/protocolVersion": "2025-06-18" } },
    },
  );
  assert.equal(res.status, 400);
  assert.equal(json(res).error.code, -32020);
});

check("the server sends 404 and -32601 for an unknown method", () => {
  const res = post(
    { "MCP-Protocol-Version": MODERN, "Mcp-Method": "nope/nope" },
    { jsonrpc: "2.0", id: 8, method: "nope/nope", params: { _meta: meta } },
  );
  assert.equal(res.status, 404);
  assert.equal(json(res).error.code, -32601);
});

check("the server sends -32022 and the supported versions for an unknown version", () => {
  const res = post(
    { "MCP-Protocol-Version": "1900-01-01", "Mcp-Method": "tools/list" },
    { jsonrpc: "2.0", id: 9, method: "tools/list", params: {} },
  );
  assert.equal(res.status, 400);
  const e = json(res).error;
  assert.equal(e.code, -32022);
  assert.ok(e.data.supported.includes(MODERN));
  assert.equal(e.data.requested, "1900-01-01");
});

check("the server sends -32602 for an unknown resource", () => {
  const res = post(
    { "MCP-Protocol-Version": MODERN, "Mcp-Method": "resources/read", "Mcp-Name": "kazejev://nope" },
    { jsonrpc: "2.0", id: 10, method: "resources/read", params: { uri: "kazejev://nope", _meta: meta } },
  );
  assert.equal(json(res).error.code, -32602);
});

console.log("legacy (the initialize handshake)");

check("initialize selects a legacy version", () => {
  const res = post({}, {
    jsonrpc: "2.0", id: 11, method: "initialize",
    params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "c", version: "1" } },
  });
  const r = json(res).result;
  assert.equal(r.protocolVersion, "2025-06-18");
  assert.equal(r.serverInfo.name, "kazejev-personal");
  assert.equal(r.resultType, undefined, "a legacy result must not have resultType");
});

check("a legacy tools/call operates with no modern headers", () => {
  const res = post({}, {
    jsonrpc: "2.0", id: 12, method: "tools/call", params: { name: "list_skills" },
  });
  const r = json(res).result;
  assert.ok(r.content[0].text.length > 0);
  assert.equal(r.ttlMs, undefined, "a legacy result must not have ttlMs");
});

check("the server answers a legacy ping", () => {
  const res = post({}, { jsonrpc: "2.0", id: 13, method: "ping", params: {} });
  assert.deepEqual(json(res).result, {});
});

console.log("transport");

check("the server sends 405 for a GET request", () => {
  const res = handle({ method: "GET", headers: {}, body: "" });
  assert.equal(res.status, 405);
  assert.equal(res.headers.allow, "POST, OPTIONS");
});

check("the server sends 405 for a DELETE request", () => {
  assert.equal(handle({ method: "DELETE", headers: {}, body: "" }).status, 405);
});

check("the server sends 202 and no body for a notification", () => {
  const res = post({}, { jsonrpc: "2.0", method: "notifications/initialized", params: {} });
  assert.equal(res.status, 202);
  assert.equal(res.body, "");
});

check("the server sends a parse error for incorrect JSON", () => {
  const res = handle({ method: "POST", headers: {}, body: "{nope" });
  assert.equal(res.status, 400);
  assert.equal(json(res).error.code, -32700);
});

check("the server accepts an OPTIONS request", () => {
  const res = handle({ method: "OPTIONS", headers: {}, body: "" });
  assert.equal(res.status, 204);
  assert.equal(res.headers["access-control-allow-origin"], "*");
});

console.log(`\n${passed} checks passed`);
