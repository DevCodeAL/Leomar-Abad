import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const INTERVAL = 3200;

/**
 * Cycles the job titles from the original hero, rendered inside JSX-style
 * angle brackets. Holds on the first title when motion is reduced.
 */
export function RoleRotator({ roles, className }) {
  const prefersReduced = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (prefersReduced || roles.length < 2) return undefined;

    const timer = window.setInterval(
      () => setIndex((value) => (value + 1) % roles.length),
      INTERVAL,
    );
    return () => window.clearInterval(timer);
  }, [prefersReduced, roles.length]);

  return (
    <span
      className={cn("inline-flex flex-wrap items-baseline font-mono", className)}
    >
      <span className="text-ink-subtle" aria-hidden="true">
        &lt;
      </span>
      <span
        key={index}
        className="animate-fade-up text-gradient"
        aria-live="polite"
      >
        {roles[index]}
      </span>
      <span className="text-ink-subtle" aria-hidden="true">
        /&gt;
      </span>
      <span
        aria-hidden="true"
        className="ml-1 inline-block h-[0.85em] w-[2px] animate-caret-blink self-center bg-primary"
      />
    </span>
  );
}
