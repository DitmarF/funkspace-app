"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useMemo,
  type ComponentPropsWithoutRef,
} from "react";
import { AnimationTimeline } from "@/infrastructure/motion/timeline";
import { FunkSpaceLogoInline } from "./FunkSpaceLogoInline";
import { applyStrokeDrawInit } from "@/infrastructure/motion/svg";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useServices } from "@/application/providers/ServiceProvider";

const TOTAL_LOGO_PATHS = 10;

export interface LogoMotionRef {
  play(): void;
  pause(): void;
  reverse(): void;
  seek(ms: number): void;
  setSpeed(f: number): void;
  isReady(): boolean;
}

export interface LogoMotionProps
  extends Omit<ComponentPropsWithoutRef<typeof FunkSpaceLogoInline>, "ref"> {
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
      pathCount = TOTAL_LOGO_PATHS,
      startAtMs,
      enabled: enabledProp,
      ...logoProps
    },
    ref,
  ) {
    const svgRef = useRef<SVGSVGElement>(null);
    const timelineRef = useRef<AnimationTimeline | null>(null);
    const autoPlayRef = useRef(autoPlay);
    const speedRef = useRef(speed);
    const reduced = useReducedMotion();
    const { animationService } = useServices();
    // Feature flag: use prop if provided, otherwise check env var
    // In Storybook, we can override via story args for testing
    const enabled =
      enabledProp !== undefined
        ? enabledProp
        : typeof window !== "undefined" &&
          process.env.NEXT_PUBLIC_ANIMATIONS_ENABLED === "true";

    const resolvedPathCount = useMemo(
      () => Math.max(1, Math.min(pathCount, TOTAL_LOGO_PATHS)),
      [pathCount],
    );
    const animationAllowed = useMemo(
      () => enabled && !reduced,
      [enabled, reduced],
    );

    useEffect(() => {
      const svg = svgRef.current;
      if (!svg) {
        return;
      }

      const setStaticState = () => {
        // Show all paths (including logoMark path 1)
        for (let i = 1; i <= TOTAL_LOGO_PATHS; i++) {
          const element = svg.querySelector(`#logo-path-${i}`) as
            | SVGPathElement
            | SVGPolygonElement
            | null;

          if (element) {
            element.style.strokeDashoffset = "0";
            element.style.opacity = "1";
            element.style.fillOpacity = "1";
          }
        }
      };

      const setAnimationStartState = () => {
        // Initialize logoMark (path 1) for animation
        const logoMark = svg.querySelector(`#logo-path-1`) as
          | SVGPathElement
          | SVGPolygonElement
          | null;
        if (logoMark) {
          applyStrokeDrawInit(logoMark);
          logoMark.style.opacity = "1";
        }

        // Initialize logoMark circles - all start hidden (opacity 0)
        // lmd-dot-1 will be shown immediately by the animation manifest
        for (let i = 1; i <= 9; i++) {
          const circle = svg.querySelector(
            `#lmd-dot-${i}`,
          ) as SVGCircleElement | null;
          if (circle) {
            circle.style.opacity = "0";
          }
        }

        // Initialize letter paths (2-10) for animation
        // Letter order: F(7), U(8), N(9), K(10), S(2), P(3), A(4), C(5), E(6)
        const letterPaths = [7, 8, 9, 10, 2, 3, 4, 5, 6];
        letterPaths.forEach((pathId) => {
          const element = svg.querySelector(`#logo-path-${pathId}`) as
            | SVGPathElement
            | SVGPolygonElement
            | null;

          if (element) {
            applyStrokeDrawInit(element);
            element.style.opacity = "1";
            element.style.fillOpacity = "0";
          }
        });
      };

      // Always ensure the logo is visible before deciding about animation
      setStaticState();

      if (!animationAllowed) {
        // Clean up existing timeline if it exists
        if (timelineRef.current) {
          timelineRef.current.pause();
          timelineRef.current.destroy();
        }
        timelineRef.current = null;
        return;
      }

      // If timeline already exists, we still need to handle cleanup
      // but we'll recreate it if dependencies changed (which is handled by the effect)
      // For now, always create/update to ensure it's in sync with current props

      try {
        setAnimationStartState();

        const orchestrator = animationService.getOrchestrator();
        const manifest = orchestrator.buildLogoManifest(svg);

        if (!manifest.steps.length) {
          setStaticState();
          timelineRef.current = null;
          return;
        }

        const timeline = new AnimationTimeline(svg, manifest);
        timelineRef.current = timeline;
        timeline.setSpeed(speedRef.current);

        const initialTime = startAtMs
          ? Math.max(0, Math.min(startAtMs, timeline.duration))
          : 0;
        timeline.seek(initialTime);

        if (process.env.NODE_ENV !== "production") {
          console.log("[LogoMotion] Timeline created:", {
            duration: timeline.duration,
            initialTime,
            autoPlay: autoPlayRef.current,
            enabled: animationAllowed,
          });
        }

        if (autoPlayRef.current) {
          timeline.play();
        }

        return () => {
          if (process.env.NODE_ENV !== "production") {
            console.log("[LogoMotion] Cleaning up timeline", {
              hasTimeline: !!timelineRef.current,
            });
          }
          // Only cleanup if this is still the current timeline
          if (timelineRef.current === timeline) {
            timeline.pause();
            timeline.destroy();
            timelineRef.current = null;
          }
        };
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(
            "[LogoMotion] Falling back to static render due to animation error",
            error,
          );
        }
        setStaticState();
        timelineRef.current = null;
      }
    }, [animationAllowed, resolvedPathCount, startAtMs, animationService]);

    useEffect(() => {
      speedRef.current = speed;
      if (!timelineRef.current) return;
      timelineRef.current.setSpeed(speed);
    }, [speed]);

    useEffect(() => {
      const previousAutoPlay = autoPlayRef.current;
      autoPlayRef.current = autoPlay;

      if (previousAutoPlay === autoPlay) {
        return;
      }

      const timeline = timelineRef.current;
      if (!timeline) return;

      if (autoPlay) {
        timeline.play();
      } else {
        timeline.pause();
      }
    }, [autoPlay]);

    useImperativeHandle(
      ref,
      () => ({
        play: () => {
          if (timelineRef.current) {
            timelineRef.current.play();
          } else {
            console.warn("[LogoMotion] Cannot play: timeline not ready");
          }
        },
        pause: () => {
          if (timelineRef.current) {
            timelineRef.current.pause();
          }
        },
        reverse: () => {
          if (timelineRef.current) {
            timelineRef.current.reverse();
          }
        },
        seek: (ms) => {
          if (timelineRef.current) {
            timelineRef.current.seek(ms);
          }
        },
        setSpeed: (f) => {
          if (timelineRef.current) {
            timelineRef.current.setSpeed(f);
          }
        },
        isReady: () => {
          return timelineRef.current !== null;
        },
      }),
      [], // Empty deps - methods always check current timelineRef
    );

    return <FunkSpaceLogoInline ref={svgRef} {...logoProps} />;
  },
);
