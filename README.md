# Leomar Abad — Portfolio

A dashboard-style personal portfolio built with React 19, Vite and Tailwind CSS.
Single page, single scroll column, fixed sidebar navigation, and a theme system
with **5 colour palettes × light/dark = 10 visual combinations**.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
npm run lint
```

## Environment

All secrets are server-side. Nothing in the booking or blog systems uses a
`VITE_` variable, so none of it can reach the browser.

See **Book a Call** and **Blog** below for the variables each feature needs.

## Structure

```
src/
├── data/            content only — no JSX layout decisions
│   ├── profile.js       name, role, socials, education, focus areas
│   ├── navigation.js    section registry (drives sidebar + scroll-spy)
│   ├── projects.js      projects + bento grid spans
│   ├── skills.js        toolkit, grouped
│   ├── experience.js    timeline entries
│   ├── services.js      services
│   ├── testimonials.js  recommendations
│   └── stats.js         figures COUNTED from the data above
│
├── styles/palettes.css  every colour token, 5 palettes × 2 modes
├── theme/               ThemeProvider, useTheme, ThemeToggle, PaletteSelector
├── hooks/               scroll-spy, parallax, reduced motion, clipboard, …
│
└── components/
    ├── layout/      DashboardLayout, Sidebar, MobileNavigation, Footer, …
    ├── ui/          Button, Card, Badge, Reveal, Tooltip, SectionHeader, …
    ├── projects/    FeaturedProject, ProjectCard, ProjectGrid
    └── dashboard/   Hero, Stats, About, Experience, Skills, Projects,
                     Services, Testimonials, Contact
```

Content lives in `src/data`. To add a project, skill or timeline entry, edit
the relevant data file — nothing in `components/` needs to change.

## Book a Call

The contact form was replaced by a booking flow that reads real Google
Calendar availability, creates the event, generates a Google Meet link and
lets Google send the invitations.

```
Visitor  →  #contact (Book a Call)
             │
             ├─ GET  /api/booking/availability   free/busy → open slots
             └─ POST /api/booking/create         re-check, then create
                        │
                        ├─ Google Calendar  freebusy.query
                        ├─ Google Calendar  events.insert
                        │     conferenceDataVersion=1  → unique Meet link
                        │     sendUpdates=all          → invitations sent
                        └─ visitor + owner both receive the invite
```

### Why not n8n

n8n was considered and rejected. Self-hosting it free is not realistic: free
tiers that sleep would time out a booking webhook and lose workflow state, and
a VM you keep patched is a lot of operational surface for one linear workflow
that a single serverless function already handles. Vercel Functions were
already in the project and working, so the booking runs there — no extra
service, no second dashboard, no recurring cost.

Zoom can be added later behind `MEETING_PROVIDER` without touching the UI.

### Files

```
lib/booking/config.js       rules from env, with defaults
lib/booking/timezone.js     Intl-based zoned <-> UTC conversion
lib/booking/slots.js        slot generation, buffers, notice, busy filtering
lib/booking/google.js       token refresh, freebusy, event + Meet creation
lib/booking/validation.js   server-side validation and sanitisation
lib/booking/rate-limit.js   best-effort limiting, honeypot, timing check

api/booking/availability.js GET  — public, exposes only free slots
api/booking/create.js       POST — re-checks, then books

src/components/booking/     BookACall (4 steps), DatePicker, useAvailability
scripts/google-auth.mjs     one-time refresh-token helper
scripts/check-booking-logic.mjs   35 offline checks
```

### Environment

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
GOOGLE_CALENDAR_ID=primary
OWNER_EMAIL=you@example.com
OWNER_NAME=Leomar Abad

BOOKING_TIMEZONE=Asia/Manila
BOOKING_DURATION_MINUTES=30
BOOKING_BUFFER_MINUTES=15
BOOKING_WINDOW_DAYS=30
BOOKING_MIN_NOTICE_MINUTES=120
BOOKING_WORKING_DAYS=1,2,3,4,5      # 1 = Monday
BOOKING_WORK_START=09:00
BOOKING_WORK_END=17:00
BOOKING_TITLE=Intro call
MEETING_PROVIDER=google_meet
```

Every value has a default, so the booking rules work unset — only the four
`GOOGLE_*` values are actually required.

### Google Cloud setup

1. Create or pick a project at <https://console.cloud.google.com>.
2. **APIs & Services → Library →** enable **Google Calendar API**.
3. **OAuth consent screen →** External, add yourself as a test user. It can
   stay in Testing; a refresh token issued to a test user still works, though
   Google may expire it after a period of inactivity.
4. **Credentials → Create credentials → OAuth client ID → Web application.**
   Add `http://localhost:5273/callback` as an authorised redirect URI.
5. Copy the client ID and secret into `.env`.
6. Run `npm run google:auth`, sign in with the account owning the calendar,
   and copy the printed `GOOGLE_REFRESH_TOKEN`.
7. Add all four `GOOGLE_*` values to Vercel → Settings → Environment Variables.

The refresh token grants calendar access — treat it like a password. To revoke
it, remove the app at <https://myaccount.google.com/permissions>.

### Booking rules and double-booking

The month is not pre-partitioned: availability is computed per request from
`freebusy.query`, which returns busy intervals only — never event titles,
attendees or descriptions, so a visitor cannot learn anything about existing
meetings.

When **Confirm booking** is pressed the calendar is queried *again* and the
slot re-validated before the event is written, so a slot taken in between is
rejected with a clear message and a refreshed list. The event id is derived
deterministically from the slot and the visitor's email, so a double-click,
retry or network hiccup cannot create a second meeting.

### Testing

```bash
npm run check:booking   # 35 offline checks, no credentials needed
```

Covers timezone conversion (including a US DST boundary), slot generation,
working hours and days, minimum notice, the booking window, buffers, busy
filtering, server-side re-validation, input validation, bot detection,
deterministic ids and rate limiting.

## Blog

Two routes (`/blog`, `/blog/:slug`) served by the same shell as the dashboard,
plus a generator that publishes roughly four AI-assisted articles a month.

```
content/blog/*.json      one file per post — this is the database
content/blog/_log.json   every generation attempt, success or failure

lib/ai/                  gemini.js · prompts.js · generate-blog.js
lib/blog/                topics.js · quota.js · similarity.js
                         schema.js · repository.js · run-generation.js
lib/http/auth.js         constant-time secret comparison

api/cron/generate-blog   scheduled publisher   (Bearer CRON_SECRET)
api/admin/generate-blog  manual trigger        (Bearer/x-admin-secret ADMIN_SECRET)

scripts/prerender-blog.mjs    per-article meta, sitemap.xml, rss.xml, robots.txt
scripts/check-blog-logic.mjs  offline checks for pacing/dedupe/validation/auth
scripts/generate-blog-local.mjs  run the pipeline from your machine
```

### Storage

Posts are committed to `content/blog/` through the GitHub Contents API, and
Vercel redeploys on the push. There is no database: publishing is a commit, so
every post is versioned, reviewable and revertable, and survives deployments.
The client reads posts through a build-time glob in `src/data/blog.js`.

To edit or unpublish a post, edit its JSON — set `"status": "draft"` to hide it.

### Environment

```env
GEMINI_API_KEY=          # Google AI Studio → Get API key
GEMINI_MODEL=gemini-2.5-flash
CRON_SECRET=             # any long random string; Vercel sends it as a Bearer token
ADMIN_SECRET=            # separate secret for the manual endpoint
GITHUB_TOKEN=            # fine-grained PAT, Contents: read and write, this repo only
GITHUB_REPO=DevCodeAL/Leomar-Abad
GITHUB_BRANCH=main
SITE_URL=https://leomar-abad.vercel.app
BLOG_POSTS_PER_MONTH=4
```

Everything except `SITE_URL` is server-only. None of it is prefixed `VITE_`,
so none of it can reach the browser — Vite only exposes `VITE_*` to client
code, and `lib/` and `api/` are outside `src/` and never imported by it.

### Running generation manually

```bash
npm run check:blog                      # offline logic checks, no API key needed
npm run generate:blog -- --dry-run      # full pipeline, commits nothing
npm run generate:blog -- --force        # ignore pacing (monthly cap still applies)
npm run generate:blog -- --topic ai-model-release
npm run generate:blog -- --list-topics
```

In production:

```bash
curl -X POST https://leomar-abad.vercel.app/api/admin/generate-blog \
  -H "x-admin-secret: $ADMIN_SECRET" \
  -H "content-type: application/json" \
  -d '{"dryRun": true}'
```

### How the schedule works

The cron runs **daily** and usually does nothing. The month is divided into
`BLOG_POSTS_PER_MONTH` equal windows; a run publishes only if fewer posts exist
than windows have opened. With the default of 4 that puts posts around days 1,
8, 16 and 24, one per run.

Running daily rather than weekly is deliberate: a failed generation leaves its
window unfilled, so the next day retries automatically instead of losing the
slot. The monthly cap is enforced separately and cannot be exceeded, including
by repeated admin calls.

### How an article is generated

1. **Quota** — is a window open and unfilled? If not, stop.
2. **Topic** — pick from `lib/blog/topics.js`, avoiding recent categories and
   recently attempted topics.
3. **Research** — a Gemini call with Google Search grounding returns notes and
   the URLs search actually surfaced. If it comes back thin, the topic is
   abandoned rather than written from imagination.
4. **Write** — a second Gemini call, schema-constrained, fed those notes. Two
   calls because grounding and strict JSON schema output do not reliably
   combine in one request.
5. **Validate** — length, category, headings, tags, https-only sources, and a
   check for stock AI phrasing. Failure moves to the next topic.
6. **Deduplicate** — title-overlap and slug check against every existing post.
7. **Commit** — if the write does not land, the run reports failure. A post is
   never reported as published unless the commit succeeded.

Sources are filtered to URLs that appeared in the grounded research, so a
citation the model produced while writing is discarded rather than trusted.

### Vercel setup

`vercel.json` declares the cron and the SPA rewrite. After deploying, add every
variable above under **Settings → Environment Variables** (Production). The
cron only authenticates when `CRON_SECRET` is set — without it the endpoint
rejects everything, including Vercel.

Note that cron frequency is plan-limited on Vercel; the daily schedule here is
chosen to fit comfortably within the Hobby allowance.

### Editing the writing style

`lib/ai/prompts.js` holds the voice rules, the research prompt, the article
prompt and the response schema. Nothing else needs touching to change how the
articles read. Topics live in `lib/blog/topics.js` — each is an angle plus what
to search for, not a headline.

## Theming

Colours are **never** hardcoded in components. Everything resolves through CSS
variables set on `<html>` by two attributes:

```html
<html data-theme="dark|light" data-palette="default|ocean|emerald|violet|sunset">
```

`src/styles/palettes.css` defines one block per combination:

| Token | Meaning |
| --- | --- |
| `--canvas`, `--canvas-deep` | page background |
| `--surface`, `--elevated` | card and raised surfaces |
| `--line`, `--line-strong` | borders |
| `--ink`, `--ink-muted`, `--ink-subtle` | text hierarchy |
| `--primary`, `--primary-strong`, `--primary-fg` | accent, hover, text-on-accent |
| `--accent` | secondary hue for gradients |

`tailwind.config.js` maps these to utilities (`bg-canvas`, `text-ink-muted`,
`border-line`, `bg-primary/10`, …). Adding a sixth palette means adding one
block of CSS — no component changes.

Palette 1 (`default`) is the original brand: `#1ed760` on `#121212` / `#212121`.
It is the default for first-time visitors. Theme and palette persist in
`localStorage` and are applied by an inline script in `index.html` before first
paint, so there is no flash of the wrong colours.

## Performance & accessibility notes

- No animation library. Reveals, hovers and marquees are CSS transitions
  driven by `IntersectionObserver`.
- Scroll listeners are `passive` and `requestAnimationFrame`-throttled; the
  parallax layers only ever write a CSS variable.
- `prefers-reduced-motion: reduce` disables reveals, parallax, the marquees,
  the count-up figures and the rotating job title.
- Semantic landmarks, a skip link, visible focus rings, `aria-current` on the
  active nav item, and `inert` on the closed mobile drawer.

## Content policy

Every fact on the page comes from the original portfolio. Dashboard figures in
`src/data/stats.js` are counted from the real data at runtime rather than typed
in, and there are no invented skill percentages, dates or metrics. The two
academic timeline entries are labelled by programme phase because only the 2025
graduation date is documented — add real dates in `src/data/experience.js` when
you have them.
