import { timingSafeEqual } from "node:crypto";

/**
 * Constant-time secret comparison. A plain `===` leaks length and position
 * through timing, which is exactly the wrong property for an endpoint that
 * spends money when it succeeds.
 *
 * @param {string|undefined} provided
 * @param {string|undefined} expected
 */
export function secretMatches(provided, expected) {
  if (typeof provided !== "string" || typeof expected !== "string") return false;
  if (!provided || !expected) return false;

  const a = Buffer.from(provided, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;

  return timingSafeEqual(a, b);
}

/**
 * Vercel Cron sends `Authorization: Bearer $CRON_SECRET` when CRON_SECRET is
 * configured on the project. Nothing else is accepted — an unauthenticated
 * visitor must never be able to trigger a paid generation.
 * @param {import('http').IncomingMessage} request
 */
export function isAuthorisedCron(request) {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;

  const header = request.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  return secretMatches(token, expected);
}

/**
 * Admin trigger. Separate secret from the cron so revoking one does not
 * disturb the other.
 * @param {import('http').IncomingMessage} request
 */
export function isAuthorisedAdmin(request) {
  const expected = process.env.ADMIN_SECRET;
  if (!expected) return false;

  const header = request.headers.authorization ?? "";
  const bearer = header.startsWith("Bearer ") ? header.slice(7) : "";
  const custom = request.headers["x-admin-secret"];

  return (
    secretMatches(bearer, expected) ||
    secretMatches(typeof custom === "string" ? custom : "", expected)
  );
}
