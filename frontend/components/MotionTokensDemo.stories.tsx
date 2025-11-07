"use client";

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";

function MotionTokensDemo() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Motion Tokens Demo</h2>
        <p className="text-sm text-gray-600 mb-4">
          Demonstrating motion tokens via Tailwind classes and CSS variables.
        </p>
      </div>

      {/* Duration tokens */}
      <div className="space-y-4">
        <h3 className="font-semibold">Duration Tokens</h3>
        <div className="space-y-2">
          {[
            { token: "duration-100", label: "100ms (quick)" },
            { token: "duration-200", label: "200ms" },
            { token: "duration-400", label: "400ms" },
            { token: "duration-800", label: "800ms (path draw)" },
          ].map(({ token, label }) => (
            <div key={token} className="flex items-center gap-4">
              <div className="w-32 text-sm">{label}</div>
              <div className="flex-1">
                <div
                  className={`h-8 bg-fs-action-primary transition-all ${token} ${isExpanded ? "w-full" : "w-20"}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Easing tokens */}
      <div className="space-y-4">
        <h3 className="font-semibold">Easing Tokens</h3>
        <div className="space-y-2">
          {[
            { token: "ease-standard", label: "Standard" },
            { token: "ease-emph", label: "Emphatic" },
          ].map(({ token, label }) => (
            <div key={token} className="flex items-center gap-4">
              <div className="w-32 text-sm">{label}</div>
              <div className="flex-1">
                <div
                  className={`h-8 bg-fs-action-hover transition-all duration-800 ${token} ${isExpanded ? "w-full" : "w-20"}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Combined demo */}
      <div className="space-y-4">
        <h3 className="font-semibold">
          Combined: duration-800 + ease-standard
        </h3>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-2 bg-fs-action-primary text-fs-white rounded-lg font-medium"
          >
            Toggle Animation
          </button>
          <div className="flex-1">
            <div
              className={`h-12 bg-fs-action-primary transition-all duration-800 ease-standard ${isExpanded ? "w-full rounded-lg" : "w-20 rounded-full"}`}
            />
          </div>
        </div>
      </div>

      {/* CSS Variables display */}
      <div className="space-y-2 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold">CSS Variables (computed values)</h3>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div>
            <div className="font-semibold">Durations:</div>
            <div>--fs-motion-duration-100: 120ms</div>
            <div>--fs-motion-duration-200: 200ms</div>
            <div>--fs-motion-duration-400: 400ms</div>
            <div>--fs-motion-duration-800: 800ms</div>
          </div>
          <div>
            <div className="font-semibold">Easings:</div>
            <div>--fs-motion-ease-standard: cubic-bezier(0.2, 0, 0, 1)</div>
            <div>--fs-motion-ease-emph: cubic-bezier(0.05, 0.7, 0.1, 1)</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const meta = {
  title: "Foundations/MotionTokens",
  component: MotionTokensDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Demonstration of motion tokens (durations and easings) available via Tailwind classes and CSS variables. Click the button to see transitions in action.",
      },
    },
  },
} satisfies Meta<typeof MotionTokensDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
