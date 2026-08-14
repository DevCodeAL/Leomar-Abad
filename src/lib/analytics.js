/**
 * Analytics dispatch that does nothing unless the site actually has an
 * analytics tool.
 *
 * The portfolio ships none today, so rather than adding a dependency and a
 * tracking script nobody asked for, this forwards events to Plausible, GA or
 * GTM only if one of them is already present. Visitor email, name and message
 * are never passed — only the step reached.
 */

const ALLOWED_KEYS = new Set(["step", "provider", "reason", "durationMinutes"]);

/** @param {string} event @param {Record<string, string|number>} [properties] */
export function track(event, properties = {}) {
  if (typeof window === "undefined") return;

  const safe = Object.fromEntries(
    Object.entries(properties).filter(([key]) => ALLOWED_KEYS.has(key)),
  );

  try {
    if (typeof window.plausible === "function") {
      window.plausible(event, { props: safe });
      return;
    }

    if (typeof window.gtag === "function") {
      window.gtag("event", event, safe);
      return;
    }

    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event, ...safe });
    }
  } catch {
    // Analytics must never break a booking.
  }
}

export const BOOKING_EVENTS = {
  opened: "booking_calendar_opened",
  dateSelected: "booking_date_selected",
  timeSelected: "booking_time_selected",
  started: "booking_started",
  completed: "booking_completed",
  failed: "booking_failed",
};
