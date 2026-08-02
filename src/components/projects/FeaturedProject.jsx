import { ArrowUpRight, Check, Github, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";

/** Hero treatment for the strongest project: big preview + full breakdown. */
export function FeaturedProject({ project }) {
  if (!project) return null;

  return (
    <Reveal direction="up">
      <Card glow className="group overflow-hidden">
        <div className="grid lg:grid-cols-2">
          {/* Preview */}
          <div className="relative order-1 overflow-hidden border-b border-line lg:order-2 lg:border-b-0 lg:border-l">
            <div
              aria-hidden="true"
              className="dot-grid absolute inset-0 opacity-60"
            />
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/25 blur-3xl"
            />

            <div className="relative flex h-full items-center p-6 sm:p-8">
              <div className="w-full overflow-hidden rounded-xl border border-line shadow-lift">
                <img
                  src={project.image}
                  alt={`${project.title} interface preview`}
                  loading="lazy"
                  decoding="async"
                  className="w-full object-cover transition-transform duration-[900ms] ease-smooth group-hover:scale-[1.05]"
                />
              </div>
            </div>
          </div>

          {/* Detail */}
          <div className="order-2 flex flex-col gap-5 p-6 sm:p-8 lg:order-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary" size="md" className="gap-1.5">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                Featured project
              </Badge>
              <Badge mono>{project.category}</Badge>
              {project.year ? <Badge mono>{project.year}</Badge> : null}
            </div>

            <div>
              <h3 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                {project.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {project.description}
              </p>
            </div>

            {project.highlights?.length ? (
              <ul className="grid gap-2 sm:grid-cols-2">
                {project.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-xs leading-relaxed text-ink-muted"
                  >
                    <Check
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}

            <div>
              <p className="mb-2 text-2xs font-semibold uppercase tracking-[0.18em] text-ink-subtle">
                Tech stack
              </p>
              <ul className="flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <li key={tech}>
                    <Badge mono>{tech}</Badge>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto flex flex-wrap gap-3 pt-1">
              {project.demo ? (
                <Button href={project.demo} size="md">
                  Visit live site
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-300 ease-smooth group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Button>
              ) : null}
              {project.repo ? (
                <Button href={project.repo} variant="outline" size="md">
                  <Github className="h-4 w-4" aria-hidden="true" />
                  Source code
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </Card>
    </Reveal>
  );
}
