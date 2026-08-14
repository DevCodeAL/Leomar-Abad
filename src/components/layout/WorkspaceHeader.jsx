import { ArrowUpRight, Slash } from "lucide-react";
import { navItems } from "@/data/navigation";
import { profile } from "@/data/profile";
import { StatusDot } from "@/components/ui/StatusDot";
import { Button } from "@/components/ui/Button";
import { useSectionLinkProps } from "@/hooks/useSectionLinkProps";

/** Desktop-only workspace bar: breadcrumb, live status, primary action. */
export function WorkspaceHeader({ activeId }) {
  // `activeId` is a section id on the dashboard and a route path elsewhere.
  const current = navItems.find(
    (item) => item.id === activeId || item.to === activeId,
  );
  const sectionLink = useSectionLinkProps();

  return (
    <div className="sticky top-0 z-30 hidden border-b border-line bg-canvas/70 backdrop-blur-xl lg:block">
      <div className="mx-auto flex h-16 max-w-workspace items-center justify-between gap-6 px-8 xl:px-10">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5">
          <span className="font-mono text-xs text-ink-subtle">
            {profile.brand.toLowerCase()}
          </span>
          <Slash
            className="h-3 w-3 -rotate-12 text-ink-subtle/60"
            aria-hidden="true"
          />
          <span
            key={current?.id ?? current?.to}
            className="animate-fade-in font-mono text-xs font-medium text-primary"
          >
            {current?.label?.toLowerCase() ?? "dashboard"}
          </span>
        </nav>

        <div className="flex items-center gap-5">
          <p className="hidden items-center gap-2 font-mono text-[0.6875rem] text-ink-muted xl:flex">
            <StatusDot />
            {profile.status}
          </p>

          <Button {...sectionLink("contact")} size="sm" variant="outline">
            Let&apos;s work together
            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform duration-300 ease-smooth group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
              aria-hidden="true"
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
