"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { AnimationTimeline } from "@/utils/motion/timeline";
import { buildLogoManifest } from "@/data/logoManifest";
import { FunkSpaceLogoInline } from "./FunkSpaceLogoInline";
import { applyStrokeDrawInit } from "@/utils/motion/svg";

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
}

/**
 * LogoMotion component that animates the FunkSpace logo
 * Uses AnimationTimeline to draw strokes and fade fills sequentially
 */
export const LogoMotion = forwardRef<LogoMotionRef, LogoMotionProps>(
  function LogoMotion({ autoPlay = true, speed = 1, pathCount = 3 }, ref) {
    const svgRef = useRef<SVGSVGElement>(null);
    const timelineRef = useRef<AnimationTimeline | null>(null);
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Feature flag: defaults to false per spec
    // In Storybook, we can override via story args
    const enabled =
      typeof window !== "undefined" &&
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

      // Check if animations should be enabled
      if (!enabled || reduced) {
        // Show static final state immediately
        for (let i = 1; i <= pathCount; i++) {
          const pathId = `logo-path-${i}`;
          const element = svg.querySelector(`#${pathId}`) as
            | SVGPathElement
            | SVGPolygonElement
            | null;

          if (element) {
            // Set final state: stroke fully drawn, fill visible
            element.style.strokeDashoffset = "0";
            element.style.opacity = "1";
          }
        }
        return;
      }

      // Build manifest with runtime path lengths
      const manifest = buildLogoManifest(svg, pathCount);

      // Create and start timeline
      const timeline = new AnimationTimeline(svg, manifest);
      timelineRef.current = timeline;
      timeline.setSpeed(speed);

      // Set initial state (time=0) before playing
      timeline.seek(0);

      if (autoPlay) {
        timeline.play();
      }

      return () => {
        timeline.pause();
        timeline.destroy();
      };
    }, [enabled, reduced, autoPlay, speed, pathCount]);

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
