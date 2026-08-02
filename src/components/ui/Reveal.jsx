import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll reveal built on a single IntersectionObserver per element and a CSS
 * transition — no animation library, and the reduced-motion media query in
 * index.css neutralises it entirely without any JS branching.
 *
 * `delay` staggers siblings; `direction` picks the entrance offset.
 */
export function Reveal({
  as: Component = "div",
  direction = "up",
  delay = 0,
  threshold = 0.15,
  className,
  children,
  ...props
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect(); // reveal once, then stop paying for it
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <Component
      ref={ref}
      data-direction={direction}
      style={delay ? { "--reveal-delay": `${delay}ms` } : undefined}
      className={cn("reveal", visible && "is-visible", className)}
      {...props}
    >
      {children}
    </Component>
  );
}
