import { cn } from "@/lib/utils";

/**
 * Suggestion chips.
 *
 * `opening` is the six-across grid shown before the first question; afterwards
 * the same component renders the two or three follow-ups the conversation
 * earned, under a quieter label.
 */
export function SuggestedQuestions({ suggestions, onSelect, opening = false, disabled }) {
  if (!suggestions?.length) return null;

  return (
    <div className={cn(opening ? "space-y-2" : "space-y-1.5 pl-[2.375rem]")}>
      <p className="text-2xs font-semibold uppercase tracking-[0.18em] text-ink-subtle">
        {opening ? "Try asking" : "Next"}
      </p>

      <ul className="flex flex-wrap gap-1.5">
        {suggestions.map((chip, index) => (
          <li
            key={chip.question}
            className="animate-fade-up"
            style={{ animationDelay: `${index * 45}ms` }}
          >
            <button
              type="button"
              disabled={disabled}
              onClick={() => onSelect(chip.question)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/70",
                "px-3 py-1.5 text-left text-xs font-medium text-ink-muted",
                "transition-[border-color,color,background-color,transform] duration-300 ease-smooth",
                "hover:-translate-y-px hover:border-primary/50 hover:bg-primary/5 hover:text-ink",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
                "disabled:pointer-events-none disabled:opacity-50",
              )}
            >
              <span aria-hidden="true">{chip.emoji}</span>
              {chip.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
