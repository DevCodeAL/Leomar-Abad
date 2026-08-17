/**
 * One-time helper that mints your GOOGLE_REFRESH_TOKEN.
 *
 *   npm run google:auth
 *
 * Starts a local server on http://localhost:5273, opens the consent screen,
 * exchanges the code and prints the refresh token. Nothing is stored or sent
 * anywhere — copy the value into .env and into Vercel.
 *
 * Requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET, and that
 * http://localhost:5273/callback is registered as an authorised redirect URI
 * on the OAuth client.
 */

import { createServer } from "node:http";
import { readFileSync } from "node:fs";

const PORT = 5273;
const REDIRECT_URI = `http://localhost:${PORT}/callback`;
const SCOPE = "https://www.googleapis.com/auth/calendar";

loadEnv(".env");
loadEnv(".env.local");

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error(
    "GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set (in .env or the environment).",
  );
  process.exit(1);
}

const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
  client_id: clientId,
  redirect_uri: REDIRECT_URI,
  response_type: "code",
  scope: SCOPE,
  // Both are required to be handed a refresh token rather than only an
  // access token.
  access_type: "offline",
  prompt: "consent",
})}`;

console.log("\nOpen this URL, sign in with the Google account that owns the calendar:\n");
console.log(authUrl);
console.log(`\nWaiting for the redirect on ${REDIRECT_URI} …\n`);

const server = createServer(async (request, response) => {
  const url = new URL(request.url, `http://localhost:${PORT}`);
  if (url.pathname !== "/callback") {
    response.writeHead(404).end("Not found");
    return;
  }

  const error = url.searchParams.get("error");
  const code = url.searchParams.get("code");

  if (error || !code) {
    respond(response, `Authorisation failed: ${error ?? "no code returned"}`);

    // access_denied here almost never means "the user clicked cancel" — it is
    // Google refusing the account because the consent screen is still in
    // Testing and the account is not a registered test user.
    if (error === "access_denied") {
      console.error(
        [
          "\nGoogle refused the account (access_denied).",
          "",
          "The consent screen is most likely still in Testing, which only lets",
          "registered test users through. At console.cloud.google.com/auth/audience:",
          "",
          "  • add the calendar owner's address under Test users, or",
          "  • click Publish app to push it to production",
          "",
          "Prefer publishing: while the app is in Testing, Google expires refresh",
          "tokens after 7 days, so booking would break a week from now.",
        ].join("\n"),
      );
    } else {
      console.error(`\nAuthorisation failed: ${error ?? "no code returned"}`);
    }

    server.close();
    process.exitCode = 1;
    return;
  }

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    const payload = await tokenResponse.json();

    if (!tokenResponse.ok || !payload.refresh_token) {
      respond(
        response,
        "No refresh token returned. Revoke the app at myaccount.google.com/permissions and run this again.",
      );
      console.error("\nToken exchange response:", {
        status: tokenResponse.status,
        hasAccessToken: Boolean(payload.access_token),
        hasRefreshToken: Boolean(payload.refresh_token),
        error: payload.error,
      });
      process.exitCode = 1;
    } else {
      respond(response, "Done. Your refresh token is in the terminal.");
      console.log("\nAdd this to .env and to Vercel:\n");
      console.log(`GOOGLE_REFRESH_TOKEN=${payload.refresh_token}\n`);
      console.log("Treat it like a password — it grants calendar access.\n");
    }
  } catch (exchangeError) {
    respond(response, "Token exchange failed. See the terminal.");
    console.error(exchangeError);
    process.exitCode = 1;
  }

  server.close();
});

server.listen(PORT);

function respond(response, message) {
  response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  response.end(
    `<!doctype html><meta charset="utf-8"><title>Google authorisation</title><body style="font:16px/1.6 system-ui;padding:3rem;max-width:34rem"><p>${message}</p><p style="color:#666">You can close this tab.</p>`,
  );
}

function loadEnv(path) {
  let contents;
  try {
    contents = readFileSync(path, "utf8");
  } catch {
    return;
  }

  contents.split("\n").forEach((line) => {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match || process.env[match[1]]) return;
    process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  });
}
