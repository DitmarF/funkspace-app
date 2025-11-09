/**
 * useScrollProgressService Hook
 * React hook for scroll progress tracking using ScrollService
 */

"use client";

import { useEffect, useState, useRef, useMemo, type RefObject } from "react";
import { useServices } from "@/application/providers/ServiceProvider";
import type { ScrollProgress } from "@/application/scroll/ScrollService";

// Hoist default thresholds to avoid recreating array on every render
const DEFAULT_THRESHOLDS: number[] = [0.2, 0.8];

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
  const { root, thresholds, onEnter, onLeave } = options;

  // Memoize thresholds to avoid recreating on every render
  // Only recreate if the caller actually provides a different array
  // If thresholds is undefined, use the constant directly (no memoization needed)
  const memoizedThresholds = useMemo(() => {
    if (!thresholds) {
      return DEFAULT_THRESHOLDS;
    }
    return thresholds;
    // Compare by stringified values to detect actual changes, not just reference changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thresholds?.join(",")]);

  // Store callbacks in refs to avoid re-attaching observers when they change
  const onEnterRef = useRef(onEnter);
  const onLeaveRef = useRef(onLeave);

  // Update refs when callbacks change (without triggering effect re-run)
  useEffect(() => {
    onEnterRef.current = onEnter;
    onLeaveRef.current = onLeave;
  }, [onEnter, onLeave]);

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
          // Read from refs to get latest callbacks without re-running effect
          if (isIntersecting && !previousInView && onEnterRef.current) {
            onEnterRef.current();
          } else if (!isIntersecting && previousInView && onLeaveRef.current) {
            onLeaveRef.current();
          }
        });
      },
      {
        root: root || null,
        threshold: memoizedThresholds,
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
    // Only re-run when ref, root, thresholds, or scrollService actually change
    // Callbacks are handled via refs to avoid unnecessary re-attachments
  }, [ref, root, memoizedThresholds, scrollService]);

  return { inView, progress };
}
