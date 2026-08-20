import { memo } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Assistant prose.
 *
 * react-markdown is used rather than a hand-rolled formatter precisely because
 * this text originates from a model: raw HTML is escaped unless `rehype-raw` is
 * added (it is not, deliberately), and the default URL transform already drops
 * `javascript:` and other non-navigational schemes. So the only way a reply can
 * put markup on the page is through the component map below.
 *
 * The map is intentionally small. Replies are two to four sentences; headings,
 * tables and images would be the model misjudging the medium, so they render as
 * ordinary text instead of being given a look that encourages them.
 */

const components = {
  p: ({ children }) => <p className="text-[0.875rem] leading-[1.65]">{children}</p>,

  strong: ({ children }) => (
    <strong className="font-semibold text-ink">{children}</strong>
  ),

  em: ({ children }) => <em className="italic text-ink-muted">{children}</em>,

  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener nofollow"
      className="font-medium text-primary underline decoration-primary/35 underline-offset-[3px] transition-colors duration-200 hover:decoration-primary"
    >
      {children}
    </a>
  ),

  ul: ({ children }) => (
    <ul className="list-disc space-y-1 pl-4 text-[0.875rem] leading-[1.6] marker:text-primary/60">
      {children}
    </ul>
  ),

  ol: ({ children }) => (
    <ol className="list-decimal space-y-1 pl-4 text-[0.875rem] leading-[1.6] marker:font-mono marker:text-[0.6875rem] marker:text-ink-subtle">
      {children}
    </ol>
  ),

  li: ({ children }) => <li className="pl-0.5">{children}</li>,

  code: ({ children }) => (
    <code className="rounded border border-line bg-elevated px-1 py-0.5 font-mono text-[0.8125em] text-ink">
      {children}
    </code>
  ),

  pre: ({ children }) => (
    <pre className="overflow-x-auto rounded-lg border border-line bg-canvas-deep p-2.5 font-mono text-[0.75rem] leading-relaxed">
      {children}
    </pre>
  ),

  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-primary/50 pl-3 italic">
      {children}
    </blockquote>
  ),

  hr: () => <hr className="border-line" />,

  /* Flattened on purpose — see the note above. */
  h1: ({ children }) => <p className="font-semibold text-ink">{children}</p>,
  h2: ({ children }) => <p className="font-semibold text-ink">{children}</p>,
  h3: ({ children }) => <p className="font-semibold text-ink">{children}</p>,
  h4: ({ children }) => <p className="font-semibold text-ink">{children}</p>,
  img: () => null,
};

export const ChatMarkdown = memo(function ChatMarkdown({ children }) {
  return (
    <div className="space-y-2 text-[0.875rem] leading-[1.65] text-ink-muted">
      <Markdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </Markdown>
    </div>
  );
});
