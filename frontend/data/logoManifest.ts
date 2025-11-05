/**
 * Logo animation manifest
 * Defines the sequence of animations for the FunkSpace logo paths
 *
 * To change animation order, modify the `delay` values in the steps.
 * No code changes needed - just update the manifest!
 */

import type { AnimationManifest, AnimationStep } from "@/utils/motion/types";
import { getPathLength } from "@/utils/motion/svg";

/**
 * Build animation manifest for first N paths with runtime path length resolution
 * @param root SVG root element
 * @param pathCount Number of paths to animate (default: 3)
 * @returns Animation manifest with resolved path lengths
 */
export function buildLogoManifest(
  root: SVGSVGElement,
  pathCount: number = 3,
): AnimationManifest {
  const steps: AnimationStep[] = [];

  // Animation timing constants (from motion tokens)
  // See: tokens/fs.motion.tokens.json
  const STROKE_DURATION = 800; // duration-800 (800ms)
  const FILL_DURATION = 200; // duration-200 (200ms)
  const STAGGER_DELAY = 120; // Stagger between paths (ms)
  const FILL_DELAY_OFFSET = 100; // Fill starts 100ms after stroke begins

  // Timing calculation for first 3 paths:
  // Path 1: stroke 0-800ms, fill 100-300ms → ends at 800ms
  // Path 2: stroke 120-920ms, fill 220-420ms → ends at 920ms
  // Path 3: stroke 240-1040ms, fill 340-540ms → ends at 1040ms
  // Total duration: 1040ms (last path stroke completes)

  for (let i = 1; i <= pathCount; i++) {
    const pathId = `#logo-path-${i}`;
    const element = root.querySelector(pathId) as
      | SVGPathElement
      | SVGPolygonElement
      | null;

    if (!element) {
      console.warn(`[LogoManifest] Path ${pathId} not found, skipping`);
      continue;
    }

    // Get actual path length at runtime
    const pathLength = getPathLength(element);

    // Stroke draw delay: staggered for each path
    const strokeDelay = (i - 1) * STAGGER_DELAY;

    // Fill fade delay: starts after stroke begins
    const fillDelay = strokeDelay + FILL_DELAY_OFFSET;

    // Path stroke draw animation
    steps.push({
      target: pathId,
      property: "strokeDashoffset",
      from: pathLength,
      to: 0,
      duration: STROKE_DURATION,
      easing: "emph",
      delay: strokeDelay,
    });

    // Path fill fade animation
    steps.push({
      target: pathId,
      property: "opacity",
      from: 0,
      to: 1,
      duration: FILL_DURATION,
      delay: fillDelay,
    });
  }

  return { steps };
}

/**
 * Default manifest builder (for first 3 paths)
 * This is a convenience function that can be called with an SVG root
 */
export function getLogoManifest(root: SVGSVGElement): AnimationManifest {
  return buildLogoManifest(root, 3);
}
