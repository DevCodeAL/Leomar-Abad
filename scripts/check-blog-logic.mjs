/**
 * Smoke checks for the blog generation logic that can be verified without an
 * API key or network: pacing, duplicate detection, article validation and
 * endpoint auth. Run with `npm run check:blog`.
 *
 * Deliberately dependency-free — the project has no test runner, and adding
 * one for four modules would be a bigger change than the thing it verifies.
 */

import assert from "node:assert/strict";
import { evaluateQuota, windowOpenDays } from "../lib/blog/quota.js";
import { findDuplicate } from "../lib/blog/similarity.js";
import { toSlug, validateArticle, ValidationError } from "../lib/blog/schema.js";
import { secretMatches } from "../lib/http/auth.js";

let passed = 0;
const failures = [];

function check(name, fn) {
  try {
    fn();
    passed += 1;
  } catch (error) {
    failures.push(`${name}\n    ${error.message.split("\n")[0]}`);
  }
}

const aiPost = (day, title = "Some post") => ({
  title,
  slug: toSlug(title),
  category: "AI",
  aiGenerated: true,
  publishedAt: `2026-03-${String(day).padStart(2, "0")}T09:00:00.000Z`,
});

const march = (day) => new Date(`2026-03-${String(day).padStart(2, "0")}T09:00:00.000Z`);

/* ── Pacing ───────────────────────────────────────────────────────────── */

check("windows are spread across a 31-day month", () => {
  assert.deepEqual(windowOpenDays(march(1), 4), [1, 8, 16, 24]);
});

check("first window, no posts yet -> generate", () => {
  const quota = evaluateQuota({ posts: [], postsPerMonth: 4, now: march(1) });
  assert.equal(quota.shouldGenerate, true);
  assert.equal(quota.windowsElapsed, 1);
});

check("window already filled -> skip", () => {
  const quota = evaluateQuota({
    posts: [aiPost(1)],
    postsPerMonth: 4,
    now: march(2),
  });
  assert.equal(quota.shouldGenerate, false);
});

check("next window opens -> generate again", () => {
  const quota = evaluateQuota({
    posts: [aiPost(1)],
    postsPerMonth: 4,
    now: march(8),
  });
  assert.equal(quota.shouldGenerate, true);
  assert.equal(quota.windowsElapsed, 2);
});

check("monthly cap is never exceeded", () => {
  const posts = [aiPost(1), aiPost(8), aiPost(16), aiPost(24)];
  const quota = evaluateQuota({ posts, postsPerMonth: 4, now: march(28) });
  assert.equal(quota.shouldGenerate, false);
  assert.match(quota.reason, /cap/);
});

check("a missed window is caught up, one post at a time", () => {
  // Nothing published all month; on day 24 three windows are overdue, but a
  // run still publishes at most one post.
  const quota = evaluateQuota({ posts: [], postsPerMonth: 4, now: march(24) });
  assert.equal(quota.shouldGenerate, true);
  assert.equal(quota.windowsElapsed, 4);
});

check("hand-written posts do not consume the AI quota", () => {
  const manual = { ...aiPost(1), aiGenerated: false };
  const quota = evaluateQuota({ posts: [manual], postsPerMonth: 4, now: march(2) });
  assert.equal(quota.postsThisMonth, 0);
});

check("last month's posts do not count", () => {
  const old = { ...aiPost(1), publishedAt: "2026-02-01T09:00:00.000Z" };
  const quota = evaluateQuota({ posts: [old], postsPerMonth: 4, now: march(2) });
  assert.equal(quota.postsThisMonth, 0);
});

/* ── Duplicates ───────────────────────────────────────────────────────── */

const existing = [
  { title: "What changed in the Vite 6 build pipeline", slug: "what-changed-in-the-vite-6-build-pipeline" },
  { title: "Running local models on a laptop GPU", slug: "running-local-models-on-a-laptop-gpu" },
];

check("identical slug is rejected", () => {
  const result = findDuplicate(
    { title: "Different words entirely", slug: "running-local-models-on-a-laptop-gpu" },
    existing,
  );
  assert.equal(result.duplicate, true);
  assert.match(result.reason, /slug/);
});

check("partial reword is still caught (exercises the threshold)", () => {
  // Shares 4 of 6 significant words -> ~0.67. Chosen to sit above the
  // threshold but well below 1.0, so this test fails if the threshold moves.
  const result = findDuplicate(
    { title: "Running local models without a GPU", slug: "running-local-models-without-gpu" },
    existing,
  );
  assert.equal(result.duplicate, true, `score was ${result.score}`);
  assert.ok(result.score < 0.9, `expected a partial score, got ${result.score}`);
});

check("same words, different subject, is allowed through", () => {
  // Two shared words out of seven -> below threshold. Guards the other
  // direction: a threshold set too low would block unrelated articles.
  const result = findDuplicate(
    { title: "Local development against a remote database", slug: "local-dev-remote-database" },
    existing,
  );
  assert.equal(result.duplicate, false, `score was ${result.score}`);
});

check("genuinely different topic is allowed", () => {
  const result = findDuplicate(
    { title: "Why my carousel autoplay ignored hover", slug: "carousel-autoplay-hover" },
    existing,
  );
  assert.equal(result.duplicate, false);
});

check("stop words alone do not trigger a match", () => {
  const result = findDuplicate(
    { title: "A guide for the developer using this", slug: "a-guide" },
    existing,
  );
  assert.equal(result.duplicate, false);
});

/* ── Slugs ────────────────────────────────────────────────────────────── */

check("slugs are clean kebab-case", () => {
  assert.equal(toSlug("Gemini AI: A Developer's Workflow!"), "gemini-ai-a-developer-s-workflow");
  assert.equal(toSlug("  spaced   out  "), "spaced-out");
  assert.equal(toSlug("Trailing punctuation???"), "trailing-punctuation");
});

/* ── Article validation ───────────────────────────────────────────────── */

const body = [
  "Here is a real opening paragraph that gets straight to the point.",
  "",
  "## The first section",
  "",
  "Detail, with something concrete in it and a reason to care.",
  "",
  "```js",
  "const x = 1;",
  "```",
  "",
  "## The second section",
  "",
  "More detail, a trade-off, and when not to use this.",
].join("\n");

const validArticle = () => ({
  title: "A specific and concrete title about one thing",
  slug: "a-specific-and-concrete-title",
  excerpt:
    "One or two sentences that state plainly what the reader gets out of this article without teasing them.",
  content: body.padEnd(1300, " \nMore substantive detail follows here."),
  category: "Developer Notes",
  tags: ["React", "Testing"],
  readingTime: 6,
  sources: ["https://example.com/docs", "http://insecure.example.com"],
});

check("a well-formed article passes", () => {
  const result = validateArticle(validArticle());
  assert.equal(result.category, "Developer Notes");
  assert.equal(result.tags.length, 2);
});

check("non-https sources are dropped, not kept", () => {
  const result = validateArticle(validArticle());
  assert.deepEqual(result.sources, ["https://example.com/docs"]);
});

check("unknown category is rejected", () => {
  assert.throws(
    () => validateArticle({ ...validArticle(), category: "Thought Leadership" }),
    ValidationError,
  );
});

check("a stub body is rejected", () => {
  assert.throws(
    () => validateArticle({ ...validArticle(), content: "## Too short\n\nNope." }),
    ValidationError,
  );
});

check("stock AI phrasing is rejected", () => {
  const article = validArticle();
  article.content = `In today's rapidly evolving landscape, ${article.content}`;
  assert.throws(() => validateArticle(article), ValidationError);
});

check("a body with no headings is rejected", () => {
  const article = validArticle();
  article.content = article.content.replace(/^## .*$/gm, "Just a paragraph.");
  assert.throws(() => validateArticle(article), ValidationError);
});

check("empty model output is rejected rather than published", () => {
  assert.throws(() => validateArticle(null), ValidationError);
  assert.throws(() => validateArticle({}), ValidationError);
});

check("reading time is recomputed when the model gets it wrong", () => {
  const result = validateArticle({ ...validArticle(), readingTime: 0 });
  assert.ok(result.readingTime >= 1);
});

/* ── Endpoint auth ────────────────────────────────────────────────────── */

check("correct secret is accepted", () => {
  assert.equal(secretMatches("s3cret-value", "s3cret-value"), true);
});

check("wrong secret is rejected", () => {
  assert.equal(secretMatches("s3cret-value", "s3cret-valuf"), false);
});

check("length mismatch is rejected without throwing", () => {
  assert.equal(secretMatches("short", "much-longer-secret"), false);
});

check("missing or empty secret is rejected", () => {
  assert.equal(secretMatches(undefined, "expected"), false);
  assert.equal(secretMatches("provided", undefined), false);
  assert.equal(secretMatches("", ""), false);
});

/* ── Report ───────────────────────────────────────────────────────────── */

if (failures.length) {
  console.error(`\n${failures.length} check(s) FAILED:\n`);
  failures.forEach((failure) => console.error(`  ✗ ${failure}`));
  console.error(`\n${passed} passed, ${failures.length} failed\n`);
  process.exit(1);
}

console.log(`\n✓ all ${passed} blog logic checks passed\n`);
