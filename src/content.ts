/**
 * The server sends all content in this file to each agent that connects to the
 * endpoint. Thus this content is as public as the home page.
 */

// This name must agree with serverInfo.name in the published server card.
export const SERVER_NAME = "kazejev-personal";
export const SERVER_VERSION = "0.3.0";

export const INSTRUCTIONS =
  "This server is read-only. It gives the professional profile of Jaroslav " +
  "Kazejev, a software engineer who moves into AI engineering. " +
  "get_profile_summary returns the complete profile in one response. " +
  "query_profile takes a topic and returns the matching projects, skills and " +
  "education.";

export const HEADLINE =
  "Software engineer moving into AI engineering. Builds LLM agents, bots and " +
  "the MCP tooling that agents use. Physics background from KTH.";

export const LOCATION = "Stockholm, Sweden";

export const AVAILABILITY =
  "Open to AI engineering and agent infrastructure roles.";

export const BIO = `Jaroslav Kazejev is a software engineer in Stockholm, Sweden.

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

export interface Skill {
  name: string;
  category: string;
  evidence?: string;
}

export const SKILLS: Skill[] = [
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
  { name: "Shell scripting", category: "language" },
];

export interface Project {
  name: string;
  year: string;
  summary: string;
  detail: string;
  url?: string;
  tags: string[];
}

export const PROJECTS: Project[] = [
  {
    name: "Sprout Buddy",
    year: "2026",
    summary:
      "A Telegram bot that looks after a person's houseplants through ordinary " +
      "conversation. An LLM agent with fifteen tools, memory and reminders.",
    detail:
      "TypeScript, Express and Zod on Node, with PostgreSQL on Neon, deployed " +
      "on Fly.io. A tool-calling agent gives the model fifteen tools: plants, " +
      "care history, reminders and a small per-user memory that survives " +
      "between conversations. A background loop checks each minute and sends " +
      "a due reminder to the user without a prompt. The reminders keep the " +
      "clock at the user's home through a daylight-saving change, and an " +
      "occurrence missed during a deploy is skipped and not replayed. The " +
      "agent has a per-user quota and a tool that sends the privacy notice. " +
      "The model endpoint is any OpenAI-compatible provider.",
    url: "https://t.me/sproutbuddy_bot",
    tags: ["ai", "agents", "llm", "tool-calling", "bots", "telegram",
           "typescript", "postgres", "memory", "automation"],
  },
  {
    name: "profile-mcp",
    year: "2026",
    summary:
      "An MCP server that makes this profile readable by AI agents. It is the " +
      "server that answers this request.",
    detail:
      "A dependency-free MCP server on Cloudflare Workers. The MCP 2026-07-28 " +
      "revision removed the initialize handshake and protocol-level sessions, " +
      "thus it needs a different architecture from earlier revisions. This " +
      "server supports both eras on one endpoint and selects the era for each " +
      "request. It implements server/discover, per-request _meta, the mirrored " +
      "header validation with the base64 sentinel format, and the cache fields " +
      "on list results. The site also publishes a SEP-1649 server card at " +
      "/.well-known/mcp/server-card.json for agent discovery.",
    url: "https://github.com/theglobe/profile-mcp",
    tags: ["ai", "mcp", "agents", "typescript", "cloudflare", "protocol", "api",
           "tool-calling"],
  },
  {
    name: "MandelbrotSIMD",
    year: "2024",
    summary:
      "A fast Mandelbrot generator in C# that uses the SIMD instructions of the " +
      "processor.",
    detail:
      "Managed code cannot call the intrinsic SSE and AVX functions directly. " +
      "This project uses System.Numerics.Vectors to reach them, together with " +
      "multiprocessing. The library reports the number of values that one " +
      "instruction can calculate, thus one code path serves each SIMD level. " +
      "Vectorisation of this kind is the same technique that numerical and " +
      "machine learning workloads depend on.",
    url: "https://github.com/theglobe/MandelbrotSIMD",
    tags: ["performance", "simd", "csharp", "dotnet", "numerical"],
  },
  {
    name: "cryptopals-challenges",
    year: "2025",
    summary: "Solutions to the Cryptopals cryptographic challenges.",
    detail:
      "The Cryptopals set is a sequence of attacks on real cryptographic " +
      "errors. The work needs exact bit-level handling and careful reasoning " +
      "about failure.",
    url: "https://github.com/theglobe/cryptopals-challenges",
    tags: ["security", "cryptography", "algorithms"],
  },
];

export interface Education {
  qualification: string;
  institution: string;
  year: string;
  detail: string;
  url?: string;
  tags: string[];
}

export const EDUCATION: Education[] = [
  {
    qualification: "Master's degree, physics",
    institution: "KTH Royal Institute of Technology, Stockholm",
    year: "2007",
    detail:
      "Thesis: Studies of Neutron Backgrounds for PoGOLite, a Balloon-borne " +
      "Gamma-ray Polarimeter (TRITA-FYS-2007:62). The work modelled the " +
      "neutron background of a balloon-borne astrophysics instrument. It gives " +
      "a quantitative and experimental foundation for numerical work.",
    url: "https://kazejev.com/thesis.pdf",
    tags: ["education", "physics", "kth", "numerical", "research"],
  },
];

export interface ContactLink {
  kind: string;
  value: string;
}

// This list has no email address. An address here becomes public.
export const CONTACT: ContactLink[] = [
  { kind: "website", value: "https://kazejev.com" },
  { kind: "linkedin", value: "https://www.linkedin.com/in/jaroslavkazejev/" },
  { kind: "github", value: "https://github.com/theglobe" },
  { kind: "blog", value: "http://kazzapp.com" },
];

export const PROFILE_URI = "kazejev://profile";
