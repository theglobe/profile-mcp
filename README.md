# profile-mcp

Personal MCP server for [kazejev.com](https://kazejev.com). The server operates
on Cloudflare Workers. The server is read-only: it gives a biography, skills,
projects and contact links to AI agents. The server has no runtime
dependencies.

## Language

This project uses Simplified Technical English (ASD-STE100). Write all
documentation and all code comments in this style:

- Keep sentences short. Use a maximum of 20 words for an instruction.
- Use the active voice.
- Use one word for one meaning. Use the same word for the same thing.
- Write one instruction in one sentence.

## Protocol support

The server supports two protocol eras.

The MCP `2026-07-28` revision removed the `initialize` handshake. It also
removed the protocol-level sessions. Thus a server for the new revision is very
different from a server for the older revisions. Most clients still use the
older revisions. Therefore this server supports the two eras on one endpoint.

| Era | Versions | Description |
|---|---|---|
| Modern | `2026-07-28` | The server keeps no state. Each request contains the version, the identity and the capabilities in `_meta`. The client also puts these values in HTTP headers. The server examines the headers. The server has the `server/discover` method. |
| Legacy | `2025-11-25`, `2025-06-18`, `2025-03-26` | The client and the server do the `initialize` handshake. |

The server selects the era for each request. If the `MCP-Protocol-Version`
header shows a modern version, the server uses the modern rules. If it does
not, the server uses the legacy rules.

The modern era has these rules:

- The server sends 405 for a GET request and for a DELETE request. The GET
  stream and the session teardown are no longer in the protocol.
- The client must send the `Mcp-Method` header. For `tools/call`,
  `resources/read` and `prompts/get`, the client must also send the `Mcp-Name`
  header.
- If a header value disagrees with the body value, the server sends 400 and
  error code `-32020` (`HeaderMismatch`). The server first decodes the
  `=?base64?…?=` format, then compares the two values.
- If the server does not support the protocol version, the server sends 400 and
  error code `-32022`. The error data shows the supported versions.
- If the method is unknown, the server sends 404 and error code `-32601`. A
  client uses this response to identify a modern server.
- A list result contains `ttlMs` and `cacheScope`. Each result contains
  `resultType`.

The server does not have `subscriptions/listen`, the MRTR input requests, or
the tasks extension. The server does not need them, because each tool is static
and has no arguments.

## Endpoint

`POST /mcp`. The server sends 404 for all other paths.

## Files

    src/content.ts    All personal content. You change this file frequently.
    src/protocol.ts   The MCP methods. This file is independent of the transport.
    src/index.ts      The Cloudflare Worker entry point.
    test/smoke.mjs    The protocol tests.

## Development

    npm install
    npm run typecheck
    npm test          # Compiles the code, then does the tests.
    npm run dev       # Starts wrangler dev.

## Deployment

    npx wrangler login
    npx wrangler deploy

Then add the custom domain `mcp.kazejev.com` in the Cloudflare dashboard. Go to
Workers & Pages, then this Worker, then Settings, then Domains & Routes.

## Server card

The repository `theglobe/theglobe.github.io` sends a discovery card at
`/.well-known/mcp/server-card.json`. The `protocolVersion` field and the
`transport.endpoint` field in the card must agree with this server.

The card gives the server name `kazejev-personal`. This name is different from
the repository name and from the Worker name. Do not change `SERVER_NAME` in
`src/content.ts` unless you also change the card.

## To do

- Put the correct biography, skills and projects in `src/content.ts`.
- Make a decision about a contact email address. The file has no email address.

## Registry

The server is in the official MCP Registry as `com.kazejev/profile`.

    https://registry.modelcontextprotocol.io/v0/servers?search=kazejev

`server.json` holds the registry entry. To publish a new version, change the
`version` field to match `SERVER_VERSION` in `src/content.ts`, then:

    mcp-publisher login dns --domain kazejev.com --private-key <HEX>
    mcp-publisher publish

The namespace `com.kazejev` is proved by a TXT record on `kazejev.com`:

    v=MCPv1; k=ed25519; p=Z3Hxdi1IjSf8w1F4nnlcPJHX/X72+rsaXY4DTJJj5Ns=

That record must stay in place. The matching private key is not in this
repository. To use a different key, generate a new pair and replace the TXT
record with the new public key.
