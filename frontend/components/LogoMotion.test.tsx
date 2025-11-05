/**
 * Component tests for LogoMotion
 * Tests animation behavior, reduced motion, and feature flag handling
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { createRef } from "react";
import { LogoMotion } from "./LogoMotion";
import type { LogoMotionRef } from "./LogoMotion";
import { AnimationTimeline } from "@/utils/motion/timeline";

// Type for the mock timeline instance
type MockTimeline = {
  play: ReturnType<typeof vi.fn>;
  pause: ReturnType<typeof vi.fn>;
  reverse: ReturnType<typeof vi.fn>;
  seek: ReturnType<typeof vi.fn>;
  setSpeed: ReturnType<typeof vi.fn>;
  destroy: ReturnType<typeof vi.fn>;
  duration: number;
  time: number;
};

// Mock SVG utilities to avoid needing full SVG DOM support in jsdom
vi.mock("@/utils/motion/svg", () => ({
  getPathLength: vi.fn(() => 100), // Return a mock path length
  applyStrokeDrawInit: vi.fn(() => 100), // Return mock length
  setStrokeDashoffset: vi.fn(),
  applyNumericStyle: vi.fn(),
}));

// Mock logoManifest to return a simple manifest
vi.mock("@/data/logoManifest", () => ({
  buildLogoManifest: vi.fn(() => ({
    steps: [
      {
        target: "#logo-path-1",
        property: "strokeDashoffset",
        from: 100,
        to: 0,
        duration: 800,
        easing: "emph",
        delay: 0,
      },
      {
        target: "#logo-path-1",
        property: "opacity",
        from: 0,
        to: 1,
        duration: 200,
        delay: 100,
      },
    ],
  })),
}));

// Mock the AnimationTimeline to avoid needing actual SVG elements in tests
vi.mock("@/utils/motion/timeline", () => ({
  AnimationTimeline: vi.fn().mockImplementation(() => ({
    play: vi.fn(),
    pause: vi.fn(),
    reverse: vi.fn(),
    seek: vi.fn(),
    setSpeed: vi.fn(),
    destroy: vi.fn(),
    get duration() {
      return 1880;
    },
    get time() {
      return 0;
    },
  })),
}));

// Mock useReducedMotion hook
vi.mock("@/hooks/useReducedMotion", () => ({
  useReducedMotion: vi.fn(() => false),
}));

describe("LogoMotion", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset env
    process.env = { ...originalEnv };
    // Reset AnimationTimeline mock call count
    vi.mocked(AnimationTimeline).mockClear();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("rendering", () => {
    it("should render the SVG logo", () => {
      render(<LogoMotion enabled={true} />);
      const svg = screen.getByRole("img", { name: /funkspace logo/i });
      expect(svg).toBeInTheDocument();
      expect(svg.tagName).toBe("svg");
    });

    it("should render with custom aria-label", () => {
      render(<LogoMotion enabled={true} aria-label="Custom label" />);
      // Use querySelector to find by aria-label since getByRole might not work with custom label in jsdom
      const svg = document.querySelector('svg[aria-label="Custom label"]');
      expect(svg).toBeInTheDocument();
    });
  });

  describe("feature flag", () => {
    it("should not animate when feature flag is disabled", async () => {
      render(<LogoMotion enabled={false} />);

      await waitFor(() => {
        // Timeline should not be created when disabled
        expect(AnimationTimeline).not.toHaveBeenCalled();
      });
    });

    it("should not animate when NEXT_PUBLIC_ANIMATIONS_ENABLED is not set", async () => {
      delete process.env.NEXT_PUBLIC_ANIMATIONS_ENABLED;
      render(<LogoMotion />);

      await waitFor(() => {
        // Timeline should not be created
        expect(AnimationTimeline).not.toHaveBeenCalled();
      });
    });

    it("should animate when feature flag is enabled", async () => {
      render(<LogoMotion enabled={true} />);

      await waitFor(() => {
        // Timeline should be created
        expect(AnimationTimeline).toHaveBeenCalled();
      });
    });

    it("should use env var when enabled prop is undefined", async () => {
      process.env.NEXT_PUBLIC_ANIMATIONS_ENABLED = "true";
      render(<LogoMotion />);

      await waitFor(() => {
        // Timeline should be created
        expect(AnimationTimeline).toHaveBeenCalled();
      });
    });
  });

  describe("reduced motion", () => {
    it("should not animate when reduced motion is preferred", async () => {
      const { useReducedMotion } = await import("@/hooks/useReducedMotion");
      vi.mocked(useReducedMotion).mockReturnValue(true);

      render(<LogoMotion enabled={true} />);

      await waitFor(() => {
        // Timeline should not be created when reduced motion is preferred
        expect(AnimationTimeline).not.toHaveBeenCalled();
      });
    });

    it("should render static final state when reduced motion is preferred", async () => {
      const { useReducedMotion } = await import("@/hooks/useReducedMotion");
      vi.mocked(useReducedMotion).mockReturnValue(true);

      render(<LogoMotion enabled={true} />);
      const svg = screen.getByRole("img");

      // Wait for SVG to be initialized
      await waitFor(() => {
        expect(svg).toBeInTheDocument();
      });

      // SVG should still render (just without animation)
      expect(svg).toBeInTheDocument();
    });
  });

  describe("autoPlay", () => {
    it("should auto-play when autoPlay is true", async () => {
      const mockTimeline: MockTimeline = {
        play: vi.fn(),
        pause: vi.fn(),
        reverse: vi.fn(),
        seek: vi.fn(),
        setSpeed: vi.fn(),
        destroy: vi.fn(),
        duration: 1880,
        time: 0,
      };

      vi.mocked(AnimationTimeline).mockReturnValue(
        mockTimeline as unknown as InstanceType<typeof AnimationTimeline>,
      );

      render(<LogoMotion enabled={true} autoPlay={true} />);

      // Wait for component to mount and useEffect to run
      await waitFor(
        () => {
          expect(AnimationTimeline).toHaveBeenCalled();
        },
        { timeout: 1000 },
      );

      // Then check that play was called
      expect(mockTimeline.play).toHaveBeenCalled();
    });

    it("should not auto-play when autoPlay is false", async () => {
      const mockTimeline: MockTimeline = {
        play: vi.fn(),
        pause: vi.fn(),
        reverse: vi.fn(),
        seek: vi.fn(),
        setSpeed: vi.fn(),
        destroy: vi.fn(),
        duration: 1880,
        time: 0,
      };

      vi.mocked(AnimationTimeline).mockReturnValue(
        mockTimeline as unknown as InstanceType<typeof AnimationTimeline>,
      );

      render(<LogoMotion enabled={true} autoPlay={false} />);

      // Wait for SVG to render, then check that timeline was created
      await waitFor(() => {
        const svg = screen.getByRole("img");
        expect(svg).toBeInTheDocument();
      });

      // AnimationTimeline should be called (but play should not)
      expect(AnimationTimeline).toHaveBeenCalled();
      expect(mockTimeline.play).not.toHaveBeenCalled();
    });
  });

  describe("ref methods", () => {
    it("should expose play, pause, reverse, seek, and setSpeed via ref", async () => {
      const mockTimeline: MockTimeline = {
        play: vi.fn(),
        pause: vi.fn(),
        reverse: vi.fn(),
        seek: vi.fn(),
        setSpeed: vi.fn(),
        destroy: vi.fn(),
        duration: 1880,
        time: 0,
      };

      vi.mocked(AnimationTimeline).mockReturnValue(
        mockTimeline as unknown as InstanceType<typeof AnimationTimeline>,
      );

      const ref = createRef<LogoMotionRef>();
      render(<LogoMotion ref={ref} enabled={true} autoPlay={false} />);

      await waitFor(() => {
        expect(ref.current).not.toBeNull();
      });

      if (ref.current) {
        ref.current.play();
        expect(mockTimeline.play).toHaveBeenCalled();

        ref.current.pause();
        expect(mockTimeline.pause).toHaveBeenCalled();

        ref.current.reverse();
        expect(mockTimeline.reverse).toHaveBeenCalled();

        ref.current.seek(500);
        expect(mockTimeline.seek).toHaveBeenCalledWith(500);

        ref.current.setSpeed(2);
        expect(mockTimeline.setSpeed).toHaveBeenCalledWith(2);
      }
    });
  });

  describe("cleanup", () => {
    it("should cleanup timeline on unmount", async () => {
      const mockTimeline: MockTimeline = {
        play: vi.fn(),
        pause: vi.fn(),
        reverse: vi.fn(),
        seek: vi.fn(),
        setSpeed: vi.fn(),
        destroy: vi.fn(),
        duration: 1880,
        time: 0,
      };

      vi.mocked(AnimationTimeline).mockReturnValue(
        mockTimeline as unknown as InstanceType<typeof AnimationTimeline>,
      );

      const { unmount } = render(<LogoMotion enabled={true} />);

      // Wait for SVG to render
      await waitFor(() => {
        const svg = screen.getByRole("img");
        expect(svg).toBeInTheDocument();
      });

      // AnimationTimeline should be called
      expect(AnimationTimeline).toHaveBeenCalled();

      unmount();

      expect(mockTimeline.pause).toHaveBeenCalled();
      expect(mockTimeline.destroy).toHaveBeenCalled();
    });
  });
});
