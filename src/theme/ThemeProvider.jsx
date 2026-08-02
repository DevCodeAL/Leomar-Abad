import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_PALETTE, DEFAULT_THEME, paletteIds } from "./palettes";
import { ThemeContext } from "./theme-context";

const THEME_KEY = "portfolio-theme";
const PALETTE_KEY = "portfolio-palette";

/** Reads whatever the inline boot script in index.html already applied. */
function readInitial(attribute, fallback, allowed) {
  if (typeof document === "undefined") return fallback;
  const value = document.documentElement.getAttribute(attribute);
  return allowed.includes(value) ? value : fallback;
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() =>
    readInitial("data-theme", DEFAULT_THEME, ["dark", "light"]),
  );
  const [palette, setPaletteState] = useState(() =>
    readInitial("data-palette", DEFAULT_PALETTE, paletteIds),
  );
  const transitionTimer = useRef(null);

  /**
   * Colour tokens change on <html>, so a blanket transition class is added for
   * the duration of the swap and removed again. Keeping it temporary avoids
   * paying transition cost on every unrelated hover.
   */
  const animateSwap = useCallback(() => {
    const root = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    root.classList.add("theme-transition");
    window.clearTimeout(transitionTimer.current);
    transitionTimer.current = window.setTimeout(
      () => root.classList.remove("theme-transition"),
      320,
    );
  }, []);

  useEffect(() => () => window.clearTimeout(transitionTimer.current), []);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.setAttribute("data-palette", palette);

    // Keep the browser chrome (mobile address bar) in sync with the canvas.
    const meta = document.querySelector('meta[name="theme-color"]');
    const canvas = getComputedStyle(root).getPropertyValue("--canvas").trim();
    if (meta && canvas) meta.setAttribute("content", `hsl(${canvas})`);

    try {
      localStorage.setItem(THEME_KEY, theme);
      localStorage.setItem(PALETTE_KEY, palette);
    } catch {
      /* storage unavailable — the choice simply won't persist */
    }
  }, [theme, palette]);

  const setTheme = useCallback(
    (next) => {
      animateSwap();
      setThemeState(next);
    },
    [animateSwap],
  );

  const setPalette = useCallback(
    (next) => {
      animateSwap();
      setPaletteState(next);
    },
    [animateSwap],
  );

  const toggleTheme = useCallback(
    () => setTheme(theme === "dark" ? "light" : "dark"),
    [setTheme, theme],
  );

  const value = useMemo(
    () => ({ theme, palette, setTheme, setPalette, toggleTheme }),
    [theme, palette, setTheme, setPalette, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
