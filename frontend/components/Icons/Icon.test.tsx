import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Icon } from "./Icon";

describe("Icon", () => {
  it("hides decorative artwork and preserves native props/ref", () => {
    const ref = createRef<SVGSVGElement>();
    render(
      <Icon
        ref={ref}
        name="arrow-left"
        size={36}
        className="custom-icon"
        data-testid="icon"
      />,
    );
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(ref.current).toBe(screen.getByTestId("icon"));
    expect(ref.current).toHaveClass("custom-icon");
    expect(ref.current).toHaveAttribute("viewBox", "0 0 36 36");
    expect(ref.current).toHaveAttribute("focusable", "false");
  });
  it("names meaningful icons and scopes titles/clip IDs per instance", () => {
    const { container } = render(
      <>
        <Icon name="arrow-left" label="Previous" />
        <Icon name="arrow-left" label="Back" />
      </>,
    );
    expect(screen.getByRole("img", { name: "Previous" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Back" })).toBeInTheDocument();
    const ids = [...container.querySelectorAll("[id]")].map((node) => node.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const node of container.querySelectorAll("[clip-path]")) {
      const id = node.getAttribute("clip-path")!.slice(5, -1);
      expect(ids).toContain(id);
    }
  });
});
