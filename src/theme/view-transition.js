const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/** ~matches the longest keyframe in index.css, plus a small safety margin. */
const FALLBACK_MS = 340;

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia(REDUCED_MOTION).matches
  );
}

export function supportsViewTransitions() {
  return (
    typeof document !== "undefined" &&
    typeof document.startViewTransition === "function"
  );
}

/**
 * The centre of the control that triggered the swap, in viewport coordinates.
 * Deliberately uses the element box rather than `event.clientX/Y` — keyboard
 * activation reports (0, 0), which would ripple from the top-left corner.
 */
export function originFromEvent(event) {
  const node = event?.currentTarget;
  if (!node?.getBoundingClientRect) return null;
  const rect = node.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

/** Distance from the origin to the furthest viewport corner. */
function coverRadius({ x, y }) {
  return Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );
}

let fallbackTimer;
/** Identifies the newest swap, so a superseded one cannot clean up after it. */
let swapToken = 0;

/**
 * Runs `commit` (a synchronous DOM mutation) inside an animated transition.
 *
 * Three tiers, in order of preference:
 *   1. reduced motion  → commit immediately, no animation at all
 *   2. View Transitions → true cross-fade of the rendered frame, so gradients,
 *      masks, images and shadows all interpolate — things a CSS `transition`
 *      on colour properties can never touch. `kind: "theme"` additionally
 *      clips the new frame to a circle growing from `origin`.
 *   3. fallback → blanket colour transition class on <html>
 *
 * `commit` must mutate the DOM synchronously; React state set inside it is
 * fine as long as the attribute write happens there too.
 */
export function runThemeTransition(commit, { kind = "theme", origin } = {}) {
  const root = document.documentElement;

  if (prefersReducedMotion()) {
    commit();
    return;
  }

  if (!supportsViewTransitions()) {
    root.classList.add("theme-transition");
    // Force a style recalculation so the browser records the *current* colours
    // with the transition already declared. Without this the class and the new
    // token values land in the same recalc and no transition is generated.
    void root.offsetWidth;

    commit();

    window.clearTimeout(fallbackTimer);
    fallbackTimer = window.setTimeout(() => {
      root.classList.remove("theme-transition");
    }, FALLBACK_MS);
    return;
  }

  const point = origin ?? {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  };

  const token = ++swapToken;
  root.dataset.vt = kind;
  root.style.setProperty("--vt-x", `${point.x}px`);
  root.style.setProperty("--vt-y", `${point.y}px`);
  root.style.setProperty("--vt-r", `${coverRadius(point)}px`);

  const transition = document.startViewTransition(commit);

  // Starting a second transition skips the first, whose `finished` then
  // settles late — without the token it would strip the styling out from
  // under the swap that replaced it.
  transition.finished
    .catch(() => {})
    .then(() => {
      if (token !== swapToken) return;
      delete root.dataset.vt;
      root.style.removeProperty("--vt-x");
      root.style.removeProperty("--vt-y");
      root.style.removeProperty("--vt-r");
    });
}
