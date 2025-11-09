"use client";

import { useRef, useEffect } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { useScrollProgressService } from "../../hooks/useScrollProgressService";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { HTMLTimeline } from "../../infrastructure/motion/htmlTimeline";
import Text from "../Base/Text";
import SnapSection from "./SnapSection";

export type AboutProps = ComponentPropsWithoutRef<"section"> & {
  /**
   * Main heading text
   */
  heading: string;
  /**
   * Content to display in the About section
   */
  children: ReactNode;
  /**
   * If true, enables inner scrolling for long content.
   * When enabled, the outer snap is relaxed to proximity to avoid trapping users.
   */
  innerScrollable?: boolean;
  /**
   * Background color token (default: fs-violet)
   */
  backgroundColor?: string;
};

/**
 * About section component with optional inner scrolling
 *
 * Supports long content with an inner scrollable area. When `innerScrollable` is true,
 * the outer snap is relaxed to proximity to avoid trapping users in mandatory snap.
 * Uses tokenized colors and typography with scroll-triggered animations.
 *
 * @example
 * ```tsx
 * <About heading="About Us" innerScrollable={true}>
 *   <p>Long content here...</p>
 * </About>
 * ```
 */
const About = ({
  heading,
  children,
  innerScrollable = false,
  backgroundColor = "bg-fs-violet",
  className = "",
  ...props
}: AboutProps) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLTimeline | null>(null);
  const prefersReduced = useReducedMotion();

  const { inView } = useScrollProgressService(sectionRef, {
    onEnter: () => {
      if (timelineRef.current && !prefersReduced) {
        timelineRef.current.playFrom(0);
      }
    },
    onLeave: () => {
      if (timelineRef.current) {
        timelineRef.current.reset();
      }
    },
  });

  // Create timeline with animated heading
  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;

    // If reduced motion, render static end state
    if (prefersReduced) {
      heading.style.transform = "translateY(0)";
      heading.style.opacity = "1";
      return;
    }

    try {
      const timeline = new HTMLTimeline(
        [
          {
            element: heading as HTMLElement,
            fromTransform: "translateY(30px)",
            toTransform: "translateY(0)",
            fromOpacity: 0,
            toOpacity: 1,
            duration: 600,
            delay: 0,
            easing: "ease-out",
          },
        ],
        {
          onEnter: () => {
            if (process.env.NODE_ENV !== "production") {
              console.log("[About] Animation entered");
            }
          },
          onLeave: () => {
            if (process.env.NODE_ENV !== "production") {
              console.log("[About] Animation left");
            }
          },
        },
      );

      timelineRef.current = timeline;

      // Set initial state
      timeline.seek(0);

      // If already in view, play immediately
      if (inView) {
        timeline.playFrom(0);
      }

      return () => {
        timeline.destroy();
        timelineRef.current = null;
      };
    } catch (error) {
      // Graceful fallback: render static end state if timeline creation fails
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "[About] Timeline creation failed, rendering static state",
          error,
        );
      }
      heading.style.transform = "translateY(0)";
      heading.style.opacity = "1";
      timelineRef.current = null;
    }
  }, [inView, prefersReduced]);

  return (
    <SnapSection
      ref={sectionRef}
      id="about"
      aria-label="About section"
      snap="start"
      relaxSnap={innerScrollable}
      className={`flex flex-col ${backgroundColor} ${className}`.trim()}
      {...props}
    >
      <div className="flex flex-col h-full">
        {/* Header area - fixed height */}
        <div className="flex-shrink-0 p-8 text-center">
          <h2
            ref={headingRef}
            className="font-display text-4xl font-bold text-white sm:text-5xl"
            style={{
              willChange: prefersReduced ? "auto" : "transform, opacity",
              transform: prefersReduced ? "translateY(0)" : "translateY(30px)",
              opacity: prefersReduced ? "1" : "0",
            }}
          >
            {heading}
          </h2>
        </div>

        {/* Content area - scrollable when innerScrollable is true */}
        <div
          ref={contentRef}
          className={`flex-1 ${
            innerScrollable
              ? "overflow-y-auto overscroll-contain"
              : "overflow-hidden"
          }`}
          style={{
            // Ensure keyboard navigation works
            scrollBehavior: "smooth",
          }}
        >
          <div className="max-w-4xl mx-auto p-8 space-y-6">
            {typeof children === "string" ? (
              <Text className="text-white">{children}</Text>
            ) : (
              <div className="text-white space-y-4">{children}</div>
            )}
          </div>
        </div>
      </div>
    </SnapSection>
  );
};

export default About;
