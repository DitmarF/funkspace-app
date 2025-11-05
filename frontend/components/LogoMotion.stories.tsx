"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { useState, useRef, useEffect } from "react";
import { LogoMotion, type LogoMotionRef } from "./LogoMotion";
import type { LogoMotionProps } from "./LogoMotion";

const meta: Meta<typeof LogoMotion> = {
  title: "Components/LogoMotion",
  component: LogoMotion,
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
    speed: 1,
    pathCount: 3,
    enabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Logo animation plays automatically. First 3 paths animate with staggered delays. " +
          "Component properly initializes timeline on mount and cleans up on unmount.",
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
    pathCount: 3,
    enabled: true,
    startAtMs: 500, // Start animation at 500ms (mid-animation)
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates the startAtMs prop. Animation starts at 500ms instead of the beginning, " +
          "allowing the logo to appear partially animated from the start.",
      },
    },
  },
};

/**
 * Controls component for interactive story with Storybook args
 */
function ControlsStory(
  args: LogoMotionProps & {
    playing?: boolean;
    reversed?: boolean;
    timeMs?: number;
    speed?: number;
  },
) {
  const timelineRef = useRef<LogoMotionRef>(null);
  const [isPlaying, setIsPlaying] = useState(args.playing ?? false);
  const [isReversed, setIsReversed] = useState(args.reversed ?? false);
  const [currentTime, setCurrentTime] = useState(args.timeMs ?? 0);
  const [speed, setSpeed] = useState(args.speed ?? 1);
  const estimatedDuration = 1500; // Estimated duration for 3 paths

  // Sync playing state from args
  useEffect(() => {
    if (args.playing !== undefined && args.playing !== isPlaying) {
      if (args.playing) {
        timelineRef.current?.play();
        setIsPlaying(true);
      } else {
        timelineRef.current?.pause();
        setIsPlaying(false);
      }
    }
  }, [args.playing, isPlaying]);

  // Sync reversed state from args
  useEffect(() => {
    if (args.reversed !== undefined && args.reversed !== isReversed) {
      timelineRef.current?.reverse();
      setIsReversed(args.reversed);
    }
  }, [args.reversed, isReversed]);

  // Sync timeMs from args
  useEffect(() => {
    if (args.timeMs !== undefined && args.timeMs !== currentTime) {
      timelineRef.current?.seek(args.timeMs);
      setCurrentTime(args.timeMs);
    }
  }, [args.timeMs, currentTime]);

  // Sync speed from args
  useEffect(() => {
    if (args.speed !== undefined && args.speed !== speed) {
      timelineRef.current?.setSpeed(args.speed);
      setSpeed(args.speed);
    }
  }, [args.speed, speed]);

  // Poll timeline time for display (optional, for real-time feedback)
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      // Note: We can't read timeline.time directly, so we track state
      // In a real implementation, you might expose a getTime() method
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="space-y-6 p-6 max-w-2xl">
      {/* Logo display */}
      <div className="border rounded-lg p-4 bg-white">
        <LogoMotion
          {...args}
          ref={timelineRef}
          autoPlay={false}
          speed={speed}
        />
      </div>

      {/* Controls panel - minimal layout */}
      <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
        <h3 className="text-lg font-semibold">Timeline Controls</h3>

        {/* Play/Pause/Reverse buttons - minimal panel */}
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => {
              timelineRef.current?.play();
              setIsPlaying(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={isPlaying}
          >
            Play
          </button>
          <button
            type="button"
            onClick={() => {
              timelineRef.current?.pause();
              setIsPlaying(false);
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
            disabled={!isPlaying}
          >
            Pause
          </button>
          <button
            type="button"
            onClick={() => {
              timelineRef.current?.reverse();
              setIsReversed(!isReversed);
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Reverse {isReversed ? "→" : "←"}
          </button>
        </div>

        {/* Speed control */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Speed: {speed}x</label>
          <input
            type="range"
            min="0"
            max="3"
            step="0.1"
            value={speed}
            onChange={(e) => {
              const newSpeed = parseFloat(e.target.value);
              setSpeed(newSpeed);
              timelineRef.current?.setSpeed(newSpeed);
            }}
            className="w-full"
          />
          <div className="flex gap-2 text-xs text-gray-600">
            <button
              type="button"
              onClick={() => {
                setSpeed(0.5);
                timelineRef.current?.setSpeed(0.5);
              }}
              className="px-2 py-1 border rounded hover:bg-gray-100"
            >
              0.5×
            </button>
            <button
              type="button"
              onClick={() => {
                setSpeed(1);
                timelineRef.current?.setSpeed(1);
              }}
              className="px-2 py-1 border rounded hover:bg-gray-100"
            >
              1×
            </button>
            <button
              type="button"
              onClick={() => {
                setSpeed(2);
                timelineRef.current?.setSpeed(2);
              }}
              className="px-2 py-1 border rounded hover:bg-gray-100"
            >
              2×
            </button>
          </div>
        </div>

        {/* Time scrubber */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Scrub: {currentTime.toFixed(0)}ms
          </label>
          <input
            type="range"
            min="0"
            max={estimatedDuration}
            step="10"
            value={currentTime}
            onChange={(e) => {
              const time = parseInt(e.target.value);
              setCurrentTime(time);
              timelineRef.current?.seek(time);
            }}
            className="w-full"
          />
          <div className="text-xs text-gray-600">
            Duration: ~{estimatedDuration.toFixed(0)}ms (estimated)
          </div>
          <div className="text-xs text-gray-500">
            Note: Duration is estimated. For first 3 paths: stroke (800ms) +
            fill (200ms) + delays (240ms) ≈ 1240ms
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Story with interactive controls for play/pause/reverse/seek/speed
 * Includes Storybook args that can be controlled via the Controls panel
 */
export const Controls: Story = {
  args: {
    autoPlay: false,
    pathCount: 3,
    enabled: true,
    playing: false,
    reversed: false,
    timeMs: 0,
    speed: 1,
  },
  argTypes: {
    playing: {
      control: { type: "boolean" },
      description: "Whether the animation is currently playing",
      table: {
        type: { summary: "boolean" },
      },
    },
    reversed: {
      control: { type: "boolean" },
      description: "Whether the animation is playing in reverse",
      table: {
        type: { summary: "boolean" },
      },
    },
    timeMs: {
      control: { type: "number", min: 0, max: 1500, step: 10 },
      description: "Current timeline time in milliseconds (for scrubbing)",
      table: {
        type: { summary: "number" },
      },
    },
    speed: {
      control: { type: "number", min: 0, max: 3, step: 0.1 },
      description: "Animation playback speed multiplier",
      table: {
        type: { summary: "number" },
      },
    },
  },
  render: ControlsStory,
  parameters: {
    docs: {
      description: {
        story:
          "Interactive controls for play, pause, reverse, speed adjustment, and timeline scrubbing. " +
          "Use the Controls panel to manipulate `playing`, `reversed`, `timeMs`, and `speed` args. " +
          "Changes are immediately reflected in the animation.",
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
    pathCount: 3,
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
    pathCount: 3,
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
    pathCount: 3,
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
