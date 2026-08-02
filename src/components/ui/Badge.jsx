import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badge = cva(
  "inline-flex items-center gap-1.5 rounded-full font-medium transition-colors duration-200",
  {
    variants: {
      variant: {
        default: "border border-line bg-elevated text-ink-muted",
        primary: "border border-primary/30 bg-primary/10 text-primary",
        outline: "border border-line-strong text-ink-muted",
      },
      size: {
        sm: "px-2 py-0.5 text-[0.6875rem]",
        md: "px-2.5 py-1 text-xs",
      },
      mono: {
        true: "font-mono tracking-tight",
        false: "",
      },
    },
    defaultVariants: { variant: "default", size: "sm", mono: false },
  },
);

export function Badge({ variant, size, mono, className, children, ...props }) {
  return (
    <span className={cn(badge({ variant, size, mono }), className)} {...props}>
      {children}
    </span>
  );
}
