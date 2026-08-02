import { cn } from "@/lib/utils";

/**
 * CSS-only tooltip. The trigger owns the group, so there is no state, no
 * portal and no positioning library — enough for icon rails and social links.
 */
export function Tooltip({ label, side = "right", className, children }) {
  const position =
    side === "right"
      ? "left-full top-1/2 ml-3 -translate-y-1/2 group-hover:translate-x-0 -translate-x-1"
      : "bottom-full left-1/2 mb-2 -translate-x-1/2 group-hover:translate-y-0 translate-y-1";

  return (
    <span className={cn("group/tip relative inline-flex", className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-50 whitespace-nowrap rounded-md border border-line bg-elevated px-2.5 py-1.5",
          "text-xs font-medium text-ink shadow-lift",
          "opacity-0 transition-[opacity,transform] duration-200 ease-smooth",
          "group-hover/tip:opacity-100 group-focus-within/tip:opacity-100",
          position,
        )}
      >
        {label}
      </span>
    </span>
  );
}
