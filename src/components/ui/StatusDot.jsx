import { cn } from "@/lib/utils";

/** Pulsing availability indicator. */
export function StatusDot({ className }) {
  return (
    <span className={cn("relative flex h-2 w-2 shrink-0", className)}>
      <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-primary" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
    </span>
  );
}
