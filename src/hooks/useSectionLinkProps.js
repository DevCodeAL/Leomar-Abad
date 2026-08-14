import { Link, useLocation } from "react-router-dom";

/**
 * Props to spread onto <Button/> so it targets a dashboard section from any
 * route. On the dashboard that is a plain fragment href; elsewhere it becomes
 * a router link to `/#section`, which <ScrollToHash/> then scrolls to.
 */
export function useSectionLinkProps() {
  const onDashboard = useLocation().pathname === "/";

  return (section) =>
    onDashboard ? { href: `#${section}` } : { as: Link, to: `/#${section}` };
}
