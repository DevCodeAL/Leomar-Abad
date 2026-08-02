import { useEffect, useState } from "react";

/**
 * Scroll-spy for the sidebar.
 *
 * One IntersectionObserver watches every section instead of the old approach
 * of one observer per section fighting over a shared setState. The section
 * closest to the top of the viewport wins, which keeps the indicator stable
 * when two sections are on screen at once.
 */
export function useActiveSection(ids, { rootMargin = "-45% 0px -50% 0px" } = {}) {
  const [activeId, setActiveId] = useState(ids[0] ?? "");

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (elements.length === 0) return undefined;

    const visible = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry.boundingClientRect.top);
          } else {
            visible.delete(entry.target.id);
          }
        });

        if (visible.size === 0) return;

        const [topMost] = [...visible.entries()].sort(
          (a, b) => Math.abs(a[1]) - Math.abs(b[1]),
        );
        setActiveId(topMost[0]);
      },
      { rootMargin, threshold: 0 },
    );

    elements.forEach((element) => observer.observe(element));

    // Landing at the very top should always highlight the first section.
    const onScroll = () => {
      if (window.scrollY < 80) setActiveId(ids[0]);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [ids, rootMargin]);

  return activeId;
}
