/**
 * Logo animation manifest
 * Defines the sequence of animations for the FunkSpace logo text
 *
 * Animation sequence:
 * - logoMark (logo-path-1) is NOT animated
 * - logoText is animated: "Funk" then "Space"
 * - Each letter: stroke builds up completely, then fill opacity animates
 * - Next letter starts 0.1s (100ms) after previous letter starts
 * - No easing (linear animation)
 *
 * Letter order: F, U, N, K, S, P, A, C, E
 * Path IDs: 7, 8, 9, 10, 2, 3, 4, 5, 6
 */

import type { AnimationManifest, AnimationStep } from "@/utils/motion/types";
import { getPathLength } from "@/utils/motion/svg";

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

  // Animation timing constants (from motion tokens)
  const STROKE_DURATION = getTokenDurationMs("--fs-motion-duration-800", 800); // duration-800 (800ms)
  const FILL_DURATION = getTokenDurationMs("--fs-motion-duration-400", 400); // duration-400 (400ms) - slower fill animation
  const LETTER_STAGGER = 100; // Each letter starts 0.1s (100ms) after previous

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
