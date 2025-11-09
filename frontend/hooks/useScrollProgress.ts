"use client";

import { useEffect, useState, useRef, type RefObject } from "react";

export type UseScrollProgressOptions = {
  /**
   * Root element for Intersection Observer. Defaults to viewport.
   */
  root?: HTMLElement | null;
  /**
   * Thresholds for Intersection Observer. Defaults to [0.2, 0.8].
   */
  thresholds?: number[];
  /**
   * Callback when section enters viewport.
   */
  onEnter?: () => void;
  /**
   * Callback when section leaves viewport.
   */
  onLeave?: () => void;
};

export type UseScrollProgressReturn = {
  /**
   * Whether the section is currently in view (based on Intersection Observer).
   */
  inView: boolean;
  /**
   * Scroll progress from 0 to 1.
   * - 0: Section top is off-screen (above viewport)
   * - 1: Section bottom reaches top of viewport
   */
  progress: number;
};

/**
 * Hook to track scroll progress and visibility of a section element.
 *
 * Uses Intersection Observer for efficient enter/leave detection and
 * a passive scroll listener to compute scroll progress.
 *
 * @param ref - Ref to the section element to track
 * @param options - Configuration options
 * @param options.root - Root element for Intersection Observer (defaults to viewport)
 * @param options.thresholds - Thresholds for Intersection Observer (defaults to [0.2, 0.8])
 * @param options.onEnter - Callback when section enters viewport (called once per enter)
 * @param options.onLeave - Callback when section leaves viewport (called once per leave)
 * @returns Object with `inView` (boolean) and `progress` (0-1)
 *
 * @example
 * ```tsx
 * const sectionRef = useRef<HTMLElement>(null);
 * const { inView, progress } = useScrollProgress(sectionRef, {
 *   onEnter: () => console.log('Entered'),
 *   onLeave: () => console.log('Left'),
 * });
 * ```
 *
 * @remarks
 * - Returns `{ inView: false, progress: 0 }` if ref is null
 * - Progress is clamped to [0, 1]
 * - Callbacks are called only on state transitions (not on every scroll)
 * - Uses passive scroll listeners for performance
 * - Automatically cleans up observers and listeners on unmount
 * - Handles viewport resize events
 *
 * @example
 * ```tsx
 * // With custom root and thresholds
 * const containerRef = useRef<HTMLElement>(null);
 * const { inView, progress } = useScrollProgress(sectionRef, {
 *   root: containerRef.current,
 *   thresholds: [0.1, 0.5, 0.9],
 * });
 * ```
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  options: UseScrollProgressOptions = {},
): UseScrollProgressReturn {
  const { root, thresholds = [0.2, 0.8], onEnter, onLeave } = options;

  const [inView, setInView] = useState(false);
  const [progress, setProgress] = useState(0);
  // Use ref to track previous inView state to avoid stale closures
  const previousInViewRef = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    // Intersection Observer for inView detection
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isIntersecting = entry.isIntersecting;
          const previousInView = previousInViewRef.current;

          setInView(isIntersecting);
          previousInViewRef.current = isIntersecting;

          // Call callbacks only on state transitions
          if (isIntersecting && !previousInView && onEnter) {
            onEnter();
          } else if (!isIntersecting && previousInView && onLeave) {
            onLeave();
          }
        });
      },
      {
        root: root || null,
        threshold: thresholds,
      },
    );

    observer.observe(element);

    // Scroll listener for progress calculation
    const calculateProgress = () => {
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Progress: 0 when section top is off-screen (below viewport, not yet entered)
      //           1 when section bottom reaches top of viewport (fully scrolled)
      // Clamped to [0, 1]
      const sectionTop = rect.top;
      const sectionBottom = rect.bottom;
      const sectionHeight = rect.height;

      let calculatedProgress = 0;

      if (sectionTop > viewportHeight) {
        // Section is below viewport (not yet entered)
        calculatedProgress = 0;
      } else if (sectionBottom < 0) {
        // Section is above viewport (fully scrolled past)
        calculatedProgress = 1;
      } else {
        // Section is intersecting viewport
        // Progress from 0 (top entering) to 1 (bottom at top)
        // When top enters: sectionTop = viewportHeight, progress = 0
        // When bottom at top: sectionBottom = 0, progress = 1
        const scrollableDistance = viewportHeight + sectionHeight;
        const scrolledDistance = viewportHeight - sectionBottom;
        calculatedProgress = Math.max(
          0,
          Math.min(1, scrolledDistance / scrollableDistance),
        );
      }

      setProgress(calculatedProgress);
    };

    // Calculate initial progress
    calculateProgress();

    // Use passive scroll listener for performance
    const scrollContainer = root || window;
    scrollContainer.addEventListener("scroll", calculateProgress, {
      passive: true,
    });

    // Also listen to resize to recalculate on viewport changes
    window.addEventListener("resize", calculateProgress, { passive: true });

    return () => {
      observer.disconnect();
      scrollContainer.removeEventListener("scroll", calculateProgress);
      window.removeEventListener("resize", calculateProgress);
    };
  }, [ref, root, thresholds, onEnter, onLeave]);

  return { inView, progress };
}
