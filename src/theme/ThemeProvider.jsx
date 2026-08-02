import { useCallback, useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { DEFAULT_PALETTE, DEFAULT_THEME, paletteIds } from "./palettes";
import { ThemeContext } from "./theme-context";
import { runThemeTransition } from "./view-transition";

const THEME_KEY = "portfolio-theme";
const PALETTE_KEY = "portfolio-palette";

/** Reads whatever the inline boot script in index.html already applied. */
function readInitial(attribute, fallback, allowed) {
  if (typeof document === "undefined") return fallback;
  const value = document.documentElement.getAttribute(attribute);
  return allowed.includes(value) ? value : fallback;
}

/**
 * Writes the tokens to <html>. Called synchronously inside the transition
 * commit so the browser captures the old and new frames around one mutation,
 * and again from the effect below — it is idempotent by design.
 */
function applyDom(theme, palette) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.setAttribute("data-palette", palette);

  // Keep the browser chrome (mobile address bar) in sync with the canvas.
  const meta = document.querySelector('meta[name="theme-color"]');
  const canvas = getComputedStyle(root).getPropertyValue("--canvas").trim();
  if (meta && canvas) meta.setAttribute("content", `hsl(${canvas})`);
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() =>
    readInitial("data-theme", DEFAULT_THEME, ["dark", "light"]),
  );
  const [palette, setPaletteState] = useState(() =>
    readInitial("data-palette", DEFAULT_PALETTE, paletteIds),
  );

  /**
   * Commits both the React state and the DOM attributes in one synchronous
   * block, wrapped in whatever animation the browser supports. `flushSync`
   * matters here: components that branch on `theme` (the toggle pill, the
   * palette swatches) must be painted before the browser snapshots the new
   * frame, otherwise they pop a frame after everything else settles.
   */
  const commit = useCallback((nextTheme, nextPalette, kind, origin) => {
    runThemeTransition(
      () => {
        flushSync(() => {
          setThemeState(nextTheme);
          setPaletteState(nextPalette);
        });
        applyDom(nextTheme, nextPalette);
      },
      { kind, origin },
    );
  }, []);

  // Persistence, plus the initial mount write.
  useEffect(() => {
    applyDom(theme, palette);
    try {
      localStorage.setItem(THEME_KEY, theme);
      localStorage.setItem(PALETTE_KEY, palette);
    } catch {
      /* storage unavailable — the choice simply won't persist */
    }
  }, [theme, palette]);

  const setTheme = useCallback(
    (next, origin) => {
      if (next === theme) return;
      commit(next, palette, "theme", origin);
    },
    [commit, palette, theme],
  );

  const setPalette = useCallback(
    (next, origin) => {
      if (next === palette) return;
      commit(theme, next, "palette", origin);
    },
    [commit, palette, theme],
  );

  const toggleTheme = useCallback(
    (origin) => setTheme(theme === "dark" ? "light" : "dark", origin),
    [setTheme, theme],
  );

  const value = useMemo(
    () => ({ theme, palette, setTheme, setPalette, toggleTheme }),
    [theme, palette, setTheme, setPalette, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
