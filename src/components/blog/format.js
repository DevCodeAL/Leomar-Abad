/** Shared date formatting so listing, article and RSS never drift apart. */

const LONG = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

/** @param {string} iso */
export function formatDate(iso) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "" : LONG.format(date);
}

/**
 * Words per minute is a convention, not a measurement — 200 is the usual
 * figure. Only used as a fallback when a post carries no `readingTime`.
 * @param {string} markdown
 */
export function estimateReadingTime(markdown) {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
