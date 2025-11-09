import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FullscreenScroll from "./FullscreenScroll";

describe("FullscreenScroll", () => {
  it("should render with default props", () => {
    render(
      <FullscreenScroll>
        <div>Test content</div>
      </FullscreenScroll>,
    );

    const container = screen.getByText("Test content").parentElement;
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass("h-screen");
    expect(container).toHaveClass("h-[100dvh]");
    expect(container).toHaveClass("overflow-y-auto");
    expect(container).toHaveClass("snap-y");
    expect(container).toHaveClass("scroll-smooth");
    expect(container).toHaveClass("snap-mandatory");
    expect(container).toHaveClass("scroll-padding-top-0");
  });

  it("should render children correctly", () => {
    render(
      <FullscreenScroll>
        <section>Section 1</section>
        <section>Section 2</section>
      </FullscreenScroll>,
    );

    expect(screen.getByText("Section 1")).toBeInTheDocument();
    expect(screen.getByText("Section 2")).toBeInTheDocument();
  });

  it("should apply mandatory snap mode", () => {
    render(
      <FullscreenScroll snapMode="mandatory">
        <div>Content</div>
      </FullscreenScroll>,
    );

    const container = screen.getByText("Content").parentElement;
    expect(container).toHaveClass("snap-mandatory");
    expect(container).not.toHaveClass("snap-proximity");
  });

  it("should apply proximity snap mode", () => {
    render(
      <FullscreenScroll snapMode="proximity">
        <div>Content</div>
      </FullscreenScroll>,
    );

    const container = screen.getByText("Content").parentElement;
    expect(container).toHaveClass("snap-proximity");
    expect(container).not.toHaveClass("snap-mandatory");
  });

  it("should disable snap when snapMode is none", () => {
    render(
      <FullscreenScroll snapMode="none">
        <div>Content</div>
      </FullscreenScroll>,
    );

    const container = screen.getByText("Content").parentElement;
    expect(container).not.toHaveClass("snap-mandatory");
    expect(container).not.toHaveClass("snap-proximity");
  });

  it("should apply custom scrollPaddingTop", () => {
    render(
      <FullscreenScroll scrollPaddingTop="scroll-padding-top-20">
        <div>Content</div>
      </FullscreenScroll>,
    );

    const container = screen.getByText("Content").parentElement;
    expect(container).toHaveClass("scroll-padding-top-20");
    expect(container).not.toHaveClass("scroll-padding-top-0");
  });

  it("should apply custom className", () => {
    render(
      <FullscreenScroll className="custom-class">
        <div>Content</div>
      </FullscreenScroll>,
    );

    const container = screen.getByText("Content").parentElement;
    expect(container).toHaveClass("custom-class");
  });

  it("should apply both custom className and default classes", () => {
    render(
      <FullscreenScroll className="custom-class">
        <div>Content</div>
      </FullscreenScroll>,
    );

    const container = screen.getByText("Content").parentElement;
    expect(container).toHaveClass("custom-class");
    expect(container).toHaveClass("h-screen");
    expect(container).toHaveClass("h-[100dvh]");
    expect(container).toHaveClass("overflow-y-auto");
  });

  it("should pass through additional props", () => {
    render(
      <FullscreenScroll
        data-testid="scroll-container"
        aria-label="Scroll container"
      >
        <div>Content</div>
      </FullscreenScroll>,
    );

    const container = screen.getByTestId("scroll-container");
    expect(container).toHaveAttribute("aria-label", "Scroll container");
  });

  it("should handle empty children", () => {
    render(<FullscreenScroll />);

    const container = document.querySelector(".h-screen");
    expect(container).toBeInTheDocument();
    expect(container?.children.length).toBe(0);
  });

  it("should combine all props correctly", () => {
    render(
      <FullscreenScroll
        snapMode="proximity"
        scrollPaddingTop="scroll-padding-top-16"
        className="custom-class"
        data-testid="combined"
      >
        <div>Content</div>
      </FullscreenScroll>,
    );

    const container = screen.getByTestId("combined");
    expect(container).toHaveClass("snap-proximity");
    expect(container).toHaveClass("scroll-padding-top-16");
    expect(container).toHaveClass("custom-class");
    expect(container).toHaveClass("h-screen");
    expect(container).toHaveClass("h-[100dvh]");
  });
});
