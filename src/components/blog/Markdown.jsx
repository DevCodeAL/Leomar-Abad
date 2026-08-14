import { Component } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Card, CardBody } from "@/components/ui/Card";

/**
 * Article body renderer.
 *
 * react-markdown does not render raw HTML unless `rehype-raw` is added, so
 * model-generated content cannot inject markup — that is deliberate, and the
 * reason no separate sanitiser is needed. Highlighting is applied by
 * rehype-highlight at render time and coloured by the `.hljs-*` rules in
 * index.css, which are written against the palette tokens so code blocks
 * follow the active theme.
 */
export function Markdown({ children }) {
  return (
    <MarkdownBoundary>
      <div className="prose-blog">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
          components={{
            a: ({ href, children: content, ...props }) => {
              const external = typeof href === "string" && /^https?:/.test(href);
              return (
                <a
                  href={href}
                  {...(external
                    ? { target: "_blank", rel: "noreferrer noopener" }
                    : null)}
                  {...props}
                >
                  {content}
                </a>
              );
            },
            img: ({ src, alt, ...props }) => (
              <img src={src} alt={alt ?? ""} loading="lazy" decoding="async" {...props} />
            ),
            table: ({ children: content, ...props }) => (
              <div className="prose-blog-table-scroll">
                <table {...props}>{content}</table>
              </div>
            ),
          }}
        >
          {children}
        </ReactMarkdown>
      </div>
    </MarkdownBoundary>
  );
}

/**
 * A malformed article should not take the whole page down with it — the rest
 * of the route (title, metadata, navigation) stays usable.
 */
class MarkdownBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <Card className="border-dashed">
        <CardBody className="py-10 text-center">
          <p className="text-sm font-semibold text-ink">
            This article could not be displayed
          </p>
          <p className="mt-2 text-xs text-ink-muted">
            The content failed to render. Try another article while I look into
            it.
          </p>
        </CardBody>
      </Card>
    );
  }
}
