import { Link, useLocation } from "react-router-dom";

/**
 * A link to a dashboard section that works from anywhere.
 *
 * On the dashboard it stays a plain fragment anchor, so the browser keeps
 * handling smooth scrolling exactly as before. From another route a bare
 * `#section` points at an element that does not exist there and silently does
 * nothing — so it becomes a router link to `/#section` instead, and
 * <ScrollToHash/> scrolls once the dashboard has mounted.
 */
export function SectionLink({ section, children, ...props }) {
  const onDashboard = useLocation().pathname === "/";

  if (onDashboard) {
    return (
      <a href={`#${section}`} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link to={`/#${section}`} {...props}>
      {children}
    </Link>
  );
}
