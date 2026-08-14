/**
 * Google Calendar access.
 *
 * Plain REST over fetch rather than the googleapis SDK: two endpoints are
 * needed (freebusy.query and events.insert) and the SDK is a large dependency
 * for a serverless function that only makes those calls.
 *
 * A refresh token is used rather than a service account because Meet links
 * cannot be created on a personal Google calendar by a service account without
 * domain-wide delegation, which consumer accounts do not have.
 */

import { createHash } from "node:crypto";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const CALENDAR_API = "https://www.googleapis.com/calendar/v3";

export class GoogleCalendarError extends Error {
  constructor(message, { status, code } = {}) {
    super(message);
    this.name = "GoogleCalendarError";
    this.status = status;
    this.code = code;
  }
}

/** Access tokens last an hour; reuse within a warm instance. */
let cachedToken = { value: null, expiresAt: 0 };

export async function getAccessToken(env = process.env) {
  const clientId = env.GOOGLE_CLIENT_ID;
  const clientSecret = env.GOOGLE_CLIENT_SECRET;
  const refreshToken = env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new GoogleCalendarError("Google credentials are not configured", {
      code: "not_configured",
    });
  }

  if (cachedToken.value && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.value;
  }

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    // Deliberately does not echo the body: it can contain token material.
    throw new GoogleCalendarError(
      `Token refresh failed with status ${response.status}`,
      { status: response.status, code: "token_refresh_failed" },
    );
  }

  const payload = await response.json();
  cachedToken = {
    value: payload.access_token,
    expiresAt: Date.now() + (payload.expires_in ?? 3600) * 1000,
  };

  return cachedToken.value;
}

async function calendarRequest(path, { method = "GET", body, env } = {}) {
  const token = await getAccessToken(env);

  const response = await fetch(`${CALENDAR_API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : null),
  });

  const text = await response.text();
  const payload = text ? safeJson(text) : null;

  if (!response.ok) {
    throw new GoogleCalendarError(
      payload?.error?.message ?? `Calendar API ${response.status}`,
      { status: response.status, code: payload?.error?.errors?.[0]?.reason },
    );
  }

  return payload;
}

function safeJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/**
 * Busy intervals only. freebusy.query never returns titles, attendees or
 * descriptions, so a visitor cannot learn anything about existing events.
 *
 * @returns {Promise<Array<{ start: Date, end: Date }>>}
 */
export async function getBusyIntervals({
  timeMin,
  timeMax,
  calendarId = "primary",
  env,
}) {
  const payload = await calendarRequest("/freeBusy", {
    method: "POST",
    env,
    body: {
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      items: [{ id: calendarId }],
    },
  });

  const calendar = payload?.calendars?.[calendarId];

  if (calendar?.errors?.length) {
    throw new GoogleCalendarError(
      `Calendar "${calendarId}" could not be read`,
      { code: calendar.errors[0]?.reason },
    );
  }

  return (calendar?.busy ?? []).map((interval) => ({
    start: new Date(interval.start),
    end: new Date(interval.end),
  }));
}

/**
 * Deterministic event id, so a retry or a double-click cannot create a second
 * meeting. Google requires base32hex (0-9a-v); a hex digest is a valid subset.
 */
export function deterministicEventId(startIso, email) {
  return createHash("sha256")
    .update(`${startIso}|${email.toLowerCase()}`)
    .digest("hex")
    .slice(0, 40);
}

/**
 * Create the event and request a fresh Meet conference for it.
 *
 * `conferenceDataVersion=1` is required for conferenceData to be honoured, and
 * `sendUpdates=all` makes Google email the invitation — containing the Meet
 * link — to the visitor, which is why this project needs no email provider.
 *
 * @returns {Promise<{ id: string, htmlLink: string, meetUrl: string|null, duplicate: boolean }>}
 */
export async function createBooking({
  start,
  end,
  visitor,
  config,
  env,
}) {
  const eventId = deterministicEventId(start.toISOString(), visitor.email);

  const description = [
    `Booked from ${config.ownerName}'s portfolio.`,
    "",
    `Name: ${visitor.name}`,
    `Email: ${visitor.email}`,
    visitor.company ? `Company: ${visitor.company}` : null,
    "",
    visitor.message ? "Message:" : null,
    visitor.message || null,
  ]
    .filter((line) => line !== null)
    .join("\n");

  const body = {
    id: eventId,
    summary: `${config.meetingTitle} — ${visitor.name}`,
    description,
    start: { dateTime: start.toISOString(), timeZone: config.timeZone },
    end: { dateTime: end.toISOString(), timeZone: config.timeZone },
    attendees: [
      { email: visitor.email, displayName: visitor.name, responseStatus: "needsAction" },
      ...(config.ownerEmail
        ? [{ email: config.ownerEmail, organizer: true, responseStatus: "accepted" }]
        : []),
    ],
    guestsCanInviteOthers: false,
    guestsCanModify: false,
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 60 },
        { method: "popup", minutes: 10 },
      ],
    },
    conferenceData: {
      createRequest: {
        // Same id as the event, so a retry asks for the same conference
        // instead of minting a second one.
        requestId: eventId,
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
  };

  let event;

  try {
    event = await calendarRequest(
      `/calendars/${encodeURIComponent(config.calendarId)}/events?conferenceDataVersion=1&sendUpdates=all`,
      { method: "POST", body, env },
    );
  } catch (error) {
    // 409 means this exact person already booked this exact slot — the retry
    // case. Return the existing event rather than failing or duplicating.
    if (error.status === 409) {
      const existing = await calendarRequest(
        `/calendars/${encodeURIComponent(config.calendarId)}/events/${eventId}`,
        { env },
      );
      return { ...extract(existing), duplicate: true };
    }
    throw error;
  }

  return { ...extract(event), duplicate: false };
}

function extract(event) {
  const meetUrl =
    event?.hangoutLink ??
    event?.conferenceData?.entryPoints?.find(
      (entry) => entry.entryPointType === "video",
    )?.uri ??
    null;

  return {
    id: event?.id,
    htmlLink: event?.htmlLink ?? null,
    meetUrl,
  };
}
