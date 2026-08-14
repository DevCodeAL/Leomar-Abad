import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const WEEKDAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

/** Month key helpers that stay in plain date-string space, never local time. */
function monthOf(key) {
  return key.slice(0, 7);
}

function daysInMonth(year, month) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** ISO weekday (1 = Monday) for a Y-M-D, computed in UTC to avoid drift. */
function weekdayOf(year, month, day) {
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return weekday === 0 ? 7 : weekday;
}

/**
 * Month grid restricted to the dates the server says are bookable. Unavailable
 * days are rendered disabled rather than hidden, so the shape of the month —
 * and which days are simply not working days — stays legible.
 */
export function DatePicker({ dates, selected, onSelect }) {
  const months = useMemo(() => [...new Set(dates.map(monthOf))], [dates]);
  const [monthIndex, setMonthIndex] = useState(() => {
    const initial = selected ? months.indexOf(monthOf(selected)) : 0;
    return initial === -1 ? 0 : initial;
  });

  const activeMonth = months[monthIndex] ?? months[0];
  const bookable = useMemo(() => new Set(dates), [dates]);

  if (!activeMonth) return null;

  const [year, month] = activeMonth.split("-").map(Number);
  const total = daysInMonth(year, month);
  const leadingBlanks = weekdayOf(year, month, 1) - 1;

  const monthLabel = new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setMonthIndex((index) => Math.max(0, index - 1))}
          disabled={monthIndex === 0}
          aria-label="Previous month"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-muted transition-colors duration-200 hover:border-primary/50 hover:text-primary disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>

        <p aria-live="polite" className="text-sm font-semibold text-ink">
          {monthLabel}
        </p>

        <button
          type="button"
          onClick={() =>
            setMonthIndex((index) => Math.min(months.length - 1, index + 1))
          }
          disabled={monthIndex >= months.length - 1}
          aria-label="Next month"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-muted transition-colors duration-200 hover:border-primary/50 hover:text-primary disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div
        className="mb-1.5 grid grid-cols-7 gap-1"
        aria-hidden="true"
      >
        {WEEKDAY_LABELS.map((label) => (
          <span
            key={label}
            className="py-1 text-center font-mono text-[0.625rem] uppercase tracking-wider text-ink-subtle"
          >
            {label}
          </span>
        ))}
      </div>

      <div role="group" aria-label="Choose a date" className="grid grid-cols-7 gap-1">
        {Array.from({ length: leadingBlanks }, (_, index) => (
          <span key={`blank-${index}`} aria-hidden="true" />
        ))}

        {Array.from({ length: total }, (_, index) => {
          const day = index + 1;
          const key = `${activeMonth}-${String(day).padStart(2, "0")}`;
          const available = bookable.has(key);
          const isSelected = key === selected;

          return (
            <button
              key={key}
              type="button"
              disabled={!available}
              aria-pressed={isSelected}
              aria-label={`${day} ${monthLabel}${available ? "" : " — unavailable"}`}
              onClick={() => onSelect(key)}
              className={cn(
                "flex aspect-square items-center justify-center rounded-lg border text-sm",
                "transition-[background-color,border-color,color,transform] duration-200 ease-smooth",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                isSelected
                  ? "border-primary bg-primary text-primary-fg shadow-glow-sm"
                  : available
                    ? "border-line bg-elevated/60 text-ink hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary"
                    : "cursor-not-allowed border-transparent text-ink-subtle/45",
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
