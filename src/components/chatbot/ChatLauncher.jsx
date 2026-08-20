import { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const NUDGE_KEY = "portfolio-chat-nudged";
const NUDGE_DELAY_MS = 7000;

/**
 * The floating entry point.
 *
 * Two deliberate details. The halo is the same `pulse-ring` the availability
 * dot uses elsewhere on the site, so the button reads as part of the design
 * system rather than a widget bolted on. And the panel chunk is prefetched on
 * hover or focus — by the time the click lands it is usually already parsed,
 * which is what makes the panel feel instant without loading it up front.
 */
export function ChatLauncher({ buttonRef, open, onToggle, onPrefetch, panelId }) {
  const prefersReduced = useReducedMotion();
  const [nudge, setNudge] = useState(false);

  // One gentle prompt per session, and only for someone who has not opened it.
  useEffect(() => {
    if (open) {
      setNudge(false);
      return undefined;
    }

    let dismissed = true;
    try {
      dismissed = sessionStorage.getItem(NUDGE_KEY) === "1";
    } catch {
      /* storage blocked — treat as already shown and stay quiet */
    }
    if (dismissed) return undefined;

    const timer = setTimeout(() => setNudge(true), NUDGE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [open]);

  const dismissNudge = () => {
    setNudge(false);
    try {
      sessionStorage.setItem(NUDGE_KEY, "1");
    } catch {
      /* nothing to do; it simply reappears next session */
    }
  };

  return (
    <div className="pointer-events-none fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {nudge ? (
        <div
          className={cn(
            "panel pointer-events-auto flex max-w-[15rem] items-start gap-2 px-3.5 py-3 shadow-lift",
            !prefersReduced && "animate-bubble-in",
          )}
        >
          <p className="text-[0.8125rem] leading-snug text-ink-muted">
            Curious about{" "}
            <span className="font-semibold text-ink">Leomar&apos;s work?</span>{" "}
            Ask me anything.
          </p>
          <button
            type="button"
            onClick={dismissNudge}
            aria-label="Dismiss"
            className="-mr-1 -mt-1 shrink-0 rounded-md p-1 text-ink-subtle transition-colors duration-200 hover:text-ink"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      ) : null}

      <div className="group/fab pointer-events-auto relative">
        {/* Tooltip. Anchored left so a long label never runs off a phone. */}
        <span
          role="tooltip"
          aria-hidden={open}
          className={cn(
            "pointer-events-none absolute right-full top-1/2 mr-3 hidden -translate-y-1/2 whitespace-nowrap",
            "rounded-md border border-line bg-elevated px-2.5 py-1.5 text-xs font-medium text-ink shadow-lift",
            "translate-x-1 opacity-0 transition-[opacity,transform] duration-200 ease-smooth",
            "group-hover/fab:translate-x-0 group-hover/fab:opacity-100",
            "group-focus-within/fab:translate-x-0 group-focus-within/fab:opacity-100",
            !open && "sm:block",
          )}
        >
          Ask my AI assistant
        </span>

        {!open && !prefersReduced ? (
          <span
            aria-hidden="true"
            className="absolute inset-0 animate-pulse-ring rounded-full bg-primary/45"
          />
        ) : null}

        <button
          ref={buttonRef}
          type="button"
          onClick={() => {
            dismissNudge();
            onToggle();
          }}
          onPointerEnter={onPrefetch}
          onFocus={onPrefetch}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={
            open ? "Close the AI assistant" : "Ask Leomar's AI assistant"
          }
          className={cn(
            "relative flex h-14 w-14 items-center justify-center rounded-full",
            "bg-primary text-primary-fg shadow-glow",
            "transition-[transform,background-color,box-shadow] duration-300 ease-smooth",
            "hover:bg-primary-strong hover:shadow-lift active:scale-95",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
          )}
        >
          {/* Both glyphs are mounted so the swap can cross-fade and rotate. */}
          <Sparkles
            className={cn(
              "absolute h-[1.35rem] w-[1.35rem] transition-[opacity,transform] duration-300 ease-smooth",
              open ? "rotate-90 scale-75 opacity-0" : "rotate-0 scale-100 opacity-100",
            )}
            aria-hidden="true"
          />
          <X
            className={cn(
              "absolute h-5 w-5 transition-[opacity,transform] duration-300 ease-smooth",
              open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-75 opacity-0",
            )}
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}
