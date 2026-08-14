/**
 * Duplicate detection.
 *
 * Cheap on purpose: a Jaccard overlap of significant words in the title, plus
 * an exact slug check. Embeddings would be more accurate, but this runs
 * without a second API call and reliably catches the failure that matters —
 * the model rewriting last month's article with new adjectives.
 */

const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "but", "by", "for", "from", "how",
  "in", "into", "is", "it", "its", "of", "on", "or", "that", "the", "to", "was",
  "what", "when", "why", "with", "you", "your", "i", "my", "we", "this", "then",
  "than", "about", "using", "use", "guide", "developer", "developers",
]);

/** @param {string} value */
function significantWords(value) {
  return new Set(
    String(value)
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2 && !STOP_WORDS.has(word)),
  );
}

/** @param {Set<string>} a @param {Set<string>} b */
function jaccard(a, b) {
  if (a.size === 0 || b.size === 0) return 0;
  let shared = 0;
  a.forEach((word) => {
    if (b.has(word)) shared += 1;
  });
  return shared / (a.size + b.size - shared);
}

/** Above this, two titles are treated as the same article. */
export const SIMILARITY_THRESHOLD = 0.42;

/**
 * @param {{ title: string, slug: string }} candidate
 * @param {Array<{ title: string, slug: string }>} existing
 * @returns {{ duplicate: boolean, score: number, match: string|null, reason: string|null }}
 */
export function findDuplicate(candidate, existing) {
  const slug = candidate.slug?.toLowerCase();

  const slugClash = existing.find((post) => post.slug?.toLowerCase() === slug);
  if (slugClash) {
    return {
      duplicate: true,
      score: 1,
      match: slugClash.title,
      reason: "slug already exists",
    };
  }

  const candidateWords = significantWords(candidate.title);
  let best = { score: 0, match: null };

  existing.forEach((post) => {
    const score = jaccard(candidateWords, significantWords(post.title));
    if (score > best.score) best = { score, match: post.title };
  });

  return {
    duplicate: best.score >= SIMILARITY_THRESHOLD,
    score: Number(best.score.toFixed(3)),
    match: best.match,
    reason:
      best.score >= SIMILARITY_THRESHOLD
        ? `title overlaps an existing post (${best.score.toFixed(2)})`
        : null,
  };
}
