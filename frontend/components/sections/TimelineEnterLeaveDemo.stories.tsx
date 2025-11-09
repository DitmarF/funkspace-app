"use client";

import type { Meta, StoryObj } from "@storybook/react";
import React, { useRef, useEffect } from "react";

import FullscreenScroll from "../Layouts/FullscreenScroll";
import { useScrollProgress } from "../../hooks/useScrollProgress";
import { HTMLTimeline } from "../../utils/motion/htmlTimeline";
import SnapSection from "./SnapSection";

/**
 * Demo component showing timeline enter/leave controls
 */
function TimelineEnterLeaveDemo() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const timelineRef = useRef<HTMLTimeline | null>(null);

  const { inView } = useScrollProgress(sectionRef, {
    onEnter: () => {
      if (timelineRef.current) {
        timelineRef.current.playFrom(0);
      }
    },
    onLeave: () => {
      if (timelineRef.current) {
        timelineRef.current.reset();
      }
    },
  });

  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;

    // Create timeline with fade and translate animation
    const timeline = new HTMLTimeline(
      [
        {
          element: heading,
          fromTransform: "translateY(20px)",
          toTransform: "translateY(0)",
          fromOpacity: 0,
          toOpacity: 1,
          duration: 400,
          delay: 0,
          easing: "ease-out",
        },
      ],
      {
        onEnter: () => {
          if (process.env.NODE_ENV !== "production") {
            console.log("[TimelineEnterLeaveDemo] Entered");
          }
        },
        onLeave: () => {
          if (process.env.NODE_ENV !== "production") {
            console.log("[TimelineEnterLeaveDemo] Left");
          }
        },
      },
    );

    timelineRef.current = timeline;

    // If already in view, play immediately
    if (inView) {
      timeline.playFrom(0);
    }

    return () => {
      timeline.destroy();
      timelineRef.current = null;
    };
  }, [inView]);

  return (
    <FullscreenScroll snapMode="proximity">
      <SnapSection
        ref={sectionRef}
        id="timeline-demo"
        aria-label="Timeline enter/leave demo"
        snap="start"
        className="flex items-center justify-center bg-fs-blue"
      >
        <div className="max-w-2xl space-y-6 p-8 text-center text-white">
          <h2
            ref={headingRef}
            className="text-4xl font-bold"
            style={{
              willChange: "transform, opacity",
            }}
          >
            Animated Heading
          </h2>
          <div className="space-y-4">
            <div className="rounded-lg bg-white/20 p-4">
              <p className="font-semibold">inView: {inView ? "Yes" : "No"}</p>
              <p className="text-sm">
                Scroll to see the heading fade and translate in on enter, then
                reset when scrolled away.
              </p>
            </div>
            <p className="text-lg">
              This animation uses only transform and opacity for GPU-accelerated
              performance. No layout thrash occurs.
            </p>
          </div>
        </div>
      </SnapSection>

      <SnapSection
        id="spacer"
        aria-label="Spacer section"
        snap="start"
        className="flex items-center justify-center bg-fs-violet"
      >
        <div className="max-w-2xl space-y-6 p-8 text-center text-white">
          <h2 className="text-4xl font-bold">Spacer Section</h2>
          <p className="text-lg">
            Scroll past this section to see the animation reset when the first
            section leaves the viewport.
          </p>
        </div>
      </SnapSection>
    </FullscreenScroll>
  );
}

const meta = {
  title: "Sections/TimelineEnterLeaveDemo",
  component: TimelineEnterLeaveDemo,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Demonstrates timeline enter/leave controls. The heading fades and translates in when the section enters the viewport, and resets when it leaves. Uses only transform and opacity for GPU-accelerated performance.",
      },
    },
  },
} satisfies Meta<typeof TimelineEnterLeaveDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
