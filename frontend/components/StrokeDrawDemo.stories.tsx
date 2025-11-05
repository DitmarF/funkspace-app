"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { useState, useRef, useEffect } from "react";
import { applyStrokeDrawInit, setStrokeDashoffset } from "@/utils/motion/svg";

function StrokeDrawDemo() {
  const pathRef = useRef<SVGPathElement>(null);
  const [isDrawn, setIsDrawn] = useState(false);
  const [totalLength, setTotalLength] = useState(0);

  useEffect(() => {
    if (pathRef.current) {
      const length = applyStrokeDrawInit(pathRef.current);
      setTotalLength(length);
    }
  }, []);

  const handleToggle = () => {
    if (pathRef.current) {
      if (isDrawn) {
        // Hide: set offset to total length
        setStrokeDashoffset(pathRef.current, totalLength);
      } else {
        // Show: set offset to 0
        setStrokeDashoffset(pathRef.current, 0);
      }
      setIsDrawn(!isDrawn);
    }
  };

  return (
    <div className="space-y-4 p-6">
      <div>
        <h2 className="text-xl font-bold mb-2">SVG Stroke Draw Demo</h2>
        <p className="text-sm text-gray-600 mb-4">
          Demonstrates stroke draw animation using stroke-dasharray and
          stroke-dashoffset. Click the button to animate from 100% offset
          (hidden) to 0 (visible).
        </p>
        <div className="mb-4">
          <p className="text-sm">
            Path length: <strong>{totalLength.toFixed(2)}</strong> pixels
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleToggle}
          className="px-4 py-2 bg-fs-action-primary text-fs-white rounded-lg font-medium transition-colors hover:bg-fs-blue"
        >
          {isDrawn ? "Hide Path" : "Draw Path"}
        </button>
        <div className="text-sm text-gray-600">
          Status:{" "}
          {isDrawn ? "Drawn (offset = 0)" : "Hidden (offset = total length)"}
        </div>
      </div>

      <div className="border border-fs-border-subtle rounded-lg p-4 bg-white">
        <svg
          width="400"
          height="200"
          viewBox="0 0 400 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            ref={pathRef}
            id="demo-path"
            d="M 50 100 Q 150 20, 250 100 T 350 100"
            fill="none"
            stroke="#000"
            strokeWidth="4"
            style={{
              transition:
                "stroke-dashoffset 800ms cubic-bezier(0.05, 0.7, 0.1, 1)",
            }}
          />
        </svg>
      </div>

      <div className="p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">How it works:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>
            <code>applyStrokeDrawInit()</code> sets{" "}
            <code>stroke-dasharray</code> to total path length
          </li>
          <li>
            Initial <code>stroke-dashoffset</code> is set to total length (path
            is hidden)
          </li>
          <li>
            Animating <code>stroke-dashoffset</code> from total length → 0
            reveals the path
          </li>
          <li>
            CSS transition handles the smooth animation (800ms, emph easing)
          </li>
        </ol>
      </div>
    </div>
  );
}

const meta = {
  title: "Components/StrokeDrawDemo",
  component: StrokeDrawDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Demonstration of SVG stroke draw animation using stroke-dasharray and stroke-dashoffset. This is the foundation for the logo animation timeline.",
      },
    },
  },
} satisfies Meta<typeof StrokeDrawDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
