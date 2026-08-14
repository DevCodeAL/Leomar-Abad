/**
 * Monthly pacing.
 *
 * The cron runs daily and this decides whether today's run should do anything.
 * The month is cut into `postsPerMonth` equal windows; a run publishes only
 * when fewer posts exist than windows have opened. So four posts land roughly
 * weekly, a failed run is retried the next day rather than lost, and the cap
 * can never be exceeded no matter how often the endpoint is hit.
 */

/** @param {Date} date */
export function monthKey(date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

/** @param {Date} date */
function daysInMonth(date) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0),
  ).getUTCDate();
}

/**
 * First day of each publishing window, 1-indexed.
 * @param {Date} now @param {number} postsPerMonth
 */
export function windowOpenDays(now, postsPerMonth) {
  const total = daysInMonth(now);
  return Array.from(
    { length: postsPerMonth },
    (_, index) => Math.floor((index * total) / postsPerMonth) + 1,
  );
}

/**
 * @param {object} options
 * @param {Array<{ publishedAt: string, aiGenerated: boolean }>} options.posts
 * @param {number} options.postsPerMonth
 * @param {Date}   [options.now]
 */
export function evaluateQuota({ posts, postsPerMonth, now = new Date() }) {
  const key = monthKey(now);

  const postsThisMonth = posts.filter(
    (post) =>
      post.aiGenerated && monthKey(new Date(post.publishedAt)) === key,
  ).length;

  const openDays = windowOpenDays(now, postsPerMonth);
  const windowsElapsed = openDays.filter(
    (day) => day <= now.getUTCDate(),
  ).length;

  const atCap = postsThisMonth >= postsPerMonth;
  const windowFilled = postsThisMonth >= windowsElapsed;

  return {
    month: key,
    postsThisMonth,
    postsPerMonth,
    windowsElapsed,
    windowOpenDays: openDays,
    shouldGenerate: !atCap && !windowFilled,
    reason: atCap
      ? `monthly cap of ${postsPerMonth} already reached`
      : windowFilled
        ? `window ${windowsElapsed} of ${postsPerMonth} already has a post`
        : `window ${windowsElapsed} of ${postsPerMonth} is open and unfilled`,
  };
}
