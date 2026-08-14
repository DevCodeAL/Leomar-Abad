# Blog + AI generation — design & implementation plan

Portfolio is a **Vite 6 + React 19 SPA** with no router, no server runtime, no
database and no Markdown pipeline. Content lives as hand-authored ES modules in
`src/data/`. Deployed through Vercel's Git integration (no `vercel.json` before
this feature).

Decisions taken with the owner:

- **Storage** — git-backed. Posts are committed to `content/blog/<slug>.json`
  by the generator; Vercel's auto-deploy publishes them.
- **SEO** — post-build script injects real meta into per-article HTML. No SSR,
  so the pre-paint theme script in `index.html` is untouched.
- **Language** — JavaScript + JSDoc, matching every existing file.

## Architecture

```
Vercel Cron (daily 09:00 UTC)
   -> api/cron/generate-blog.js        auth: Bearer CRON_SECRET
   -> lib/blog/quota.js                how many AI posts this month? is a window due?
   -> lib/blog/topics.js               pick a topic, avoiding recent titles
   -> lib/ai/research.js               Gemini + Google Search grounding -> facts + sources
   -> lib/ai/generate-blog.js          Gemini + responseSchema -> structured BlogPost
   -> lib/blog/validation.js           reject malformed / empty / over-long
   -> lib/blog/similarity.js           reject near-duplicate of existing posts
   -> lib/blog/repository.js           commit JSON via GitHub Contents API
   -> Vercel auto-redeploy             post is live, static
```

Client never imports anything under `lib/` or `api/`; those are server-only and
sit outside `src/`, so the bundler cannot pull secrets into the browser.

## Data shape

`content/blog/<slug>.json`

```jsonc
{
  "id": "2026-08-uuid",
  "slug": "kebab-case",
  "title": "...",
  "excerpt": "...",
  "content": "# Markdown body",
  "category": "AI",
  "tags": ["..."],
  "author": "Leomar Abad",
  "publishedAt": "2026-08-15T09:00:00.000Z",
  "updatedAt": null,
  "readingTime": 7,
  "coverImage": null,
  "sourceUrls": ["https://..."],
  "aiGenerated": true,
  "status": "published"
}
```

`content/blog/_log.json` records every generation attempt (timestamp, topic,
outcome, error) so failures are visible and retried by the next run.

## Quota / scheduling

`BLOG_POSTS_PER_MONTH` (default 4) divides the month into equal windows. A run
generates **at most one** post, and only when
`postsThisMonth < windowsElapsed`. A daily cron therefore spreads four posts
across the month and self-heals after a failure, without ever exceeding the cap.

## Routes

| Path | View |
| --- | --- |
| `/` | existing dashboard, unchanged |
| `/blog` | listing: featured latest + cards + category filter |
| `/blog/:slug` | article |

Sidebar anchor items keep working as today on `/`; from any other route they
resolve to `/#section`.

## Phases

1. Routing, nav integration, blog UI, sample posts.
2. Storage / quota / topics / validation / similarity modules.
3. Gemini research + generation, cron + admin endpoints.
4. Prerender, sitemap, RSS, docs, regression pass.

## Env

```env
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
CRON_SECRET=
ADMIN_SECRET=
GITHUB_TOKEN=
GITHUB_REPO=DevCodeAL/Leomar-Abad
SITE_URL=https://leomar-abad.vercel.app
BLOG_POSTS_PER_MONTH=4
```
