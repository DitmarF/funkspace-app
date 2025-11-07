"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { useState, useRef, useEffect } from "react";
import { LogoMotion, type LogoMotionRef } from "./LogoMotion";
import type { LogoMotionProps } from "./LogoMotion";

const meta: Meta<typeof LogoMotion> = {
  title: "Components/LogoMotion",
  component: LogoMotion,
  args: {
    enabled: true,
    autoPlay: true,
    speed: 1,
    pathCount: 10,
    className: "max-w-[420px] w-full",
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Animated FunkSpace logo with timeline-based stroke draw and fill fade. Respects reduced motion preferences and feature flag.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    enabled: {
      control: { type: "boolean" },
      description:
        "Override feature flag for testing. In production, uses NEXT_PUBLIC_ANIMATIONS_ENABLED env var.",
      table: {
        type: { summary: "boolean | undefined" },
        defaultValue: { summary: "undefined (uses env var)" },
      },
    },
    autoPlay: {
      control: { type: "boolean" },
      description: "Whether to start animation automatically",
    },
    speed: {
      control: { type: "number", min: 0, max: 3, step: 0.1 },
      description: "Animation playback speed multiplier",
    },
    pathCount: {
      control: { type: "number", min: 1, max: 10, step: 1 },
      description: "Number of logo paths to animate",
    },
    startAtMs: {
      control: { type: "number", min: 0, step: 50 },
      description:
        "Start animation at a specific time (ms) instead of beginning",
    },
  },
};

export default meta;
type Story = StoryObj<typeof LogoMotion>;

/**
 * Default story - auto-plays the animation
 */
export const Default: Story = {
  args: {
    autoPlay: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Logo animation plays automatically. All 10 paths animate with staggered delays. " +
          "Total duration: ~1880ms. Component properly initializes timeline on mount and cleans up on unmount.",
      },
    },
  },
};

/**
 * Start at specific time - demonstrates startAtMs prop
 */
export const StartAtTime: Story = {
  args: {
    autoPlay: true,
    speed: 1,
    pathCount: 10,
    enabled: true,
    startAtMs: 1000, // Start animation at 1000ms (mid-animation)
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates the startAtMs prop. Animation starts at 1000ms instead of the beginning, " +
          "allowing the logo to appear partially animated from the start.",
      },
    },
  },
};

/**
 * Simple Controls component - Play, Pause, and Reverse buttons
 */
function ControlsStory(args: LogoMotionProps) {
  const timelineRef = useRef<LogoMotionRef>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReversed, setIsReversed] = useState(false);

  const handlePlay = () => {
    const timeline = timelineRef.current;
    if (!timeline) {
      console.warn("[ControlsStory] Timeline ref is null");
      return;
    }

    if (!timeline.isReady?.()) {
      console.warn("[ControlsStory] Timeline is not ready");
      return;
    }

    try {
      // Reset to forward direction if reversed
      if (isReversed) {
        timeline.reverse();
        setIsReversed(false);
      }
      timeline.seek(0);
      timeline.play();
      setIsPlaying(true);
      console.log("[ControlsStory] Play clicked - animation started");
    } catch (error) {
      console.error("[ControlsStory] Error calling play:", error);
    }
  };

  const handlePause = () => {
    const timeline = timelineRef.current;
    if (!timeline) {
      console.warn("[ControlsStory] Timeline ref is null");
      return;
    }

    try {
      timeline.pause();
      setIsPlaying(false);
      console.log("[ControlsStory] Pause clicked - animation paused");
    } catch (error) {
      console.error("[ControlsStory] Error calling pause:", error);
    }
  };

  const handleReverse = () => {
    const timeline = timelineRef.current;
    if (!timeline) {
      console.warn("[ControlsStory] Timeline ref is null");
      return;
    }

    if (!timeline.isReady?.()) {
      console.warn("[ControlsStory] Timeline is not ready");
      return;
    }

    try {
      // Toggle direction
      timeline.reverse();
      const newReversedState = !isReversed;
      setIsReversed(newReversedState);
      
      // If animation is paused/done, start playing in the new direction
      if (!isPlaying) {
        // If going reverse, seek to end first, if forward, seek to beginning
        if (newReversedState) {
          // Playing backwards - start from end
          timeline.seek(1880); // Estimated duration
        } else {
          // Playing forwards - start from beginning
          timeline.seek(0);
        }
        timeline.play();
        setIsPlaying(true);
        console.log(
          `[ControlsStory] Reverse clicked - playing ${newReversedState ? "backwards" : "forwards"}`,
        );
      } else {
        // If already playing, just toggle direction (timeline handles this)
        console.log("[ControlsStory] Reverse clicked - direction toggled while playing");
      }
    } catch (error) {
      console.error("[ControlsStory] Error calling reverse:", error);
    }
  };

  // Detect when animation finishes (estimated duration: ~1880ms)
  useEffect(() => {
    if (!isPlaying) return;

    const estimatedDuration = 1880; // ms
    const timeout = setTimeout(() => {
      // Animation should have finished by now
      setIsPlaying(false);
      console.log("[ControlsStory] Animation finished - Play button available");
    }, estimatedDuration + 100); // Add small buffer

    return () => clearTimeout(timeout);
  }, [isPlaying]);

  return (
    <div className="space-y-6 p-6 max-w-2xl">
      {/* Logo display */}
      <div className="border rounded-lg p-4 bg-white">
        <LogoMotion
          {...args}
          ref={timelineRef}
          autoPlay={false}
        />
      </div>

      {/* Simple Controls - Play, Pause, and Reverse */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h3 className="text-lg font-semibold mb-4">Controls</h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handlePlay}
            disabled={isPlaying}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Play
          </button>
          <button
            type="button"
            onClick={handlePause}
            disabled={!isPlaying}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Pause
          </button>
          <button
            type="button"
            onClick={handleReverse}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Reverse {isReversed ? "→" : "←"}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Simple Controls story - just Play and Pause buttons for testing
 */
export const Controls: Story = {
  args: {
    autoPlay: false,
    pathCount: 10,
    enabled: true,
  },
  render: ControlsStory,
  parameters: {
    docs: {
      description: {
        story:
          "Simple controls with Play and Pause buttons. Click Play to start the animation from the beginning.",
      },
    },
  },
};

/**
 * Reduced motion story component
 */
function ReducedMotionStory(args: LogoMotionProps) {
  return (
    <div className="space-y-4 p-6">
      <div className="border rounded-lg p-4">
        <LogoMotion {...args} />
      </div>
      <div className="space-y-2 text-sm text-gray-600 max-w-md">
        <p>
          To test reduced motion: Enable &quot;Reduce motion&quot; in your
          system preferences, or use browser dev tools to simulate the
          preference.
        </p>
        <p className="text-xs text-gray-500">
          Reference:{" "}
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            MDN: prefers-reduced-motion
          </a>
        </p>
      </div>
    </div>
  );
}

/**
 * Reduced motion story - demonstrates static fallback
 */
export const ReducedMotion: Story = {
  args: {
    autoPlay: true,
    speed: 1,
    pathCount: 10,
  },
  parameters: {
    docs: {
      description: {
        story:
          "When `prefers-reduced-motion: reduce` is active, the logo renders in its final static state immediately without animation. " +
          "The component uses the `useReducedMotion()` hook to detect the user's preference via the CSS media query. " +
          "See [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) for more information.",
      },
    },
    // Note: This story demonstrates the concept, but actual reduced motion
    // detection happens at runtime via window.matchMedia
  },
  render: ReducedMotionStory,
};

/**
 * Feature flag toggle story component
 */
function FeatureFlagToggleStory(args: LogoMotionProps) {
  const [enabled, setEnabled] = useState(args.enabled ?? false);

  return (
    <div className="space-y-4 p-6 max-w-2xl">
      <div className="border rounded-lg p-4">
        <LogoMotion {...args} enabled={enabled} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">
              Enable Animations (Feature Flag)
            </span>
          </label>
        </div>

        <div className="p-3 bg-gray-50 rounded text-sm text-gray-700 space-y-1">
          <p>
            <strong>Current state:</strong>{" "}
            {enabled ? (
              <span className="text-green-600">Animations enabled</span>
            ) : (
              <span className="text-gray-600">Static fallback</span>
            )}
          </p>
          <p className="text-xs text-gray-600">
            In production, this is controlled by the{" "}
            <code className="px-1 py-0.5 bg-gray-200 rounded text-xs">
              NEXT_PUBLIC_ANIMATIONS_ENABLED
            </code>{" "}
            environment variable. Toggle the checkbox above to simulate
            enabling/disabling the feature flag.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Feature flag toggle - demonstrates feature flag behavior
 */
export const FeatureFlagToggle: Story = {
  args: {
    autoPlay: true,
    speed: 1,
    pathCount: 10,
    enabled: false, // Default to off (matches production default)
  },
  render: FeatureFlagToggleStory,
  parameters: {
    docs: {
      description: {
        story:
          "Interactive demonstration of the feature flag. Toggle the checkbox to switch between animated and static states. " +
          "In production, this is controlled by the NEXT_PUBLIC_ANIMATIONS_ENABLED environment variable.",
      },
    },
  },
};

/**
 * Feature flag off - demonstrates static fallback
 */
export const FeatureFlagOff: Story = {
  args: {
    autoPlay: true,
    speed: 1,
    pathCount: 10,
    enabled: false, // Explicitly disabled
  },
  parameters: {
    docs: {
      description: {
        story:
          "When the feature flag is disabled (or NEXT_PUBLIC_ANIMATIONS_ENABLED is not set to 'true'), " +
          "the logo renders statically without any animation.",
      },
    },
  },
};
