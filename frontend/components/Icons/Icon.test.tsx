import { createElement, createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Icon, iconNames } from "./Icon";
import { spriteIconArtwork } from "./spriteIconArtwork";
import { isSpriteIcon } from "./iconMetadata";
import { iconArtwork } from "./iconArtwork";
import { renderToStaticMarkup } from "react-dom/server";
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
        // Validate authoring geometry as well as the generated delivery asset.
        const authored = new DOMParser().parseFromString(
          renderToStaticMarkup(
            createElement(
              "svg",
              { xmlns: "http://www.w3.org/2000/svg" },
              (isSpriteIcon(name)
                ? spriteIconArtwork[name][size]
                : iconArtwork[name][size])("author-proof"),
            ),
          ),
          "image/svg+xml",
        );
        expect(
          [...authored.querySelectorAll("path")].map((path) =>
            path.getAttribute("d"),
          ),
        ).toEqual(
          [...source.querySelectorAll("path")].map((path) =>
            path.getAttribute("d"),
          ),
        );
        const { container } = render(
          <>
            <Icon name={name} size={size} label="First" />
            <Icon name={name} size={size} label="Second" />
          </>,
        );
        const icon = screen.getByRole("img", { name: "First" });
        const sprite = new DOMParser().parseFromString(
          readFileSync("frontend/public/svg/icons/sprite.svg", "utf8"),
          "image/svg+xml",
        );
        const symbol = isSpriteIcon(name)
          ? sprite.getElementById(`${name}-${size}`)!
          : icon;
        if (isSpriteIcon(name)) {
          expect(icon.querySelector("use")).toHaveAttribute(
            "href",
            `/svg/icons/sprite.svg#${name}-${size}`,
          );
          expect(symbol.getAttribute("data-view-box")).toBe(
            source.getAttribute("viewBox"),
          );
        }
        expect(icon.getAttribute("viewBox")).toBe(
          source.getAttribute("viewBox"),
        );
        expect(
          [...symbol.querySelectorAll("path")].map((path) =>
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
    const sprite = new DOMParser().parseFromString(
      readFileSync("frontend/public/svg/icons/sprite.svg", "utf8"),
      "image/svg+xml",
    );
    const spriteIds = [...sprite.querySelectorAll("[id]")].map(
      (node) => node.id,
    );
    expect(new Set(spriteIds).size).toBe(spriteIds.length);
    for (const node of sprite.querySelectorAll("[clip-path]")) {
      const id = node.getAttribute("clip-path")!.slice(5, -1);
      expect(spriteIds).toContain(id);
    }
  });
});
