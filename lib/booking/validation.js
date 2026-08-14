/**
 * Server-side validation. The browser validates too, for the visitor's sake,
 * but nothing here trusts it — every field is re-checked and trimmed before it
 * reaches a calendar event.
 */

const LIMITS = {
  name: [2, 80],
  email: [5, 254],
  company: [0, 120],
  message: [0, 1000],
};

/** Pragmatic, not RFC-exhaustive: one @, a dot in the domain, no spaces. */
const EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

const TAB = 9;
const NEWLINE = 10;
const DELETE = 127;
const FIRST_PRINTABLE = 32;

export class BookingValidationError extends Error {
  constructor(fields) {
    super("Booking details are invalid");
    this.name = "BookingValidationError";
    this.fields = fields;
  }
}

/**
 * Drop control characters by codepoint rather than by regex — a character
 * class of raw control bytes is invisible in a diff and easy to get wrong.
 * Tabs and newlines survive when the field is allowed to be multi-line.
 */
function stripControlCharacters(value, { keepBreaks }) {
  let output = "";

  for (const character of value) {
    const code = character.codePointAt(0);
    const isControl = code < FIRST_PRINTABLE || code === DELETE;
    const isAllowedBreak = keepBreaks && (code === NEWLINE || code === TAB);

    if (!isControl || isAllowedBreak) output += character;
  }

  return output;
}

/**
 * Clean a field. The output lands in a calendar event description, so newlines
 * survive in the message but nothing that could corrupt the payload does.
 */
function clean(value, { multiline = false } = {}) {
  if (typeof value !== "string") return "";

  const stripped = stripControlCharacters(value, { keepBreaks: multiline });

  return multiline
    ? stripped.replace(/\n{3,}/g, "\n\n").trim()
    : stripped.replace(/\s+/g, " ").trim();
}

/**
 * @param {unknown} body
 * @returns {{ name: string, email: string, company: string, message: string, start: string }}
 */
export function validateBookingRequest(body) {
  const fields = {};
  const input = body && typeof body === "object" ? body : {};

  const name = clean(input.name);
  const email = clean(input.email).toLowerCase();
  const company = clean(input.company);
  const message = clean(input.message, { multiline: true });
  const start = clean(input.start);

  if (name.length < LIMITS.name[0] || name.length > LIMITS.name[1]) {
    fields.name = `Please enter your name (${LIMITS.name[0]}–${LIMITS.name[1]} characters).`;
  }

  if (!EMAIL.test(email) || email.length > LIMITS.email[1]) {
    fields.email = "Please enter a valid email address.";
  }

  if (company.length > LIMITS.company[1]) {
    fields.company = `Company must be ${LIMITS.company[1]} characters or fewer.`;
  }

  if (message.length > LIMITS.message[1]) {
    fields.message = `Message must be ${LIMITS.message[1]} characters or fewer.`;
  }

  if (!start || Number.isNaN(new Date(start).getTime())) {
    fields.start = "Please choose a time.";
  }

  if (Object.keys(fields).length) throw new BookingValidationError(fields);

  return { name, email, company, message, start: new Date(start).toISOString() };
}

/**
 * Cheap bot checks that cost a real visitor nothing.
 *
 * `trap` is a hidden field only a script fills in. `elapsedMs` is how long the
 * form was on screen — a human cannot complete it in under a couple of
 * seconds, and a script usually posts instantly.
 */
export function looksAutomated({ trap, elapsedMs }) {
  if (typeof trap === "string" && trap.trim().length > 0) return "honeypot";

  const elapsed = Number(elapsedMs);
  if (Number.isFinite(elapsed) && elapsed >= 0 && elapsed < 2500) {
    return "submitted too quickly";
  }

  return null;
}
