/**
 * Blog index, built at compile time from `content/blog/*.json`.
 *
 * The generator commits posts as JSON files and Vercel redeploys, so the
 * bundle always ships the current set — no runtime fetch, no loading state,
 * and no frontmatter parser in the client bundle.
 *
 * @typedef {object} BlogPost
 * @property {string}   id
 * @property {string}   slug
 * @property {string}   title
 * @property {string}   excerpt
 * @property {string}   content        Markdown body.
 * @property {string}   category
 * @property {string[]} tags
 * @property {string}   author
 * @property {string}   publishedAt    ISO 8601.
 * @property {string?}  [updatedAt]    ISO 8601, when edited after publishing.
 * @property {number}   readingTime    Minutes.
 * @property {string?}  [coverImage]
 * @property {string[]} [sourceUrls]
 * @property {boolean}  aiGenerated
 * @property {"draft"|"published"} status
 */

const modules = import.meta.glob("../../content/blog/*.json", { eager: true });

/** Drafts and the generation log never reach the client. */
export const posts = Object.entries(modules)
  .filter(([path]) => !path.includes("/_"))
  .map(([, module]) => /** @type {BlogPost} */ (module.default ?? module))
  .filter((post) => post?.status === "published")
  .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

/** @param {string} slug */
export function getPostBySlug(slug) {
  return posts.find((post) => post.slug === slug) ?? null;
}

/**
 * Neighbours in publication order, for the article footer. `previous` is the
 * older post, so the pair reads the way the archive does.
 * @param {string} slug
 */
export function getAdjacentPosts(slug) {
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) return { previous: null, next: null };

  return {
    previous: posts[index + 1] ?? null,
    next: posts[index - 1] ?? null,
  };
}

/** Categories actually in use, most-used first, for the filter row. */
export const categories = Object.entries(
  posts.reduce((counts, post) => {
    counts[post.category] = (counts[post.category] ?? 0) + 1;
    return counts;
  }, {}),
)
  .sort((a, b) => b[1] - a[1])
  .map(([name, count]) => ({ name, count }));

export const totalPosts = posts.length;
