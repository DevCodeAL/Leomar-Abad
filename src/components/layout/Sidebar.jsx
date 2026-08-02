import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/Tooltip";
import { SidebarContent } from "./SidebarContent";

/** Fixed desktop rail. Hidden below `lg`, where the drawer takes over. */
export function Sidebar({ activeId, collapsed, onToggleCollapse }) {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 hidden w-sidebar lg:block",
        "border-r border-line bg-surface/80 backdrop-blur-xl",
        "transition-[width] duration-300 ease-smooth",
      )}
    >
      <SidebarContent collapsed={collapsed} activeId={activeId} />

      <Tooltip
        label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        side="right"
        className="absolute -right-3.5 top-24"
      >
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full border border-line bg-elevated",
            "text-ink-subtle shadow-soft transition-colors duration-200",
            "hover:border-primary/50 hover:text-primary",
          )}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <PanelLeftClose className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </button>
      </Tooltip>
    </aside>
  );
}
