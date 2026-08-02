import { useCallback, useEffect, useState } from "react";

const KEY = "portfolio-sidebar";

/**
 * Collapsed state lives on <html data-sidebar> because the sidebar width is a
 * CSS variable that the main column also reads — one attribute drives both.
 */
export function useSidebarCollapse() {
  const [collapsed, setCollapsed] = useState(
    () =>
      typeof document !== "undefined" &&
      document.documentElement.getAttribute("data-sidebar") === "collapsed",
  );

  useEffect(() => {
    const root = document.documentElement;
    if (collapsed) {
      root.setAttribute("data-sidebar", "collapsed");
    } else {
      root.removeAttribute("data-sidebar");
    }
    try {
      localStorage.setItem(KEY, collapsed ? "collapsed" : "expanded");
    } catch {
      /* storage unavailable */
    }
  }, [collapsed]);

  const toggle = useCallback(() => setCollapsed((value) => !value), []);

  return { collapsed, toggle };
}
