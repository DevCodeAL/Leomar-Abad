import { getBookingConfig } from "../../lib/booking/config.js";
import { validateSlot } from "../../lib/booking/slots.js";
import { createBooking, getBusyIntervals } from "../../lib/booking/google.js";
import {
  BookingValidationError,
  looksAutomated,
  validateBookingRequest,
} from "../../lib/booking/validation.js";
import { clientKey, consume } from "../../lib/booking/rate-limit.js";
import { formatSlotLabel, formatZonedDate } from "../../lib/booking/timezone.js";

/**
 * Create a booking.
 *
 * The availability shown to the visitor is never trusted: the calendar is
 * queried again here, immediately before the event is written, so a slot taken
 * in the meantime is rejected rather than double-booked.
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
      message: "Too many attempts. Please try again in a few minutes.",
    });
  }

  const body =
    typeof request.body === "string" ? safeParse(request.body) : (request.body ?? {});

  // Bots are dropped with a success-shaped response so a script cannot tell
  // the honeypot exists, but nothing is written.
  const automated = looksAutomated({
    trap: body.trap,
    elapsedMs: body.elapsedMs,
  });
  if (automated) {
    console.warn(`[booking] rejected as automated: ${automated}`);
    return response.status(202).json({ status: "received" });
  }

  const config = getBookingConfig();
  let visitor;

  try {
    visitor = validateBookingRequest(body);
  } catch (error) {
    if (error instanceof BookingValidationError) {
      return response
        .status(400)
        .json({ error: "invalid", fields: error.fields });
    }
    throw error;
  }

  const start = new Date(visitor.start);
  const now = new Date();

  try {
    // Re-check against the live calendar, not against what the browser saw.
    const busy = await getBusyIntervals({
      timeMin: new Date(start.getTime() - 24 * 3600_000),
      timeMax: new Date(start.getTime() + 24 * 3600_000),
      calendarId: config.calendarId,
    });

    const check = validateSlot({ startIso: visitor.start, busy, config, now });

    if (!check.valid) {
      return response.status(409).json({
        error: "slot_taken",
        message:
          "Sorry, that time was just booked. Please choose another available time.",
      });
    }

    const end = new Date(start.getTime() + config.durationMinutes * 60000);

    const event = await createBooking({ start, end, visitor, config });

    // No Meet link means the conference was not created, so the booking is not
    // what was promised. Reported as a failure rather than a partial success.
    if (!event.meetUrl) {
      console.error("[booking] event created without a Meet link:", event.id);
      return response.status(502).json({
        error: "meeting_failed",
        message:
          "The meeting link could not be created. Please try again, or email me directly.",
      });
    }

    return response.status(201).json({
      status: "confirmed",
      duplicate: event.duplicate,
      booking: {
        start: start.toISOString(),
        end: end.toISOString(),
        timeZone: config.timeZone,
        durationMinutes: config.durationMinutes,
        dateLabel: formatZonedDate(start, config.timeZone),
        startLabel: formatSlotLabel(start, config.timeZone),
        endLabel: formatSlotLabel(end, config.timeZone),
        meetUrl: event.meetUrl,
        calendarLink: event.htmlLink,
        name: visitor.name,
        email: visitor.email,
      },
    });
  } catch (error) {
    console.error("[booking] create failed:", error.message);

    if (error.code === "not_configured") {
      return response.status(503).json({
        error: "unavailable",
        message:
          "Booking isn't available right now. Please email me directly and I'll set something up.",
      });
    }

    return response.status(502).json({
      error: "booking_failed",
      message:
        "Something went wrong creating the meeting. Nothing was booked — please try again.",
    });
  }
}

function safeParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}
