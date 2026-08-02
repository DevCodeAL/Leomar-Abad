import { useParallax } from "@/hooks/useParallax";

/**
 * Fixed decorative backdrop: hairline grid, two palette-tinted gradient blobs
 * and a vignette. Everything is a static CSS layer — the only moving part is a
 * transform driven by one shared scroll listener, and it flattens to nothing
 * under prefers-reduced-motion.
 */
export function AmbientBackground() {
  const slowLayer = useParallax(0.06);
  const fastLayer = useParallax(-0.04);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Base wash */}
      <div className="absolute inset-0 bg-canvas" />
      <div className="absolute inset-0 bg-gradient-to-b from-canvas-deep/80 via-canvas to-canvas-deep/60" />

      {/* Hairline grid, faded out towards the bottom */}
      <div className="grid-lines absolute inset-0 opacity-[0.55] [mask-image:radial-gradient(120%_80%_at_50%_0%,#000_20%,transparent_75%)]" />

      {/* Palette-tinted ambience */}
      <div
        ref={slowLayer}
        className="absolute -left-40 -top-32 h-[36rem] w-[36rem] rounded-full bg-primary/[0.13] blur-[110px] will-change-transform"
        style={{ transform: "translate3d(0, var(--parallax, 0px), 0)" }}
      />
      <div
        ref={fastLayer}
        className="absolute -right-48 top-1/3 h-[32rem] w-[32rem] rounded-full bg-accent/[0.10] blur-[120px] will-change-transform"
        style={{ transform: "translate3d(0, var(--parallax, 0px), 0)" }}
      />

      {/* Vignette keeps text legible over the blobs */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,transparent_35%,hsl(var(--canvas-deep)/0.55)_100%)]" />
    </div>
  );
}
