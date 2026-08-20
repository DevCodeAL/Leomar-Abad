import { FaFacebook, FaGithub, FaInstagramSquare, FaLinkedin } from "react-icons/fa";
import { SiClaude, SiGooglegemini, SiOpenai } from "react-icons/si";
import {
  aiWorkflow as aiWorkflowData,
  socialLinks,
} from "../../lib/portfolio/profile.js";

/**
 * Personal details for the UI.
 *
 * The values live in `lib/portfolio/profile.js` — shared with the AI
 * assistant's serverless function, which must not import an icon library.
 * This module is the presentation layer: it attaches the icon components and
 * keeps the export surface the dashboard has always consumed.
 */
export { profile, education, focusAreas } from "../../lib/portfolio/profile.js";

const SOCIAL_ICONS = {
  GitHub: FaGithub,
  LinkedIn: FaLinkedin,
  Facebook: FaFacebook,
  Instagram: FaInstagramSquare,
};

const AI_TOOL_ICONS = {
  "Claude Code": SiClaude,
  ChatGPT: SiOpenai,
  Gemini: SiGooglegemini,
};

export const aiWorkflow = {
  ...aiWorkflowData,
  tools: aiWorkflowData.tools.map((name) => ({
    name,
    Icon: AI_TOOL_ICONS[name],
  })),
};

export const socials = socialLinks.map((social) => ({
  ...social,
  Icon: SOCIAL_ICONS[social.label],
}));
