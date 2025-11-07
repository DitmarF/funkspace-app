/**
 * Logo animation manifest
 * Defines the sequence of animations for the FunkSpace logo
 *
 * Animation sequence:
 * - logoText: "Funk" then "Space" - each letter stroke completes, then fill animates
 *   - Next letter starts 0.1s (100ms) after previous letter starts
 * - logoMark: Starts when letter "N" starts to build up
 *   - All circles (including lmd-dot-1) start hidden
 *   - Path builds up, circles appear as path reaches their positions
 * - No easing (linear animation)
 *
 * Letter order: F, U, N, K, S, P, A, C, E
 * Path IDs: 7, 8, 9, 10, 2, 3, 4, 5, 6
 */

import type { AnimationManifest, AnimationStep } from "@/utils/motion/types";
import { getPathLength, getDistanceAlongPath } from "@/utils/motion/svg";

/**
 * Get a CSS custom property value as a number (in milliseconds)
 * @param propertyName CSS custom property name (e.g., "--fs-motion-duration-800")
 * @param fallback Fallback value if property is not found
 * @returns Value in milliseconds
 */
function getTokenDurationMs(propertyName: string, fallback: number): number {
  if (typeof window === "undefined") return fallback;

  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(propertyName)
    .trim();

  if (!value) return fallback;

  // Parse "800ms" or "800" to milliseconds
  const match = value.match(/^(\d+(?:\.\d+)?)/);
  if (match) {
    const num = parseFloat(match[1]);
    // If value ends with "s", convert to ms
    if (value.endsWith("s") && !value.endsWith("ms")) {
      return num * 1000;
    }
    return num;
  }

  return fallback;
}

/**
 * Build animation manifest for logo text letters
 * @param root SVG root element
 * @returns Animation manifest with letter-by-letter animation sequence
 */
export function buildLogoManifest(
  root: SVGSVGElement,
  pathCount?: number, // Ignored - we animate specific letter paths
): AnimationManifest {
  const steps: AnimationStep[] = [];

  // Animation timing constants
  // Target: entire animation completes within 1500ms
  const TARGET_DURATION = 1500;

  // Base durations (will be scaled to fit 1500ms)
  const BASE_STROKE_DURATION = getTokenDurationMs(
    "--fs-motion-duration-800",
    800,
  );
  const BASE_FILL_DURATION = getTokenDurationMs(
    "--fs-motion-duration-400",
    400,
  );
  const BASE_LETTER_STAGGER = 100;

  // Calculate max end time considering:
  // - Last letter (E) is at index 8
  // - Last letter fill delay = 8 * BASE_LETTER_STAGGER + BASE_STROKE_DURATION
  // - Last letter fill end = fillDelay + BASE_FILL_DURATION
  // - logoMark starts at 2 * BASE_LETTER_STAGGER, duration = BASE_STROKE_DURATION * 2
  // - logoMark end = 2 * BASE_LETTER_STAGGER + BASE_STROKE_DURATION * 2
  // Max is the later of: last letter fill end or logoMark end
  const LAST_LETTER_FILL_END =
    8 * BASE_LETTER_STAGGER + BASE_STROKE_DURATION + BASE_FILL_DURATION;
  const LOGOMARK_END = 2 * BASE_LETTER_STAGGER + BASE_STROKE_DURATION * 2;
  const CURRENT_MAX_END = Math.max(LAST_LETTER_FILL_END, LOGOMARK_END);

  // Scale factor to fit in 1500ms
  const SCALE_FACTOR = TARGET_DURATION / CURRENT_MAX_END;

  const STROKE_DURATION = Math.round(BASE_STROKE_DURATION * SCALE_FACTOR);
  const FILL_DURATION = Math.round(BASE_FILL_DURATION * SCALE_FACTOR);
  const LETTER_STAGGER = Math.round(BASE_LETTER_STAGGER * SCALE_FACTOR);

  // ===== logoMark Animation =====
  // logoMark animation starts when letter "N" (logo-path-9) starts to build up
  // Letter "N" starts at delay 2 * LETTER_STAGGER (index 2)
  const LOGOMARK_START_DELAY = 2 * LETTER_STAGGER; // Start when "N" starts
  // logoMark animation is half as slow (double duration)
  const LOGOMARK_STROKE_DURATION = STROKE_DURATION * 2; // Scaled to fit 1500ms timeline

  const logoMarkPath = root.querySelector(
    "#logo-path-1",
  ) as SVGPolygonElement | null;

  if (logoMarkPath) {
    const pathLength = getPathLength(logoMarkPath);

    // Get all circles and find their positions along the path
    const circles: Array<{
      id: string;
      element: SVGCircleElement;
      distance: number;
    }> = [];

    for (let i = 1; i <= 9; i++) {
      const circle = root.querySelector(
        `#lmd-dot-${i}`,
      ) as SVGCircleElement | null;
      if (circle) {
        const cx = parseFloat(circle.getAttribute("cx") || "0");
        const cy = parseFloat(circle.getAttribute("cy") || "0");
        const distance = getDistanceAlongPath(logoMarkPath, cx, cy);
        circles.push({ id: `lmd-dot-${i}`, element: circle, distance });
      }
    }

    // Sort circles by their position along the path
    circles.sort((a, b) => a.distance - b.distance);

    // Animate the path stroke (starts after "F" completes)
    steps.push({
      target: "#logo-path-1",
      property: "strokeDashoffset",
      from: pathLength,
      to: 0,
      duration: LOGOMARK_STROKE_DURATION,
      easing: "linear",
      delay: LOGOMARK_START_DELAY,
    });

    // Show each circle when the path reaches its position
    // All circles (including lmd-dot-1) start hidden and appear as path reaches them
    circles.forEach((circle) => {
      // Calculate delay based on when stroke reaches this circle's position
      // delay = LOGOMARK_START_DELAY + (distance / pathLength) * LOGOMARK_STROKE_DURATION
      const delay =
        LOGOMARK_START_DELAY +
        (circle.distance / pathLength) * LOGOMARK_STROKE_DURATION;

      steps.push({
        target: `#${circle.id}`,
        property: "opacity",
        from: 0,
        to: 1,
        duration: 0, // Instant appearance
        delay: delay,
        easing: "linear",
      });
    });
  }

  // ===== logoText Animation =====

  // Letter order: F, U, N, K, S, P, A, C, E
  // Path IDs: 7, 8, 9, 10, 2, 3, 4, 5, 6
  const letterPaths = [7, 8, 9, 10, 2, 3, 4, 5, 6];

  // Animation timing:
  // Each letter's stroke completes fully, then fill animates
  // Next letter starts 0.1s after previous letter starts
  // So: letter i stroke delay = (i-1) * LETTER_STAGGER
  //     letter i fill delay = letter i stroke delay + STROKE_DURATION

  letterPaths.forEach((pathId, index) => {
    const pathSelector = `#logo-path-${pathId}`;
    const element = root.querySelector(pathSelector) as
      | SVGPathElement
      | SVGPolygonElement
      | null;

    if (!element) {
      if (process.env.NODE_ENV === "development") {
        console.warn(`[LogoManifest] Path ${pathSelector} not found, skipping`);
      }
      return;
    }

    // Get actual path length at runtime
    const pathLength = getPathLength(element);

    // Stroke delay: next letter starts 0.1s after previous
    const strokeDelay = index * LETTER_STAGGER;

    // Fill delay: starts after stroke completes
    const fillDelay = strokeDelay + STROKE_DURATION;

    // Stroke draw animation (outline builds up completely, no easing)
    steps.push({
      target: pathSelector,
      property: "strokeDashoffset",
      from: pathLength,
      to: 0,
      duration: STROKE_DURATION,
      easing: "linear",
      delay: strokeDelay,
    });

    // Fill opacity animation (starts after stroke completes, no easing)
    steps.push({
      target: pathSelector,
      property: "fillOpacity",
      from: 0,
      to: 1,
      duration: FILL_DURATION,
      easing: "linear",
      delay: fillDelay,
    });
  });

  return { steps };
}

/**
 * Default manifest builder for logo text animation
 * This is a convenience function that can be called with an SVG root
 */
export function getLogoManifest(root: SVGSVGElement): AnimationManifest {
  return buildLogoManifest(root);
}
