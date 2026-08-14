/**
 * Timezone maths with no dependency, built on Intl.
 *
 * Asia/Manila has no DST, so naive arithmetic would happen to work — but the
 * zone is configurable, so everything here resolves the real offset for the
 * specific instant instead of assuming a fixed one. `check-booking-logic.mjs`
 * exercises this across a US DST boundary for exactly that reason.
 */

const PARTS = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
};

const formatterCache = new Map();

function formatter(timeZone) {
  let cached = formatterCache.get(timeZone);
  if (!cached) {
    cached = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      ...PARTS,
    });
    formatterCache.set(timeZone, cached);
  }
  return cached;
}

/** Wall-clock fields for an instant, as seen in `timeZone`. */
export function getZonedParts(date, timeZone) {
  const parts = formatter(timeZone)
    .formatToParts(date)
    .reduce((accumulator, part) => {
      if (part.type !== "literal") accumulator[part.type] = part.value;
      return accumulator;
    }, {});

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    // Some environments render midnight as hour 24.
    hour: Number(parts.hour) % 24,
    minute: Number(parts.minute),
    second: Number(parts.second),
  };
}

/** Offset in minutes east of UTC for this instant in this zone. */
export function getOffsetMinutes(date, timeZone) {
  const parts = getZonedParts(date, timeZone);
  const asUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );
  return (asUtc - date.getTime()) / 60000;
}

/**
 * Wall-clock time in a zone → the UTC instant.
 *
 * Resolved twice: the first pass uses the offset at the guessed instant, which
 * can be the wrong side of a DST transition, and the second pass corrects it.
 *
 * @returns {Date}
 */
export function zonedTimeToUtc(
  { year, month, day, hour = 0, minute = 0 },
  timeZone,
) {
  const guess = Date.UTC(year, month - 1, day, hour, minute, 0);

  const firstOffset = getOffsetMinutes(new Date(guess), timeZone);
  let instant = guess - firstOffset * 60000;

  const secondOffset = getOffsetMinutes(new Date(instant), timeZone);
  if (secondOffset !== firstOffset) {
    instant = guess - secondOffset * 60000;
  }

  return new Date(instant);
}

/** ISO weekday in the given zone: 1 = Monday … 7 = Sunday. */
export function getZonedWeekday(date, timeZone) {
  const { year, month, day } = getZonedParts(date, timeZone);
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return weekday === 0 ? 7 : weekday;
}

/** "YYYY-MM-DD" as seen in the zone. */
export function toZonedDateKey(date, timeZone) {
  const { year, month, day } = getZonedParts(date, timeZone);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** @param {string} key "YYYY-MM-DD" */
export function parseDateKey(key) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(key ?? ""));
  if (!match) return null;

  const [, year, month, day] = match.map(Number);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  return { year, month, day };
}

/** Human label for a slot, rendered in the booking timezone. */
export function formatSlotLabel(date, timeZone) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

/** e.g. "Thursday, 20 August 2026" in the booking timezone. */
export function formatZonedDate(date, timeZone) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/** Add days to a date key without stepping through UTC arithmetic bugs. */
export function addDaysToKey(key, days) {
  const parsed = parseDateKey(key);
  if (!parsed) return null;

  const date = new Date(
    Date.UTC(parsed.year, parsed.month - 1, parsed.day + days),
  );

  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}
