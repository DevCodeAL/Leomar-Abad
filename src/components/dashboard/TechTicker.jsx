import { skillTicker } from "@/data/skills";

/**
 * Continuous logo marquee. The list is duplicated once and translated -50%,
 * which loops seamlessly with a single compositor-only transform.
 * Pauses on hover, and the reduced-motion rule in index.css stops it dead.
 */
export function TechTicker() {
  return (
    <section aria-label="Technologies I work with" className="pt-6">
      <div className="edge-fade relative overflow-hidden rounded-2xl border border-line bg-surface/60 py-4">
        <ul
          className="flex w-max animate-marquee items-center gap-10 pr-10 hover:[animation-play-state:paused]"
          style={{ "--marquee-duration": "52s" }}
        >
          {[...skillTicker, ...skillTicker].map(({ name, Icon }, index) => (
            <li
              key={`${name}-${index}`}
              className="flex shrink-0 items-center gap-2.5 text-ink-subtle transition-colors duration-300 hover:text-primary"
              aria-hidden={index >= skillTicker.length ? "true" : undefined}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span className="whitespace-nowrap font-mono text-xs">{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
