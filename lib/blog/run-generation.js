/**
 * The shared publishing run, used by both the cron and the admin endpoint so
 * the two can never drift apart. The only difference between them is who is
 * allowed to call, and whether the quota may be bypassed.
 */

import { generateBlogPost, GenerationError } from "../ai/generate-blog.js";
import { appendLog, listPosts, readLog, savePost } from "./repository.js";
import { evaluateQuota } from "./quota.js";

const DEFAULT_POSTS_PER_MONTH = 4;

function postsPerMonth() {
  const configured = Number(process.env.BLOG_POSTS_PER_MONTH);
  return Number.isFinite(configured) && configured > 0 && configured <= 31
    ? Math.floor(configured)
    : DEFAULT_POSTS_PER_MONTH;
}

/**
 * @param {object} [options]
 * @param {boolean} [options.force]   Ignore pacing (admin only). The monthly
 *                                    cap still applies.
 * @param {boolean} [options.dryRun]  Generate and validate, commit nothing.
 * @param {string}  [options.topicId]
 * @param {Date}    [options.now]
 */
export async function runGeneration({
  force = false,
  dryRun = false,
  topicId,
  now = new Date(),
} = {}) {
  const startedAt = Date.now();
  const perMonth = postsPerMonth();

  const posts = await listPosts();
  const quota = evaluateQuota({ posts, postsPerMonth: perMonth, now });

  const atCap = quota.postsThisMonth >= perMonth;

  // `force` skips pacing but never the cap — otherwise repeated admin calls
  // could quietly blow through the monthly budget.
  if (!quota.shouldGenerate && !(force && !atCap)) {
    return {
      status: "skipped",
      generated: false,
      quota,
      reason: atCap ? `monthly cap of ${perMonth} reached` : quota.reason,
      durationMs: Date.now() - startedAt,
    };
  }

  const { entries } = await readLog();
  const usedTopicIds = entries
    .map((entry) => entry.topicId)
    .filter(Boolean)
    .slice(0, 6);

  try {
    const { post, topic, attempts } = await generateBlogPost({
      existingPosts: posts,
      usedTopicIds,
      topicId,
      now,
    });

    if (dryRun) {
      return {
        status: "dry-run",
        generated: false,
        quota,
        post: preview(post),
        topicId: topic.id,
        attempts,
        durationMs: Date.now() - startedAt,
      };
    }

    // Throws if the commit does not land, so a storage failure can never be
    // reported as a successful publication.
    const saved = await savePost(post);

    await appendLog({
      at: now.toISOString(),
      outcome: "published",
      topicId: topic.id,
      slug: post.slug,
      title: post.title,
      commit: saved.commit,
      durationMs: Date.now() - startedAt,
    });

    return {
      status: "published",
      generated: true,
      quota,
      post: preview(post),
      commit: saved.commit,
      path: saved.path,
      topicId: topic.id,
      attempts,
      durationMs: Date.now() - startedAt,
    };
  } catch (error) {
    const failure = {
      at: now.toISOString(),
      outcome: "failed",
      topicId: topicId ?? null,
      error: error.message,
      attempts: error instanceof GenerationError ? error.attempts : undefined,
      durationMs: Date.now() - startedAt,
    };

    // Recorded so the next scheduled run can see what happened; the window
    // stays unfilled, so tomorrow retries on its own.
    await appendLog(failure);

    return {
      status: "failed",
      generated: false,
      quota,
      error: error.message,
      attempts: failure.attempts ?? [],
      durationMs: Date.now() - startedAt,
    };
  }
}

/** Response-sized view: never echo a full article body back over HTTP. */
function preview(post) {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    category: post.category,
    tags: post.tags,
    readingTime: post.readingTime,
    words: post.content.trim().split(/\s+/).length,
    sourceUrls: post.sourceUrls,
    publishedAt: post.publishedAt,
    status: post.status,
    url: `/blog/${post.slug}`,
  };
}
