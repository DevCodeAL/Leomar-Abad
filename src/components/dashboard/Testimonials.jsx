import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/SectionHeader";

/**
 * A 3D spotlight deck rather than a flat slider. The active recommendation is
 * held centre-stage at full scale while its neighbours rotate back into space,
 * fade and blur toward the edges — cards fanned on a table.
 *
 * Arrows, dots, side-card clicks, keyboard (←/→), touch swipe and autoplay all
 * drive the same `active` index, so there is one source of truth for position.
 */
const AUTOPLAY_MS = 5200;
const SWIPE_THRESHOLD_PX = 44;

/** Cards further out than this are fully transparent, so they skip painting. */
const VISIBLE_DEPTH = 2;

export function Testimonials() {
  const count = testimonials.length;
  const [active, setActive] = useState(0);
  const touchStartX = useRef(null);
  const stillMotion = usePrefersReducedMotion();

  /* Three independent reasons to hold the deck still. They are tracked
     separately because one shared boolean lets them clobber each other —
     blurring a dot while the cursor is still on the deck would resume it. */
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const paused = hovered || focused || tabHidden;

  const go = useCallback(
    (direction) => setActive((prev) => (prev + direction + count) % count),
    [count],
  );

  const jumpTo = useCallback(
    (index) => setActive(((index % count) + count) % count),
    [count],
  );

  /* Autoplay. Held while hovered/focused, and skipped entirely when the reader
     asked for less motion — index.css zeroes the transitions, but an interval
     would otherwise keep teleporting the deck underneath them. */
  useEffect(() => {
    if (paused || stillMotion || count <= 1) return undefined;
    const id = window.setInterval(() => go(1), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, stillMotion, go, count]);

  /* A backgrounded tab should not burn through the deck unseen. */
  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  /* Arrow keys are bound to the region, not the window: on a page this long,
     hijacking them globally would break ordinary keyboard scrolling. */
  const onKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(1);
    }
  };

  /* Shortest signed distance around the ring, so the last card sits to the
     LEFT of the first instead of looping the long way round. */
  const offsetOf = (index) => {
    let distance = index - active;
    if (distance > count / 2) distance -= count;
    if (distance < -count / 2) distance += count;
    return distance;
  };

  return (
    <Section id="testimonials">
      <SectionHeader
        index="06"
        eyebrow="Testimonials"
        title="What clients, mentors and teammates say"
        description="Feedback from the people I've built systems with and for."
      />

      <Reveal direction="none">
        <div
          role="region"
          tabIndex={0}
          aria-roledescription="carousel"
          aria-label="Recommendations"
          className="relative select-none rounded-3xl outline-none ring-offset-4 ring-offset-canvas focus-visible:ring-2"
          onKeyDown={onKeyDown}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocusCapture={() => setFocused(true)}
          onBlurCapture={() => setFocused(false)}
          onTouchStart={(event) => {
            touchStartX.current = event.touches[0].clientX;
          }}
          onTouchEnd={(event) => {
            if (touchStartX.current == null) return;
            const dx = event.changedTouches[0].clientX - touchStartX.current;
            if (Math.abs(dx) > SWIPE_THRESHOLD_PX) go(dx < 0 ? 1 : -1);
            touchStartX.current = null;
          }}
        >
          {/* Stage */}
          <div
            className="relative mx-auto h-[30rem] w-full max-w-3xl sm:h-[27rem]"
            style={{ perspective: "1800px" }}
          >
            <div
              className="absolute inset-0"
              style={{ transformStyle: "preserve-3d" }}
            >
              {testimonials.map((person, index) => {
                const offset = offsetOf(index);
                const depth = Math.abs(offset);
                const isActive = depth === 0;
                const isVisible = depth <= VISIBLE_DEPTH;

                return (
                  <article
                    key={person.name}
                    aria-hidden={!isActive}
                    onClick={() => {
                      if (!isActive && isVisible) jumpTo(index);
                    }}
                    className="absolute left-1/2 top-1/2 w-[88vw] max-w-[26rem]"
                    style={{
                      transform: `translate(-50%, -50%) translateX(${offset * 54}%) translateZ(${-depth * 160}px) rotateY(${offset * -34}deg) scale(${isActive ? 1 : 0.92})`,
                      opacity: !isVisible ? 0 : isActive ? 1 : depth === 1 ? 0.5 : 0.15,
                      filter: isActive ? "none" : `blur(${depth * 1.6}px)`,
                      zIndex: 40 - depth,
                      pointerEvents: isVisible ? "auto" : "none",
                      cursor: isActive ? "default" : "pointer",
                      transformStyle: "preserve-3d",
                      transition:
                        "transform 650ms cubic-bezier(0.22,1,0.36,1), opacity 650ms ease, filter 650ms ease",
                    }}
                  >
                    <Slide person={person} active={isActive} />
                  </article>
                );
              })}
            </div>

            {/* Edge masks reinforce the fade into the page on both sides. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 z-[45] w-12 bg-gradient-to-r from-canvas to-transparent sm:w-24"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 z-[45] w-12 bg-gradient-to-l from-canvas to-transparent sm:w-24"
            />
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center justify-center gap-5">
            <DeckButton label="Previous recommendation" onClick={() => go(-1)}>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </DeckButton>

            <div className="flex items-center gap-2">
              {testimonials.map((person, index) => {
                const isActive = index === active;
                return (
                  <button
                    key={person.name}
                    type="button"
                    onClick={() => jumpTo(index)}
                    aria-label={`Show recommendation from ${person.name}`}
                    aria-current={isActive}
                    className="h-2.5 rounded-full transition-[width,background-color] duration-500 ease-smooth"
                    style={{
                      width: isActive ? "1.875rem" : "0.625rem",
                      backgroundColor: isActive
                        ? "hsl(var(--primary))"
                        : "hsl(var(--line-strong))",
                    }}
                  />
                );
              })}
            </div>

            <DeckButton label="Next recommendation" onClick={() => go(1)}>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </DeckButton>
          </div>

          <p className="sr-only" aria-live="polite">
            Recommendation {active + 1} of {count}
          </p>
        </div>
      </Reveal>
    </Section>
  );
}

function DeckButton({ label, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-ink shadow-soft transition-[transform,border-color,color] duration-300 ease-smooth hover:-translate-y-0.5 hover:border-primary hover:text-primary"
    >
      {children}
    </button>
  );
}

/** One card. `active` drives the accents that light up only centre-stage. */
function Slide({ person, active }) {
  return (
    <div className="panel relative flex h-[27rem] flex-col overflow-hidden p-6 shadow-lift sm:h-[24rem] sm:p-7">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/25 blur-3xl transition-opacity duration-700 ease-smooth"
        style={{ opacity: active ? 1 : 0 }}
      />

      <Quote
        className="absolute right-6 top-6 h-9 w-9 rotate-180 text-primary/10"
        aria-hidden="true"
      />

      <figure className="relative flex h-full flex-col">
        <figcaption className="flex items-center gap-4">
          <span className="relative h-16 w-16 shrink-0 rounded-2xl bg-gradient-to-br from-primary to-transparent p-[2px]">
            <img
              src={person.photo}
              alt=""
              loading="lazy"
              decoding="async"
              width="64"
              height="64"
              className="h-full w-full rounded-[calc(var(--radius)+4px)] object-cover"
            />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-base font-semibold text-ink">
              {person.name}
            </span>
            <span className="block truncate text-xs text-ink-subtle">
              {person.position}
            </span>
            <Rating value={person.rating} />
          </span>
        </figcaption>

        <blockquote className="mt-6 flex-1 text-[0.9375rem] leading-relaxed text-ink-muted">
          &ldquo;{person.quote}&rdquo;
        </blockquote>

        <span
          aria-hidden="true"
          className="mt-4 h-1 rounded-full bg-primary transition-[width,opacity] duration-700 ease-smooth"
          style={{ width: active ? "3.5rem" : "1.5rem", opacity: active ? 1 : 0.4 }}
        />
      </figure>
    </div>
  );
}

/**
 * Filled stars out of five. Renders nothing without a `rating`, so a card can
 * carry a quote with no score attached rather than an implied one.
 */
function Rating({ value, total = 5 }) {
  if (!value) return null;

  return (
    <span
      role="img"
      aria-label={`Rated ${value} out of ${total}`}
      className="mt-1.5 flex gap-0.5"
    >
      {Array.from({ length: total }, (_, index) => (
        <Star
          key={index}
          className={
            index < value
              ? "h-3.5 w-3.5 fill-current text-amber-400"
              : "h-3.5 w-3.5 text-line-strong"
          }
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

/** Live `prefers-reduced-motion`, so a mid-session preference change lands. */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (event) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
