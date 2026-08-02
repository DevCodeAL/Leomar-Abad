import { useContext } from "react";
import { ThemeContext } from "./theme-context";

/** Access to the active theme, palette and their setters. */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside a <ThemeProvider>");
  }
  return context;
}
