/**
 * Generation orchestrator.
 *
 * Tries topic candidates in order, and treats a duplicate or a validation
 * failure as a reason to try the next topic rather than as a fatal error —
 * but never publishes more than one post per call, and never publishes
 * anything that has not passed validation.
 */

import { generateStructured, researchWithSearch } from "./gemini.js";
import { ARTICLE_SCHEMA, AUTHOR, articlePrompt, researchPrompt } from "./prompts.js";
import { selectTopicCandidates } from "../blog/topics.js";
import { findDuplicate } from "../blog/similarity.js";
import { toBlogPost, validateArticle, ValidationError } from "../blog/schema.js";

const WORD_RANGE = [1000, 2000];
const MAX_TOPIC_ATTEMPTS = 3;

export class GenerationError extends Error {
  constructor(message, attempts) {
    super(message);
    this.name = "GenerationError";
    this.attempts = attempts;
  }
}

/**
 * @param {object} options
 * @param {Array<{ title: string, slug: string, category: string, publishedAt: string }>} options.existingPosts
 * @param {string[]} [options.usedTopicIds]
 * @param {Date}   [options.now]
 * @param {string} [options.topicId]   Force a topic (admin endpoint).
 * @returns {Promise<{ post: object, topic: object, attempts: object[] }>}
 */
export async function generateBlogPost({
  existingPosts,
  usedTopicIds = [],
  now = new Date(),
  topicId,
}) {
  const today = now.toISOString().slice(0, 10);
  const recentPosts = existingPosts.slice(0, 12);
  const recentTitles = recentPosts.map((post) => post.title);

  let candidates = selectTopicCandidates({
    recentCategories: recentPosts.map((post) => post.category),
    usedTopicIds,
    seed: now.getUTCDate(),
  });

  if (topicId) {
    const forced = candidates.find((topic) => topic.id === topicId);
    if (!forced) throw new GenerationError(`Unknown topic id "${topicId}"`, []);
    candidates = [forced];
  }

  const attempts = [];

  for (const topic of candidates.slice(0, MAX_TOPIC_ATTEMPTS)) {
    const attempt = { topicId: topic.id, category: topic.category };

    try {
      let research = "";
      let searchSources = [];

      if (topic.needsResearch !== false) {
        const result = await researchWithSearch(
          researchPrompt({
            angle: topic.angle,
            research: topic.research,
            today,
          }),
        );

        // Writing about "what is new" without current facts is how invented
        // releases happen. Move to the next topic instead.
        if (!result.notes || result.notes.length < 200) {
          attempt.outcome = "research-empty";
          attempts.push(attempt);
          continue;
        }

        research = result.notes;
        searchSources = result.sources;
        attempt.grounded = result.grounded;
      }

      const raw = await generateStructured(
        articlePrompt({
          angle: topic.angle,
          category: topic.category,
          today,
          recentTitles,
          research,
          wordRange: WORD_RANGE,
        }),
        ARTICLE_SCHEMA,
      );

      const article = validateArticle(raw);

      // Only sources search actually returned survive; anything the model
      // added while writing is discarded rather than trusted.
      const verified = article.sources.filter((url) =>
        searchSources.some((source) => source === url),
      );
      article.sources = verified.length ? verified : searchSources.slice(0, 6);

      const duplicate = findDuplicate(article, existingPosts);
      if (duplicate.duplicate) {
        attempt.outcome = "duplicate";
        attempt.detail = duplicate.reason;
        attempt.match = duplicate.match;
        attempts.push(attempt);
        continue;
      }

      attempt.outcome = "generated";
      attempt.title = article.title;
      attempts.push(attempt);

      return {
        post: toBlogPost(article, { author: AUTHOR, now }),
        topic,
        attempts,
      };
    } catch (error) {
      attempt.outcome =
        error instanceof ValidationError ? "invalid" : "error";
      attempt.detail = error.message;
      if (error instanceof ValidationError) attempt.problems = error.problems;
      attempts.push(attempt);
    }
  }

  throw new GenerationError(
    "No topic produced a publishable article this run",
    attempts,
  );
}
