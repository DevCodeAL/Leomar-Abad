import { Sparkles } from "lucide-react";

/** Shown between sending and the first token, so the panel is never still. */
export function TypingIndicator() {
  return (
    <div className="flex animate-bubble-in gap-2.5">
      <span
        aria-hidden="true"
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary"
      >
        <Sparkles className="h-3.5 w-3.5" />
      </span>

      <div className="flex items-center gap-1 rounded-2xl rounded-tl-md border border-line bg-elevated px-4 py-3.5">
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className="h-1.5 w-1.5 animate-typing-dot rounded-full bg-primary"
            style={{ animationDelay: `${index * 160}ms` }}
          />
        ))}
        <span className="sr-only">Thinking…</span>
      </div>
    </div>
  );
}
