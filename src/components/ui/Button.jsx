import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const button = cva(
  [
    "group/btn relative inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "rounded-full font-semibold tracking-tight",
    "transition-[transform,background-color,border-color,color,box-shadow] duration-300 ease-smooth",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
    "disabled:pointer-events-none disabled:opacity-55",
    "active:scale-[0.98]",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-fg shadow-glow-sm hover:bg-primary-strong hover:shadow-glow",
        outline:
          "border border-line-strong bg-surface/60 text-ink hover:border-primary hover:text-primary hover:shadow-glow-sm",
        ghost: "text-ink-muted hover:bg-elevated hover:text-ink",
        subtle:
          "border border-line bg-elevated text-ink-muted hover:border-line-strong hover:text-ink",
      },
      size: {
        sm: "h-9 px-4 text-[0.8125rem]",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-[0.9375rem]",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

/**
 * Renders an <a> when `href` is present, otherwise a <button>.
 * External links get the safe rel/target pair automatically.
 */
export function Button({
  as,
  href,
  variant,
  size,
  className,
  children,
  ...props
}) {
  const Component = as ?? (href ? "a" : "button");
  const isExternal = typeof href === "string" && href.startsWith("http");

  return (
    <Component
      href={href}
      className={cn(button({ variant, size }), className)}
      {...(Component === "button" ? { type: props.type ?? "button" } : null)}
      {...(isExternal ? { target: "_blank", rel: "noreferrer noopener" } : null)}
      {...props}
    >
      {children}
    </Component>
  );
}
