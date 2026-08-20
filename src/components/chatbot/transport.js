import { fallbackReplyText } from "../../../lib/chat/fallback.js";

/**
 * One async generator that always produces a reply.
 *
 * It prefers `/api/chat`, but the endpoint is genuinely absent in two ordinary
 * situations — `npm run dev` runs plain Vite with no serverless runtime, and a
 * fresh deploy may have no GEMINI_API_KEY — so a failure to reach it is not an
 * error state. When the request cannot start, the same knowledge engine the
 * server would have used runs here instead and is typed out identically. The
 * only thing the visitor loses is the model's phrasing.
 *
 * Yields: { type: "meta" | "delta" | "done" | "error", … }
 */

const ENDPOINT = "/api/chat";

/** Matches the server's simulated typing so both engines feel the same. */
const TYPE_CHUNK_CHARS = 3;
const TYPE_DELAY_MS = 12;

export async function* streamAssistantReply({
  message,
  history = [],
  signal,
  instant = false,
}) {
  let started = false;

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history }),
      signal,
    });

    if (response.status === 429) {
      const body = await response.json().catch(() => ({}));
      yield {
        type: "error",
        retryable: false,
        message:
          body.message ??
          "That's a lot of questions in a short time. Give it a minute and try again.",
      };
      return;
    }

    const contentType = response.headers.get("content-type") ?? "";

    if (!response.ok || !response.body || !contentType.includes("text/event-stream")) {
      throw new Error(`unusable response (${response.status})`);
    }

    for await (const event of readEventStream(response.body)) {
      started = true;
      yield event;
    }
    return;
  } catch {
    if (signal?.aborted) return;

    // Already mid-reply: the caller keeps what arrived and offers a retry.
    // Restarting with the fallback here would print a second, different answer.
    if (started) {
      yield { type: "error", retryable: true, message: INTERRUPTED };
      return;
    }
  }

  yield { type: "meta", mode: "offline" };
  yield* typeOut(fallbackReplyText(message), { signal, instant });
  yield { type: "done", mode: "offline" };
}

const INTERRUPTED =
  "Something went wrong while processing that. Please try again.";

/* ── Server-sent events ─────────────────────────────────────────────────── */

async function* readEventStream(body) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      let boundary = buffer.indexOf("\n\n");
      while (boundary !== -1) {
        const frame = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);

        const event = parseFrame(frame);
        if (event) yield event;

        boundary = buffer.indexOf("\n\n");
      }
    }
  } finally {
    reader.releaseLock();
  }
}

function parseFrame(frame) {
  let name = "message";
  const data = [];

  for (const line of frame.split("\n")) {
    if (line.startsWith("event:")) name = line.slice(6).trim();
    else if (line.startsWith("data:")) data.push(line.slice(5).trim());
  }

  if (!data.length) return null;

  let payload;
  try {
    payload = JSON.parse(data.join("\n"));
  } catch {
    return null;
  }

  if (name === "delta") return { type: "delta", text: payload.text ?? "" };
  if (name === "meta") return { type: "meta", mode: payload.mode };
  if (name === "done") return { type: "done", mode: payload.mode };
  if (name === "error") return { type: "error", retryable: true, message: INTERRUPTED };

  return null;
}

/* ── Local typing ───────────────────────────────────────────────────────── */

async function* typeOut(text, { signal, instant }) {
  if (instant) {
    yield { type: "delta", text };
    return;
  }

  for (let i = 0; i < text.length; i += TYPE_CHUNK_CHARS) {
    if (signal?.aborted) return;
    yield { type: "delta", text: text.slice(i, i + TYPE_CHUNK_CHARS) };
    await new Promise((resolve) => setTimeout(resolve, TYPE_DELAY_MS));
  }
}
