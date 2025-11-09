import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import About from "./About";
import { HTMLTimeline } from "@/infrastructure/motion/htmlTimeline";
import type { ThemeService } from "@/application/theme/ThemeService";
import type { AnimationService } from "@/application/animations/AnimationService";

// Mock hooks - use vi.hoisted() to define mocks before vi.mock() calls
const { mockUseScrollProgress, mockUseReducedMotion, mockTimeline, mockState } =
  vi.hoisted(() => {
    const mockState = {
      inView: false,
      onEnter: undefined as (() => void) | undefined,
      onLeave: undefined as (() => void) | undefined,
    };

    const mockUseScrollProgress = vi.fn(
      (
        ref: unknown,
        options?: { onEnter?: () => void; onLeave?: () => void },
      ) => {
        mockState.onEnter = options?.onEnter;
        mockState.onLeave = options?.onLeave;
        return { inView: mockState.inView, progress: 0 };
      },
    );
    const mockUseReducedMotion = vi.fn(() => false);

    const mockTimeline = {
      playFrom: vi.fn(),
      reset: vi.fn(),
      seek: vi.fn(),
      destroy: vi.fn(),
      play: vi.fn(),
      pause: vi.fn(),
    };

    return {
      mockUseScrollProgress,
      mockUseReducedMotion,
      mockTimeline,
      mockState,
    };
  });

vi.mock("@/hooks/useScrollProgressService", () => ({
  useScrollProgressService: mockUseScrollProgress,
}));

// Mock ServiceProvider
vi.mock("@/application/providers/ServiceProvider", () => ({
  ServiceProvider: ({ children }: { children: React.ReactNode }) => children,
  useServices: () => ({
    scrollService: {
      calculateProgress: vi.fn(() => 0),
      isInView: vi.fn(() => false),
    },
    themeService: {} as Partial<ThemeService>,
    animationService: {} as Partial<AnimationService>,
  }),
}));

vi.mock("@/hooks/useReducedMotion", () => ({
  useReducedMotion: () => mockUseReducedMotion(),
}));

vi.mock("@/infrastructure/motion/htmlTimeline", () => ({
  HTMLTimeline: vi.fn().mockImplementation(() => mockTimeline),
}));

describe("About", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockState.inView = false;
    mockState.onEnter = undefined;
    mockState.onLeave = undefined;
    mockUseReducedMotion.mockReturnValue(false);
  });

  it("should render with required heading and children", () => {
    render(
      <About heading="About Us">
        <p>Content here</p>
      </About>,
    );

    expect(screen.getByText("About Us")).toBeInTheDocument();
    expect(screen.getByText("Content here")).toBeInTheDocument();
  });

  it("should render string children as Text component", () => {
    render(<About heading="About">Simple text content</About>);

    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Simple text content")).toBeInTheDocument();
  });

  it("should render ReactNode children", () => {
    render(
      <About heading="About">
        <div>
          <p>Paragraph 1</p>
          <p>Paragraph 2</p>
        </div>
      </About>,
    );

    expect(screen.getByText("Paragraph 1")).toBeInTheDocument();
    expect(screen.getByText("Paragraph 2")).toBeInTheDocument();
  });

  it("should apply default background color", () => {
    render(
      <About heading="About">
        <p>Content</p>
      </About>,
    );

    const section = screen.getByText("About").closest("section");
    expect(section).toHaveClass("bg-fs-violet");
  });

  it("should apply custom background color", () => {
    render(
      <About heading="About" backgroundColor="bg-fs-blue">
        <p>Content</p>
      </About>,
    );

    const section = screen.getByText("About").closest("section");
    expect(section).toHaveClass("bg-fs-blue");
    expect(section).not.toHaveClass("bg-fs-violet");
  });

  it("should apply custom className", () => {
    render(
      <About heading="About" className="custom-class">
        <p>Content</p>
      </About>,
    );

    const section = screen.getByText("About").closest("section");
    expect(section).toHaveClass("custom-class");
  });

  it("should have correct accessibility attributes", () => {
    render(
      <About heading="About">
        <p>Content</p>
      </About>,
    );

    const section = screen.getByText("About").closest("section");
    expect(section).toHaveAttribute("id", "about");
    expect(section).toHaveAttribute("aria-label", "About section");
  });

  it("should enable inner scrolling when innerScrollable is true", () => {
    render(
      <About heading="About" innerScrollable={true}>
        <p>Content</p>
      </About>,
    );

    // Find the scrollable container - it's the div with flex-1 class
    const scrollableContainer = screen.getByText("Content").closest("div")
      ?.parentElement?.parentElement;
    expect(scrollableContainer).toHaveClass("overflow-y-auto");
    expect(scrollableContainer).toHaveClass("overscroll-contain");
  });

  it("should disable inner scrolling when innerScrollable is false", () => {
    render(
      <About heading="About" innerScrollable={false}>
        <p>Content</p>
      </About>,
    );

    // Find the scrollable container - it's the div with flex-1 class
    const scrollableContainer = screen.getByText("Content").closest("div")
      ?.parentElement?.parentElement;
    expect(scrollableContainer).toHaveClass("overflow-hidden");
    expect(scrollableContainer).not.toHaveClass("overflow-y-auto");
  });

  it("should relax snap when innerScrollable is true", () => {
    render(
      <About heading="About" innerScrollable={true}>
        <p>Content</p>
      </About>,
    );

    const section = screen.getByText("About").closest("section");
    expect(section).toHaveAttribute("data-snap", "proximity");
  });

  it("should not relax snap when innerScrollable is false", () => {
    render(
      <About heading="About" innerScrollable={false}>
        <p>Content</p>
      </About>,
    );

    const section = screen.getByText("About").closest("section");
    expect(section).not.toHaveAttribute("data-snap");
  });

  it("should create timeline when heading element exists", async () => {
    render(
      <About heading="About">
        <p>Content</p>
      </About>,
    );

    await waitFor(() => {
      expect(HTMLTimeline).toHaveBeenCalled();
    });

    const timelineCall = vi.mocked(HTMLTimeline).mock.calls[0];
    expect(timelineCall[0]).toHaveLength(1); // only heading
  });

  it("should set initial timeline state when created", async () => {
    render(
      <About heading="About">
        <p>Content</p>
      </About>,
    );

    await waitFor(() => {
      expect(mockTimeline.seek).toHaveBeenCalledWith(0);
    });
  });

  it("should play timeline when section enters view", async () => {
    mockState.inView = true;
    render(
      <About heading="About">
        <p>Content</p>
      </About>,
    );

    await waitFor(() => {
      expect(HTMLTimeline).toHaveBeenCalled();
    });

    // Trigger onEnter callback
    if (mockState.onEnter) {
      mockState.onEnter();
    }

    await waitFor(() => {
      expect(mockTimeline.playFrom).toHaveBeenCalledWith(0);
    });
  });

  it("should reset timeline when section leaves view", async () => {
    mockState.inView = true;
    render(
      <About heading="About">
        <p>Content</p>
      </About>,
    );

    await waitFor(() => {
      expect(HTMLTimeline).toHaveBeenCalled();
    });

    // Trigger onLeave callback to simulate leaving view
    if (mockState.onLeave) {
      mockState.onLeave();
    }

    expect(mockTimeline.reset).toHaveBeenCalled();
  });

  it("should render static end state when reduced motion is enabled", () => {
    mockUseReducedMotion.mockReturnValue(true);
    render(
      <About heading="About">
        <p>Content</p>
      </About>,
    );

    const heading = screen.getByText("About");
    expect(heading).toHaveStyle({ transform: "translateY(0)", opacity: "1" });
  });

  it("should not create timeline when reduced motion is enabled", async () => {
    mockUseReducedMotion.mockReturnValue(true);
    render(
      <About heading="About">
        <p>Content</p>
      </About>,
    );

    await waitFor(() => {
      expect(HTMLTimeline).not.toHaveBeenCalled();
    });
  });

  it("should set initial animation state when reduced motion is disabled", () => {
    mockUseReducedMotion.mockReturnValue(false);
    render(
      <About heading="About">
        <p>Content</p>
      </About>,
    );

    const heading = screen.getByText("About");
    expect(heading).toHaveStyle({
      transform: "translateY(30px)",
      opacity: "0",
    });
  });

  it("should clean up timeline on unmount", async () => {
    const { unmount } = render(
      <About heading="About">
        <p>Content</p>
      </About>,
    );

    await waitFor(() => {
      expect(HTMLTimeline).toHaveBeenCalled();
    });

    unmount();

    await waitFor(() => {
      expect(mockTimeline.destroy).toHaveBeenCalled();
    });
  });

  it("should pass through additional props to SnapSection", () => {
    render(
      <About heading="About" data-testid="about-section" data-custom="value">
        <p>Content</p>
      </About>,
    );

    const section = screen.getByTestId("about-section");
    expect(section).toHaveAttribute("data-custom", "value");
  });

  it("should apply smooth scroll behavior to inner scrollable area", () => {
    render(
      <About heading="About" innerScrollable={true}>
        <p>Content</p>
      </About>,
    );

    // Find the scrollable container - it's the div with flex-1 class
    const scrollableContainer = screen.getByText("Content").closest("div")
      ?.parentElement?.parentElement;
    expect(scrollableContainer).toHaveStyle({ scrollBehavior: "smooth" });
  });
});
