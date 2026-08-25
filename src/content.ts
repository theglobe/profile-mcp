/**
 * All personal content lives here, isolated from protocol plumbing.
 *
 * Seeded from public sources: the GitHub profile at github.com/theglobe and
 * the existing site at theglobe.github.io. Everything here is served publicly
 * to any agent that can reach the endpoint, so treat it as equivalent to the
 * homepage. Review and rewrite in your own words before deploying.
 */

export const SERVER_NAME = "kazejev-personal";
export const SERVER_VERSION = "0.1.0";

export const INSTRUCTIONS =
  "Read-only server exposing public professional information about Jaroslav " +
  "Kazejev: biography, skills, projects, and contact links. All tools take no " +
  "arguments and return static content.";

/** REVIEW: expanded from the one-line GitHub profile bio. */
export const BIO = `Jaroslav Kazejev — software developer based in Stockholm, Sweden.

Works primarily in C# and .NET, Java on Android, and Python and shell scripting.

Site: https://kazejev.com`;

export interface Skill {
  name: string;
  category: string;
}

/** From the GitHub profile bio. REVIEW: add depth, years, or domains. */
export const SKILLS: Skill[] = [
  { name: "C#", category: "language" },
  { name: ".NET", category: "platform" },
  { name: "Java", category: "language" },
  { name: "Android", category: "platform" },
  { name: "Python", category: "language" },
  { name: "Shell scripting", category: "language" },
];

export interface Project {
  name: string;
  description: string;
  url?: string;
}

export const PROJECTS: Project[] = [
  {
    name: "Master's thesis",
    description: "Thesis published on the personal site.",
    url: "https://kazejev.com/thesis.pdf",
  },
  {
    name: "profile-mcp",
    description:
      "This MCP server — exposes the personal site's content to AI agents " +
      "over Streamable HTTP, running on Cloudflare Workers.",
    url: "https://github.com/theglobe/profile-mcp",
  },
  // REVIEW: add real projects worth showing.
];

export interface ContactLink {
  kind: string;
  value: string;
}

/**
 * No email address is included by default. Add one only if you want it
 * readable by any agent that reaches this server.
 */
export const CONTACT: ContactLink[] = [
  { kind: "website", value: "https://kazejev.com" },
  { kind: "linkedin", value: "https://www.linkedin.com/in/jaroslavkazejev/" },
  { kind: "github", value: "https://github.com/theglobe" },
  { kind: "blog", value: "http://kazzapp.com" },
];

export const PROFILE_URI = "kazejev://profile";
