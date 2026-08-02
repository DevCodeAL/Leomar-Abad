import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/Tooltip";
import { palettes } from "./palettes";
import { useTheme } from "./useTheme";
import { originFromEvent } from "./view-transition";

/**
 * Circular swatch picker. Each dot previews the palette's accent for the
 * theme that is currently active, so the row reads correctly in both modes.
 */
export function PaletteSelector({ className, tooltipSide = "top" }) {
  const { palette, setPalette, theme } = useTheme();
  const active = palettes.find((item) => item.id === palette);

  return (
    <div className={cn("space-y-2.5", className)}>
      <div
        role="radiogroup"
        aria-label="Colour palette"
        className="flex items-center gap-2"
      >
        {palettes.map((item) => {
          const selected = item.id === palette;
          return (
            <Tooltip key={item.id} label={item.name} side={tooltipSide}>
              <button
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={`${item.name} palette — ${item.description}`}
                onClick={(event) => setPalette(item.id, originFromEvent(event))}
                className={cn(
                  "relative flex h-7 w-7 items-center justify-center rounded-full",
                  "ring-offset-2 ring-offset-canvas transition-[transform,box-shadow] duration-200 ease-smooth",
                  "hover:scale-110",
                  selected ? "ring-2 ring-primary" : "ring-1 ring-line-strong",
                )}
                style={{ backgroundColor: item.swatch[theme] }}
              >
                {selected ? (
                  <Check
                    className="h-3.5 w-3.5 animate-scale-in text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]"
                    strokeWidth={3.5}
                    aria-hidden="true"
                  />
                ) : null}
              </button>
            </Tooltip>
          );
        })}
      </div>

      <p className="font-mono text-[0.6875rem] text-ink-subtle">
        {active?.name} · {active?.description}
      </p>
    </div>
  );
}
