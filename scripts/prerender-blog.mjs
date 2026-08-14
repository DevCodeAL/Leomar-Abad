/**
 * Post-build SEO pass.
 *
 * The app is a client-rendered SPA, so per-article meta tags cannot come from
 * the runtime — a crawler or a link unfurler reads the HTML it is served and
 * does not wait for React. This clones the built index.html once per article
 * and injects real <title>, description, canonical, Open Graph, Twitter and
 * JSON-LD tags, then writes sitemap.xml and the RSS feed.
 *
 * No React SSR on purpose: the pre-paint theme script in index.html reads
 * localStorage, and rendering the tree on the server to gain nothing over
 * static meta would risk that working behaviour.
 */

import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const DIST = join(ROOT, "dist");
const CONTENT = join(ROOT, "content", "blog");
const SITE = (process.env.SITE_URL || "https://leomar-abad.vercel.app").replace(/\/$/, "");
const AUTHOR = "Leomar Abad";

const escape = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function loadPosts() {
  let files;
  try {
    files = readdirSync(CONTENT).filter(
      (name) => name.endsWith(".json") && !name.startsWith("_"),
    );
  } catch {
    return [];
  }

  return files
    .map((name) => {
      try {
        return JSON.parse(readFileSync(join(CONTENT, name), "utf8"));
      } catch (error) {
        console.warn(`  ! skipping ${name}: ${error.message}`);
        return null;
      }
    })
    .filter((post) => post && post.status === "published")
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}

/** Replace the meta the SPA shell ships with, rather than appending duplicates. */
function withMeta(shell, tags, title) {
  let html = shell.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${escape(title)}</title>`,
  );

  // Drop the shell's own description/OG/Twitter tags so an article does not
  // end up with two of each.
  html = html.replace(
    /\s*<meta\s+(?:name|property)="(?:description|og:[a-z:]+|twitter:[a-z:]+)"[^>]*>/g,
    "",
  );

  return html.replace("</head>", `${tags}\n  </head>`);
}

function articleTags(post) {
  const url = `${SITE}/blog/${post.slug}`;
  const image = post.coverImage
    ? new URL(post.coverImage, `${SITE}/`).toString()
    : `${SITE}/picture/Leomar-Abad.png`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    ...(post.updatedAt ? { dateModified: post.updatedAt } : null),
    author: { "@type": "Person", name: post.author || AUTHOR, url: SITE },
    keywords: (post.tags ?? []).join(", "),
    articleSection: post.category,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image,
  };

  return [
    `<meta name="description" content="${escape(post.excerpt)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="article" />`,
    `<meta property="og:title" content="${escape(post.title)}" />`,
    `<meta property="og:description" content="${escape(post.excerpt)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:site_name" content="${escape(AUTHOR)}" />`,
    `<meta property="article:published_time" content="${post.publishedAt}" />`,
    ...(post.tags ?? []).map(
      (tag) => `<meta property="article:tag" content="${escape(tag)}" />`,
    ),
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escape(post.title)}" />`,
    `<meta name="twitter:description" content="${escape(post.excerpt)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
  ]
    .map((tag) => `  ${tag}`)
    .join("\n");
}

function listingTags() {
  const url = `${SITE}/blog`;
  const description =
    "Thoughts, discoveries, experiments and things I've learned while building software.";

  return [
    `<meta name="description" content="${description}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="Blog — ${AUTHOR}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${SITE}/picture/Leomar-Abad.png" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<link rel="alternate" type="application/rss+xml" title="${AUTHOR} — Blog" href="${SITE}/blog/rss.xml" />`,
  ]
    .map((tag) => `  ${tag}`)
    .join("\n");
}

function write(relativePath, contents) {
  const target = join(DIST, relativePath);
  mkdirSync(join(target, ".."), { recursive: true });
  writeFileSync(target, contents, "utf8");
}

function sitemap(posts) {
  const staticEntries = [
    { loc: `${SITE}/`, priority: "1.0" },
    { loc: `${SITE}/blog`, priority: "0.8" },
  ];

  const urls = [
    ...staticEntries.map(
      ({ loc, priority }) =>
        `  <url>\n    <loc>${loc}</loc>\n    <priority>${priority}</priority>\n  </url>`,
    ),
    ...posts.map(
      (post) =>
        `  <url>\n    <loc>${SITE}/blog/${post.slug}</loc>\n    <lastmod>${(post.updatedAt || post.publishedAt).slice(0, 10)}</lastmod>\n    <priority>0.7</priority>\n  </url>`,
    ),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}

function rss(posts) {
  const items = posts
    .map(
      (post) => `    <item>
      <title>${escape(post.title)}</title>
      <link>${SITE}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <category>${escape(post.category)}</category>
      <description>${escape(post.excerpt)}</description>
    </item>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(AUTHOR)} — Blog</title>
    <link>${SITE}/blog</link>
    <atom:link href="${SITE}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>Notes from building software.</description>
    <language>en</language>
    <lastBuildDate>${new Date(posts[0]?.publishedAt ?? Date.now()).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
}

function robots() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`;
}

/* ── run ──────────────────────────────────────────────────────────────── */

const shell = readFileSync(join(DIST, "index.html"), "utf8");
const posts = loadPosts();

posts.forEach((post) => {
  write(
    join("blog", post.slug, "index.html"),
    withMeta(shell, articleTags(post), `${post.title} — ${AUTHOR}`),
  );
});

write(
  join("blog", "index.html"),
  withMeta(shell, listingTags(), `Blog — ${AUTHOR}`),
);

write("sitemap.xml", sitemap(posts));
write(join("blog", "rss.xml"), rss(posts));
write("robots.txt", robots());

console.log(
  `prerendered ${posts.length} article page(s) + /blog, sitemap.xml, rss.xml, robots.txt`,
);
