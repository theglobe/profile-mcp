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

check("server/discover advertises versions and capabilities", () => {
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

check("tools/list is cacheable and deterministically ordered", () => {
  const res = post(
    { "MCP-Protocol-Version": MODERN, "Mcp-Method": "tools/list" },
    { jsonrpc: "2.0", id: 2, method: "tools/list", params: { _meta: meta } },
  );
  const r = json(res).result;
  const names = r.tools.map((t) => t.name);
  assert.deepEqual(names, ["get_bio", "get_contact_info", "list_projects", "list_skills"]);
  assert.deepEqual(names, [...names].sort());
  assert.equal(typeof r.ttlMs, "number");
});

check("tools/call returns content", () => {
  const res = post(
    { "MCP-Protocol-Version": MODERN, "Mcp-Method": "tools/call", "Mcp-Name": "get_bio" },
    { jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "get_bio", _meta: meta } },
  );
  const r = json(res).result;
  assert.equal(r.resultType, "complete");
  assert.equal(r.content[0].type, "text");
  assert.ok(r.content[0].text.length > 0);
});

check("missing Mcp-Method header is rejected as HeaderMismatch", () => {
  const res = post(
    { "MCP-Protocol-Version": MODERN },
    { jsonrpc: "2.0", id: 4, method: "tools/list", params: { _meta: meta } },
  );
  assert.equal(res.status, 400);
  assert.equal(json(res).error.code, -32020);
});

check("Mcp-Name not matching body is rejected", () => {
  const res = post(
    { "MCP-Protocol-Version": MODERN, "Mcp-Method": "tools/call", "Mcp-Name": "wrong" },
    { jsonrpc: "2.0", id: 5, method: "tools/call", params: { name: "get_bio", _meta: meta } },
  );
  assert.equal(res.status, 400);
  assert.equal(json(res).error.code, -32020);
});

check("base64 sentinel Mcp-Name is decoded before comparison", () => {
  const encoded = "=?base64?" + Buffer.from("kazejev://profile", "utf8").toString("base64") + "?=";
  const res = post(
    { "MCP-Protocol-Version": MODERN, "Mcp-Method": "resources/read", "Mcp-Name": encoded },
    { jsonrpc: "2.0", id: 6, method: "resources/read", params: { uri: "kazejev://profile", _meta: meta } },
  );
  assert.equal(res.status, 200);
  assert.ok(json(res).result.contents[0].text.includes("bio"));
});

check("_meta protocolVersion disagreeing with header is rejected", () => {
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

check("unknown method returns 404 with -32601", () => {
  const res = post(
    { "MCP-Protocol-Version": MODERN, "Mcp-Method": "nope/nope" },
    { jsonrpc: "2.0", id: 8, method: "nope/nope", params: { _meta: meta } },
  );
  assert.equal(res.status, 404);
  assert.equal(json(res).error.code, -32601);
});

check("unknown protocol version returns -32022 with supported list", () => {
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

check("unknown resource uses -32602", () => {
  const res = post(
    { "MCP-Protocol-Version": MODERN, "Mcp-Method": "resources/read", "Mcp-Name": "kazejev://nope" },
    { jsonrpc: "2.0", id: 10, method: "resources/read", params: { uri: "kazejev://nope", _meta: meta } },
  );
  assert.equal(json(res).error.code, -32602);
});

console.log("legacy (initialize handshake)");

check("initialize negotiates a legacy version", () => {
  const res = post({}, {
    jsonrpc: "2.0", id: 11, method: "initialize",
    params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "c", version: "1" } },
  });
  const r = json(res).result;
  assert.equal(r.protocolVersion, "2025-06-18");
  assert.equal(r.serverInfo.name, "kazejev-personal");
  assert.equal(r.resultType, undefined, "legacy results must not carry resultType");
});

check("legacy tools/call works without modern headers", () => {
  const res = post({}, {
    jsonrpc: "2.0", id: 12, method: "tools/call", params: { name: "list_skills" },
  });
  const r = json(res).result;
  assert.ok(r.content[0].text.length > 0);
  assert.equal(r.ttlMs, undefined, "legacy results must not carry ttlMs");
});

check("legacy ping still answers", () => {
  const res = post({}, { jsonrpc: "2.0", id: 13, method: "ping", params: {} });
  assert.deepEqual(json(res).result, {});
});

console.log("transport");

check("GET is 405", () => {
  const res = handle({ method: "GET", headers: {}, body: "" });
  assert.equal(res.status, 405);
  assert.equal(res.headers.allow, "POST, OPTIONS");
});

check("DELETE is 405 (sessions are gone)", () => {
  assert.equal(handle({ method: "DELETE", headers: {}, body: "" }).status, 405);
});

check("notification is 202 with no body", () => {
  const res = post({}, { jsonrpc: "2.0", method: "notifications/initialized", params: {} });
  assert.equal(res.status, 202);
  assert.equal(res.body, "");
});

check("malformed JSON is a parse error", () => {
  const res = handle({ method: "POST", headers: {}, body: "{nope" });
  assert.equal(res.status, 400);
  assert.equal(json(res).error.code, -32700);
});

check("OPTIONS preflight succeeds", () => {
  const res = handle({ method: "OPTIONS", headers: {}, body: "" });
  assert.equal(res.status, 204);
  assert.equal(res.headers["access-control-allow-origin"], "*");
});

console.log(`\n${passed} checks passed`);
