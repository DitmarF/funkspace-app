import { renderToStaticMarkup } from "react-dom/server";
import { screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import Home from "@/app/page";
import PrivacyPage from "@/app/privacy/page";
import AboutPage from "@/app/about/page";
import ImpressumPage from "@/app/impressum/page";
import { contactEmail, contactHref } from "@/data/contactContent";
import { aboutContent } from "@/data/aboutContent";
import { ServiceProvider } from "@/application/providers/ServiceProvider";
import { portfolioDestinations as destinations } from "@/data/portfolioDestinations";

afterEach(() => document.body.replaceChildren());

describe("server-rendered portfolio documents", () => {
  for (const [name, Page] of [
    ["Home", Home],
    ["Privacy", PrivacyPage],
    ["About", AboutPage],
    ["Impressum", ImpressumPage],
  ] as const) {
    it(`${name} supplies one shell and only readable native destinations before hydration`, () => {
      document.body.innerHTML = renderToStaticMarkup(
        <ServiceProvider>
          <Page />
        </ServiceProvider>,
      );
      expect(screen.getAllByRole("banner")).toHaveLength(1);
      expect(screen.getAllByRole("main")).toHaveLength(1);
      expect(screen.getAllByRole("contentinfo")).toHaveLength(1);
      expect(document.querySelectorAll("header")).toHaveLength(1);
      expect(document.querySelectorAll("footer")).toHaveLength(1);
      expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
      expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
      expect(screen.getByRole("main")).toHaveAttribute("tabindex", "-1");
      expect(
        screen.getByRole("link", { name: "Skip to main content" }),
      ).toHaveAttribute("href", "#main-content");

      const ids = Array.from(
        document.querySelectorAll("[id]"),
        (node) => node.id,
      );
      expect(new Set(ids).size).toBe(ids.length);
      const header = within(screen.getByRole("banner"));
      expect(
        header.getByRole("link", { name: destinations.home.label }),
      ).toHaveAttribute("href", destinations.home.href);
      expect(
        header
          .getByRole("link", { name: destinations.home.label })
          .querySelector("svg"),
      ).not.toBeNull();
      for (const destination of [
        destinations.start,
        destinations.about,
        destinations.contact,
      ]) {
        expect(
          within(screen.getByRole("navigation", { name: "Primary" })).getByRole(
            "link",
            { name: destination.label },
          ),
        ).toHaveAttribute("href", destination.href);
      }
      expect(
        within(screen.getByRole("contentinfo")).getByRole("link", {
          name: destinations.privacy.label,
        }),
      ).toHaveAttribute("href", destinations.privacy.href);
      expect(screen.getAllByRole("link")).toHaveLength(
        name === "Home" ? 10 : name === "About" ? 8 : 9,
      );
      for (const destination of [
        destinations.contact,
        destinations.impressum,
        destinations.privacy,
      ]) {
        expect(
          within(screen.getByRole("navigation", { name: "Footer" })).getByRole(
            "link",
            { name: destination.label },
          ),
        ).toHaveAttribute("href", destination.href);
      }
    });
  }

  it("renders ordered homepage targets with the supplied email and no simulated form", () => {
    document.body.innerHTML = renderToStaticMarkup(
      <ServiceProvider>
        <Home />
      </ServiceProvider>,
    );
    const sections = Array.from(
      screen.getByRole("main").querySelectorAll("section"),
    );
    expect(sections.map((section) => section.id)).toEqual([
      "start",
      "about",
      "contact",
    ]);
    for (const section of sections) {
      expect(section.textContent?.trim()).not.toBe("");
      expect(
        destinations[section.id as "start" | "about" | "contact"].href,
      ).toBe(`/#${section.id}`);
    }
    expect(screen.getByText(aboutContent.preview)).toBeVisible();
    expect(screen.getByRole("link", { name: contactEmail })).toHaveAttribute(
      "href",
      contactHref,
    );
    expect(document.querySelector("form, input, textarea, canvas")).toBeNull();
    expect(
      screen.queryByRole("button", { name: /menu|send/i }),
    ).not.toBeInTheDocument();
  });
});
