import { useEffect, useRef, useState } from "react";
import { stats } from "@/data/stats";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Counts up to `value` once the tile scrolls into view.
 * Snaps straight to the final number when motion is reduced.
 */
function useCountUp(value, { duration = 1100 } = {}) {
  const ref = useRef(null);
  const prefersReduced = useReducedMotion();
  const [display, setDisplay] = useState(prefersReduced ? value : 0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (prefersReduced) {
      setDisplay(value);
      return undefined;
    }

    let frame = 0;
    let start = 0;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // easeOutCubic — fast off the mark, gentle landing
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = window.requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        frame = window.requestAnimationFrame(step);
        observer.disconnect();
      },
      { threshold: 0.4 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [value, duration, prefersReduced]);

  return { ref, display };
}

export function Stats() {
  return (
    <section aria-label="Portfolio at a glance" className="pt-4">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Reveal key={stat.label} delay={index * 80} direction="up">
            <StatCard {...stat} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function StatCard({ label, value, caption, icon: Icon }) {
  const { ref, display } = useCountUp(value);

  return (
    <Card interactive className="group h-full">
      <div className="relative p-4 sm:p-5">
        <div className="mb-3 flex items-start justify-between gap-2">
          <p className="text-2xs font-semibold uppercase tracking-[0.16em] text-ink-subtle">
            {label}
          </p>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-elevated text-ink-subtle transition-colors duration-300 group-hover:border-primary/40 group-hover:text-primary">
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </div>

        <p
          ref={ref}
          className="font-mono text-3xl font-bold tracking-tight text-ink tabular-nums sm:text-4xl"
        >
          {display}
          <span className="text-primary">+</span>
        </p>

        <p className="mt-1 text-xs text-ink-subtle">{caption}</p>

        {/* Bottom accent that fills on hover */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-primary to-transparent transition-transform duration-500 ease-smooth group-hover:scale-x-100"
        />
      </div>
    </Card>
  );
}
