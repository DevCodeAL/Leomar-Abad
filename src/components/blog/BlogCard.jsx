import { Link } from "react-router-dom";
import { ArrowUpRight, Clock, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { formatDate } from "./format";

/**
 * One article in the listing. `featured` gives the newest post a wider,
 * taller treatment without needing a second component.
 */
export function BlogCard({ post, featured = false }) {
  return (
    <Card
      as="article"
      interactive
      className={cn("group h-full", featured && "sm:col-span-2")}
    >
      <Link
        to={`/blog/${post.slug}`}
        className="flex h-full flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {post.coverImage ? (
          <span className="relative block aspect-[2/1] overflow-hidden border-b border-line">
            <img
              src={post.coverImage}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 ease-smooth group-hover:scale-[1.03]"
            />
          </span>
        ) : null}

        <div
          className={cn(
            "flex h-full flex-col gap-3 p-5",
            featured && "sm:gap-4 sm:p-6",
          )}
        >
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary" size="sm">
              {post.category}
            </Badge>
            {post.aiGenerated ? (
              <Badge size="sm" mono title="Drafted with AI, published by Leomar">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                ai-assisted
              </Badge>
            ) : null}
          </div>

          <h3
            className={cn(
              "text-pretty font-bold leading-snug tracking-tight text-ink transition-colors duration-300 group-hover:text-primary",
              featured ? "text-lg sm:text-2xl" : "text-base",
            )}
          >
            {post.title}
          </h3>

          <p
            className={cn(
              "flex-1 text-pretty leading-relaxed text-ink-muted",
              featured ? "text-sm sm:text-[0.9375rem]" : "text-xs",
            )}
          >
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.6875rem] text-ink-subtle">
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {post.readingTime} min read
            </span>
          </div>

          <span className="flex items-center gap-1.5 text-xs font-semibold text-primary">
            Read article
            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform duration-300 ease-smooth group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </span>
        </div>
      </Link>
    </Card>
  );
}
