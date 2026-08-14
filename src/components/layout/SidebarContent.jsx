import { Download, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { SectionLink } from "./SectionLink";
import { navGroups } from "@/data/navigation";
import { profile, socials } from "@/data/profile";
import { Tooltip } from "@/components/ui/Tooltip";
import { StatusDot } from "@/components/ui/StatusDot";
import { ThemeToggle } from "@/theme/ThemeToggle";
import { PaletteSelector } from "@/theme/PaletteSelector";

/**
 * The sidebar body, shared by the desktop rail and the mobile drawer.
 * `collapsed` only ever applies on desktop; the drawer always renders labels
 * and passes `onClose` so the dismiss control sits inside the brand row.
 */
export function SidebarContent({
  collapsed = false,
  activeId,
  onNavigate,
  onClose,
}) {
  return (
    <div className="flex h-full flex-col">
      <SidebarBrand collapsed={collapsed} onClose={onClose} />

      <nav
        aria-label="Sections"
        className={cn(
          "flex-1 px-3 py-4",
          // Collapsed mode relies on tooltips escaping the rail, so it must
          // not create a scroll container.
          collapsed ? "overflow-visible" : "overflow-y-auto overscroll-contain",
        )}
      >
        {navGroups.map((group) => (
          <div key={group.label} className="mb-5 last:mb-0">
            <p
              className={cn(
                "px-3 pb-2 text-2xs font-semibold uppercase tracking-[0.2em] text-ink-subtle",
                collapsed && "sr-only",
              )}
            >
              {group.label}
            </p>

            <ul className="space-y-1">
              {group.items.map((item) => (
                <li key={item.id ?? item.to}>
                  <NavLink
                    item={item}
                    collapsed={collapsed}
                    active={activeId === (item.id ?? item.to)}
                    onNavigate={onNavigate}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <SidebarFooter collapsed={collapsed} />
    </div>
  );
}

function SidebarBrand({ collapsed, onClose }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 border-b border-line px-4 py-5",
        collapsed && "justify-center px-2",
      )}
    >
      <SectionLink
        section="overview"
        className="relative shrink-0 rounded-full"
        aria-label={`${profile.name} — back to dashboard`}
      >
        <span className="absolute inset-0 rounded-full bg-primary/25 blur-md" />
        <img
          src={profile.avatar}
          alt=""
          width="44"
          height="44"
          className="relative h-11 w-11 rounded-full border-2 border-primary/70 object-cover object-top"
        />
        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-surface bg-primary" />
      </SectionLink>

      {!collapsed ? (
        <div className="min-w-0 flex-1 animate-fade-in">
          <p className="truncate text-sm font-bold tracking-tight text-ink">
            {profile.name}
          </p>
          <p className="truncate font-mono text-[0.6875rem] text-ink-subtle">
            {profile.role}
          </p>
        </div>
      ) : null}

      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation menu"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-elevated text-ink-muted transition-colors duration-200 hover:border-primary/40 hover:text-primary"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}

function NavLink({ item, collapsed, active, onNavigate }) {
  const { icon: Icon, label, id, to } = item;
  const onDashboard = useLocation().pathname === "/";

  /* Three cases, one appearance: a route item is a router link; a section item
     is a plain anchor on the dashboard, and a router link to `/#id` from
     anywhere else, where a bare fragment would point at nothing. */
  const Component = to || !onDashboard ? Link : "a";
  const target = to
    ? { to }
    : onDashboard
      ? { href: `#${id}` }
      : { to: `/#${id}` };

  const link = (
    <Component
      {...target}
      onClick={onNavigate}
      aria-current={active ? "true" : undefined}
      className={cn(
        "group/nav relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
        "transition-colors duration-200",
        collapsed && "justify-center px-0",
        active
          ? "bg-primary/10 text-primary"
          : "text-ink-muted hover:bg-elevated hover:text-ink",
      )}
    >
      {/* Sliding active rail */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-primary",
          "origin-center transition-transform duration-300 ease-smooth",
          active ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0",
        )}
      />

      <Icon
        className={cn(
          "h-[1.05rem] w-[1.05rem] shrink-0 transition-transform duration-300 ease-smooth",
          "group-hover/nav:scale-110",
          active && "scale-110",
        )}
        aria-hidden="true"
      />

      {!collapsed ? <span className="truncate">{label}</span> : null}

      {!collapsed && active ? (
        <span
          aria-hidden="true"
          className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
        />
      ) : null}
    </Component>
  );

  return collapsed ? (
    <Tooltip label={label} side="right" className="w-full">
      {link}
    </Tooltip>
  ) : (
    link
  );
}

function SidebarFooter({ collapsed }) {
  return (
    <div className="border-t border-line px-3 py-4">
      {collapsed ? (
        <div className="flex flex-col items-center gap-2">
          {socials.slice(0, 2).map(({ label, href, Icon }) => (
            <Tooltip key={label} label={label} side="right">
              <a
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-subtle transition-colors duration-200 hover:bg-elevated hover:text-primary"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </a>
            </Tooltip>
          ))}
          <Tooltip label="Download CV" side="right">
            <a
              href={profile.resume}
              download
              aria-label="Download CV"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-subtle transition-colors duration-200 hover:bg-elevated hover:text-primary"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
            </a>
          </Tooltip>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="px-1 pb-2 text-2xs font-semibold uppercase tracking-[0.2em] text-ink-subtle">
              Connect
            </p>
            <ul className="grid grid-cols-2 gap-1.5">
              {socials.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group/social flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-ink-muted transition-colors duration-200 hover:bg-elevated hover:text-primary"
                  >
                    <Icon
                      className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 ease-smooth group-hover/social:-translate-y-0.5"
                      aria-hidden="true"
                    />
                    <span className="truncate">{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 rounded-xl border border-line bg-canvas-deep/40 p-3">
            <p className="text-2xs font-semibold uppercase tracking-[0.2em] text-ink-subtle">
              Appearance
            </p>
            <ThemeToggle />
            <PaletteSelector />
          </div>

          <a
            href={profile.resume}
            download
            className="flex items-center justify-center gap-2 rounded-xl border border-line-strong bg-elevated px-3 py-2.5 text-xs font-semibold text-ink transition-colors duration-200 hover:border-primary hover:text-primary"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            Download CV
          </a>

          <p className="flex items-center gap-2 px-1 text-[0.6875rem] text-ink-subtle">
            <StatusDot />
            {profile.status}
          </p>
        </div>
      )}
    </div>
  );
}
