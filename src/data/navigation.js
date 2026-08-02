import {
  Briefcase,
  FolderGit2,
  LayoutDashboard,
  Layers,
  Mail,
  MessageSquareQuote,
  User,
  Wrench,
} from "lucide-react";

/**
 * Section registry. Drives the sidebar, the mobile drawer, the scroll-spy
 * observer and the section anchors — add a section here and everywhere
 * that needs to know about it updates.
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
      { id: "contact", label: "Contact", icon: Mail },
    ],
  },
];

export const navItems = navGroups.flatMap((group) => group.items);

export const sectionIds = navItems.map((item) => item.id);
