import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "./useTheme";
import { originFromEvent } from "./view-transition";

const OPTIONS = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
];

/**
 * Segmented light/dark control. The sliding pill is a single translated
 * element rather than per-option backgrounds, so the swap animates smoothly.
 */
export function ThemeToggle({ className }) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className={cn(
        "relative grid grid-cols-2 gap-1 rounded-full border border-line bg-canvas-deep/60 p-1",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-y-1 left-1 w-[calc(50%-0.375rem)] rounded-full bg-elevated shadow-soft",
          "transition-transform duration-300 ease-smooth",
          theme === "dark" && "translate-x-[calc(100%+0.25rem)]",
        )}
      />
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={(event) => setTheme(value, originFromEvent(event))}
            className={cn(
              "relative z-10 flex h-8 items-center justify-center gap-1.5 rounded-full text-xs font-semibold",
              "transition-colors duration-200",
              active ? "text-primary" : "text-ink-subtle hover:text-ink",
            )}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {label}
          </button>
        );
      })}
    </div>
  );
}

/** Compact single-button variant for the mobile header and the icon rail. */
export function ThemeToggleIcon({ className }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={(event) => toggleTheme(originFromEvent(event))}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl",
        "border border-line bg-surface text-ink-muted",
        "transition-colors duration-200 hover:border-primary/40 hover:text-primary",
        className,
      )}
    >
      <Sun
        className={cn(
          "absolute h-4 w-4 transition-all duration-300 ease-smooth",
          isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100",
        )}
        aria-hidden="true"
      />
      <Moon
        className={cn(
          "absolute h-4 w-4 transition-all duration-300 ease-smooth",
          isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0",
        )}
        aria-hidden="true"
      />
    </button>
  );
}
