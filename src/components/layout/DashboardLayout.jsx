import { useCallback, useState } from "react";
import { useLocation } from "react-router-dom";
import { sectionIds } from "@/data/navigation";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useSidebarCollapse } from "@/hooks/useSidebarCollapse";
import { AmbientBackground } from "./AmbientBackground";
import { Sidebar } from "./Sidebar";
import { MobileDrawer, MobileHeader } from "./MobileNavigation";
import { WorkspaceHeader } from "./WorkspaceHeader";
import { ScrollProgress } from "./ScrollProgress";
import { Footer } from "./Footer";

/** Stable identity so the scroll-spy effect does not re-run off route. */
const NO_SECTIONS = [];

/**
 * App shell: fixed rail on desktop, drawer on mobile, and a single scrolling
 * workspace column. Nav state has exactly one owner — but two sources: the
 * scroll-spy while the dashboard is on screen, and the route everywhere else.
 */
export function DashboardLayout({ children }) {
  const { pathname } = useLocation();
  const onDashboard = pathname === "/";

  // Off the dashboard there are no sections to observe, so the spy stands down
  // and the current route supplies the active key instead.
  const activeSection = useActiveSection(
    onDashboard ? sectionIds : NO_SECTIONS,
  );
  const activeId = onDashboard
    ? activeSection
    : `/${pathname.split("/").filter(Boolean)[0] ?? ""}`;

  const { collapsed, toggle } = useSidebarCollapse();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  return (
    <div className="relative min-h-screen">
      <AmbientBackground />
      <ScrollProgress />

      <a
        href={onDashboard ? "#overview" : "#workspace"}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-fg"
      >
        Skip to content
      </a>

      <Sidebar
        activeId={activeId}
        collapsed={collapsed}
        onToggleCollapse={toggle}
      />

      <MobileHeader
        activeId={activeId}
        open={drawerOpen}
        onToggle={() => setDrawerOpen((value) => !value)}
      />
      <MobileDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        activeId={activeId}
      />

      <div className="lg:pl-sidebar lg:transition-[padding] lg:duration-300 lg:ease-smooth">
        <WorkspaceHeader activeId={activeId} />

        <main
          id="workspace"
          // `overflow-x: clip` (not hidden) guards against any stray wide
          // child without creating a scroll container.
          className="mx-auto w-full max-w-workspace overflow-x-clip px-4 pb-10 sm:px-6 lg:px-8 xl:px-10"
        >
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}
