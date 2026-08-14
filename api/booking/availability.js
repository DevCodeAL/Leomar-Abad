import { getBookingConfig, publicBookingConfig } from "../../lib/booking/config.js";
import { availableSlots, bookableDateKeys } from "../../lib/booking/slots.js";
import { getBusyIntervals } from "../../lib/booking/google.js";
import { parseDateKey, zonedTimeToUtc } from "../../lib/booking/timezone.js";

/**
 * Availability for one date, plus the dates worth offering in the picker.
 *
 * Public by design — it exposes only which slots are open, never anything
 * about the events that make the others closed.
 *
 *   GET /api/booking/availability            -> config + bookable dates
 *   GET /api/booking/availability?date=…      -> the above + slots for that date
 */
export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const config = getBookingConfig();
  const now = new Date();

  const dates = bookableDateKeys(config, now);
  const base = {
    config: publicBookingConfig(config),
    dates,
  };

  const requested = Array.isArray(request.query?.date)
    ? request.query.date[0]
    : request.query?.date;

  if (!requested) {
    // Cached briefly: the date list only changes at a day boundary.
    response.setHeader("Cache-Control", "public, max-age=300");
    return response.status(200).json({ ...base, slots: [] });
  }

  const parsed = parseDateKey(requested);
  if (!parsed) {
    return response.status(400).json({ error: "Invalid date", ...base });
  }

  if (!dates.includes(requested)) {
    return response.status(200).json({ ...base, date: requested, slots: [] });
  }

  try {
    // A day either side, so an event that straddles midnight in the booking
    // timezone still counts against the first and last slots.
    const timeMin = zonedTimeToUtc({ ...parsed, hour: 0 }, config.timeZone);
    const timeMax = zonedTimeToUtc(
      { ...parsed, day: parsed.day + 1, hour: 0 },
      config.timeZone,
    );

    const busy = await getBusyIntervals({
      timeMin: new Date(timeMin.getTime() - 12 * 3600_000),
      timeMax: new Date(timeMax.getTime() + 12 * 3600_000),
      calendarId: config.calendarId,
    });

    const slots = availableSlots({
      dateKey: requested,
      busy,
      config,
      now,
    });

    response.setHeader("Cache-Control", "no-store");
    return response.status(200).json({ ...base, date: requested, slots });
  } catch (error) {
    // The visitor gets a generic message; the detail stays in the logs.
    console.error("[booking] availability failed:", error.message);

    return response.status(503).json({
      ...base,
      date: requested,
      slots: [],
      error: "unavailable",
      message:
        "We're unable to check availability right now. Please try again shortly.",
    });
  }
}
