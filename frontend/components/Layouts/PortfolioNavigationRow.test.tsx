import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import PortfolioNavigationRow from "./PortfolioNavigationRow";
import { portfolioMainNavigation } from "@/data/portfolioNavigation";
import {
  portfolioDestinations,
  type PortfolioDestinationKey,
} from "@/data/portfolioDestinations";

const route = vi.hoisted(() => ({ pathname: null as string | null }));
vi.mock("next/navigation", () => ({ usePathname: () => route.pathname }));
beforeEach(() => {
  route.pathname = null;
});

for (const destination of [
  "home",
  "aboutPage",
  "aperture",
  "privacy",
  "impressum",
] as const) {
  it(`renders ${destination} as a disabled current page without an activation handler`, () => {
    route.pathname = portfolioDestinations[destination].href;
    const navigate = vi.fn();
    render(
      <PortfolioNavigationRow
        item={{
          id: destination,
          label: "Current",
          icon: "home",
          kind: "link",
          destination,
        }}
        onNavigate={navigate}
      />,
    );
    const current = screen.getByRole("button", { name: "Current" });
    expect(current).toBeDisabled();
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current).not.toHaveAttribute("href");
    expect(screen.queryByRole("link")).toBeNull();
    fireEvent.click(current);
    expect(navigate).not.toHaveBeenCalled();
  });
}

it("updates the shared state when the route changes and matches exact paths", () => {
  route.pathname = "/";
  const items = portfolioMainNavigation.map((item) => (
    <PortfolioNavigationRow key={item.id} item={item} />
  ));
  const view = render(<>{items}</>);
  expect(screen.getByRole("button", { name: "Home" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
    "href",
    "/about",
  );
  route.pathname = "/about/";
  view.rerender(
    <>
      {portfolioMainNavigation.map((item) => (
        <PortfolioNavigationRow key={item.id} item={item} />
      ))}
    </>,
  );
  expect(screen.getByRole("button", { name: "About" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
    "href",
    "/",
  );
  expect(screen.getByRole("button", { name: "Contact" })).not.toHaveAttribute(
    "aria-current",
  );
});

for (const pathname of [null, "/about/child", "/missing"]) {
  it(`keeps available destinations as links for ${pathname}`, () => {
    route.pathname = pathname;
    render(<PortfolioNavigationRow item={portfolioMainNavigation[1]} />);
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/about",
    );
  });
}

it("keeps section anchors available on their parent page", () => {
  route.pathname = "/";
  const destination: PortfolioDestinationKey = "about";
  render(
    <PortfolioNavigationRow
      item={{
        id: "preview",
        label: "Preview",
        icon: "about",
        kind: "link",
        destination,
      }}
    />,
  );
  expect(screen.getByRole("link", { name: "Preview" })).toHaveAttribute(
    "href",
    "/#about",
  );
});
