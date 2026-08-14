import { useEffect } from "react";

const SITE_NAME = "Leomar Abad";

/**
 * Keeps the document head in step with the current route.
 *
 * Belt and braces: the build already writes real static meta into
 * `dist/blog/<slug>/index.html`, which is what crawlers and link unfurlers
 * read. This handles the in-app case — client-side navigation, and the browser
 * tab title — and restores the previous values on unmount so returning to the
 * dashboard does not leave an article's title behind.
 */
export function useDocumentMeta({
  title,
  description,
  path,
  image,
  type = "website",
  publishedAt,
  tags = [],
}) {
  // Serialised so the effect depends on a primitive instead of a fresh array
  // identity on every render.
  const tagsKey = tags.join("|");

  useEffect(() => {
    const previousTitle = document.title;
    if (title) document.title = title;

    const url = path
      ? new URL(path, window.location.origin).toString()
      : window.location.href;

    const applied = [
      ["name", "description", description],
      ["property", "og:title", title],
      ["property", "og:description", description],
      ["property", "og:url", url],
      ["property", "og:type", type],
      ["property", "og:image", image],
      ["name", "twitter:card", image ? "summary_large_image" : "summary"],
      ["name", "twitter:title", title],
      ["name", "twitter:description", description],
      ["name", "twitter:image", image],
      ["property", "article:published_time", publishedAt],
    ].filter(([, , value]) => Boolean(value));

    const previous = new Map();
    const created = [];

    applied.forEach(([attribute, key, value]) => {
      let element = document.head.querySelector(`meta[${attribute}="${key}"]`);

      if (element) {
        if (!previous.has(element)) previous.set(element, element.content);
      } else {
        element = document.createElement("meta");
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
        created.push(element);
      }

      element.setAttribute("content", value);
    });

    /* `article:tag` repeats — one element per tag. Looking these up by
       selector would make every tag overwrite the same node, so they are
       always appended fresh and removed on cleanup. */
    (tagsKey ? tagsKey.split("|") : []).forEach((tag) => {
      const element = document.createElement("meta");
      element.setAttribute("property", "article:tag");
      element.setAttribute("content", tag);
      document.head.appendChild(element);
      created.push(element);
    });

    let canonical = document.head.querySelector('link[rel="canonical"]');
    const previousCanonical = canonical?.getAttribute("href") ?? null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
      created.push(canonical);
    }
    canonical.setAttribute("href", url);

    return () => {
      document.title = previousTitle;
      previous.forEach((value, element) =>
        element.setAttribute("content", value),
      );
      if (previousCanonical) canonical.setAttribute("href", previousCanonical);
      created.forEach((element) => element.remove());
    };
  }, [title, description, path, image, type, publishedAt, tagsKey]);
}

export { SITE_NAME };
