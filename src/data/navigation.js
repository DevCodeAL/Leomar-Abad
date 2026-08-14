import {
  Briefcase,
  FolderGit2,
  LayoutDashboard,
  Layers,
  Mail,
  MessageSquareQuote,
  Newspaper,
  User,
  Wrench,
} from "lucide-react";

/**
 * Section registry. Drives the sidebar, the mobile drawer, the scroll-spy
 * observer and the section anchors — add a section here and everywhere
 * that needs to know about it updates.
 *
 * Two kinds of item live here:
 *   { id }  a section on the dashboard, reached by anchor and tracked by
 *           scroll-spy. From another route it resolves to `/#id`.
 *   { to }  a real route, matched against the current path instead.
 */
export const navGroups = [
  {
    label: "Overview",
    items: [
      { id: "overview", label: "Dashboard", icon: LayoutDashboard },
      { id: "about", label: "About", icon: User },
      { id: "experience", label: "Experience", icon: Briefcase },
      { id: "skills", label: "Skills", icon: Layers },
    ],
  },
  {
    label: "Work",
    items: [
      { id: "projects", label: "Projects", icon: FolderGit2 },
      { id: "services", label: "Services", icon: Wrench },
      { id: "testimonials", label: "Testimonials", icon: MessageSquareQuote },
      { to: "/blog", label: "Blog", icon: Newspaper },
      { id: "contact", label: "Contact", icon: Mail },
    ],
  },
];

export const navItems = navGroups.flatMap((group) => group.items);

/** Only anchor items are observable by the scroll-spy. */
export const sectionIds = navItems
  .filter((item) => item.id)
  .map((item) => item.id);
