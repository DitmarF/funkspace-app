import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import SnapSection from "./SnapSection";

describe("SnapSection", () => {
  it("should render with required props", () => {
    render(
      <SnapSection id="test-section" aria-label="Test section">
        <div>Test content</div>
      </SnapSection>,
    );

    const section = screen.getByText("Test content").closest("section");
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute("id", "test-section");
    expect(section).toHaveAttribute("aria-label", "Test section");
  });

  it("should apply default snap behavior (start)", () => {
    render(
      <SnapSection id="test" aria-label="Test">
        <div>Content</div>
      </SnapSection>,
    );

    const section = screen.getByText("Content").closest("section");
    expect(section).toHaveClass("snap-start");
    expect(section).not.toHaveClass("snap-center");
    expect(section).not.toHaveClass("snap-end");
  });

  it("should apply snap-start when snap prop is start", () => {
    render(
      <SnapSection id="test" aria-label="Test" snap="start">
        <div>Content</div>
      </SnapSection>,
    );

    const section = screen.getByText("Content").closest("section");
    expect(section).toHaveClass("snap-start");
  });

  it("should apply snap-center when snap prop is center", () => {
    render(
      <SnapSection id="test" aria-label="Test" snap="center">
        <div>Content</div>
      </SnapSection>,
    );

    const section = screen.getByText("Content").closest("section");
    expect(section).toHaveClass("snap-center");
    expect(section).not.toHaveClass("snap-start");
  });

  it("should apply snap-end when snap prop is end", () => {
    render(
      <SnapSection id="test" aria-label="Test" snap="end">
        <div>Content</div>
      </SnapSection>,
    );

    const section = screen.getByText("Content").closest("section");
    expect(section).toHaveClass("snap-end");
    expect(section).not.toHaveClass("snap-start");
  });

  it("should disable snap when snap prop is none", () => {
    render(
      <SnapSection id="test" aria-label="Test" snap="none">
        <div>Content</div>
      </SnapSection>,
    );

    const section = screen.getByText("Content").closest("section");
    expect(section).not.toHaveClass("snap-start");
    expect(section).not.toHaveClass("snap-center");
    expect(section).not.toHaveClass("snap-end");
  });

  it("should apply required CSS classes", () => {
    render(
      <SnapSection id="test" aria-label="Test">
        <div>Content</div>
      </SnapSection>,
    );

    const section = screen.getByText("Content").closest("section");
    expect(section).toHaveClass("h-screen");
    expect(section).toHaveClass("h-[100dvh]");
    expect(section).toHaveClass("w-screen");
    expect(section).toHaveClass("snap-start");
  });

  it("should have correct accessibility attributes", () => {
    render(
      <SnapSection id="test-section" aria-label="Test section">
        <div>Content</div>
      </SnapSection>,
    );

    const section = screen.getByText("Content").closest("section");
    expect(section).toHaveAttribute("role", "region");
    expect(section).toHaveAttribute("tabIndex", "-1");
    expect(section).toHaveAttribute("aria-label", "Test section");
  });

  it("should apply data-snap attribute when relaxSnap is true", () => {
    render(
      <SnapSection id="test" aria-label="Test" relaxSnap={true}>
        <div>Content</div>
      </SnapSection>,
    );

    const section = screen.getByText("Content").closest("section");
    expect(section).toHaveAttribute("data-snap", "proximity");
  });

  it("should not apply data-snap attribute when relaxSnap is false", () => {
    render(
      <SnapSection id="test" aria-label="Test" relaxSnap={false}>
        <div>Content</div>
      </SnapSection>,
    );

    const section = screen.getByText("Content").closest("section");
    expect(section).not.toHaveAttribute("data-snap");
  });

  it("should apply custom className", () => {
    render(
      <SnapSection id="test" aria-label="Test" className="custom-class">
        <div>Content</div>
      </SnapSection>,
    );

    const section = screen.getByText("Content").closest("section");
    expect(section).toHaveClass("custom-class");
  });

  it("should forward ref correctly", () => {
    const ref = createRef<HTMLElement>();
    render(
      <SnapSection ref={ref} id="test" aria-label="Test">
        <div>Content</div>
      </SnapSection>,
    );

    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current).toHaveAttribute("id", "test");
  });

  it("should render children correctly", () => {
    render(
      <SnapSection id="test" aria-label="Test">
        <h1>Heading</h1>
        <p>Paragraph</p>
      </SnapSection>,
    );

    expect(screen.getByText("Heading")).toBeInTheDocument();
    expect(screen.getByText("Paragraph")).toBeInTheDocument();
  });

  it("should pass through additional props", () => {
    render(
      <SnapSection
        id="test"
        aria-label="Test"
        data-testid="snap-section"
        data-custom="value"
      >
        <div>Content</div>
      </SnapSection>,
    );

    const section = screen.getByTestId("snap-section");
    expect(section).toHaveAttribute("data-custom", "value");
  });

  it("should combine all props correctly", () => {
    render(
      <SnapSection
        id="combined-test"
        aria-label="Combined test"
        snap="center"
        relaxSnap={true}
        className="custom-class"
      >
        <div>Content</div>
      </SnapSection>,
    );

    const section = screen.getByText("Content").closest("section");
    expect(section).toHaveAttribute("id", "combined-test");
    expect(section).toHaveAttribute("aria-label", "Combined test");
    expect(section).toHaveClass("snap-center");
    expect(section).toHaveClass("custom-class");
    expect(section).toHaveAttribute("data-snap", "proximity");
  });
});
