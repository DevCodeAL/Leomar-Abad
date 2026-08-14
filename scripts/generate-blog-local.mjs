/**
 * Run the generation pipeline from your machine instead of waiting for the
 * cron. Same code path the scheduler uses.
 *
 *   npm run generate:blog -- --dry-run
 *   npm run generate:blog -- --force
 *   npm run generate:blog -- --topic ai-model-release
 *
 * Reads .env if present, so GEMINI_API_KEY and GITHUB_TOKEN do not have to be
 * exported by hand. Without --dry-run this commits to the repository and the
 * post goes live on the next deploy.
 */

import { readFileSync } from "node:fs";
import { runGeneration } from "../lib/blog/run-generation.js";
import { TOPICS } from "../lib/blog/topics.js";

loadEnvFile(".env");
loadEnvFile(".env.local");

const args = process.argv.slice(2);
const has = (flag) => args.includes(flag);
const value = (flag) => {
  const index = args.indexOf(flag);
  return index === -1 ? undefined : args[index + 1];
};

if (has("--list-topics")) {
  TOPICS.forEach((topic) =>
    console.log(`${topic.id.padEnd(30)} ${topic.category}`),
  );
  process.exit(0);
}

const missing = ["GEMINI_API_KEY", "GITHUB_TOKEN", "GITHUB_REPO"].filter(
  (key) => !process.env[key],
);

if (missing.length && !has("--dry-run")) {
  console.error(`Missing environment variables: ${missing.join(", ")}`);
  console.error("Set them in .env, or pass --dry-run to stop before committing.");
  process.exit(1);
}

const result = await runGeneration({
  force: has("--force"),
  dryRun: has("--dry-run"),
  topicId: value("--topic"),
});

console.log(JSON.stringify(result, null, 2));

if (result.status === "failed") process.exit(1);

/** Minimal .env reader — no dependency needed for KEY=value lines. */
function loadEnvFile(path) {
  let contents;
  try {
    contents = readFileSync(path, "utf8");
  } catch {
    return;
  }

  contents.split("\n").forEach((line) => {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match) return;
    const [, key, rawValue] = match;
    if (process.env[key]) return;
    process.env[key] = rawValue.replace(/^["']|["']$/g, "");
  });
}
