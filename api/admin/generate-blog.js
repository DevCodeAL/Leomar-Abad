import { isAuthorisedAdmin } from "../../lib/http/auth.js";
import { runGeneration } from "../../lib/blog/run-generation.js";
import { TOPICS } from "../../lib/blog/topics.js";

/**
 * Manual trigger, for testing the pipeline without waiting for the schedule.
 *
 * Same code path as the cron, same monthly cap. `force` skips only the pacing
 * windows, and `dryRun` generates and validates without committing anything —
 * so the expensive path can be exercised without publishing.
 *
 * Body (all optional):
 *   { "force": true, "dryRun": true, "topicId": "ai-model-release" }
 */
export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  if (!isAuthorisedAdmin(request)) {
    return response.status(401).json({ error: "Unauthorized" });
  }

  const body =
    typeof request.body === "string"
      ? safeParse(request.body)
      : (request.body ?? {});

  const topicId = typeof body.topicId === "string" ? body.topicId : undefined;

  if (topicId && !TOPICS.some((topic) => topic.id === topicId)) {
    return response.status(400).json({
      error: `Unknown topicId "${topicId}"`,
      availableTopicIds: TOPICS.map((topic) => topic.id),
    });
  }

  const startedAt = new Date();

  try {
    const result = await runGeneration({
      force: body.force === true,
      dryRun: body.dryRun === true,
      topicId,
    });

    return response.status(result.status === "failed" ? 502 : 200).json({
      ok: result.status !== "failed",
      requestedAt: startedAt.toISOString(),
      ...result,
    });
  } catch (error) {
    return response.status(500).json({
      ok: false,
      status: "error",
      requestedAt: startedAt.toISOString(),
      error: error.message,
    });
  }
}

function safeParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}
