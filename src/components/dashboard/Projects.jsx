import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  featuredProject,
  gridProjects,
  projectCategories,
  projects,
} from "@/data/projects";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/SectionHeader";
import { FeaturedProject } from "@/components/projects/FeaturedProject";
import { ProjectGrid } from "@/components/projects/ProjectGrid";

export function Projects() {
  const [category, setCategory] = useState("All");

  const visible = useMemo(
    () =>
      category === "All"
        ? gridProjects
        : gridProjects.filter((project) => project.category === category),
    [category],
  );

  return (
    <Section id="projects">
      <SectionHeader
        index="04"
        eyebrow="Projects"
        title="Things I've designed, built and shipped"
        description="Client systems, developer tools and personal products — each one solving a real problem."
        action={
          <span className="font-mono text-xs text-ink-subtle">
            {String(projects.length).padStart(2, "0")} projects
          </span>
        }
      />

      <div className="space-y-4">
        <FeaturedProject project={featuredProject} />

        <Reveal
          direction="none"
          className="flex flex-wrap gap-2 pt-2"
          role="group"
          aria-label="Filter projects by category"
        >
          {projectCategories.map((item) => {
            const active = item === category;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                aria-pressed={active}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-medium",
                  "transition-[color,background-color,border-color] duration-200",
                  active
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-line text-ink-muted hover:border-line-strong hover:text-ink",
                )}
              >
                {item}
              </button>
            );
          })}
        </Reveal>

        <ProjectGrid projects={visible} />
      </div>
    </Section>
  );
}
