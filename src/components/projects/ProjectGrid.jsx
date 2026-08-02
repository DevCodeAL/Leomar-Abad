import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCard } from "./ProjectCard";

const SPAN = {
  1: "lg:col-span-1",
  2: "lg:col-span-2",
  3: "lg:col-span-3",
};

/** Bento grid — varying column spans keep the rhythm from feeling like a table. */
export function ProjectGrid({ projects }) {
  if (projects.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-line py-14 text-center text-sm text-ink-subtle">
        No projects in this category yet.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => {
        const span = project.span ?? 1;
        return (
          <Reveal
            key={project.slug}
            direction="up"
            delay={Math.min(index, 4) * 80}
            className={cn(
              "h-full",
              SPAN[span] ?? SPAN[1],
              span >= 2 && "sm:col-span-2",
            )}
          >
            <ProjectCard project={project} wide={span >= 2} />
          </Reveal>
        );
      })}
    </div>
  );
}
