import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { experience } from "@/data/experience";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/SectionHeader";

export function Experience() {
  return (
    <Section id="experience">
      <SectionHeader
        index="02"
        eyebrow="Experience"
        title="Where I've built and shipped"
        description="Client work, academic projects and training — the path so far."
      />

      <ol className="relative space-y-4">
        {/* Spine */}
        <span
          aria-hidden="true"
          className="absolute bottom-6 left-[1.1875rem] top-6 w-px bg-gradient-to-b from-primary/60 via-line-strong to-transparent sm:left-[1.4375rem]"
        />

        {experience.map((entry, index) => (
          <TimelineItem
            key={entry.id}
            entry={entry}
            delay={index * 90}
            defaultOpen={index === 0}
          />
        ))}
      </ol>
    </Section>
  );
}

function TimelineItem({ entry, delay, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const { icon: Icon, role, org, period, kind, summary, details, tech } = entry;
  const panelId = `timeline-panel-${entry.id}`;

  return (
    <Reveal as="li" direction="up" delay={delay} className="relative pl-12 sm:pl-16">
      {/* Node */}
      <span className="absolute left-0 top-4 flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface text-primary shadow-soft sm:h-12 sm:w-12">
        <Icon className="h-4 w-4 sm:h-[1.15rem] sm:w-[1.15rem]" aria-hidden="true" />
      </span>

      <Card interactive className="group">
        <div className="p-4 sm:p-5">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant="primary" mono>
              {period}
            </Badge>
            <Badge>{kind}</Badge>
          </div>

          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-base font-bold tracking-tight text-ink sm:text-lg">
                {role}
              </h3>
              <p className="mt-0.5 text-sm text-primary">{org}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {summary}
              </p>
            </div>

            {details.length > 0 ? (
              <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
                aria-controls={panelId}
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line",
                  "text-ink-subtle transition-colors duration-200",
                  "hover:border-primary/40 hover:bg-primary/10 hover:text-primary",
                )}
              >
                <span className="sr-only">
                  {open ? "Hide details" : "Show details"} for {role}
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-300 ease-smooth",
                    open && "rotate-180",
                  )}
                  aria-hidden="true"
                />
              </button>
            ) : null}
          </div>

          {/* Grid-rows trick: animates height without measuring anything */}
          <div
            id={panelId}
            className={cn(
              "grid transition-[grid-template-rows,opacity] duration-300 ease-smooth",
              open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
            )}
          >
            <div className="overflow-hidden">
              <ul className="mt-4 space-y-2 border-t border-line pt-4">
                {details.map((detail) => (
                  <li
                    key={detail}
                    className="flex gap-2.5 text-sm leading-relaxed text-ink-muted"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[0.5rem] h-1 w-1 shrink-0 rounded-full bg-primary"
                    />
                    {detail}
                  </li>
                ))}
              </ul>

              {tech.length > 0 ? (
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {tech.map((item) => (
                    <li key={item}>
                      <Badge mono>{item}</Badge>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </div>
      </Card>
    </Reveal>
  );
}
