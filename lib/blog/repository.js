/**
 * Storage: the repository itself.
 *
 * Posts are committed to `content/blog/*.json` through the GitHub Contents
 * API. Vercel's Git integration redeploys on the push, so publishing is a
 * commit — versioned, reviewable, revertable, and surviving every deployment
 * without a database.
 */

const API = "https://api.github.com";
const DIRECTORY = "content/blog";
const LOG_PATH = `${DIRECTORY}/_log.json`;

export class RepositoryError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "RepositoryError";
    this.status = status;
  }
}

function config() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;

  if (!token) throw new RepositoryError("GITHUB_TOKEN is not set", 500);
  if (!repo || !repo.includes("/")) {
    throw new RepositoryError("GITHUB_REPO must be 'owner/name'", 500);
  }

  return { token, repo, branch: process.env.GITHUB_BRANCH || "main" };
}

async function github(path, { method = "GET", body } = {}) {
  const { token } = config();

  const response = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "leomar-abad-portfolio-blog-generator",
      ...(body ? { "Content-Type": "application/json" } : null),
    },
    ...(body ? { body: JSON.stringify(body) } : null),
  });

  if (response.status === 404) return null;

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new RepositoryError(
      `GitHub ${method} ${path} failed: ${response.status} ${detail.slice(0, 200)}`,
      response.status,
    );
  }

  return response.json();
}

/** Existing posts, newest first. Returns [] before the first post exists. */
export async function listPosts() {
  const { repo, branch } = config();
  const listing = await github(
    `/repos/${repo}/contents/${DIRECTORY}?ref=${encodeURIComponent(branch)}`,
  );

  if (!Array.isArray(listing)) return [];

  const files = listing.filter(
    (entry) =>
      entry.type === "file" &&
      entry.name.endsWith(".json") &&
      !entry.name.startsWith("_"),
  );

  const posts = await Promise.all(
    files.map(async (file) => {
      try {
        const response = await fetch(file.download_url);
        if (!response.ok) return null;
        return await response.json();
      } catch {
        return null;
      }
    }),
  );

  return posts
    .filter(Boolean)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}

async function putFile(path, contentObject, message) {
  const { repo, branch } = config();

  // A file that already exists needs its blob sha, or the write is rejected.
  const existing = await github(
    `/repos/${repo}/contents/${path}?ref=${encodeURIComponent(branch)}`,
  );

  const encoded = Buffer.from(
    `${JSON.stringify(contentObject, null, 2)}\n`,
    "utf8",
  ).toString("base64");

  return github(`/repos/${repo}/contents/${path}`, {
    method: "PUT",
    body: {
      message,
      content: encoded,
      branch,
      ...(existing?.sha ? { sha: existing.sha } : null),
    },
  });
}

/**
 * Commit a post. Throws on failure so the caller never reports success for a
 * write that did not land.
 * @param {{ slug: string, title: string }} post
 */
export async function savePost(post) {
  const result = await putFile(
    `${DIRECTORY}/${post.slug}.json`,
    post,
    `blog: publish "${post.title}"`,
  );

  if (!result?.commit?.sha) {
    throw new RepositoryError("GitHub accepted the write but returned no commit", 502);
  }

  return { commit: result.commit.sha, path: `${DIRECTORY}/${post.slug}.json` };
}

/** @returns {Promise<{ entries: Array<object> }>} */
export async function readLog() {
  const { repo, branch } = config();
  const file = await github(
    `/repos/${repo}/contents/${LOG_PATH}?ref=${encodeURIComponent(branch)}`,
  );

  if (!file?.content) return { entries: [] };

  try {
    const decoded = Buffer.from(file.content, "base64").toString("utf8");
    const parsed = JSON.parse(decoded);
    return { entries: Array.isArray(parsed.entries) ? parsed.entries : [] };
  } catch {
    return { entries: [] };
  }
}

/**
 * Append a generation attempt — successes and failures both — so a failed run
 * is visible rather than silent, and the next run can see what was tried.
 * Never throws: losing the log must not turn a published post into an error.
 * @param {object} entry
 */
export async function appendLog(entry) {
  try {
    const { entries } = await readLog();
    const next = [entry, ...entries].slice(0, 120);
    await putFile(LOG_PATH, { entries: next }, `blog: log ${entry.outcome}`);
    return true;
  } catch {
    return false;
  }
}
