/**
 * Topic registry.
 *
 * Each entry is an angle rather than a headline — the model is asked to find
 * something specific and current within the angle, which is what keeps the
 * output away from "10 AI Tools Every Developer Should Know". Edit freely;
 * nothing else needs to change.
 */

/**
 * @typedef {object} Topic
 * @property {string} id
 * @property {string} category   Must be one of CATEGORIES in ./schema.js.
 * @property {string} angle      What the article should be about.
 * @property {string} research   What to search for before writing.
 * @property {boolean} [needsResearch]  False for reflective, personal pieces.
 */

/** @type {Topic[]} */
export const TOPICS = [
  {
    id: "trend-frontend-architecture",
    category: "Web Development",
    angle:
      "A frontend architecture pattern that has recently gained or lost favour, and what actually changed to cause it",
    research:
      "recent frontend architecture discussion, framework release notes, RFCs from React/Vue/Svelte/Angular teams",
  },
  {
    id: "trend-javascript-ecosystem",
    category: "Technology Trends",
    angle:
      "A concrete change in the JavaScript or TypeScript ecosystem — a spec stage change, a runtime feature, a build tool shift — and what it means day to day",
    research:
      "TC39 proposal stage changes, Node.js/Deno/Bun release notes, Vite/Turbopack/esbuild announcements",
  },
  {
    id: "tool-cli-discovery",
    category: "Developer Tools",
    angle:
      "A CLI tool or small utility worth adding to a workflow, with the specific problem it removes",
    research:
      "recently released developer CLI tools, GitHub trending repositories, official tool documentation",
  },
  {
    id: "tool-library-release",
    category: "Open Source",
    angle:
      "A notable open-source library release: what changed, what it replaces, and whether it is worth migrating",
    research:
      "recent major library releases, changelogs, migration guides from official repositories",
  },
  {
    id: "ai-model-release",
    category: "AI",
    angle:
      "A newly released or updated AI model or API, focused on what a developer can now build that they could not before",
    research:
      "official model announcements and API documentation from Google, Anthropic, OpenAI, Microsoft, Meta",
  },
  {
    id: "ai-coding-workflow",
    category: "AI",
    angle:
      "A practical AI-assisted development workflow — where it genuinely helps, and where it costs more than it saves",
    research:
      "AI coding assistant documentation, agent frameworks, MCP and tool-use developments",
  },
  {
    id: "ai-local-models",
    category: "AI",
    angle:
      "Running models locally or on the edge: what it costs, what it buys you, and when it beats an API call",
    research:
      "local inference runtimes, quantisation, on-device model releases, official benchmarks",
  },
  {
    id: "notes-debugging",
    category: "Developer Notes",
    angle:
      "A debugging lesson with a concrete reproduction — the wrong assumption, the evidence that corrected it, and the fix",
    research: "",
    needsResearch: false,
  },
  {
    id: "notes-performance",
    category: "Developer Notes",
    angle:
      "A performance problem measured before and after, with the numbers that justified the change",
    research: "",
    needsResearch: false,
  },
  {
    id: "notes-deployment",
    category: "Developer Notes",
    angle:
      "Something learned deploying to production that the documentation does not tell you",
    research: "",
    needsResearch: false,
  },
  {
    id: "wins-build-lesson",
    category: "Developer Wins",
    angle:
      "Something learned while building a real feature — the problem, the approach that failed, and what finally worked",
    research: "",
    needsResearch: false,
  },
  {
    id: "wins-portfolio-improvement",
    category: "Developer Wins",
    angle:
      "A concrete improvement shipped to a personal project, with the reasoning behind the trade-offs",
    research: "",
    needsResearch: false,
  },
  {
    id: "career-lessons",
    category: "Career",
    angle:
      "A practical lesson about working as a developer — estimating, reviewing, communicating with clients — grounded in a specific situation",
    research: "",
    needsResearch: false,
  },
];

/**
 * Rotate deterministically through topics, skipping any whose angle is already
 * covered by a recent post, so the same category cannot come up twice running.
 *
 * @param {{ recentCategories?: string[], usedTopicIds?: string[], seed?: number }} options
 * @returns {Topic[]} candidates in preference order
 */
export function selectTopicCandidates({
  recentCategories = [],
  usedTopicIds = [],
  seed = 0,
} = {}) {
  const recentlyUsed = new Set(usedTopicIds.slice(0, 4));
  const recent = recentCategories.slice(0, 2);

  const scored = TOPICS.map((topic, index) => {
    let score = 0;
    if (recentlyUsed.has(topic.id)) score += 100;
    const categoryIndex = recent.indexOf(topic.category);
    if (categoryIndex !== -1) score += 20 - categoryIndex * 5;
    // Deterministic rotation so consecutive runs do not start from the same
    // place, without needing randomness the caller cannot reproduce.
    score += (index + seed) % TOPICS.length;
    return { topic, score };
  });

  return scored.sort((a, b) => a.score - b.score).map((entry) => entry.topic);
}
