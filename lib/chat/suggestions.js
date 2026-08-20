/**
 * Suggestion chips.
 *
 * The opening set is fixed; after that they follow the conversation, keyed off
 * the intent detected for the visitor's last question. Anything already asked
 * is filtered out at the call site, so the chips never loop back on themselves.
 */

export const OPENING_SUGGESTIONS = [
  { emoji: "👨‍💻", label: "Who is Leomar?", question: "Who is Leomar Abad?" },
  { emoji: "🚀", label: "Show me his projects", question: "Show me his best projects" },
  { emoji: "🛠️", label: "What are his tech skills?", question: "What technologies does he work with?" },
  { emoji: "💼", label: "What can he build?", question: "What kind of websites and apps can he build?" },
  { emoji: "📄", label: "Tell me about his experience", question: "What is his experience?" },
  { emoji: "📬", label: "How can I contact him?", question: "How can I contact him?" },
];

const CHIPS = {
  projects: { emoji: "🚀", label: "His best projects", question: "Which are his best projects?" },
  clientWork: { emoji: "🏛️", label: "Client work", question: "What client projects has he delivered?" },
  frontend: { emoji: "🎨", label: "Frontend stack", question: "What frontend technologies does he know?" },
  backend: { emoji: "⚙️", label: "Backend stack", question: "What backend technologies does he use?" },
  ai: { emoji: "🤖", label: "Does he work with AI?", question: "Does he work with AI?" },
  automation: { emoji: "🔗", label: "Automation work", question: "Does he do workflow automation?" },
  fullstack: { emoji: "🧱", label: "Can he build fullstack apps?", question: "Can Leomar build a full-stack application?" },
  services: { emoji: "💼", label: "What can he build?", question: "What kind of websites and apps can he build?" },
  experience: { emoji: "📄", label: "His experience", question: "What is his experience?" },
  education: { emoji: "🎓", label: "His education", question: "Where did he study?" },
  hire: { emoji: "🤝", label: "Is he available?", question: "Is he available for freelance work?" },
  contact: { emoji: "📬", label: "How to reach him", question: "How can I contact him?" },
  booking: { emoji: "📅", label: "Book a call", question: "How do I book a call with him?" },
  differentiator: { emoji: "✨", label: "What makes him different?", question: "What makes Leomar different from other developers?" },
  testimonials: { emoji: "💬", label: "What clients say", question: "What do his clients say about him?" },
  github: { emoji: "🐙", label: "Find his GitHub", question: "Where can I find his GitHub and LinkedIn?" },
  identity: { emoji: "👨‍💻", label: "Who is Leomar?", question: "Who is Leomar Abad?" },
  blog: { emoji: "📰", label: "Read his blog", question: "Does he write a blog?" },
};

/** Which chips make sense to show *after* an answer of each intent. */
const FOLLOW_UPS = {
  greeting: ["identity", "projects", "services", "contact"],
  "bot-identity": ["identity", "projects", "contact"],
  identity: ["projects", "frontend", "experience", "hire"],
  role: ["projects", "services", "fullstack", "hire"],
  "skills-frontend": ["backend", "fullstack", "projects", "hire"],
  "skills-backend": ["frontend", "fullstack", "clientWork", "hire"],
  "skills-ai": ["automation", "services", "projects", "hire"],
  "skills-hosting": ["backend", "clientWork", "hire"],
  "skills-automation": ["ai", "services", "contact"],
  skills: ["frontend", "backend", "ai", "projects"],
  "best-projects": ["clientWork", "frontend", "fullstack", "hire"],
  projects: ["clientWork", "ai", "frontend", "hire"],
  "project-specific": ["projects", "frontend", "backend", "hire"],
  technology: ["projects", "fullstack", "services", "hire"],
  experience: ["education", "clientWork", "testimonials", "hire"],
  education: ["experience", "projects", "hire"],
  services: ["fullstack", "ai", "automation", "contact"],
  hire: ["booking", "contact", "differentiator", "testimonials"],
  contact: ["booking", "github", "hire"],
  booking: ["contact", "services", "differentiator"],
  social: ["projects", "contact", "hire"],
  resume: ["experience", "contact"],
  location: ["hire", "contact", "projects"],
  differentiator: ["clientWork", "testimonials", "hire"],
  testimonials: ["clientWork", "differentiator", "hire"],
  blog: ["ai", "projects", "contact"],
  thanks: ["booking", "projects"],
  unknown: ["identity", "projects", "services", "contact"],
};

/**
 * @param {string} intent   Intent id from `detectIntent()`.
 * @param {Set<string>} asked  Questions already sent this session.
 * @param {number} [limit]
 */
export function suggestionsFor(intent, asked = new Set(), limit = 3) {
  const keys = FOLLOW_UPS[intent] ?? FOLLOW_UPS.unknown;

  return keys
    .map((key) => CHIPS[key])
    .filter((chip) => chip && !asked.has(chip.question.toLowerCase()))
    .slice(0, limit);
}
