import { useEffect, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Writes the page scroll offset into a CSS variable on a single element, so
 * decorative layers can be shifted in pure CSS (`translate3d(0, var(--parallax) ...)`).
 *
 * One rAF-throttled passive listener for the whole page — no per-element
 * observers, no layout reads inside the scroll handler.
 */
export function useParallax(speed = 0.12) {
  const ref = useRef(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReduced) {
      node?.style.setProperty("--parallax", "0px");
      return undefined;
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      node.style.setProperty("--parallax", `${window.scrollY * speed}px`);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [speed, prefersReduced]);

  return ref;
}
