import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Hero from "./Hero";
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

describe("Hero", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockState.inView = false;
    mockState.onEnter = undefined;
    mockState.onLeave = undefined;
    mockUseReducedMotion.mockReturnValue(false);
  });

  it("should render with required heading", () => {
    render(<Hero heading="Welcome" />);

    expect(screen.getByText("Welcome")).toBeInTheDocument();
  });

  it("should render subheading when provided", () => {
    render(<Hero heading="Welcome" subheading="A modern design system" />);

    expect(screen.getByText("Welcome")).toBeInTheDocument();
    expect(screen.getByText("A modern design system")).toBeInTheDocument();
  });

  it("should render CTA button when ctaLabel is provided", () => {
    render(<Hero heading="Welcome" ctaLabel="Get Started" />);

    expect(
      screen.getByRole("button", { name: "Get Started" }),
    ).toBeInTheDocument();
  });

  it("should not render subheading when not provided", () => {
    render(<Hero heading="Welcome" />);

    expect(screen.getByText("Welcome")).toBeInTheDocument();
    expect(
      screen.queryByText("A modern design system"),
    ).not.toBeInTheDocument();
  });

  it("should not render CTA button when ctaLabel is not provided", () => {
    render(<Hero heading="Welcome" />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("should call onCtaClick when CTA button is clicked", async () => {
    const handleClick = vi.fn();
    render(
      <Hero
        heading="Welcome"
        ctaLabel="Get Started"
        onCtaClick={handleClick}
      />,
    );

    const button = screen.getByRole("button", { name: "Get Started" });
    await userEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should apply default background color", () => {
    render(<Hero heading="Welcome" />);

    const section = screen.getByText("Welcome").closest("section");
    expect(section).toHaveClass("bg-fs-blue");
  });

  it("should apply custom background color", () => {
    render(<Hero heading="Welcome" backgroundColor="bg-fs-violet" />);

    const section = screen.getByText("Welcome").closest("section");
    expect(section).toHaveClass("bg-fs-violet");
    expect(section).not.toHaveClass("bg-fs-blue");
  });

  it("should apply custom className", () => {
    render(<Hero heading="Welcome" className="custom-class" />);

    const section = screen.getByText("Welcome").closest("section");
    expect(section).toHaveClass("custom-class");
  });

  it("should have correct accessibility attributes", () => {
    render(<Hero heading="Welcome" />);

    const section = screen.getByText("Welcome").closest("section");
    expect(section).toHaveAttribute("id", "hero");
    expect(section).toHaveAttribute("aria-label", "Hero section");
  });

  it("should render sticky pin demo badge", () => {
    render(<Hero heading="Welcome" />);

    expect(screen.getByText("Sticky Pin Demo")).toBeInTheDocument();
    const badge = screen.getByText("Sticky Pin Demo").closest("div");
    expect(badge).toHaveAttribute("role", "status");
    expect(badge).toHaveAttribute("aria-live", "polite");
  });

  it("should create timeline when heading element exists", async () => {
    render(<Hero heading="Welcome" subheading="Subheading" ctaLabel="CTA" />);

    await waitFor(() => {
      expect(HTMLTimeline).toHaveBeenCalled();
    });

    const timelineCall = vi.mocked(HTMLTimeline).mock.calls[0];
    expect(timelineCall[0]).toHaveLength(3); // heading, subheading, cta
  });

  it("should create timeline with only heading when subheading and CTA are not provided", async () => {
    render(<Hero heading="Welcome" />);

    await waitFor(() => {
      expect(HTMLTimeline).toHaveBeenCalled();
    });

    const timelineCall = vi.mocked(HTMLTimeline).mock.calls[0];
    expect(timelineCall[0]).toHaveLength(1); // only heading
  });

  it("should set initial timeline state when created", async () => {
    render(<Hero heading="Welcome" />);

    await waitFor(() => {
      expect(mockTimeline.seek).toHaveBeenCalledWith(0);
    });
  });

  it("should play timeline when section enters view", async () => {
    mockState.inView = true;
    render(<Hero heading="Welcome" />);

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
    render(<Hero heading="Welcome" />);

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
    render(<Hero heading="Welcome" subheading="Subheading" ctaLabel="CTA" />);

    const heading = screen.getByText("Welcome");
    expect(heading).toHaveStyle({ transform: "translateY(0)", opacity: "1" });

    const subheading = screen.getByText("Subheading");
    expect(subheading).toHaveStyle({
      transform: "translateY(0)",
      opacity: "1",
    });

    const button = screen.getByRole("button");
    expect(button).toHaveStyle({ transform: "translateY(0)", opacity: "1" });
  });

  it("should not create timeline when reduced motion is enabled", async () => {
    mockUseReducedMotion.mockReturnValue(true);
    render(<Hero heading="Welcome" />);

    await waitFor(() => {
      // Timeline should not be created
      expect(HTMLTimeline).not.toHaveBeenCalled();
    });
  });

  it("should set initial animation state when reduced motion is disabled", () => {
    mockUseReducedMotion.mockReturnValue(false);
    render(<Hero heading="Welcome" subheading="Subheading" ctaLabel="CTA" />);

    const heading = screen.getByText("Welcome");
    expect(heading).toHaveStyle({
      transform: "translateY(30px)",
      opacity: "0",
    });

    const subheading = screen.getByText("Subheading");
    expect(subheading).toHaveStyle({
      transform: "translateY(20px)",
      opacity: "0",
    });

    const button = screen.getByRole("button");
    expect(button).toHaveStyle({
      transform: "translateY(20px)",
      opacity: "0",
    });
  });

  it("should clean up timeline on unmount", async () => {
    const { unmount } = render(<Hero heading="Welcome" />);

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
      <Hero heading="Welcome" data-testid="hero-section" data-custom="value" />,
    );

    const section = screen.getByTestId("hero-section");
    expect(section).toHaveAttribute("data-custom", "value");
  });
});
