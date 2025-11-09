/**
 * Logo animation manifest builder
 *
 * NOTE: This file is kept for backward compatibility.
 * The actual implementation has been moved to AnimationOrchestrator.
 *
 * @deprecated Use AnimationOrchestrator.buildLogoManifest() instead
 */

import type { AnimationManifest } from "@/domain/animations/AnimationManifest";

/**
 * @deprecated Use AnimationOrchestrator.buildLogoManifest() instead
 */
export function buildLogoManifest(
  root: SVGSVGElement,
  pathCount?: number,
): AnimationManifest {
  // This function is deprecated and should not be used directly
  // Components should use AnimationOrchestrator via AnimationService
  throw new Error(
    "buildLogoManifest is deprecated. Use AnimationOrchestrator.buildLogoManifest() instead.",
  );
}

/**
 * @deprecated Use AnimationOrchestrator.buildLogoManifest() instead
 */
export function getLogoManifest(root: SVGSVGElement): AnimationManifest {
  return buildLogoManifest(root);
}
