/**
 * Knowledge-based answers with no model behind them.
 *
 * This is not a stub. It is the assistant's floor, and it runs in three real
 * situations: `npm run dev` (plain Vite — there is no serverless runtime, so
 * /api/chat does not exist), a deployment with no GEMINI_API_KEY yet, and any
 * request the model fails to answer. A visitor should never hit a dead chat.
 *
 * It works by scoring the question against weighted keyword sets, resolving any
 * project or technology named in it, and answering from the same portfolio data
 * the model is given. Every answer is written; none are generated. That is the
 * point — offline, the assistant is allowed to be narrower, never wronger.
 */

import { education, profile, socialLinks } from "../portfolio/profile.js";
import { experience } from "../portfolio/experience.js";
import { projects } from "../portfolio/projects.js";
import { services } from "../portfolio/services.js";
import { skillGroups } from "../portfolio/skills.js";
import { testimonials } from "../portfolio/testimonials.js";
import { allTechnologies } from "../portfolio/knowledge.js";
import { buildActions, serialiseActions } from "./actions.js";

const firstName = profile.name.split(" ")[0];

/* ── Matching helpers ──────────────────────────────────────────────────── */

/**
 * Lowercase, strip punctuation, single-space.
 *
 * A dot survives only between two alphanumerics, so "node.js" stays one token
 * while a sentence-ending "projects." does not quietly stop matching the word
 * "projects" — which is exactly the kind of miss nobody notices in review.
 */
function normalise(text) {
  return ` ${String(text)
    .toLowerCase()
    .replace(/[^a-z0-9.+#\s-]/g, " ")
    .replace(/(?<![a-z0-9])\.|\.(?![a-z0-9])/g, " ")
    .replace(/\s+/g, " ")
    .trim()} `;
}

/** Whole-phrase containment, so "ai" never matches inside "available". */
function has(haystack, phrase) {
  return haystack.includes(` ${phrase} `);
}

function countHits(haystack, phrases) {
  return phrases.reduce((total, phrase) => total + (has(haystack, phrase) ? 1 : 0), 0);
}

/* ── Entity resolution ─────────────────────────────────────────────────── */

/** Extra ways a visitor might name a project, beyond its title and slug. */
const PROJECT_ALIASES = {
  "guimba-east-edulink": ["edulink", "guimba", "school system", "school platform"],
  "ai-math-generator": ["math generator", "math app", "ottodot", "math problems"],
  "portfolio-builder": ["portfolio builder", "website builder", "site builder"],
  "image-compressor": ["image compressor", "compressor", "image resizer"],
  "armandos-resort": ["armandos", "resort", "hotel", "resort system", "booking system"],
  "qr-code-generator": ["qr code", "qr generator", "qr"],
  "inventory-system": ["inventory", "stock", "inventory system"],
};

/** Longest alias first, so "portfolio builder" wins over a bare "portfolio". */
const PROJECT_INDEX = projects
  .flatMap((project) => [
    ...new Set([
      project.title.toLowerCase(),
      project.slug.replace(/-/g, " "),
      ...(PROJECT_ALIASES[project.slug] ?? []),
    ]),
  ].map((alias) => ({ alias, project })))
  .sort((a, b) => b.alias.length - a.alias.length);

function findProject(haystack) {
  return PROJECT_INDEX.find((entry) => has(haystack, entry.alias))?.project ?? null;
}

const TECH_INDEX = [...allTechnologies]
  .map((name) => ({ name, needle: name.toLowerCase() }))
  .sort((a, b) => b.needle.length - a.needle.length);

function findTechnologies(haystack) {
  return TECH_INDEX.filter((entry) => has(haystack, entry.needle)).map((e) => e.name);
}

/* ── Reusable answer fragments ─────────────────────────────────────────── */

const group = (id) => skillGroups.find((entry) => entry.id === id);
const names = (id) => group(id).skills.map((skill) => skill.name).join(", ");
const featured = projects.find((project) => project.featured);
const liveProjects = projects.filter((project) => project.demo);
const clientProjects = projects.filter((project) => project.category === "Client Work");

function projectsUsing(tech) {
  const needles = tech.map((name) => name.toLowerCase());
  return projects.filter((project) =>
    project.technologies.some((name) => needles.includes(name.toLowerCase())),
  );
}

/* ── Intents ───────────────────────────────────────────────────────────── */

/**
 * Each intent scores itself against the normalised question. `weight` biases
 * intents that should win a tie: a question mentioning both "projects" and
 * "contact" is almost always about projects.
 */
const INTENTS = [
  {
    id: "greeting",
    weight: 0.5,
    match: (q) =>
      countHits(q, ["hi", "hey", "hello", "yo", "sup", "good morning", "good evening", "good afternoon"]),
    answer: () => ({
      text: `Hey! I'm ${firstName}'s portfolio assistant. Ask me about his projects, his stack, or what he can build for you.`,
      actions: ["cta:projects", "cta:contact"],
    }),
  },
  {
    id: "bot-identity",
    weight: 2,
    match: (q) =>
      (countHits(q, ["who are you", "what are you", "are you leomar", "are you a bot", "are you real", "are you human", "are you ai"]) * 2) +
      countHits(q, ["chatbot", "assistant"]),
    answer: () => ({
      text: `I'm the assistant built into ${profile.name}'s portfolio — not ${firstName} himself. I answer from what's actually on this site: his projects, skills, experience and how to reach him. For anything beyond that, he's the better person to ask.`,
      actions: ["cta:contact"],
    }),
  },
  {
    id: "identity",
    weight: 1.4,
    /* His name and the bare pronouns only *strengthen* a match — on their own
       they are in almost every question asked here, including off-topic ones. */
    match: (q) => {
      const asking = countHits(q, ["who is", "about leomar", "about him", "tell me about", "introduce", "background", "bio", "story"]);
      if (!asking) return 0;
      return asking * 1.5 + countHits(q, ["leomar", "abad", "he", "him"]) * 0.2;
    },
    answer: () => ({
      text: `${profile.name} is a ${profile.role} based in ${profile.location}. ${profile.intro}\n\nHe's shipped ${projects.length} projects — ${clientProjects.length} of them for real clients — and works mainly across React, Node.js and the MERN stack.`,
      actions: ["cta:projects", "cta:contact"],
    }),
  },
  {
    id: "role",
    weight: 1.2,
    match: (q) =>
      countHits(q, ["what does he do", "what does leomar do", "what do you do", "his role", "his job", "what is he", "profession", "occupation"]) * 2,
    answer: () => ({
      text: `He's a ${profile.role} — he builds web applications end to end, from the interface down to the database. Right now he's ${profile.currently.toLowerCase()}, and he's ${profile.status.toLowerCase()}.`,
      actions: ["cta:services", "cta:projects"],
    }),
  },
  {
    id: "skills-frontend",
    weight: 2,
    match: (q) =>
      countHits(q, ["frontend", "front end", "front-end", "ui", "client side", "styling", "css"]) *
      (countHits(q, ["skill", "skills", "tech", "technologies", "stack", "know", "use", "uses"]) ? 3 : 2),
    answer: () => ({
      text: `On the frontend he works with ${names("frontend")}.\n\nMost of his recent work is React with Tailwind — the Portfolio Builder and the EduLink client platform are both built that way.`,
      actions: ["skills:frontend", "project:portfolio-builder"],
    }),
  },
  {
    id: "skills-backend",
    weight: 2,
    match: (q) =>
      countHits(q, ["backend", "back end", "back-end", "server", "api", "apis", "database", "databases", "server side"]) *
      (countHits(q, ["skill", "skills", "tech", "technologies", "stack", "know", "use", "uses"]) ? 3 : 2),
    answer: () => ({
      text: `Backend and data: ${names("backend")}.\n\nHe's built REST APIs with both Node/Express and PHP, and shipped production systems on MongoDB, MySQL and Supabase.`,
      actions: ["skills:backend", "project:guimba-east-edulink"],
    }),
  },
  {
    id: "skills-ai",
    weight: 2.2,
    match: (q) =>
      countHits(q, ["ai", "artificial intelligence", "llm", "gpt", "gemini", "claude", "machine learning", "chatbot", "openai"]) * 2,
    answer: () => ({
      text: `Yes. He built the AI Math Generator on Gemini via Google AI Studio, and he offers AI feature integration as a service — chat assistants, content generation and automation wired into an existing stack.\n\nHe also codes with AI assistants in the loop: ${names("ai")}.`,
      actions: ["project:ai-math-generator", "skills:ai", "cta:contact"],
    }),
  },
  {
    id: "skills-hosting",
    weight: 2,
    match: (q) =>
      countHits(q, ["hosting", "deploy", "deployment", "cloud", "server hosting", "devops", "infrastructure", "vercel", "render", "digitalocean"]) * 2,
    answer: () => ({
      text: `He deploys on ${names("hosting")}. ${liveProjects.length} of his ${projects.length} projects are publicly deployed and reachable right now — including a client system running on its own live domain.`,
      actions: ["skills:hosting", "project:guimba-east-edulink"],
    }),
  },
  {
    id: "skills-automation",
    weight: 2,
    match: (q) =>
      countHits(q, ["automation", "automate", "n8n", "gohighlevel", "ghl", "crm", "workflow", "workflows", "zapier", "integrations"]) * 2,
    answer: () => ({
      text: `Automation is one of his services: workflow automation with n8n, and CRM and pipeline setup in GoHighLevel with webhook and API integrations back into the rest of your stack.`,
      actions: ["skills:automation", "cta:services", "cta:contact"],
    }),
  },
  {
    id: "skills",
    weight: 1.3,
    match: (q) =>
      countHits(q, ["skill", "skills", "tech", "techs", "technologies", "technology", "stack", "tools", "languages", "toolkit", "framework", "frameworks", "what does he use", "what can he use"]) * 1.5,
    answer: () => {
      const total = skillGroups.reduce((count, g) => count + g.skills.length, 0);
      return {
        text: `His core stack is ${profile.coreStack.join(", ")}.\n\nThe full toolkit is ${total} technologies across ${skillGroups.length} groups — ${skillGroups.map((g) => g.label).join(", ")}. Ask about any one of them and I'll go deeper.`,
        actions: ["skills:frontend", "skills:backend", "cta:skills"],
      };
    },
  },
  {
    id: "best-projects",
    weight: 2.4,
    match: (q) =>
      countHits(q, ["best", "favourite", "favorite", "strongest", "most impressive", "flagship", "proudest", "biggest", "showcase", "top"]) *
      (countHits(q, ["project", "projects", "work", "build", "built"]) ? 3 : 1),
    answer: () => ({
      text: `His flagship is ${featured.title} — his first major client project, built for the Guimba East District and running on a live domain. ${featured.summary}\n\nAfter that, the AI Math Generator is the one to look at: it's his first AI integration, built with Next.js and Gemini.`,
      actions: [`project:${featured.slug}`, "project:ai-math-generator", "cta:projects"],
    }),
  },
  {
    id: "projects",
    weight: 1.5,
    match: (q) =>
      countHits(q, ["project", "projects", "portfolio work", "his work", "built", "build", "made", "shipped", "case study", "case studies", "show me"]) * 1.5,
    answer: () => ({
      text: `He has ${projects.length} projects on the site, ${liveProjects.length} of them live. They span client systems (${clientProjects.map((p) => p.title).join(", ")}), an AI integration, and a few developer tools he built for his own workflow.\n\nThe standout is ${featured.title}.`,
      actions: [`project:${featured.slug}`, "cta:projects"],
    }),
  },
  {
    id: "experience",
    weight: 1.6,
    match: (q) =>
      countHits(q, ["experience", "worked", "work history", "career", "background", "employment", "job history", "how long", "years", "cv", "resume", "professional"]) * 1.8,
    answer: () => ({
      text: `${experience
        .map((entry) => `**${entry.role}** — ${entry.org} (${entry.period}). ${entry.summary}`)
        .join("\n\n")}`,
      actions: ["cta:experience", "cta:resume"],
    }),
  },
  {
    id: "education",
    weight: 2,
    match: (q) =>
      countHits(q, ["education", "study", "studied", "school", "university", "college", "degree", "graduate", "graduated", "course", "qualification"]) * 2,
    answer: () => ({
      text: `He holds a ${education.degree} from ${education.school} in ${education.address}, graduated ${education.graduated}. He led his capstone project as team lead and developer, and did his OJT at the Office of the Sangguniang Bayan.`,
      actions: ["cta:experience"],
    }),
  },
  {
    id: "services",
    weight: 1.6,
    match: (q) =>
      countHits(q, ["service", "services", "offer", "offers", "what can he build", "what can you build", "what kind of websites", "what type of websites", "help me with", "work on", "capable"]) * 2,
    answer: () => ({
      text: `${services.length} services, in short: fullstack web apps on the MERN stack, responsive React frontends, backend and API work in Node or PHP, AI feature integration, and workflow automation with n8n and GoHighLevel — plus design, optimisation and ongoing maintenance.\n\nIf you tell me what you're building, I can point you at the closest thing he's already shipped.`,
      actions: ["cta:services", "cta:contact"],
    }),
  },
  {
    id: "hire",
    weight: 2.2,
    match: (q) =>
      countHits(q, ["hire", "hiring", "available", "availability", "freelance", "freelancing", "work with", "work together", "commission", "quote", "budget", "rate", "rates", "price", "pricing", "cost", "recruit", "opportunity", "open to"]) * 2,
    answer: () => ({
      text: `Yes — he's ${profile.status.toLowerCase()}, and he's done commissioned client work before (${clientProjects.map((p) => p.title).join(" and ")}).\n\nThe quickest route is booking a 30-minute call on this site; you get a Google Meet link straight away. Rates and timelines are his to quote, so bring the project and he'll take it from there.`,
      actions: ["cta:contact", "cta:email"],
    }),
  },
  {
    id: "contact",
    weight: 2,
    match: (q) =>
      countHits(q, ["contact", "reach", "reach him", "get in touch", "email", "e mail", "phone", "call him", "message him", "talk to", "connect"]) * 2,
    answer: () => ({
      text: `Email is **${profile.email}** and his phone is ${profile.phone}. You can also book a 30-minute call directly on this site — pick a slot and you get a Google Meet link immediately, no back-and-forth.`,
      actions: ["cta:contact", "cta:email"],
    }),
  },
  {
    id: "booking",
    weight: 2.2,
    match: (q) =>
      countHits(q, ["book", "booking", "schedule", "meeting", "appointment", "book a call", "set up a call", "consultation"]) * 2.2,
    answer: () => ({
      text: `You can book a 30-minute call right here on the portfolio. Choose a date and time that works for you and the Google Meet link is created on the spot.`,
      actions: ["cta:contact"],
    }),
  },
  {
    id: "social",
    weight: 2,
    match: (q) =>
      countHits(q, ["github", "linkedin", "social", "socials", "profile", "profiles", "facebook", "instagram", "source code", "repos", "repositories"]) * 2,
    answer: () => ({
      text: `Here's where to find him:\n\n${socialLinks.map((s) => `- **${s.label}** — @${s.handle}`).join("\n")}\n\nMost of the projects on this site link straight to their GitHub repo.`,
      actions: ["cta:github", "cta:linkedin"],
    }),
  },
  {
    id: "resume",
    weight: 2.2,
    match: (q) => countHits(q, ["cv", "resume", "résumé", "download his cv", "pdf"]) * 2.5,
    answer: () => ({
      text: `His CV is downloadable from the portfolio — it covers the same ground as the Experience section, in one page.`,
      actions: ["cta:resume", "cta:experience"],
    }),
  },
  {
    id: "location",
    weight: 2,
    match: (q) =>
      countHits(q, ["where", "based", "located", "location", "country", "city", "timezone", "time zone", "remote", "philippines"]) * 2,
    answer: () => ({
      text: `He's based in ${profile.location}. All of his work so far has been delivered remotely or locally to clients in the region, and calls are booked through this site in his timezone.`,
      actions: ["cta:contact"],
    }),
  },
  {
    id: "differentiator",
    weight: 2,
    match: (q) =>
      countHits(q, ["different", "differentiate", "stand out", "unique", "why him", "why leomar", "why hire", "why should", "better than", "special"]) * 2.2,
    answer: () => ({
      text: `Three things the portfolio actually shows:\n\n- **Real delivery, not just demos.** ${clientProjects.length} commissioned client systems, one of them live on its own domain for a school district.\n- **Genuinely full stack.** He's shipped in both MERN and PHP/MySQL, so he picks the stack that fits rather than the one he knows.\n- **AI in the workflow and in the product.** He builds with Claude Code, ChatGPT and Gemini, and ships AI features — this assistant and the AI Math Generator are both his.`,
      actions: [`project:${featured.slug}`, "cta:contact"],
    }),
  },
  {
    id: "testimonials",
    weight: 2,
    match: (q) =>
      countHits(q, ["testimonial", "testimonials", "recommendation", "recommendations", "review", "reviews", "reference", "references", "what do clients say", "feedback"]) * 2.2,
    answer: () => {
      const first = testimonials[0];
      return {
        text: `There are ${testimonials.length} recommendations on the site, from clients, a project adviser, an OJT supervisor and teammates.\n\n${first.name}, ${first.position}: *"${first.quote}"*`,
        actions: ["cta:contact"],
      };
    },
  },
  {
    id: "blog",
    weight: 2,
    match: (q) => countHits(q, ["blog", "article", "articles", "posts", "writing", "writes", "newsletter"]) * 2.2,
    answer: () => ({
      text: `He publishes technical articles on the site's blog — they're researched and drafted with AI assistance, then reviewed before going out.`,
      actions: ["cta:blog"],
    }),
  },
  {
    id: "thanks",
    weight: 1.6,
    match: (q) => countHits(q, ["thanks", "thank you", "thx", "cheers", "appreciate it", "great", "awesome", "cool", "nice"]) * 1.8,
    answer: () => ({
      text: `Anytime. If you want to take it further, a 30-minute call with ${firstName} is one click away.`,
      actions: ["cta:contact"],
    }),
  },
];

/* ── Entity-driven answers, which outrank every keyword intent ─────────── */

function answerForProject(project) {
  const links = project.demo
    ? `It's live at ${project.demo}.`
    : `There's no public deployment for this one, but the source is on GitHub.`;

  return {
    intent: "project-specific",
    text: `${project.description}\n\nBuilt with ${project.technologies.join(", ")}. ${links}`,
    actions: buildActions([`project:${project.slug}`, "cta:contact"]),
  };
}

function answerForTechnology(tech) {
  const matches = projectsUsing(tech);
  const label = tech.slice(0, 2).join(" and ");

  if (!matches.length) {
    return {
      intent: "technology",
      text: `${label} is in his toolkit, but none of the projects on the site are built with it. Worth asking ${firstName} directly how he's used it.`,
      actions: buildActions(["cta:skills", "cta:contact"]),
    };
  }

  const shown = matches.slice(0, 2);

  return {
    intent: "technology",
    text: `Yes — ${label} shows up in ${matches.length} of his projects${matches.length > 2 ? `, including these` : ""}: ${matches.map((p) => p.title).join(", ")}.`,
    actions: buildActions([
      ...shown.map((p) => `project:${p.slug}`),
      "cta:projects",
    ]),
  };
}

/** Highest-scoring intent for an already-normalised question, or null. */
function bestIntent(q) {
  let best = null;
  let bestScore = 0;

  for (const intent of INTENTS) {
    const score = intent.match(q) * intent.weight;
    if (score > bestScore) {
      bestScore = score;
      best = intent;
    }
  }

  return best;
}

/* ── Public API ────────────────────────────────────────────────────────── */

/**
 * Best-guess intent for a question. Exported on its own because the UI uses it
 * to pick follow-up suggestions even when the model answered.
 *
 * @param {string} question
 * @returns {string} intent id, or "unknown"
 */
export function detectIntent(question) {
  const q = normalise(question);
  if (!q.trim()) return "unknown";

  if (findProject(q)) return "project-specific";

  const best = bestIntent(q);

  if (best) return best.id;
  return findTechnologies(q).length ? "technology" : "unknown";
}

/**
 * Answer a question from the portfolio data alone.
 *
 * @param {string} question
 * @returns {{ intent: string, text: string, actions: Array<object> }}
 */
export function answerFromKnowledge(question) {
  const q = normalise(question);

  // A named project beats any keyword score — "tell me about EduLink" is not a
  // generic projects question, and answering it as one would be a downgrade.
  const project = findProject(q);
  if (project) return answerForProject(project);

  const best = bestIntent(q);

  if (best) {
    const { text, actions } = best.answer();
    return { intent: best.id, text, actions: buildActions(actions) };
  }

  const tech = findTechnologies(q);
  if (tech.length) return answerForTechnology(tech);

  return {
    intent: "unknown",
    text: `I don't have that in ${firstName}'s portfolio yet — I only answer from what's actually on this site, so I'd rather not guess.\n\nI can tell you about his projects, his stack, his experience, or how to reach him. Or ask him directly and he'll answer properly.`,
    actions: buildActions(["cta:projects", "cta:contact"]),
  };
}

/**
 * The same answer, flattened to the wire format every reply uses: prose with
 * the rich-block directives appended. Shared by the API's fallback path and by
 * the browser when the endpoint cannot be reached at all.
 *
 * @param {string} question
 * @returns {string}
 */
export function fallbackReplyText(question) {
  const { text, actions } = answerFromKnowledge(question);
  const directives = serialiseActions(actions);
  return directives ? `${text}\n\n${directives}` : text;
}
