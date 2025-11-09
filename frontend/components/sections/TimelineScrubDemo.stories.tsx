"use client";

import type { Meta, StoryObj } from "@storybook/react";
import React, { useRef, useEffect, useMemo } from "react";

import FullscreenScroll from "../Layouts/FullscreenScroll";
import { useScrollProgress } from "../../hooks/useScrollProgress";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { HTMLTimeline } from "../../utils/motion/htmlTimeline";
import SnapSection from "./SnapSection";

/**
 * Demo component showing timeline scrubbing with scroll progress
 */
function TimelineScrubDemo() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const timelineRef = useRef<HTMLTimeline | null>(null);
  const prefersReduced = useReducedMotion();

  const { inView, progress } = useScrollProgress(sectionRef);

  // Create timeline with multiple elements
  useEffect(() => {
    const heading = headingRef.current;
    const subheading = subheadingRef.current;
    if (!heading || !subheading) return;

    // If reduced motion, render static end state
    if (prefersReduced) {
      heading.style.transform = "translateY(0)";
      heading.style.opacity = "1";
      subheading.style.transform = "translateY(0)";
      subheading.style.opacity = "1";
      return;
    }

    // Create timeline with scrubbing support
    const timeline = new HTMLTimeline(
      [
        {
          element: heading,
          fromTransform: "translateY(30px)",
          toTransform: "translateY(0)",
          fromOpacity: 0,
          toOpacity: 1,
          duration: 1000, // Full scroll distance maps to this duration
          delay: 0,
          easing: "ease-out",
        },
        {
          element: subheading,
          fromTransform: "translateY(20px)",
          toTransform: "translateY(0)",
          fromOpacity: 0,
          toOpacity: 1,
          duration: 1000,
          delay: 200,
          easing: "ease-out",
        },
      ],
      {},
    );

    timelineRef.current = timeline;

    // Set initial state
    timeline.seek(0);

    return () => {
      timeline.destroy();
      timelineRef.current = null;
    };
  }, [prefersReduced]);

  // Continuously scrub timeline based on scroll progress
  useEffect(() => {
    if (prefersReduced || !timelineRef.current) return;

    // Update timeline immediately when progress changes
    timelineRef.current.seek(progress);
  }, [progress, prefersReduced]);

  const progressPercent = useMemo(() => Math.round(progress * 100), [progress]);

  return (
    <FullscreenScroll snapMode="proximity">
      <SnapSection
        ref={sectionRef}
        id="timeline-scrub-demo"
        aria-label="Timeline scrubbing demo"
        snap="start"
        className="flex items-center justify-center bg-fs-blue"
      >
        <div className="max-w-2xl space-y-6 p-8 text-center text-white">
          <h2
            ref={headingRef}
            className="text-4xl font-bold"
            style={{
              willChange: prefersReduced ? "auto" : "transform, opacity",
              // Ensure initial state is set (will be overridden by timeline)
              transform: prefersReduced ? "translateY(0)" : "translateY(30px)",
              opacity: prefersReduced ? "1" : "0",
            }}
          >
            Scrubbed Heading
          </h2>
          <p
            ref={subheadingRef}
            className="text-lg"
            style={{
              willChange: prefersReduced ? "auto" : "transform, opacity",
              // Ensure initial state is set (will be overridden by timeline)
              transform: prefersReduced ? "translateY(0)" : "translateY(20px)",
              opacity: prefersReduced ? "1" : "0",
            }}
          >
            This text animates smoothly as you scroll. Scroll slowly to see the
            interpolation.
          </p>
          <div className="space-y-4">
            <div className="rounded-lg bg-white/20 p-4">
              <p className="font-semibold">Progress: {progressPercent}%</p>
              <p className="text-sm">
                inView: {inView ? "Yes" : "No"} | Reduced Motion:{" "}
                {prefersReduced ? "Yes" : "No"}
              </p>
              {prefersReduced && (
                <p className="mt-2 text-sm text-yellow-200">
                  Scrubbing disabled due to reduced motion preference
                </p>
              )}
            </div>
            <p className="text-sm text-white/80">
              Scroll slowly to see smooth interpolation. The timeline is
              scrubbed directly from scroll progress, maintaining 60fps with
              requestAnimationFrame throttling.
            </p>
          </div>
        </div>
      </SnapSection>

      <SnapSection
        id="spacer-scrub"
        aria-label="Spacer section for scrubbing demo"
        snap="start"
        className="flex items-center justify-center bg-fs-violet"
      >
        <div className="max-w-2xl space-y-6 p-8 text-center text-white">
          <h2 className="text-4xl font-bold">Spacer Section</h2>
          <p className="text-lg">
            Scroll back up to see the scrubbing effect again. With reduced
            motion enabled, scrubbing is bypassed and content appears in its
            final state.
          </p>
        </div>
      </SnapSection>
    </FullscreenScroll>
  );
}

const meta = {
  title: "Sections/TimelineScrubDemo",
  component: TimelineScrubDemo,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Demonstrates timeline scrubbing with scroll progress. Elements interpolate smoothly as you scroll. With reduced motion enabled, scrubbing is bypassed and content appears in its final state. Uses requestAnimationFrame throttling for 60fps performance.",
      },
    },
  },
} satisfies Meta<typeof TimelineScrubDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
