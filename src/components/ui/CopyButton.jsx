import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

/** Copies `value` and swaps its icon for ~2s. Announces the result politely. */
export function CopyButton({ value, label = "Copy", className }) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <button
      type="button"
      onClick={() => copy(value)}
      aria-label={copied ? `${label} copied` : label}
      className={cn(
        "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line",
        "text-ink-subtle transition-colors duration-200",
        "hover:border-primary/40 hover:bg-primary/10 hover:text-primary",
        className,
      )}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 animate-scale-in" aria-hidden="true" />
      ) : (
        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </button>
  );
}
