import { Plug, Workflow } from "lucide-react";
import {
  SiBootstrap,
  SiClaude,
  SiCss3,
  SiDigitalocean,
  SiExpress,
  SiFigma,
  SiGit,
  SiGithub,
  SiGooglegemini,
  SiHtml5,
  SiJavascript,
  SiMongodb,
  SiMysql,
  SiN8N,
  SiNextdotjs,
  SiNodedotjs,
  SiNpm,
  SiOpenai,
  SiPhp,
  SiPostman,
  SiReact,
  SiRender,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiVite,
  SiXampp,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import { skillGroups as skillGroupData } from "../../lib/portfolio/skills.js";

/**
 * The toolkit for the UI.
 *
 * Names, grouping and brand colours live in `lib/portfolio/skills.js`, shared
 * with the AI assistant's serverless function. This module attaches the logo
 * components — the one thing the server has no use for.
 */
const SKILL_ICONS = {
  HTML5: SiHtml5,
  CSS3: SiCss3,
  "JavaScript ES6+": SiJavascript,
  TypeScript: SiTypescript,
  React: SiReact,
  "Next.js": SiNextdotjs,
  "Tailwind CSS": SiTailwindcss,
  "Bootstrap 5": SiBootstrap,
  "Node.js": SiNodedotjs,
  "Express.js": SiExpress,
  PHP: SiPhp,
  MongoDB: SiMongodb,
  MySQL: SiMysql,
  Supabase: SiSupabase,
  "VS Code": VscVscode,
  Git: SiGit,
  GitHub: SiGithub,
  NPM: SiNpm,
  Vite: SiVite,
  Postman: SiPostman,
  XAMPP: SiXampp,
  Figma: SiFigma,
  DigitalOcean: SiDigitalocean,
  Render: SiRender,
  Vercel: SiVercel,
  "Claude Code": SiClaude,
  "Gemini (Google AI Studio)": SiGooglegemini,
  ChatGPT: SiOpenai,
  MCP: Plug,
  n8n: SiN8N,
  GoHighLevel: Workflow,
};

export const skillGroups = skillGroupData.map((group) => ({
  ...group,
  skills: group.skills.map((skill) => ({
    ...skill,
    Icon: SKILL_ICONS[skill.name],
  })),
}));

export { totalSkills } from "../../lib/portfolio/skills.js";

/** Flat list used by the ticker under the hero. */
export const skillTicker = skillGroups.flatMap((group) => group.skills);
