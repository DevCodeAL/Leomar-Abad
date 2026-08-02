import { useEffect, useRef } from "react";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { profile } from "@/data/profile";
import { navItems } from "@/data/navigation";
import { ThemeToggleIcon } from "@/theme/ThemeToggle";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { SidebarContent } from "./SidebarContent";

/** Sticky top bar shown below `lg`, with the drawer trigger. */
export function MobileHeader({ activeId, open, onToggle }) {
  const current = navItems.find((item) => item.id === activeId);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/85 backdrop-blur-xl lg:hidden">
      <div className="flex h-16 items-center justify-between gap-3 px-4">
        <button
          type="button"
          onClick={onToggle}
          aria-label="Open navigation menu"
          aria-expanded={open}
          aria-controls="mobile-drawer"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface text-ink transition-colors duration-200 hover:border-primary/40 hover:text-primary"
        >
          <Menu className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
        </button>

        <div className="min-w-0 flex-1 text-center">
          <p className="truncate text-sm font-bold tracking-tight text-ink">
            {profile.brand}
          </p>
          <p className="truncate font-mono text-[0.625rem] uppercase tracking-[0.18em] text-ink-subtle">
            {current?.label ?? "Dashboard"}
          </p>
        </div>

        <ThemeToggleIcon />
      </div>
    </header>
  );
}

/** Slide-out drawer. Traps focus loosely: Escape closes, first item focused. */
export function MobileDrawer({ open, onClose, activeId }) {
  const panelRef = useRef(null);
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    const firstLink = panelRef.current?.querySelector("a, button");
    firstLink?.focus({ preventScroll: true });

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    // `inert` keeps the closed drawer's links out of the tab order, which
    // aria-hidden alone would not do.
    <div className="lg:hidden" aria-hidden={!open} inert={!open}>
      {/* Scrim */}
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-canvas-deep/70 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <div
        id="mobile-drawer"
        ref={panelRef}
        role="dialog"
        aria-modal={open}
        aria-label="Navigation"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[min(19rem,86vw)] flex-col",
          "border-r border-line bg-surface shadow-lift",
          "transition-transform duration-300 ease-smooth",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarContent
          activeId={activeId}
          onNavigate={onClose}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
