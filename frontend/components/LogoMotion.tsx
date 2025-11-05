"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { AnimationTimeline } from "@/utils/motion/timeline";
import { buildLogoManifest } from "@/data/logoManifest";
import { FunkSpaceLogoInline } from "./FunkSpaceLogoInline";
import { applyStrokeDrawInit } from "@/utils/motion/svg";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface LogoMotionRef {
  play(): void;
  pause(): void;
  reverse(): void;
  seek(ms: number): void;
  setSpeed(f: number): void;
}

export interface LogoMotionProps {
  autoPlay?: boolean;
  speed?: number;
  pathCount?: number;
  /**
   * Start animation at a specific time (ms) instead of beginning
   * Useful for resuming from a saved position or starting mid-animation
   */
  startAtMs?: number;
  /**
   * Override feature flag for testing/Storybook
   * If undefined, uses NEXT_PUBLIC_ANIMATIONS_ENABLED env var
   */
  enabled?: boolean;
}

/**
 * LogoMotion component that animates the FunkSpace logo
 * Uses AnimationTimeline to draw strokes and fade fills sequentially
 */
export const LogoMotion = forwardRef<LogoMotionRef, LogoMotionProps>(
  function LogoMotion(
    {
      autoPlay = true,
      speed = 1,
      pathCount = 3,
      startAtMs,
      enabled: enabledProp,
    },
    ref,
  ) {
    const svgRef = useRef<SVGSVGElement>(null);
    const timelineRef = useRef<AnimationTimeline | null>(null);
    const reduced = useReducedMotion();
    // Feature flag: use prop if provided, otherwise check env var
    // In Storybook, we can override via story args for testing
    const enabled =
      enabledProp !== undefined
        ? enabledProp
        : typeof window !== "undefined" &&
          process.env.NEXT_PUBLIC_ANIMATIONS_ENABLED === "true";

    useEffect(() => {
      if (!svgRef.current) return;

      const svg = svgRef.current;

      // Initialize SVG elements for animation
      // Set up stroke-dasharray and stroke-dashoffset for stroke draw effect
      for (let i = 1; i <= pathCount; i++) {
        const pathId = `logo-path-${i}`;
        const element = svg.querySelector(`#${pathId}`) as
          | SVGPathElement
          | SVGPolygonElement
          | null;

        if (element) {
          // Initialize stroke draw state (hides stroke via dashoffset)
          applyStrokeDrawInit(element);
          // Opacity will be managed by timeline; start at 1 so stroke is visible when drawn
          // Timeline's update() will set it to 0 before animation starts (per manifest)
          element.style.opacity = "1";
        }
      }

      // Early exit: Show static final state if animations disabled or reduced motion preferred
      // This ensures no timeline is created and no animation loop starts
      if (!enabled || reduced) {
        // Set final state immediately: stroke fully drawn, fill visible
        for (let i = 1; i <= pathCount; i++) {
          const pathId = `logo-path-${i}`;
          const element = svg.querySelector(`#${pathId}`) as
            | SVGPathElement
            | SVGPolygonElement
            | null;

          if (element) {
            // Final state: stroke fully drawn (offset = 0), opacity = 1
            element.style.strokeDashoffset = "0";
            element.style.opacity = "1";
          }
        }
        return; // Early exit - no timeline created
      }

      // Build manifest with runtime path lengths
      const manifest = buildLogoManifest(svg, pathCount);

      // Create and start timeline
      const timeline = new AnimationTimeline(svg, manifest);
      timelineRef.current = timeline;
      timeline.setSpeed(speed);

      // Set initial state: start at specified time or beginning (0)
      // Clamp to valid timeline range [0, duration]
      const initialTime = startAtMs
        ? Math.max(0, Math.min(startAtMs, timeline.duration))
        : 0;
      timeline.seek(initialTime);

      if (autoPlay) {
        timeline.play();
      }

      return () => {
        timeline.pause();
        timeline.destroy();
      };
    }, [enabled, reduced, autoPlay, speed, pathCount, startAtMs]);

    useImperativeHandle(ref, () => ({
      play: () => timelineRef.current?.play(),
      pause: () => timelineRef.current?.pause(),
      reverse: () => timelineRef.current?.reverse(),
      seek: (ms) => timelineRef.current?.seek(ms),
      setSpeed: (f) => timelineRef.current?.setSpeed(f),
    }));

    return <FunkSpaceLogoInline ref={svgRef} />;
  },
);
