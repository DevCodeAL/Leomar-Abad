import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { getAdjacentPosts, getPostBySlug } from "@/data/blog";
import { profile } from "@/data/profile";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/SectionHeader";
import { Markdown } from "./Markdown";
import { formatDate } from "./format";
import { useDocumentMeta } from "./useDocumentMeta";

export function BlogArticle() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);
  const { previous, next } = getAdjacentPosts(slug);

  useDocumentMeta({
    title: post ? `${post.title} — Leomar Abad` : "Article not found",
    description: post?.excerpt,
    path: post ? `/blog/${post.slug}` : "/blog",
    image: post?.coverImage ?? profile.avatar,
    type: "article",
    publishedAt: post?.publishedAt,
    tags: post?.tags ?? [],
  });

  if (!post) return <NotFound />;

  return (
    <Section id="article">
      <Reveal direction="none" className="mb-6">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-ink-subtle transition-colors duration-200 hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          All articles
        </Link>
      </Reveal>

      <article>
        <Reveal direction="up" className="mb-8">
          <header className="max-w-3xl">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge variant="primary" size="md">
                {post.category}
              </Badge>
              {post.aiGenerated ? (
                <Badge size="md" mono>
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                  ai-assisted
                </Badge>
              ) : null}
            </div>

            <h1 className="text-balance text-3xl font-bold leading-[1.15] tracking-tight text-ink sm:text-[2.5rem]">
              {post.title}
            </h1>

            <p className="mt-4 text-pretty text-sm leading-relaxed text-ink-muted sm:text-base">
              {post.excerpt}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-line pt-4 font-mono text-[0.6875rem] text-ink-subtle">
              <span className="flex items-center gap-2">
                <img
                  src={profile.avatar}
                  alt=""
                  width="24"
                  height="24"
                  className="h-6 w-6 rounded-full border border-line object-cover object-top"
                />
                {post.author}
              </span>
              <span aria-hidden="true">·</span>
              <time dateTime={post.publishedAt}>
                {formatDate(post.publishedAt)}
              </time>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" aria-hidden="true" />
                {post.readingTime} min read
              </span>
              {post.updatedAt ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span>Updated {formatDate(post.updatedAt)}</span>
                </>
              ) : null}
            </div>
          </header>
        </Reveal>

        {post.coverImage ? (
          <Reveal direction="none" className="mb-8">
            <img
              src={post.coverImage}
              alt=""
              className="w-full rounded-2xl border border-line object-cover"
            />
          </Reveal>
        ) : null}

        <Reveal direction="none">
          <Markdown>{post.content}</Markdown>
        </Reveal>

        {post.tags?.length ? (
          <div className="mt-10 flex flex-wrap gap-2 border-t border-line pt-6">
            {post.tags.map((tag) => (
              <Badge key={tag} size="sm">
                #{tag}
              </Badge>
            ))}
          </div>
        ) : null}

        {post.sourceUrls?.length ? (
          <Card className="mt-6">
            <CardBody className="space-y-2">
              <p className="text-2xs font-semibold uppercase tracking-[0.16em] text-ink-subtle">
                Sources
              </p>
              <ul className="space-y-1.5">
                {post.sourceUrls.map((url) => (
                  <li key={url}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-start gap-1.5 break-all text-xs text-ink-muted transition-colors duration-200 hover:text-primary"
                    >
                      <ExternalLink
                        className="mt-0.5 h-3 w-3 shrink-0"
                        aria-hidden="true"
                      />
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        ) : null}
      </article>

      {previous || next ? (
        <nav
          aria-label="More articles"
          className="mt-10 grid gap-4 border-t border-line pt-8 sm:grid-cols-2"
        >
          {previous ? <AdjacentLink post={previous} direction="previous" /> : <span />}
          {next ? <AdjacentLink post={next} direction="next" /> : null}
        </nav>
      ) : null}
    </Section>
  );
}

function AdjacentLink({ post, direction }) {
  const isNext = direction === "next";

  return (
    <Link to={`/blog/${post.slug}`} className="group block">
      <Card interactive className="h-full">
        <CardBody className={isNext ? "text-right" : undefined}>
          <span className="flex items-center gap-1.5 font-mono text-[0.6875rem] text-ink-subtle">
            {!isNext ? (
              <ArrowLeft className="h-3 w-3" aria-hidden="true" />
            ) : null}
            <span className={isNext ? "ml-auto" : undefined}>
              {isNext ? "Newer" : "Older"}
            </span>
            {isNext ? <ArrowRight className="h-3 w-3" aria-hidden="true" /> : null}
          </span>
          <p className="mt-2 text-sm font-semibold leading-snug text-ink transition-colors duration-300 group-hover:text-primary">
            {post.title}
          </p>
        </CardBody>
      </Card>
    </Link>
  );
}

/** Reachable by typing a slug that does not exist, or following a stale link. */
function NotFound() {
  return (
    <Section id="article">
      <Card className="border-dashed">
        <CardBody className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="font-mono text-xs text-primary">404</p>
          <p className="text-lg font-bold tracking-tight text-ink">
            That article doesn&apos;t exist
          </p>
          <p className="max-w-sm text-xs leading-relaxed text-ink-muted">
            The link may be out of date, or the post may have been removed.
          </p>
          <Button as={Link} to="/blog" variant="outline" size="sm" className="mt-2">
            Browse all articles
          </Button>
        </CardBody>
      </Card>
    </Section>
  );
}
