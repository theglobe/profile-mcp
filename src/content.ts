/**
 * The server sends all content in this file to each agent that connects to the
 * endpoint. Thus this content is as public as the home page.
 */

// This name must agree with serverInfo.name in the published server card.
export const SERVER_NAME = "kazejev-personal";
export const SERVER_VERSION = "0.1.0";

export const INSTRUCTIONS =
  "This server is read-only. It gives public professional information about " +
  "Jaroslav Kazejev: the biography, the skills, the projects and the contact " +
  "links. Each tool has no arguments and sends static content.";

export const BIO = `Jaroslav Kazejev — software developer based in Stockholm, Sweden.

Works primarily in C# and .NET, Java on Android, and Python and shell scripting.

Site: https://kazejev.com`;

export interface Skill {
  name: string;
  category: string;
}

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
  // TODO: add the correct projects.
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
