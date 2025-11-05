"use client";

import { useEffect, useState } from "react";

/**
 * Hook to detect user's preference for reduced motion
 * Returns true if the user prefers reduced motion
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
 * @returns true if prefers-reduced-motion: reduce is active
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    // SSR-safe: check if window is available
    if (typeof window === "undefined") {
      return;
    }

    // Check initial preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mediaQuery.matches);

    // Listen for changes (user can change preference dynamically)
    const handleChange = (event: MediaQueryListEvent) => {
      setReduced(event.matches);
    };

    // Modern browsers support addEventListener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => {
        mediaQuery.removeEventListener("change", handleChange);
      };
    }

    // Fallback for older browsers
    if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => {
        mediaQuery.removeListener(handleChange);
      };
    }
  }, []);

  return reduced;
}
