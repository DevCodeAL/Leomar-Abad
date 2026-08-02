import { cn } from "@/lib/utils";

/**
 * The one surface primitive every panel in the dashboard is built from.
 *
 * `glow` adds a palette-tinted radial wash in the top-right corner, which is
 * how the interface stays visually tied to the active palette without any
 * component knowing what colour that palette actually is.
 */
export function Card({
  as: Component = "div",
  interactive = false,
  glow = false,
  className,
  children,
  ...props
}) {
  return (
    <Component
      className={cn(
        "panel overflow-hidden shadow-soft",
        interactive && "panel-hover",
        className,
      )}
      {...props}
    >
      {glow ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-primary/20 blur-3xl"
        />
      ) : null}
      {children}
    </Component>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3
      className={cn(
        "text-2xs font-semibold uppercase tracking-[0.18em] text-ink-subtle",
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardBody({ className, children, ...props }) {
  return (
    <div className={cn("relative px-5 py-5 sm:px-6 sm:py-6", className)} {...props}>
      {children}
    </div>
  );
}
