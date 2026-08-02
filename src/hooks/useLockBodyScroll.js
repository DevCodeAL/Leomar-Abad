import { useEffect } from "react";

/** Freezes page scroll while the mobile drawer is open. */
export function useLockBodyScroll(locked) {
  useEffect(() => {
    if (!locked) return undefined;

    const { body } = document;
    const previous = body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;

    body.classList.add("no-scroll");
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    return () => {
      body.classList.remove("no-scroll");
      body.style.paddingRight = previous;
    };
  }, [locked]);
}
