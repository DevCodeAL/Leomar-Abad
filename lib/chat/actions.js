/**
 * The assistant's rich-response vocabulary.
 *
 * Rather than asking the model for JSON — which cannot be streamed into the UI
 * a token at a time — replies are plain prose with inline directives:
 *
 *   [[project:guimba-east-edulink]]   render that project's card
 *   [[skills:frontend]]               render that skill group as badges
 *   [[cta:contact]]                   render a call-to-action button
 *
 * `parseActions()` lifts them out of the text and validates every one against
 * the real portfolio data, so a hallucinated slug renders nothing at all
 * instead of a broken card. Directives are never rendered as markup, which is
 * also what keeps them from being an injection surface.
 *
 * Isomorphic: the API uses it to sanity-check replies, the client uses it to
 * render them, and the offline fallback speaks the same vocabulary.
 */

import { projects } from "../portfolio/projects.js";
import { skillGroups } from "../portfolio/skills.js";
import { profile, socialLinks } from "../portfolio/profile.js";
import { siteMap } from "../portfolio/knowledge.js";

const github = socialLinks.find((social) => social.label === "GitHub");
const linkedin = socialLinks.find((social) => social.label === "LinkedIn");

/** The complete CTA set. Anything outside it is dropped. */
export const CTAS = {
  contact: {
    key: "contact",
    label: "Book a call with Leomar",
    href: siteMap.contact.href,
    icon: "calendar",
    external: false,
  },
  email: {
    key: "email",
    label: `Email ${profile.name.split(" ")[0]}`,
    href: `mailto:${profile.email}`,
    icon: "mail",
    external: false,
  },
  projects: {
    key: "projects",
    label: "Explore all projects",
    href: siteMap.projects.href,
    icon: "folder",
    external: false,
  },
  skills: {
    key: "skills",
    label: "See the full toolkit",
    href: siteMap.skills.href,
    icon: "layers",
    external: false,
  },
  experience: {
    key: "experience",
    label: "View his experience",
    href: siteMap.experience.href,
    icon: "briefcase",
    external: false,
  },
  services: {
    key: "services",
    label: "See what he offers",
    href: siteMap.services.href,
    icon: "wrench",
    external: false,
  },
  resume: {
    key: "resume",
    label: "Download his CV",
    href: profile.resume,
    icon: "download",
    external: false,
    download: profile.resumeFileName,
  },
  blog: {
    key: "blog",
    label: "Read the blog",
    href: siteMap.blog.href,
    icon: "newspaper",
    external: false,
  },
  github: {
    key: "github",
    label: "GitHub — @" + (github?.handle ?? "DevCodeAL"),
    href: github?.href ?? "https://github.com/DevCodeAL",
    icon: "github",
    external: true,
  },
  linkedin: {
    key: "linkedin",
    label: "Connect on LinkedIn",
    href: linkedin?.href ?? "https://www.linkedin.com/in/leomar-abad-52381327b/",
    icon: "linkedin",
    external: true,
  },
};

const PROJECTS_BY_SLUG = new Map(projects.map((p) => [p.slug, p]));
const SKILL_GROUPS_BY_ID = new Map(skillGroups.map((g) => [g.id, g]));

/** Matches one complete directive. */
const DIRECTIVE = /\[\[(project|skills|cta):([a-z0-9-]+)\]\]/gi;
/** A directive the stream has not finished emitting yet. */
const PARTIAL_DIRECTIVE = /\[\[[a-z0-9:-]*$/i;

function resolve(kind, value) {
  const id = value.toLowerCase();

  if (kind === "project") {
    const project = PROJECTS_BY_SLUG.get(id);
    return project ? { type: "project", id, project } : null;
  }

  if (kind === "skills") {
    const group = SKILL_GROUPS_BY_ID.get(id);
    return group ? { type: "skills", id, group } : null;
  }

  if (kind === "cta") {
    const cta = CTAS[id];
    return cta ? { type: "cta", id, cta } : null;
  }

  return null;
}

/**
 * Split a reply into the prose the user reads and the blocks rendered under it.
 *
 * @param {string} raw
 * @param {{ streaming?: boolean }} [options] While streaming, a half-written
 *   directive at the very end is hidden rather than flashing as literal text.
 * @returns {{ text: string, actions: Array<object> }}
 */
export function parseActions(raw, { streaming = false } = {}) {
  if (typeof raw !== "string" || !raw) return { text: "", actions: [] };

  const actions = [];
  const seen = new Set();

  let text = raw.replace(DIRECTIVE, (_match, kind, value) => {
    const action = resolve(kind, value);
    if (!action) return "";

    const key = `${action.type}:${action.id}`;
    if (!seen.has(key)) {
      seen.add(key);
      actions.push(action);
    }
    return "";
  });

  if (streaming) text = text.replace(PARTIAL_DIRECTIVE, "");

  // Directives usually sit on their own line; collapse the gaps they leave.
  text = text
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return { text, actions };
}

/** Convenience for the fallback engine, which builds actions directly. */
export function buildActions(specs = []) {
  return specs
    .map((spec) =>
      typeof spec === "string"
        ? resolve(...spec.split(":"))
        : resolve(spec.type, spec.id),
    )
    .filter(Boolean);
}

/**
 * Render actions back into directive text.
 *
 * The fallback engine builds its actions as objects, but every reply — model
 * or fallback — reaches the browser as one string. Serialising here means both
 * engines produce the same wire format and the client only has one parser.
 */
export function serialiseActions(actions = []) {
  return actions.map((action) => `[[${action.type}:${action.id}]]`).join("\n");
}
