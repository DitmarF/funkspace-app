import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Icon, iconNames } from "./Icon";
import { readFileSync } from "node:fs";

describe("Icon", () => {
  for (const name of iconNames) {
    for (const size of [24, 36, 48] as const) {
      it(`preserves the exported ${name}-${size} geometry and unique IDs`, () => {
        const raw = readFileSync(
          `frontend/public/svg/icons/${name}-${size}.svg`,
          "utf8",
        );
        const source = new DOMParser().parseFromString(
          raw,
          "image/svg+xml",
        ).documentElement;
        const { container } = render(
          <>
            <Icon name={name} size={size} label="First" />
            <Icon name={name} size={size} label="Second" />
          </>,
        );
        const icon = screen.getByRole("img", { name: "First" });
        expect(icon.getAttribute("viewBox")).toBe(
          source.getAttribute("viewBox"),
        );
        expect(
          [...icon.querySelectorAll("path")].map((path) =>
            path.getAttribute("d"),
          ),
        ).toEqual(
          [...source.querySelectorAll("path")].map((path) =>
            path.getAttribute("d"),
          ),
        );
        const ids = [...container.querySelectorAll("[id]")].map(
          (node) => node.id,
        );
        expect(new Set(ids).size).toBe(ids.length);
        expect(icon.innerHTML).not.toContain("#1A1A1A");
      });
    }
  }
  it.each([
    [24, 26],
    [36, 40],
    [48, 48],
  ] as const)(
    "displays Close at %ipx without cropping its %i-unit source frame",
    (size, sourceSize) => {
      render(<Icon name="close" size={size} label="Close artwork" />);
      const icon = screen.getByRole("img", { name: "Close artwork" });
      expect(icon).toHaveAttribute("width", String(size));
      expect(icon).toHaveAttribute("height", String(size));
      expect(icon).toHaveAttribute(
        "viewBox",
        `0 0 ${sourceSize} ${sourceSize}`,
      );
    },
  );
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
