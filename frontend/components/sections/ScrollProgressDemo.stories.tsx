"use client";

import type { Meta, StoryObj } from "@storybook/react";
import React, { useRef } from "react";

import FullscreenScroll from "../Layouts/FullscreenScroll";
import { useScrollProgress } from "../../hooks/useScrollProgress";
import SnapSection from "./SnapSection";

/**
 * Demo component showing scroll progress tracking
 */
function ScrollProgressDemo() {
  const section1Ref = useRef<HTMLElement>(null);
  const section2Ref = useRef<HTMLElement>(null);
  const section3Ref = useRef<HTMLElement>(null);

  const progress1 = useScrollProgress(section1Ref);
  const progress2 = useScrollProgress(section2Ref);
  const progress3 = useScrollProgress(section3Ref);

  return (
    <FullscreenScroll snapMode="proximity">
      {/* Fixed progress bar at top */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-fs-grey-bright-2">
        <div
          className="h-full bg-fs-action-primary transition-all duration-100"
          style={{ width: `${progress1.progress * 100}%` }}
        />
      </div>

      <SnapSection
        ref={section1Ref}
        id="section-1"
        aria-label="Section 1 with progress tracking"
        snap="start"
        className="flex items-center justify-center bg-fs-blue"
      >
        <div className="max-w-2xl space-y-6 p-8 text-center text-white">
          <h2 className="text-4xl font-bold">Section 1</h2>
          <div className="space-y-4">
            <div className="rounded-lg bg-white/20 p-4">
              <p className="font-semibold">
                Progress: {progress1.progress.toFixed(2)}
              </p>
              <p className="text-sm">
                inView: {progress1.inView ? "Yes" : "No"}
              </p>
            </div>
            <p className="text-lg">
              Scroll to see the progress bar at the top grow from 0 to 1. The
              progress value updates as you scroll through this section.
            </p>
          </div>
        </div>
      </SnapSection>

      <SnapSection
        ref={section2Ref}
        id="section-2"
        aria-label="Section 2 with progress tracking"
        snap="start"
        className="flex items-center justify-center bg-fs-violet"
      >
        <div className="max-w-2xl space-y-6 p-8 text-center text-white">
          <h2 className="text-4xl font-bold">Section 2</h2>
          <div className="space-y-4">
            <div className="rounded-lg bg-white/20 p-4">
              <p className="font-semibold">
                Progress: {progress2.progress.toFixed(2)}
              </p>
              <p className="text-sm">
                inView: {progress2.inView ? "Yes" : "No"}
              </p>
            </div>
            <p className="text-lg">
              Each section tracks its own scroll progress independently. The
              progress bar shows Section 1&apos;s progress.
            </p>
          </div>
        </div>
      </SnapSection>

      <SnapSection
        ref={section3Ref}
        id="section-3"
        aria-label="Section 3 with progress tracking"
        snap="start"
        className="flex items-center justify-center bg-fs-cyan"
      >
        <div className="max-w-2xl space-y-6 p-8 text-center text-white">
          <h2 className="text-4xl font-bold">Section 3</h2>
          <div className="space-y-4">
            <div className="rounded-lg bg-white/20 p-4">
              <p className="font-semibold">
                Progress: {progress3.progress.toFixed(2)}
              </p>
              <p className="text-sm">
                inView: {progress3.inView ? "Yes" : "No"}
              </p>
            </div>
            <p className="text-lg">
              The `inView` value flips at the Intersection Observer thresholds
              (0.2 and 0.8). Progress smoothly goes from 0 to 1 as you scroll.
            </p>
          </div>
        </div>
      </SnapSection>
    </FullscreenScroll>
  );
}

const meta = {
  title: "Sections/ScrollProgressDemo",
  component: ScrollProgressDemo,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Demonstrates the useScrollProgress hook. Shows a progress bar at the top that grows from 0 to 1 as you scroll through Section 1. Each section displays its own progress and inView status.",
      },
    },
  },
} satisfies Meta<typeof ScrollProgressDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
