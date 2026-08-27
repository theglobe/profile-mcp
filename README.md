# profile-mcp

An MCP server that answers questions about Jaroslav Kazejev: biography,
skills, projects and education. It is read-only, it needs no authentication,
and it has no runtime dependencies.

**Endpoint:** `https://mcp.kazejev.com/mcp`

## Connect

With the Claude Code CLI:

    claude mcp add --transport http kazejev https://mcp.kazejev.com/mcp

With a client that reads a JSON configuration:

```json
{
  "mcpServers": {
    "kazejev": {
      "type": "http",
      "url": "https://mcp.kazejev.com/mcp"
    }
  }
}
```

## Tools

| Tool | Arguments | Returns |
|---|---|---|
| `get_profile_summary` | none | The complete profile in one response: headline, location, work status, focus, the strongest work, the main skills, education and links |
| `query_profile` | `topic` | The projects, skills and education that match the topic, with the detail behind each one |
| `get_bio` | none | The short professional biography |
| `list_skills` | none | The technical and professional skills |
| `list_projects` | none | The projects and the work |
| `get_contact_info` | none | The public contact details and profile links |

One resource, `kazejev://profile`, holds the same content as one JSON
document.

## Protocol support

The server answers two protocol eras on the same endpoint, and selects the
era for each request.

| Era | Versions | Description |
|---|---|---|
| Modern | `2026-07-28` | The server keeps no state. Each request carries its version, identity and capabilities in `_meta` and in HTTP headers, which the server examines. `server/discover` is available. |
| Legacy | `2025-11-25`, `2025-06-18`, `2025-03-26` | The client and the server do the `initialize` handshake. |

The `2026-07-28` revision removed the `initialize` handshake and the
protocol-level sessions. Most clients still use the older revisions, thus the
server keeps both.

Notable behaviour in the modern era:

- `GET` and `DELETE` return 405. The GET stream and the session teardown are
  no longer in the protocol.
- A header that disagrees with the body returns 400 and `-32020`.
- An unsupported version returns 400 and `-32022` with the supported list.
- An unknown method returns 404 and `-32601`.

## Where else this server appears

- Registry entry: `com.kazejev/profile` in the
  [official MCP Registry](https://registry.modelcontextprotocol.io/v0/servers?search=kazejev)
- Server card: <https://kazejev.com/.well-known/mcp/server-card.json>
- Site: <https://kazejev.com>

## Development and maintenance

See [docs/maintenance.md](docs/maintenance.md).
