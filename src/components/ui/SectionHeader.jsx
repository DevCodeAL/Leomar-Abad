import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

/**
 * Consistent section masthead: monospace index + eyebrow, display heading,
 * optional description and a right-hand slot for actions.
 */
export function SectionHeader({
  index,
  eyebrow,
  title,
  description,
  action,
  className,
}) {
  return (
    <Reveal
      className={cn(
        "mb-8 flex flex-col gap-5 sm:mb-10 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className="max-w-2xl">
        <div className="mb-3 flex items-center gap-3">
          {index ? (
            <span className="font-mono text-xs text-primary">{index}</span>
          ) : null}
          <span className="h-px w-8 bg-gradient-to-r from-primary to-transparent" />
          <span className="text-2xs font-semibold uppercase tracking-[0.22em] text-ink-subtle">
            {eyebrow}
          </span>
        </div>

        <h2 className="text-balance text-3xl font-bold tracking-tight text-ink sm:text-[2.5rem] sm:leading-[1.1]">
          {title}
        </h2>

        {description ? (
          <p className="mt-3 max-w-xl text-pretty text-sm leading-relaxed text-ink-muted sm:text-base">
            {description}
          </p>
        ) : null}
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </Reveal>
  );
}

/** Wrapper that gives every section its anchor, rhythm and scroll offset. */
export function Section({ id, className, children, ...props }) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-24 py-14 sm:py-20", className)}
      {...props}
    >
      {children}
    </section>
  );
}
