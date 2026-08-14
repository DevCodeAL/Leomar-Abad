import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Route changes need two different scroll behaviours.
 *
 * Arriving at `/#skills` from another route, the target section does not exist
 * until the dashboard has rendered, so the browser's own fragment handling has
 * already given up by then — one frame later it does exist and we scroll to it.
 * A plain route change with no hash starts at the top, the way a new page
 * should.
 */
export function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "auto" });
      return undefined;
    }

    const frame = window.requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
}
