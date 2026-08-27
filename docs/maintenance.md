# Maintenance

This file holds the information a maintainer needs. The README describes the
server for a person who wants to use it.

## Language

This project uses Simplified Technical English (ASD-STE100). Write all
documentation and all code comments in this style:

- Keep sentences short. Use a maximum of 20 words for an instruction.
- Use the active voice.
- Use one word for one meaning. Use the same word for the same thing.
- Write one instruction in one sentence.

Do not write a comment that repeats the code. Write a comment only when it
stops an incorrect change.

## Files

    src/content.ts    All personal content. You change this file frequently.
    src/protocol.ts   The MCP methods. This file is independent of the transport.
    src/index.ts      The Cloudflare Worker entry point.
    test/smoke.mjs    The protocol tests.
    server.json       The entry in the official MCP Registry.

## Development

    npm install
    npm run typecheck
    npm test          # Compiles the code, then does the tests.
    npm run dev       # Starts wrangler dev.

## Deployment

    npx wrangler login
    npx wrangler deploy

Wrangler needs a **user** API token, or an interactive login. Wrangler does
not operate with an account-scoped token, because it reads user endpoints
that such a token cannot reach.

With an account-scoped token, build the code and send it to the API:

    npx wrangler deploy --dry-run --outdir=dist-worker

    curl -X PUT -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
      -F 'metadata={"main_module":"index.js","compatibility_date":"2026-07-01","observability":{"enabled":true}};type=application/json' \
      -F "index.js=@dist-worker/index.js;type=application/javascript+module" \
      "https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/workers/scripts/profile-mcp"

The token needs Account → Workers Scripts → Edit. The custom domain
`mcp.kazejev.com` is separate and stays in place through a deployment.

## The three names and the three versions

A change to the name or the version must go to three places, in this order:

1. `SERVER_NAME` and `SERVER_VERSION` in `src/content.ts`, then deploy.
2. `serverInfo` in `.well-known/mcp/server-card.json`, in the
   `theglobe/theglobe.github.io` repository.
3. `version` in `server.json`, then publish to the registry.

Deploy first. A card or a registry entry that names something the live server
does not report is worse than a delay.

These three names are different and are all correct:

| Name | Value | Where it matters |
|---|---|---|
| Repository | `profile-mcp` | GitHub |
| Worker service | `profile-mcp` | The deployment target |
| MCP server identity | `jaroslavkazejev-profile` | `serverInfo`, and the server card |
| Registry entry | `com.kazejev/profile` | The registry namespace, proved by DNS |

## Registry

To publish a new version:

    mcp-publisher login dns --domain kazejev.com --private-key <HEX>
    mcp-publisher publish

The registry session token expires. Log in again when a publish returns 401.

The namespace `com.kazejev` is proved by a TXT record on `kazejev.com`:

    v=MCPv1; k=ed25519; p=Z3Hxdi1IjSf8w1F4nnlcPJHX/X72+rsaXY4DTJJj5Ns=

That record must stay in place. The matching private key is not in this
repository. To use a different key, generate a new pair and replace the TXT
record with the new public key.

The publisher tool is `github.com/modelcontextprotocol/registry/cmd/publisher`.
Install it with `go install`. The npm package named `mcp-publisher` is a
different and unrelated package.

## To do

- Put the correct biography, skills and projects in `src/content.ts`.
- Make a decision about a contact email address. The file has no email
  address.
