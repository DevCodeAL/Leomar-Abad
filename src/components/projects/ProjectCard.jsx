import { ArrowUpRight, Github, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

/**
 * Bento tile. The whole card is a hover target: the preview zooms, a gradient
 * wash rises over it and the title arrow slides — all transform/opacity only.
 */
export function ProjectCard({ project, wide = false }) {
  const primaryHref = project.demo ?? project.repo;

  return (
    <Card interactive className="group flex h-full flex-col">
      {/* Preview */}
      <div className="relative overflow-hidden border-b border-line bg-elevated">
        <div
          className={cn(
            "relative overflow-hidden",
            wide ? "aspect-[16/8]" : "aspect-[16/10]",
          )}
        >
          <img
            src={project.image}
            alt={`${project.title} preview`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-top transition-transform duration-700 ease-smooth group-hover:scale-[1.07]"
          />

          {/* Rising wash */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-canvas-deep/85 via-canvas-deep/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-95"
          />

          <div className="absolute left-3 top-3">
            <Badge
              mono
              className="border-line-strong bg-canvas-deep/70 text-ink backdrop-blur-sm"
            >
              {project.category}
            </Badge>
          </div>

          {/* Quick links */}
          <div className="absolute right-3 top-3 flex gap-1.5 opacity-0 transition-[opacity,transform] duration-300 ease-smooth translate-y-1 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
            {project.repo ? (
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${project.title} source code on GitHub`}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-line-strong bg-canvas-deep/80 text-ink backdrop-blur-sm transition-colors duration-200 hover:border-primary hover:text-primary"
              >
                <Github className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ) : null}
            {project.demo ? (
              <a
                href={project.demo}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`Open the ${project.title} live demo`}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary bg-primary text-primary-fg transition-transform duration-200 hover:scale-105"
              >
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ) : null}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-bold tracking-tight text-ink">
            {primaryHref ? (
              <a
                href={primaryHref}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 transition-colors duration-200 hover:text-primary focus-visible:text-primary"
              >
                {project.title}
                <ArrowUpRight
                  className="h-3.5 w-3.5 text-primary transition-transform duration-300 ease-smooth group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            ) : (
              project.title
            )}
          </h3>
        </div>

        <p className="text-xs leading-relaxed text-ink-muted sm:text-[0.8125rem]">
          {wide ? project.description : project.summary}
        </p>

        <ul className="mt-auto flex flex-wrap gap-1.5 pt-1">
          {project.technologies.map((tech) => (
            <li key={tech}>
              <Badge mono>{tech}</Badge>
            </li>
          ))}
        </ul>

        {!project.demo ? (
          <p className="flex items-center gap-1.5 font-mono text-[0.6875rem] text-ink-subtle">
            <Lock className="h-3 w-3" aria-hidden="true" />
            Source available — no public deployment
          </p>
        ) : null}
      </div>
    </Card>
  );
}
