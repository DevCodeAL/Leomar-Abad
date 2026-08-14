import { isAuthorisedCron } from "../../lib/http/auth.js";
import { runGeneration } from "../../lib/blog/run-generation.js";

/**
 * Scheduled publisher. Runs daily (see vercel.json) and usually does nothing:
 * it publishes only when the month has an open, unfilled window. That is what
 * spreads four posts across the month and makes a failed run self-healing —
 * tomorrow's run sees the same open window and tries again.
 */
export default async function handler(request, response) {
  if (request.method !== "GET" && request.method !== "POST") {
    response.setHeader("Allow", "GET, POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  if (!isAuthorisedCron(request)) {
    // Deliberately terse: no hint about whether CRON_SECRET is configured.
    return response.status(401).json({ error: "Unauthorized" });
  }

  try {
    const result = await runGeneration();

    // A failed generation is a 200 for the scheduler's purposes — the run
    // completed and recorded the failure. The body carries the detail.
    return response.status(200).json({ ok: result.status !== "failed", ...result });
  } catch (error) {
    return response.status(500).json({
      ok: false,
      status: "error",
      error: error.message,
    });
  }
}
