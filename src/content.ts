/**
 * All personal content. This file is separate from the protocol code.
 *
 * The content comes from two public sources: the GitHub profile at
 * github.com/theglobe and the site at theglobe.github.io.
 *
 * The server sends this content to each agent that connects to the endpoint.
 * Thus the content is as public as the home page. Examine the content and
 * write it again in your own words before you deploy the server.
 */

export const SERVER_NAME = "kazejev-personal";
export const SERVER_VERSION = "0.1.0";

export const INSTRUCTIONS =
  "This server is read-only. It gives public professional information about " +
  "Jaroslav Kazejev: the biography, the skills, the projects and the contact " +
  "links. Each tool has no arguments and sends static content.";

/** REVIEW: this text comes from the one-line GitHub profile biography. */
export const BIO = `Jaroslav Kazejev — software developer based in Stockholm, Sweden.

Works primarily in C# and .NET, Java on Android, and Python and shell scripting.

Site: https://kazejev.com`;

export interface Skill {
  name: string;
  category: string;
}

/** From the GitHub profile biography. REVIEW: add more detail. */
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
    description: "The thesis. It is available on the personal site.",
    url: "https://kazejev.com/thesis.pdf",
  },
  {
    name: "profile-mcp",
    description:
      "This MCP server. It gives the content of the personal site to AI " +
      "agents with the Streamable HTTP transport. It operates on Cloudflare " +
      "Workers.",
    url: "https://github.com/theglobe/profile-mcp",
  },
  // REVIEW: add the correct projects.
];

export interface ContactLink {
  kind: string;
  value: string;
}

/**
 * This list has no email address. Add an email address only if each agent that
 * connects to this server can read it.
 */
export const CONTACT: ContactLink[] = [
  { kind: "website", value: "https://kazejev.com" },
  { kind: "linkedin", value: "https://www.linkedin.com/in/jaroslavkazejev/" },
  { kind: "github", value: "https://github.com/theglobe" },
  { kind: "blog", value: "http://kazzapp.com" },
];

export const PROFILE_URI = "kazejev://profile";
