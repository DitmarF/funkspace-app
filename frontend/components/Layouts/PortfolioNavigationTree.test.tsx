import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { readFileSync } from "node:fs";
import PortfolioNavigationTree from "./PortfolioNavigationTree";
import { portfolioNavigation } from "../../data/portfolioNavigation";

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
  expect(screen.getAllByText("Coming soon")).toHaveLength(4);
  expect(navigation.querySelectorAll('[aria-disabled="true"]')).toHaveLength(4);
  expect(
    navigation.querySelectorAll(
      '[aria-disabled="true"] a, [aria-disabled="true"][href], button',
    ),
  ).toHaveLength(0);
  expect(
    navigation.querySelectorAll('[role="tree"], [role="menu"]'),
  ).toHaveLength(0);
  for (const row of navigation.querySelectorAll('a, [aria-disabled="true"]'))
    expect(row.querySelectorAll("svg")).toHaveLength(1);
  for (const summary of navigation.querySelectorAll("summary")) {
    expect(summary.querySelectorAll("svg")).toHaveLength(3);
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

it("places Contact last and renders the matching destination artwork", () => {
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
    "Games",
    "Privacy",
    "Privacy policy",
    "Legal notice",
    "Contact",
  ]);
  for (const [label, family] of [
    ["Home", "home"],
    ["About", "about"],
    ["Contact", "contact"],
    ["Animations", "animations"],
    ["Games", "games"],
    ["Privacy", "privacy"],
    ["Privacy policy", "privacy-policy"],
    ["Legal notice", "legal-notice"],
  ]) {
    const row = screen.getByText(label, { exact: true }).closest("a, summary")!;
    const icon = row.querySelector(":scope > svg")!;
    const source = new DOMParser().parseFromString(
      readFileSync(`frontend/public/svg/icons/${family}-24.svg`, "utf8"),
      "image/svg+xml",
    );
    expect(
      [...icon.querySelectorAll("path")].map((path) => path.getAttribute("d")),
    ).toEqual(
      [...source.querySelectorAll("path")].map((path) =>
        path.getAttribute("d"),
      ),
    );
  }
});
