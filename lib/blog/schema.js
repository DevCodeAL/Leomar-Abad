/**
 * Validation for model output. Nothing reaches the repository until it has
 * been through here — a generation that fails validation is a failed run, not
 * a published post.
 *
 * @typedef {object} GeneratedArticle
 * @property {string}   title
 * @property {string}   slug
 * @property {string}   excerpt
 * @property {string}   content
 * @property {string}   category
 * @property {string[]} tags
 * @property {number}   readingTime
 * @property {string[]} sources
 */

export const CATEGORIES = [
  "AI",
  "Web Development",
  "Developer Tools",
  "Technology Trends",
  "Open Source",
  "Career",
  "Projects",
  "Developer Wins",
  "Developer Notes",
];

const LIMITS = {
  title: [15, 120],
  excerpt: [60, 320],
  content: [1200, 24000],
  tags: [1, 6],
  readingTime: [1, 30],
};

/** Phrases that mark exactly the generic AI voice the brief rules out. */
const BANNED_OPENERS = [
  "in today's rapidly evolving",
  "in today's fast-paced",
  "in the ever-evolving world",
  "in the world of software development",
  "as an ai language model",
  "delve into",
  "it's important to note that",
];

export class ValidationError extends Error {
  /** @param {string} message @param {string[]} [problems] */
  constructor(message, problems = []) {
    super(message);
    this.name = "ValidationError";
    this.problems = problems;
  }
}

/** @param {string} value */
export function toSlug(value) {
  return String(value)
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

/** @param {string} markdown */
export function countWords(markdown) {
  return markdown.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Structural validation plus the content rules that matter: a real body, a
 * known category, honest sources, and none of the stock AI phrasing.
 *
 * @param {unknown} raw
 * @returns {GeneratedArticle}
 */
export function validateArticle(raw) {
  const problems = [];

  if (!raw || typeof raw !== "object") {
    throw new ValidationError("Model returned no usable object", [
      "response was not an object",
    ]);
  }

  const article = /** @type {Record<string, unknown>} */ (raw);
  const text = (key) => (typeof article[key] === "string" ? article[key].trim() : "");

  const title = text("title");
  const excerpt = text("excerpt");
  const content = text("content");
  const category = text("category");
  const slug = toSlug(text("slug") || title);

  const between = (value, [min, max], label) => {
    if (value.length < min || value.length > max) {
      problems.push(
        `${label} length ${value.length} outside ${min}–${max} characters`,
      );
    }
  };

  between(title, LIMITS.title, "title");
  between(excerpt, LIMITS.excerpt, "excerpt");
  between(content, LIMITS.content, "content");

  if (!slug) problems.push("slug is empty after normalisation");
  if (!CATEGORIES.includes(category)) {
    problems.push(`category "${category}" is not one of the allowed values`);
  }

  const tags = Array.isArray(article.tags)
    ? article.tags
        .filter((tag) => typeof tag === "string" && tag.trim())
        .map((tag) => tag.trim())
        .slice(0, LIMITS.tags[1])
    : [];
  if (tags.length < LIMITS.tags[0]) problems.push("at least one tag required");

  // Only https sources, and only ones that parse — a fabricated citation is
  // worse than none, so anything malformed is dropped rather than kept.
  const sources = (Array.isArray(article.sources) ? article.sources : [])
    .filter((url) => typeof url === "string")
    .map((url) => url.trim())
    .filter((url) => {
      try {
        return new URL(url).protocol === "https:";
      } catch {
        return false;
      }
    });

  const words = countWords(content);
  let readingTime = Number(article.readingTime);
  if (!Number.isFinite(readingTime) || readingTime < LIMITS.readingTime[0]) {
    readingTime = Math.max(1, Math.round(words / 200));
  }
  readingTime = Math.min(readingTime, LIMITS.readingTime[1]);

  const lowered = content.toLowerCase();
  const banned = BANNED_OPENERS.filter((phrase) => lowered.includes(phrase));
  if (banned.length) {
    problems.push(`contains stock AI phrasing: ${banned.join(", ")}`);
  }

  // A body with no structure is a wall of text, not an article.
  if (!/^#{2,3}\s/m.test(content)) {
    problems.push("content has no headings");
  }

  if (problems.length) {
    throw new ValidationError("Generated article failed validation", problems);
  }

  return { title, slug, excerpt, content, category, tags, readingTime, sources };
}

/**
 * Turn a validated article into the stored post shape.
 * @param {GeneratedArticle} article
 * @param {{ author: string, now?: Date }} options
 */
export function toBlogPost(article, { author, now = new Date() }) {
  return {
    id: `${now.toISOString().slice(0, 10)}-${article.slug}`.slice(0, 120),
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    category: article.category,
    tags: article.tags,
    author,
    publishedAt: now.toISOString(),
    updatedAt: null,
    readingTime: article.readingTime,
    coverImage: null,
    sourceUrls: article.sources,
    aiGenerated: true,
    status: "published",
  };
}
