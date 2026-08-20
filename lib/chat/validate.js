/**
 * Request validation for the chat endpoint.
 *
 * The browser already limits what can be typed; this exists because the
 * endpoint is public and nothing that reaches a paid model should be trusted
 * to have come from the UI. Isomorphic — the composer uses the same limits so
 * the two can never disagree about what is sendable.
 */

export const LIMITS = {
  /** Per message. Long enough for a real question, short enough to bound cost. */
  messageChars: 800,
  /** Turns of history replayed to the model, newest kept. */
  historyTurns: 12,
  /** Hard ceiling on the whole payload once history is counted. */
  totalChars: 8000,
};

export class ChatValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ChatValidationError";
  }
}

/**
 * True for codepoints that must never reach the model.
 *
 * Written as explicit ranges rather than a character class because the two
 * groups are here for different reasons and the second one is easy to get
 * wrong: invisible codepoints are the standard way of smuggling instructions
 * past a prompt-injection guard that a human reviewer would have caught by eye.
 */
function isStrippable(code) {
  if (code === 9 || code === 10 || code === 13) return false; // tab, LF, CR

  return (
    code < 0x20 || // C0 controls
    (code >= 0x7f && code <= 0x9f) || // DEL + C1 controls
    (code >= 0x200b && code <= 0x200f) || // zero-width, LRM/RLM
    code === 0x2028 || // line separator
    code === 0x2029 || // paragraph separator
    (code >= 0x202a && code <= 0x202e) || // bidi embedding/override
    (code >= 0x2060 && code <= 0x2064) || // word joiner, invisible operators
    (code >= 0xfff9 && code <= 0xfffb) || // interlinear annotation
    code === 0xfeff // BOM / zero-width no-break space
  );
}

/**
 * Strip control and invisible characters, collapse runaway whitespace, and
 * clamp length.
 */
export function sanitiseText(value, maxChars = LIMITS.messageChars) {
  if (typeof value !== "string") return "";

  let cleaned = "";
  for (const char of value) {
    if (!isStrippable(char.codePointAt(0))) cleaned += char;
  }

  return cleaned
    .replace(/[ \t]{4,}/g, "   ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, maxChars);
}

/**
 * Validate and normalise an incoming `POST /api/chat` body.
 *
 * @param {unknown} body
 * @returns {{ message: string, history: Array<{ role: "user"|"assistant", content: string }> }}
 * @throws {ChatValidationError}
 */
export function validateChatRequest(body) {
  const payload = body && typeof body === "object" ? body : {};

  const message = sanitiseText(payload.message);
  if (!message) throw new ChatValidationError("A message is required.");

  const rawHistory = Array.isArray(payload.history) ? payload.history : [];

  const history = rawHistory
    .filter(
      (turn) =>
        turn &&
        typeof turn === "object" &&
        (turn.role === "user" || turn.role === "assistant") &&
        typeof turn.content === "string",
    )
    .slice(-LIMITS.historyTurns)
    .map((turn) => ({
      role: turn.role,
      content: sanitiseText(turn.content, LIMITS.messageChars * 2),
    }))
    .filter((turn) => turn.content);

  const total =
    message.length +
    history.reduce((count, turn) => count + turn.content.length, 0);

  if (total <= LIMITS.totalChars) return { message, history };

  // Drop the oldest turns until it fits rather than rejecting outright — a
  // long conversation is a good sign, and losing its head is invisible.
  let running = message.length;
  const trimmed = [];

  for (let i = history.length - 1; i >= 0; i -= 1) {
    running += history[i].content.length;
    if (running > LIMITS.totalChars) break;
    trimmed.unshift(history[i]);
  }

  return { message, history: trimmed };
}
