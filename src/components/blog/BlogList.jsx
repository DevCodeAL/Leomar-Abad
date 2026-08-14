import { useMemo, useState } from "react";
import { FileText } from "lucide-react";
import { categories, posts } from "@/data/blog";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";
import { BlogCard } from "./BlogCard";
import { useDocumentMeta } from "./useDocumentMeta";

/** Posts shown before "Load more" appears. */
const PAGE_SIZE = 7;

export function BlogList() {
  const [category, setCategory] = useState("All");
  const [visible, setVisible] = useState(PAGE_SIZE);

  useDocumentMeta({
    title: "Blog — Leomar Abad",
    description:
      "Thoughts, discoveries, experiments and things I've learned while building software.",
    path: "/blog",
  });

  const filtered = useMemo(
    () =>
      category === "All"
        ? posts
        : posts.filter((post) => post.category === category),
    [category],
  );

  const shown = filtered.slice(0, visible);
  const [featured, ...rest] = shown;

  return (
    <Section id="blog">
      <SectionHeader
        index="07"
        eyebrow="Blog"
        title="Notes from the build"
        description="Thoughts, discoveries, experiments and things I've learned while building software."
      />

      {posts.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {categories.length > 1 ? (
            <Reveal direction="none" className="mb-6">
              <div
                role="group"
                aria-label="Filter by category"
                className="flex flex-wrap gap-2"
              >
                <CategoryChip
                  label="All"
                  count={posts.length}
                  active={category === "All"}
                  onClick={() => {
                    setCategory("All");
                    setVisible(PAGE_SIZE);
                  }}
                />
                {categories.map(({ name, count }) => (
                  <CategoryChip
                    key={name}
                    label={name}
                    count={count}
                    active={category === name}
                    onClick={() => {
                      setCategory(name);
                      setVisible(PAGE_SIZE);
                    }}
                  />
                ))}
              </div>
            </Reveal>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured ? (
              <Reveal direction="up" className="sm:col-span-2 lg:col-span-3">
                <BlogCard post={featured} featured />
              </Reveal>
            ) : null}

            {rest.map((post, index) => (
              <Reveal key={post.slug} direction="up" delay={index * 70}>
                <BlogCard post={post} />
              </Reveal>
            ))}
          </div>

          {visible < filtered.length ? (
            <div className="mt-8 flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setVisible((count) => count + PAGE_SIZE)}
              >
                Load more ({filtered.length - visible} remaining)
              </Button>
            </div>
          ) : null}
        </>
      )}
    </Section>
  );
}

function CategoryChip({ label, count, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
        "transition-[background-color,border-color,color] duration-200",
        active
          ? "border-primary/40 bg-primary/10 text-primary"
          : "border-line bg-elevated text-ink-muted hover:border-line-strong hover:text-ink",
      )}
    >
      {label}
      <span className="font-mono text-[0.625rem] opacity-70">{count}</span>
    </button>
  );
}

/** Genuinely reachable: the generator has not published anything yet. */
function EmptyState() {
  return (
    <Reveal direction="up">
      <Card className="border-dashed">
        <CardBody className="flex flex-col items-center gap-3 py-14 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-elevated text-ink-subtle">
            <FileText className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="text-sm font-semibold text-ink">No articles yet</p>
          <p className="max-w-sm text-xs leading-relaxed text-ink-muted">
            The first posts are on their way. New articles are published a few
            times a month.
          </p>
        </CardBody>
      </Card>
    </Reveal>
  );
}
