/**
 * Animation Orchestrator
 * Application service for building animation manifests
 */

import type {
  AnimationManifest,
  AnimationStep,
} from "@/domain/animations/AnimationManifest";
import type { AnimationPort } from "@/domain/ports/AnimationPort";
import {
  ANIMATION_TIMING,
  calculateScaledTiming,
} from "@/domain/animations/AnimationTiming";

export interface AnimationOrchestrator {
  /**
   * Build animation manifest for logo
   */
  buildLogoManifest(root: SVGSVGElement): AnimationManifest;
}

export class AnimationOrchestratorImpl implements AnimationOrchestrator {
  constructor(private readonly animationPort: AnimationPort) {}

  buildLogoManifest(root: SVGSVGElement): AnimationManifest {
    const steps: AnimationStep[] = [];

    // Get base durations from tokens
    const baseStrokeDuration = this.animationPort.getTokenDurationMs(
      ANIMATION_TIMING.BASE_STROKE_DURATION_TOKEN,
      ANIMATION_TIMING.BASE_STROKE_DURATION_FALLBACK,
    );
    const baseFillDuration = this.animationPort.getTokenDurationMs(
      ANIMATION_TIMING.BASE_FILL_DURATION_TOKEN,
      ANIMATION_TIMING.BASE_FILL_DURATION_FALLBACK,
    );
    const baseLetterStagger = ANIMATION_TIMING.BASE_LETTER_STAGGER;

    // Letter order: F, U, N, K, S, P, A, C, E (9 letters, last index is 8)
    const lastLetterIndex = 8;

    // Calculate scaled timing
    const timing = calculateScaledTiming(
      baseStrokeDuration,
      baseFillDuration,
      baseLetterStagger,
      ANIMATION_TIMING.TARGET_DURATION,
      lastLetterIndex,
    );

    // ===== logoMark Animation =====
    const logoMarkPath = root.querySelector(
      "#logo-path-1",
    ) as SVGPolygonElement | null;

    if (logoMarkPath) {
      const pathLength = this.animationPort.getPathLength(logoMarkPath);

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
          const distance = this.animationPort.getDistanceAlongPath(
            logoMarkPath,
            cx,
            cy,
          );
          circles.push({ id: `lmd-dot-${i}`, element: circle, distance });
        }
      }

      // Sort circles by their position along the path
      circles.sort((a, b) => a.distance - b.distance);

      // Animate the path stroke
      steps.push({
        target: "#logo-path-1",
        property: "strokeDashoffset",
        from: pathLength,
        to: 0,
        duration: timing.logomarkStrokeDuration,
        easing: "linear",
        delay: timing.logomarkStartDelay,
      });

      // Show each circle when the path reaches its position
      circles.forEach((circle) => {
        const delay =
          timing.logomarkStartDelay +
          (circle.distance / pathLength) * timing.logomarkStrokeDuration;

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

    letterPaths.forEach((pathId, index) => {
      const pathSelector = `#logo-path-${pathId}`;
      const element = root.querySelector(pathSelector) as
        | SVGPathElement
        | SVGPolygonElement
        | null;

      if (!element) {
        if (process.env.NODE_ENV === "development") {
          console.warn(
            `[AnimationOrchestrator] Path ${pathSelector} not found, skipping`,
          );
        }
        return;
      }

      // Get actual path length at runtime
      const pathLength = this.animationPort.getPathLength(element);

      // Stroke delay: next letter starts after previous
      const strokeDelay = index * timing.letterStagger;

      // Fill delay: starts after stroke completes
      const fillDelay = strokeDelay + timing.strokeDuration;

      // Stroke draw animation
      steps.push({
        target: pathSelector,
        property: "strokeDashoffset",
        from: pathLength,
        to: 0,
        duration: timing.strokeDuration,
        easing: "linear",
        delay: strokeDelay,
      });

      // Fill opacity animation
      steps.push({
        target: pathSelector,
        property: "fillOpacity",
        from: 0,
        to: 1,
        duration: timing.fillDuration,
        easing: "linear",
        delay: fillDelay,
      });
    });

    return { steps };
  }
}
