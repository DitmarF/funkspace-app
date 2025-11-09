/**
 * useScrollProgressService Hook
 * React hook for scroll progress tracking using ScrollService
 */

"use client";

import { useEffect, useState, useRef, type RefObject } from "react";
import { useServices } from "@/application/providers/ServiceProvider";
import type { ScrollProgress } from "@/application/scroll/ScrollService";

export interface UseScrollProgressOptions {
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
}

/**
 * Hook to track scroll progress and visibility of a section element.
 */
export function useScrollProgressService(
  ref: RefObject<HTMLElement | null>,
  options: UseScrollProgressOptions = {},
): ScrollProgress {
  const { scrollService } = useServices();
  const { root, thresholds = [0.2, 0.8], onEnter, onLeave } = options;

  const [inView, setInView] = useState(false);
  const [progress, setProgress] = useState(0);
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
      const calculatedProgress = scrollService.calculateProgress(element);
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
  }, [ref, root, thresholds, onEnter, onLeave, scrollService]);

  return { inView, progress };
}
