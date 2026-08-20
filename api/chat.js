import { GeminiError, isConfigured, streamChat } from "../lib/ai/gemini.js";
import { buildSystemPrompt } from "../lib/chat/system-prompt.js";
import { fallbackReplyText } from "../lib/chat/fallback.js";
import { clientKey, consume } from "../lib/chat/rate-limit.js";
import {
  ChatValidationError,
  validateChatRequest,
} from "../lib/chat/validate.js";

/**
 * The portfolio assistant.
 *
 *   POST /api/chat  { message, history[] }  ->  text/event-stream
 *
 * Always streams, whichever engine answers. When there is no API key, or the
 * model fails before producing a single token, the knowledge-based fallback
 * answers instead and is streamed out the same way — so the browser has one
 * code path and a visitor never sees a dead chat. `meta.mode` says which
 * engine replied, which is also what the dev-tools panel reads.
 *
 * The API key stays here. Nothing about the model, the prompt or the failure
 * reason is ever sent to the client.
 */
export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const limit = consume(clientKey(request));
  if (!limit.allowed) {
    response.setHeader("Retry-After", String(limit.retryAfterSeconds));
    return response.status(429).json({
      error: "rate_limited",
      message:
        "That's a lot of questions in a short time. Give it a minute and try again.",
    });
  }

  let payload;

  try {
    const body =
      typeof request.body === "string"
        ? safeParse(request.body)
        : (request.body ?? {});
    payload = validateChatRequest(body);
  } catch (error) {
    if (error instanceof ChatValidationError) {
      return response.status(400).json({ error: "invalid", message: error.message });
    }
    throw error;
  }

  const stream = openStream(response);

  if (!isConfigured()) {
    // Not an error state — the portfolio is expected to run without a key.
    stream.meta("fallback");
    await stream.type(fallbackReplyText(payload.message));
    return stream.done("fallback");
  }

  let delivered = 0;

  try {
    const deltas = streamChat(payload.history, payload.message, {
      systemInstruction: buildSystemPrompt(),
    });

    for await (const delta of deltas) {
      if (delivered === 0) stream.meta("model");
      delivered += delta.length;
      stream.delta(delta);
    }

    // An empty completion usually means the reply was filtered. Treat it as a
    // miss and let the fallback answer rather than showing an empty bubble.
    if (delivered === 0) {
      stream.meta("fallback");
      await stream.type(fallbackReplyText(payload.message));
      return stream.done("fallback");
    }

    return stream.done("model");
  } catch (error) {
    const reason = error instanceof GeminiError ? error.message : String(error);
    console.error("[chat] model call failed:", reason);

    // Nothing sent yet — the visitor can still get a real answer.
    if (delivered === 0) {
      stream.meta("fallback");
      await stream.type(fallbackReplyText(payload.message));
      return stream.done("fallback");
    }

    // Mid-reply. Keep what arrived and let the client offer a retry.
    return stream.fail();
  }
}

/* ── Server-sent events ─────────────────────────────────────────────────── */

/** Roughly a comfortable reading cadence for the fallback's simulated typing. */
const TYPE_CHUNK_CHARS = 3;
const TYPE_DELAY_MS = 12;

function openStream(response) {
  response.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    /* Belt and braces for any proxy that would otherwise buffer the body and
       deliver the whole reply in one go, which defeats the point. */
    "X-Accel-Buffering": "no",
  });

  const send = (event, data) => {
    response.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  return {
    meta: (mode) => send("meta", { mode }),
    delta: (text) => send("delta", { text }),

    /** Streams a pre-written answer so the fallback types like the model does. */
    async type(text) {
      for (let i = 0; i < text.length; i += TYPE_CHUNK_CHARS) {
        send("delta", { text: text.slice(i, i + TYPE_CHUNK_CHARS) });
        await new Promise((resolve) => setTimeout(resolve, TYPE_DELAY_MS));
      }
    },

    done(mode) {
      send("done", { mode });
      response.end();
    },

    /** Generic by design — the visitor never sees why the model failed. */
    fail() {
      send("error", { message: "interrupted" });
      response.end();
    },
  };
}

function safeParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}
