# profile-mcp

Personal MCP server for [kazejev.com](https://kazejev.com), running on
Cloudflare Workers. Read-only: it exposes a bio, skills, projects and contact
links to AI agents. No dependencies at runtime.

## Protocol support

This server is **dual-era**. The MCP `2026-07-28` revision removed the
`initialize` handshake and protocol-level sessions, so a server written to the
older spec and a server written to the new one look almost nothing alike. Most
deployed clients still speak the older revision, so both are served on the same
endpoint:

| Era | Versions | Shape |
|---|---|---|
| Modern | `2026-07-28` | Stateless. Version, identity and capabilities travel in `_meta` on every request and are mirrored into HTTP headers the server validates. Implements `server/discover`. |
| Legacy | `2025-11-25`, `2025-06-18`, `2025-03-26` | `initialize` / `notifications/initialized` handshake. |

Era is chosen per request: an `MCP-Protocol-Version` header naming a modern
version selects modern handling; anything else falls back to legacy.

Notable modern-era behaviour:

- `GET` and `DELETE` return `405` — the GET stream and session teardown are gone.
- `Mcp-Method` is required, and `Mcp-Name` on `tools/call`, `resources/read` and
  `prompts/get`. Mismatch with the body is `400` + `-32020` (`HeaderMismatch`).
  The `=?base64?…?=` sentinel encoding is decoded before comparison.
- An unsupported version is `400` + `-32022`, listing supported versions.
- An unknown method is `404` + `-32601`, which is how clients tell a modern
  server from a legacy HTTP+SSE endpoint.
- List results carry `ttlMs` and `cacheScope`; all results carry `resultType`.

Not implemented: `subscriptions/listen`, MRTR input requests, tasks. Nothing
here needs them — every tool is static and takes no arguments.

## Endpoint

`POST /mcp`. Any other path is `404`.

## Layout

    src/content.ts    all personal content — the only file you edit routinely
    src/protocol.ts   MCP dispatch, transport-agnostic and testable
    src/index.ts      Cloudflare Worker entry point
    test/smoke.mjs    protocol conformance checks

## Development

    npm install
    npm run typecheck
    npm test          # compiles, then runs the smoke checks
    npm run dev       # wrangler dev

## Deploy

    npx wrangler login
    npx wrangler deploy

Then add the custom domain `mcp.kazejev.com` in the Cloudflare dashboard
(Workers & Pages → this Worker → Settings → Domains & Routes).

## Server card

`theglobe/theglobe.github.io` serves a discovery card at
`/.well-known/mcp/server-card.json`. Its `protocolVersion` and `transport.endpoint`
must stay in step with this server.

## TODO

- Fill in the real bio, skills and projects in `src/content.ts`.
- Decide whether a contact email should be public; none is included by default.
