/**
 * Best-effort rate limiting for the chat endpoint.
 *
 * Same honest caveat as `lib/booking/rate-limit.js`: serverless instances do
 * not share memory, so this is a speed bump rather than a guarantee. It exists
 * because every request here costs money at the model, and an unmetered public
 * endpoint that spends money is the one thing worth putting a lid on even if
 * the lid is imperfect. A hard limit would need shared storage (Upstash Redis
 * or similar) — a deliberate trade to avoid adding a third-party service.
 *
 * Separate module from booking on purpose: the budgets are unrelated, and a
 * chatty visitor must never eat into someone else's ability to book a call.
 */

const WINDOW_MS = 5 * 60 * 1000;
/** A real conversation is ~5-10 turns; 20 leaves plenty of headroom. */
const MAX_PER_WINDOW = 20;
/** Ceiling across all callers on one instance, as a crude flood guard. */
const MAX_GLOBAL_PER_WINDOW = 240;

/** @type {Map<string, number[]>} */
const hits = new Map();

function prune(now) {
  hits.forEach((timestamps, key) => {
    const fresh = timestamps.filter((time) => now - time < WINDOW_MS);
    if (fresh.length) hits.set(key, fresh);
    else hits.delete(key);
  });
}

/** Vercel puts the client IP in x-forwarded-for; the first entry is the caller. */
export function clientKey(request) {
  const forwarded = request.headers["x-forwarded-for"];
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  const ip = String(raw ?? "").split(",")[0].trim();
  return ip || "unknown";
}

/**
 * @param {string} key
 * @param {number} [now]
 * @returns {{ allowed: boolean, retryAfterSeconds: number }}
 */
export function consume(key, now = Date.now()) {
  prune(now);

  const total = [...hits.values()].reduce(
    (count, timestamps) => count + timestamps.length,
    0,
  );

  const timestamps = hits.get(key) ?? [];

  if (timestamps.length >= MAX_PER_WINDOW || total >= MAX_GLOBAL_PER_WINDOW) {
    const oldest = timestamps[0] ?? now;
    return {
      allowed: false,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((WINDOW_MS - (now - oldest)) / 1000),
      ),
    };
  }

  hits.set(key, [...timestamps, now]);
  return { allowed: true, retryAfterSeconds: 0 };
}

/** Test seam. */
export function reset() {
  hits.clear();
}
