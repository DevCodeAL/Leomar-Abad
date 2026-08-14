/**
 * Booking rules, read from the environment with sensible defaults so nothing
 * is hard-coded in the flow. The same object is used by the availability
 * endpoint and the create endpoint, so the rules cannot drift between the
 * slots that are offered and the slots that are accepted.
 */

/** @param {string|undefined} value @param {number} fallback */
function number(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}

/** Minutes since midnight from "HH:MM". */
export function parseTimeOfDay(value, fallback) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(String(value ?? ""));
  if (!match) return fallback;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return fallback;
  return hours * 60 + minutes;
}

export function getBookingConfig(env = process.env) {
  const durationMinutes = number(env.BOOKING_DURATION_MINUTES, 30);

  return {
    timeZone: env.BOOKING_TIMEZONE || "Asia/Manila",
    durationMinutes,
    /** Gap enforced either side of an existing event. */
    bufferMinutes: number(env.BOOKING_BUFFER_MINUTES, 15),
    /** How far ahead bookings are accepted. */
    windowDays: number(env.BOOKING_WINDOW_DAYS, 30),
    /** Earliest a visitor may book from now. */
    minimumNoticeMinutes: number(env.BOOKING_MIN_NOTICE_MINUTES, 120),
    /** Distance between slot start times. Defaults to the meeting length. */
    slotStepMinutes: number(env.BOOKING_SLOT_STEP_MINUTES, durationMinutes),
    /** 1 = Monday … 7 = Sunday, matching ISO weekday numbering. */
    workingDays: parseWorkingDays(env.BOOKING_WORKING_DAYS, [1, 2, 3, 4, 5]),
    workStartMinutes: parseTimeOfDay(env.BOOKING_WORK_START, 9 * 60),
    workEndMinutes: parseTimeOfDay(env.BOOKING_WORK_END, 17 * 60),
    calendarId: env.GOOGLE_CALENDAR_ID || "primary",
    meetingProvider: env.MEETING_PROVIDER || "google_meet",
    ownerEmail: env.OWNER_EMAIL || "",
    ownerName: env.OWNER_NAME || "Leomar Abad",
    meetingTitle: env.BOOKING_TITLE || "Intro call",
  };
}

function parseWorkingDays(value, fallback) {
  if (!value) return fallback;

  const days = String(value)
    .split(",")
    .map((part) => Number(part.trim()))
    .filter((day) => Number.isInteger(day) && day >= 1 && day <= 7);

  return days.length ? [...new Set(days)].sort() : fallback;
}

/** Public-safe subset, sent to the browser so the UI can label things. */
export function publicBookingConfig(config) {
  return {
    timeZone: config.timeZone,
    durationMinutes: config.durationMinutes,
    windowDays: config.windowDays,
    workingDays: config.workingDays,
    meetingProvider: config.meetingProvider,
    ownerName: config.ownerName,
  };
}
