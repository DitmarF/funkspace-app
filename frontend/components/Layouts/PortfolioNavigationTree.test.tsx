import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import PortfolioNavigationTree from "./PortfolioNavigationTree";
import { portfolioNavigation } from "../../data/portfolioNavigation";

const route = vi.hoisted(() => ({ pathname: null as string | null }));
vi.mock("next/navigation", () => ({ usePathname: () => route.pathname }));
beforeEach(() => {
  route.pathname = null;
});

it("reveals the current page and keeps native manual toggling across rerenders", () => {
  route.pathname = "/animations/aperture/";
  const view = render(<PortfolioNavigationTree />);
  const summary = screen.getByText("Animations", { exact: true });
  const branch = summary.closest("details")!;
  expect(branch).toHaveAttribute("open");
  expect(screen.getByRole("button", { name: "Web Aperture" })).toBeDisabled();
  expect(view.container.querySelectorAll("details[open]")).toHaveLength(1);
  fireEvent.click(summary);
  view.rerender(<PortfolioNavigationTree />);
  expect(branch).not.toHaveAttribute("open");
  fireEvent.click(summary);
  expect(branch).toHaveAttribute("open");
});

it("reveals every ancestor and resets groups when the route changes", () => {
  route.pathname = "/animations/aperture";
  const items = [
    {
      id: "collection",
      kind: "group" as const,
      label: "Collection",
      icon: "settings-burger" as const,
      children: portfolioNavigation,
    },
  ];
  const view = render(<PortfolioNavigationTree items={items} />);
  expect(view.container.querySelectorAll("details[open]")).toHaveLength(2);
  expect(screen.getByRole("button", { name: "Web Aperture" })).toBeVisible();
  route.pathname = "/privacy";
  view.rerender(<PortfolioNavigationTree items={items} />);
  expect(screen.getByText("Animations").closest("details")).not.toHaveAttribute(
    "open",
  );
  expect(
    screen.getByText("Privacy", { exact: true }).closest("details"),
  ).toHaveAttribute("open");
  expect(screen.getByRole("button", { name: "Privacy policy" })).toBeVisible();
  route.pathname = "/about/child";
  view.rerender(<PortfolioNavigationTree items={items} />);
  expect(view.container.querySelectorAll("details[open]")).toHaveLength(0);
});

it("keeps ready destinations as anchors and future entries noninteractive", () => {
  render(<PortfolioNavigationTree />);
  expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
    "href",
    "/about",
  );
  expect(
    screen.queryByRole("link", { name: "More about FunkSpace" }),
  ).toBeNull();
  const navigation = screen.getByRole("navigation", { name: "Primary" });
  expect(navigation.querySelectorAll("details")).toHaveLength(3);
  expect(navigation.querySelectorAll("details[open]")).toHaveLength(0);
  for (const summary of navigation.querySelectorAll("summary"))
    fireEvent.click(summary);
  expect(navigation.querySelectorAll("details[open]")).toHaveLength(3);
  expect(screen.getByRole("link", { name: "Privacy policy" })).toHaveAttribute(
    "href",
    "/privacy",
  );
  expect(screen.getByRole("link", { name: "Legal notice" })).toHaveAttribute(
    "href",
    "/impressum",
  );
  expect(screen.getByRole("link", { name: "Web Aperture" })).toHaveAttribute(
    "href",
    "/animations/aperture",
  );
  expect(screen.getAllByText("Coming soon")).toHaveLength(3);
  expect(navigation.querySelectorAll('[aria-disabled="true"]')).toHaveLength(3);
  expect(
    navigation.querySelectorAll(
      '[aria-disabled="true"] a, [aria-disabled="true"][href], button:not(:disabled)',
    ),
  ).toHaveLength(0);
  expect(screen.getByRole("button", { name: "Contact" })).toBeDisabled();
  expect(screen.queryByRole("link", { name: "Contact" })).toBeNull();
  expect(
    navigation.querySelectorAll('[role="tree"], [role="menu"]'),
  ).toHaveLength(0);
  for (const row of navigation.querySelectorAll('a, [aria-disabled="true"]'))
    expect(row.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(2);
  for (const summary of navigation.querySelectorAll("summary")) {
    expect(summary.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(4);
    for (const [index, direction] of ["right", "down"].entries()) {
      const source = new DOMParser().parseFromString(
        readFileSync(
          `frontend/public/svg/icons/arrow-${direction}-small-24.svg`,
          "utf8",
        ),
        "image/svg+xml",
      );
      expect(
        summary.querySelectorAll("svg")[index].querySelector("path"),
      ).toHaveAttribute("d", source.querySelector("path")!.getAttribute("d"));
    }
  }
});

it("allows further nested groups with native destination anchors", () => {
  const view = render(
    <div>
      <PortfolioNavigationTree
        items={[
          {
            id: "collection",
            kind: "group",
            label: "Collection",
            icon: "settings-burger",
            children: portfolioNavigation,
          },
        ]}
      />
    </div>,
  );
  expect(view.container.querySelectorAll("details")).toHaveLength(4);
  fireEvent.click(screen.getByText("Collection"));
  expect(view.container.querySelector("details")).toHaveAttribute("open");
  expect(view.container.querySelector('a[href="/about"]')).toBeInTheDocument();
});

it("keeps Contact disabled and renders the matching destination artwork", () => {
  render(<PortfolioNavigationTree />);
  const navigation = screen.getByRole("navigation", { name: "Primary" });
  for (const summary of navigation.querySelectorAll("summary"))
    fireEvent.click(summary);
  expect(
    [...navigation.querySelectorAll("a, summary")].map(
      (row) => row.textContent,
    ),
  ).toEqual([
    "Home",
    "About",
    "Animations",
    "Web Aperture",
    "Games",
    "Privacy",
    "Privacy policy",
    "Legal notice",
  ]);
  for (const [label, family] of [
    ["Home", "home"],
    ["About", "about"],
    ["Animations", "animations"],
    ["Web Aperture", "s-web"],
    ["Games", "games"],
    ["Privacy", "privacy"],
    ["Privacy policy", "privacy-policy"],
    ["Legal notice", "legal-notice"],
  ]) {
    const row = screen.getByText(label, { exact: true }).closest("a, summary")!;
    for (const size of [24, 36]) {
      const icon = row.querySelector(`:scope > svg[width="${size}"]`)!;
      expect(icon.querySelector("use")).toHaveAttribute(
        "href",
        `/svg/icons/sprite.svg#${family}-${size}`,
      );
      const source = new DOMParser().parseFromString(
        readFileSync(`frontend/public/svg/icons/${family}-${size}.svg`, "utf8"),
        "image/svg+xml",
      );
      expect(
        [
          ...new DOMParser()
            .parseFromString(
              readFileSync("frontend/public/svg/icons/sprite.svg", "utf8"),
              "image/svg+xml",
            )
            .getElementById(`${family}-${size}`)!
            .querySelectorAll("path"),
        ].map((path) => path.getAttribute("d")),
      ).toEqual(
        [...source.querySelectorAll("path")].map((path) =>
          path.getAttribute("d"),
        ),
      );
    }
  }
});
