/**
 * Best-effort rate limiting.
 *
 * Serverless instances do not share memory, so this is a speed bump rather
 * than a guarantee: an abuser who triggers cold starts gets fresh counters.
 * It is stated plainly here so nobody later mistakes it for a hard limit. The
 * real defences against duplicate bookings are the honeypot, the timing check,
 * server-side slot validation and the deterministic event ID.
 *
 * A distributed limit would need shared storage (Upstash Redis or similar);
 * that was a deliberate trade to avoid adding a third-party service.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
/** Ceiling across all callers on one instance, as a crude flood guard. */
const MAX_GLOBAL_PER_WINDOW = 60;

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
