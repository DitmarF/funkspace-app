import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PortfolioSection from "./PortfolioSection";

describe("PortfolioSection", () => {
  for (const variant of ["plain", "cornered"] as const) {
    it(`${variant} preserves the named landmark, anchor target and interactive content`, () => {
      render(
        <PortfolioSection
          variant={variant}
          id="example"
          aria-labelledby="title"
          tabIndex={-1}
          className="consumer-layout"
        >
          <h2 id="title">Example section</h2>
          <a href="/about">Read more</a>
        </PortfolioSection>,
      );
      const section = screen.getByRole("region", { name: "Example section" });
      expect(section).toHaveAttribute("id", "example");
      expect(section).toHaveAttribute("tabindex", "-1");
      expect(section).toHaveClass("consumer-layout");
      expect(section).not.toHaveAttribute("variant");
      expect(screen.getByRole("link", { name: "Read more" })).toHaveAttribute(
        "href",
        "/about",
      );
      const corners = section.querySelectorAll(":scope > svg");
      expect(corners).toHaveLength(variant === "cornered" ? 4 : 0);
      for (const corner of corners) {
        expect(corner).toHaveAttribute("aria-hidden", "true");
        expect(corner).toHaveAttribute("focusable", "false");
      }
    });
  }

  it("defaults to plain content without decorative SVGs", () => {
    render(
      <PortfolioSection aria-label="Content">Static copy</PortfolioSection>,
    );
    expect(
      screen.getByRole("region", { name: "Content" }).querySelector("svg"),
    ).toBeNull();
  });
});
