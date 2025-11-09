"use client";

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import FullscreenScroll from "../Layouts/FullscreenScroll";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import SnapSection from "./SnapSection";

/**
 * Demo component showing reduced motion behavior
 */
function ReducedMotionDemo() {
  const prefersReduced = useReducedMotion();

  return (
    <FullscreenScroll snapMode="mandatory">
      <SnapSection
        id="reduced-motion-info"
        aria-label="Reduced motion information"
        snap="start"
        className="flex items-center justify-center bg-fs-blue"
      >
        <div className="max-w-2xl space-y-6 p-8 text-center text-white">
          <h2 className="text-4xl font-bold">
            Reduced Motion: {prefersReduced ? "Active" : "Inactive"}
          </h2>
          <p className="text-lg">
            {prefersReduced
              ? "Animations are disabled. Content is static and readable."
              : "Animations are enabled. Toggle 'Reduce motion' in your OS settings to see the difference."}
          </p>
          <div className="mt-8 space-y-4">
            <div
              className="motion-fade-in rounded-lg bg-white/20 p-4 transition-all duration-normal ease-out hover:bg-white/30"
              style={{
                animation: prefersReduced
                  ? "none"
                  : "fadeIn 0.4s ease-out forwards",
              }}
            >
              <p className="font-semibold">Animated Box 1</p>
              <p className="text-sm">
                This box should {prefersReduced ? "not" : ""} animate
              </p>
            </div>
            <div
              className="motion-slide-up rounded-lg bg-white/20 p-4 transition-all duration-normal ease-out hover:bg-white/30"
              style={{
                animation: prefersReduced
                  ? "none"
                  : "slideUp 0.4s ease-out 0.1s forwards",
              }}
            >
              <p className="font-semibold">Animated Box 2</p>
              <p className="text-sm">
                This box should {prefersReduced ? "not" : ""} animate
              </p>
            </div>
          </div>
        </div>
      </SnapSection>
      <SnapSection
        id="static-content"
        aria-label="Static content section"
        snap="start"
        className="flex items-center justify-center bg-fs-violet"
      >
        <div className="max-w-2xl space-y-6 p-8 text-center text-white">
          <h2 className="text-4xl font-bold">Static Content</h2>
          <p className="text-lg">
            This section demonstrates that content remains readable and
            accessible when motion is reduced. No layout shifts occur.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-white/20 p-4">
              <p className="font-semibold">Card 1</p>
              <p className="text-sm">Content is always visible</p>
            </div>
            <div className="rounded-lg bg-white/20 p-4">
              <p className="font-semibold">Card 2</p>
              <p className="text-sm">No missing content</p>
            </div>
            <div className="rounded-lg bg-white/20 p-4">
              <p className="font-semibold">Card 3</p>
              <p className="text-sm">Layout is stable</p>
            </div>
            <div className="rounded-lg bg-white/20 p-4">
              <p className="font-semibold">Card 4</p>
              <p className="text-sm">Accessibility maintained</p>
            </div>
          </div>
        </div>
      </SnapSection>
    </FullscreenScroll>
  );
}

const meta = {
  title: "Sections/ReducedMotionDemo",
  component: ReducedMotionDemo,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Demonstrates reduced motion behavior. Toggle 'Reduce motion' in your OS settings to see animations disabled. Content remains readable and accessible with no layout shifts.",
      },
    },
  },
} satisfies Meta<typeof ReducedMotionDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
