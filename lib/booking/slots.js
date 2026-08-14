/**
 * Slot generation.
 *
 * One function decides what is bookable, and both endpoints call it — the
 * availability list and the final check before writing to the calendar come
 * from the same code, so a slot can never be offered under one set of rules
 * and accepted under another.
 */

import {
  addDaysToKey,
  getZonedWeekday,
  parseDateKey,
  formatSlotLabel,
  toZonedDateKey,
  zonedTimeToUtc,
} from "./timezone.js";

/**
 * @typedef {{ start: Date, end: Date }} Interval
 * @typedef {{ start: string, end: string, label: string }} Slot
 */

/** Does [aStart, aEnd) overlap [bStart, bEnd)? */
function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

/**
 * Every slot the rules allow on a date, before availability is considered.
 * @param {string} dateKey "YYYY-MM-DD"
 * @param {ReturnType<import('./config.js').getBookingConfig>} config
 */
export function candidateSlots(dateKey, config) {
  const parsed = parseDateKey(dateKey);
  if (!parsed) return [];

  const dayStart = zonedTimeToUtc({ ...parsed, hour: 12 }, config.timeZone);
  const weekday = getZonedWeekday(dayStart, config.timeZone);
  if (!config.workingDays.includes(weekday)) return [];

  const slots = [];
  const lastStart = config.workEndMinutes - config.durationMinutes;

  for (
    let minutes = config.workStartMinutes;
    minutes <= lastStart;
    minutes += config.slotStepMinutes
  ) {
    const start = zonedTimeToUtc(
      {
        ...parsed,
        hour: Math.floor(minutes / 60),
        minute: minutes % 60,
      },
      config.timeZone,
    );

    slots.push({
      start,
      end: new Date(start.getTime() + config.durationMinutes * 60000),
    });
  }

  return slots;
}

/**
 * Filter candidates down to what a visitor may actually book.
 *
 * @param {object} input
 * @param {string} input.dateKey
 * @param {Interval[]} input.busy       Busy intervals from freebusy.query.
 * @param {ReturnType<import('./config.js').getBookingConfig>} input.config
 * @param {Date} [input.now]
 * @returns {Slot[]}
 */
export function availableSlots({ dateKey, busy = [], config, now = new Date() }) {
  const earliest = new Date(
    now.getTime() + config.minimumNoticeMinutes * 60000,
  );
  const latest = new Date(
    now.getTime() + config.windowDays * 24 * 60 * 60000,
  );

  const bufferMs = config.bufferMinutes * 60000;

  return candidateSlots(dateKey, config)
    .filter((slot) => slot.start >= earliest && slot.start <= latest)
    .filter(
      (slot) =>
        // The buffer is applied around existing events, so a meeting never
        // starts immediately after one ends.
        !busy.some((interval) =>
          overlaps(
            slot.start,
            slot.end,
            new Date(interval.start.getTime() - bufferMs),
            new Date(interval.end.getTime() + bufferMs),
          ),
        ),
    )
    .map((slot) => ({
      start: slot.start.toISOString(),
      end: slot.end.toISOString(),
      label: formatSlotLabel(slot.start, config.timeZone),
    }));
}

/**
 * Is this exact instant one of the bookable slots for its date? Used by the
 * create endpoint so a hand-crafted request cannot book 03:00 on a Sunday.
 *
 * @returns {{ valid: boolean, slot?: Slot, reason?: string }}
 */
export function validateSlot({ startIso, busy = [], config, now = new Date() }) {
  const start = new Date(startIso);
  if (Number.isNaN(start.getTime())) {
    return { valid: false, reason: "invalid start time" };
  }

  const dateKey = toZonedDateKey(start, config.timeZone);
  const slots = availableSlots({ dateKey, busy, config, now });
  const match = slots.find((slot) => slot.start === start.toISOString());

  if (!match) {
    return { valid: false, reason: "slot is not available" };
  }

  return { valid: true, slot: match };
}

/**
 * Date keys worth offering in the picker: working days inside the booking
 * window, starting today in the booking timezone.
 * @returns {string[]}
 */
export function bookableDateKeys(config, now = new Date()) {
  const first = toZonedDateKey(now, config.timeZone);
  const keys = [];

  for (let offset = 0; offset <= config.windowDays; offset += 1) {
    const key = addDaysToKey(first, offset);
    const parsed = parseDateKey(key);
    const noon = zonedTimeToUtc({ ...parsed, hour: 12 }, config.timeZone);
    if (config.workingDays.includes(getZonedWeekday(noon, config.timeZone))) {
      keys.push(key);
    }
  }

  return keys;
}
