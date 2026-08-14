/**
 * Offline checks for the booking logic: timezone conversion, slot generation,
 * the booking rules, validation and the deterministic event id. No Google
 * credentials or network needed.
 *
 *   npm run check:booking
 */

import assert from "node:assert/strict";
import { getBookingConfig } from "../lib/booking/config.js";
import {
  getOffsetMinutes,
  getZonedWeekday,
  toZonedDateKey,
  zonedTimeToUtc,
} from "../lib/booking/timezone.js";
import {
  availableSlots,
  bookableDateKeys,
  candidateSlots,
  validateSlot,
} from "../lib/booking/slots.js";
import {
  looksAutomated,
  validateBookingRequest,
  BookingValidationError,
} from "../lib/booking/validation.js";
import { deterministicEventId } from "../lib/booking/google.js";
import { consume, reset } from "../lib/booking/rate-limit.js";

let passed = 0;
const failures = [];

function check(name, fn) {
  try {
    fn();
    passed += 1;
  } catch (error) {
    failures.push(`${name}\n    ${error.message.split("\n")[0]}`);
  }
}

const config = getBookingConfig({});
const MANILA = "Asia/Manila";

/* ── Timezone ─────────────────────────────────────────────────────────── */

check("Manila is UTC+8", () => {
  assert.equal(
    getOffsetMinutes(new Date("2026-08-20T00:00:00Z"), MANILA),
    480,
  );
});

check("9:00 Manila is 01:00 UTC", () => {
  const utc = zonedTimeToUtc(
    { year: 2026, month: 8, day: 20, hour: 9, minute: 0 },
    MANILA,
  );
  assert.equal(utc.toISOString(), "2026-08-20T01:00:00.000Z");
});

check("round trip through a zone is stable", () => {
  const utc = zonedTimeToUtc(
    { year: 2026, month: 8, day: 20, hour: 14, minute: 30 },
    MANILA,
  );
  assert.equal(toZonedDateKey(utc, MANILA), "2026-08-20");
});

// Manila has no DST, so these guard the general implementation against the
// day the timezone config is changed to somewhere that does.
check("DST zone: New York is UTC-5 in winter", () => {
  const utc = zonedTimeToUtc(
    { year: 2026, month: 1, day: 15, hour: 9 },
    "America/New_York",
  );
  assert.equal(utc.toISOString(), "2026-01-15T14:00:00.000Z");
});

check("DST zone: New York is UTC-4 in summer", () => {
  const utc = zonedTimeToUtc(
    { year: 2026, month: 7, day: 15, hour: 9 },
    "America/New_York",
  );
  assert.equal(utc.toISOString(), "2026-07-15T13:00:00.000Z");
});

check("DST zone: the day after spring-forward resolves correctly", () => {
  // US DST began 2026-03-08. 09:00 the next day must be UTC-4, not UTC-5.
  const utc = zonedTimeToUtc(
    { year: 2026, month: 3, day: 9, hour: 9 },
    "America/New_York",
  );
  assert.equal(utc.toISOString(), "2026-03-09T13:00:00.000Z");
});

check("weekday is computed in the zone, not in UTC", () => {
  // 2026-08-17 09:00 Manila = 2026-08-17T01:00Z, a Monday in both.
  const monday = zonedTimeToUtc(
    { year: 2026, month: 8, day: 17, hour: 9 },
    MANILA,
  );
  assert.equal(getZonedWeekday(monday, MANILA), 1);

  // 08:00 Manila Monday is Sunday 00:00 UTC — the zone must win.
  const earlyMonday = zonedTimeToUtc(
    { year: 2026, month: 8, day: 17, hour: 8 },
    MANILA,
  );
  assert.equal(earlyMonday.toISOString(), "2026-08-17T00:00:00.000Z");
  assert.equal(getZonedWeekday(earlyMonday, MANILA), 1);
});

/* ── Slot generation ──────────────────────────────────────────────────── */

check("a weekday yields 9:00–16:30 in 30-minute steps", () => {
  const slots = candidateSlots("2026-08-20", config); // Thursday
  assert.equal(slots.length, 16);
  assert.equal(slots[0].start.toISOString(), "2026-08-20T01:00:00.000Z");
  assert.equal(
    slots.at(-1).start.toISOString(),
    "2026-08-20T08:30:00.000Z", // 16:30 Manila
  );
});

check("the last slot ends by the end of the working day", () => {
  const slots = candidateSlots("2026-08-20", config);
  const end = slots.at(-1).end;
  assert.equal(end.toISOString(), "2026-08-20T09:00:00.000Z"); // 17:00 Manila
});

check("weekends produce nothing", () => {
  assert.equal(candidateSlots("2026-08-22", config).length, 0); // Saturday
  assert.equal(candidateSlots("2026-08-23", config).length, 0); // Sunday
});

check("a malformed date produces nothing rather than throwing", () => {
  assert.equal(candidateSlots("not-a-date", config).length, 0);
  assert.equal(candidateSlots("2026-13-40", config).length, 0);
});

/* ── Booking rules ────────────────────────────────────────────────────── */

const now = new Date("2026-08-17T00:00:00.000Z"); // Mon 08:00 Manila

check("minimum notice hides imminent slots", () => {
  // 2h notice from 08:00 Manila -> the 09:00 and 09:30 slots are gone.
  const slots = availableSlots({ dateKey: "2026-08-17", config, now });
  assert.ok(!slots.some((slot) => slot.label === "9:00 AM"));
  assert.ok(!slots.some((slot) => slot.label === "9:30 AM"));
  assert.equal(slots[0].label, "10:00 AM");
});

check("slots beyond the booking window are excluded", () => {
  const slots = availableSlots({ dateKey: "2026-10-01", config, now });
  assert.equal(slots.length, 0);
});

check("a busy interval removes the overlapping slot", () => {
  const busy = [
    {
      start: new Date("2026-08-20T02:00:00.000Z"), // 10:00 Manila
      end: new Date("2026-08-20T02:30:00.000Z"),
    },
  ];
  const slots = availableSlots({ dateKey: "2026-08-20", busy, config, now });
  assert.ok(!slots.some((slot) => slot.label === "10:00 AM"));
});

check("the buffer also removes the slots either side", () => {
  const busy = [
    {
      start: new Date("2026-08-20T02:00:00.000Z"), // 10:00–10:30 Manila
      end: new Date("2026-08-20T02:30:00.000Z"),
    },
  ];
  const slots = availableSlots({ dateKey: "2026-08-20", busy, config, now });
  const labels = slots.map((slot) => slot.label);
  // 15-minute buffer bleeds into the 09:30 and 10:30 slots.
  assert.ok(!labels.includes("9:30 AM"), "9:30 should be blocked by buffer");
  assert.ok(!labels.includes("10:30 AM"), "10:30 should be blocked by buffer");
  assert.ok(labels.includes("11:00 AM"), "11:00 should still be free");
});

check("an all-day busy block clears the day", () => {
  const busy = [
    {
      start: new Date("2026-08-20T00:00:00.000Z"),
      end: new Date("2026-08-20T23:59:00.000Z"),
    },
  ];
  assert.equal(
    availableSlots({ dateKey: "2026-08-20", busy, config, now }).length,
    0,
  );
});

check("bookable dates are working days inside the window", () => {
  const keys = bookableDateKeys(config, now);
  assert.ok(keys.includes("2026-08-17"));
  assert.ok(!keys.includes("2026-08-22"), "Saturday must not be offered");
  assert.ok(!keys.includes("2026-08-23"), "Sunday must not be offered");
  assert.ok(keys.length > 15 && keys.length < 25, `got ${keys.length} dates`);
});

/* ── Server-side slot re-validation ───────────────────────────────────── */

check("a legitimate slot passes re-validation", () => {
  const result = validateSlot({
    startIso: "2026-08-20T02:00:00.000Z",
    config,
    now,
  });
  assert.equal(result.valid, true);
});

check("a slot outside working hours is rejected", () => {
  // 03:00 Manila on a Thursday — never offered.
  const result = validateSlot({
    startIso: "2026-08-19T19:00:00.000Z",
    config,
    now,
  });
  assert.equal(result.valid, false);
});

check("a slot on a Sunday is rejected", () => {
  const result = validateSlot({
    startIso: "2026-08-23T02:00:00.000Z",
    config,
    now,
  });
  assert.equal(result.valid, false);
});

check("a slot that is not on the step grid is rejected", () => {
  // 10:07 Manila — inside hours, but not a real slot boundary.
  const result = validateSlot({
    startIso: "2026-08-20T02:07:00.000Z",
    config,
    now,
  });
  assert.equal(result.valid, false);
});

check("a slot that just became busy is rejected", () => {
  const busy = [
    {
      start: new Date("2026-08-20T02:00:00.000Z"),
      end: new Date("2026-08-20T02:30:00.000Z"),
    },
  ];
  const result = validateSlot({
    startIso: "2026-08-20T02:00:00.000Z",
    busy,
    config,
    now,
  });
  assert.equal(result.valid, false);
  assert.match(result.reason, /not available/);
});

/* ── Validation ───────────────────────────────────────────────────────── */

const goodBody = {
  name: "Jane Dela Cruz",
  email: "jane@example.com",
  start: "2026-08-20T02:00:00.000Z",
};

check("valid details are accepted and normalised", () => {
  const result = validateBookingRequest({
    ...goodBody,
    email: "  JANE@Example.com ",
    name: "  Jane   Dela Cruz  ",
  });
  assert.equal(result.email, "jane@example.com");
  assert.equal(result.name, "Jane Dela Cruz");
});

check("an empty name is rejected", () => {
  assert.throws(
    () => validateBookingRequest({ ...goodBody, name: "" }),
    BookingValidationError,
  );
});

check("invalid emails are rejected", () => {
  ["nope", "a@b", "a b@c.com", "@example.com", "a@@b.com"].forEach((email) => {
    assert.throws(
      () => validateBookingRequest({ ...goodBody, email }),
      BookingValidationError,
      `should reject ${email}`,
    );
  });
});

check("a missing time is rejected", () => {
  assert.throws(
    () => validateBookingRequest({ ...goodBody, start: "" }),
    BookingValidationError,
  );
});

check("an over-long message is rejected", () => {
  assert.throws(
    () => validateBookingRequest({ ...goodBody, message: "x".repeat(1001) }),
    BookingValidationError,
  );
});

check("special characters survive intact", () => {
  const result = validateBookingRequest({
    ...goodBody,
    name: "José O'Brien-Añez",
    message: "Budget? ~₱50,000 & <urgent>",
  });
  assert.equal(result.name, "José O'Brien-Añez");
  assert.match(result.message, /₱50,000/);
});

check("control characters are stripped", () => {
  const result = validateBookingRequest({
    ...goodBody,
    name: "Ja ne Doe",
  });
  assert.equal(result.name, "Jane Doe");
});

check("bot signals are detected", () => {
  assert.equal(looksAutomated({ trap: "x", elapsedMs: 9999 }), "honeypot");
  assert.match(looksAutomated({ trap: "", elapsedMs: 10 }), /quickly/);
  assert.equal(looksAutomated({ trap: "", elapsedMs: 9000 }), null);
  assert.equal(looksAutomated({}), null, "missing timing must not block");
});

/* ── Idempotency & rate limiting ──────────────────────────────────────── */

check("the same slot and email always yield the same event id", () => {
  const a = deterministicEventId("2026-08-20T02:00:00.000Z", "jane@example.com");
  const b = deterministicEventId("2026-08-20T02:00:00.000Z", "JANE@example.com");
  assert.equal(a, b);
});

check("different slots yield different ids", () => {
  const a = deterministicEventId("2026-08-20T02:00:00.000Z", "jane@example.com");
  const b = deterministicEventId("2026-08-20T02:30:00.000Z", "jane@example.com");
  assert.notEqual(a, b);
});

check("event ids are valid Google ids (base32hex, long enough)", () => {
  const id = deterministicEventId("2026-08-20T02:00:00.000Z", "jane@example.com");
  assert.ok(id.length >= 5 && id.length <= 1024, `length ${id.length}`);
  assert.match(id, /^[0-9a-v]+$/);
});

check("repeated attempts from one caller are limited", () => {
  reset();
  const results = Array.from({ length: 7 }, () => consume("1.2.3.4").allowed);
  assert.deepEqual(results.slice(0, 5), [true, true, true, true, true]);
  assert.deepEqual(results.slice(5), [false, false]);
  reset();
});

check("a different caller is unaffected", () => {
  reset();
  Array.from({ length: 5 }, () => consume("1.2.3.4"));
  assert.equal(consume("5.6.7.8").allowed, true);
  reset();
});

/* ── Report ───────────────────────────────────────────────────────────── */

if (failures.length) {
  console.error(`\n${failures.length} check(s) FAILED:\n`);
  failures.forEach((failure) => console.error(`  ✗ ${failure}`));
  console.error(`\n${passed} passed, ${failures.length} failed\n`);
  process.exit(1);
}

console.log(`\n✓ all ${passed} booking logic checks passed\n`);
