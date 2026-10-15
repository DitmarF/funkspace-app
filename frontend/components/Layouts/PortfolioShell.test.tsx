import { renderToStaticMarkup } from "react-dom/server";
import { screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import Home from "@/app/page";
import PrivacyPage from "@/app/privacy/page";
import AboutPage from "@/app/about/page";
import ImpressumPage from "@/app/impressum/page";
import { aboutContent } from "@/data/aboutContent";
import { ServiceProvider } from "@/application/providers/ServiceProvider";
import { portfolioDestinations as destinations } from "@/data/portfolioDestinations";
import { contactEmail, contactHref } from "@/data/contactContent";
import { metadata as privacyMetadata } from "@/app/privacy/page";
import { metadata as legalMetadata } from "@/app/impressum/page";

afterEach(() => document.body.replaceChildren());

describe("server-rendered portfolio documents", () => {
  for (const [name, Page] of [
    ["Home", Home],
    ["Privacy", PrivacyPage],
    ["About", AboutPage],
    ["Legal notice", ImpressumPage],
  ] as const) {
    it(`${name} supplies one shell and only readable native destinations before hydration`, () => {
      document.body.innerHTML = renderToStaticMarkup(
        <ServiceProvider>
          <Page />
        </ServiceProvider>,
      );
      const fallback = document.querySelector("footer details")!;
      expect(fallback).not.toHaveAttribute("open");
      const summary = fallback.querySelector("summary")!;
      expect(summary).toHaveAccessibleName("Navigation");
      expect(summary.textContent).toBe("");
      expect(summary.querySelector("svg")).not.toBeNull();
      expect(summary.querySelector("button, a")).toBeNull();
      // Native disclosure remains operable without any application JavaScript.
      fallback.setAttribute("open", "");
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
        { label: "Home", href: destinations.home.href },
        { label: "About", href: destinations.aboutPage.href },
      ]) {
        expect(
          within(screen.getByRole("navigation", { name: "Primary" })).getByRole(
            "link",
            { name: destination.label },
          ),
        ).toHaveAttribute("href", destination.href);
      }
      expect(
        within(screen.getByRole("navigation", { name: "Footer" })).getByRole(
          "link",
          {
            name: "Privacy policy",
          },
        ),
      ).toHaveAttribute("href", destinations.privacy.href);
      const links = screen.getAllByRole("link");
      if (name === "Privacy" || name === "Legal notice") {
        // Legal provider/rights references may grow without changing shell navigation.
        expect(links.filter((link) => !link.closest("article"))).toHaveLength(
          14,
        );
      } else {
        expect(links).toHaveLength(name === "Home" ? 16 : 14);
      }
      const mainNav = header.getByRole("navigation", { name: "Main" });
      expect(
        within(mainNav).getByRole("link", { name: "Home" }),
      ).toHaveAttribute("href", "/");
      expect(
        within(mainNav).getByRole("link", { name: "About" }),
      ).toHaveAttribute("href", "/about");
      expect(
        within(mainNav).getByRole("link", { name: "Contact" }),
      ).toHaveAttribute("href", "/contact");
      for (const destination of [
        destinations.impressum,
        { ...destinations.privacy, label: "Privacy policy" },
      ]) {
        expect(
          within(screen.getByRole("navigation", { name: "Footer" })).getByRole(
            "link",
            { name: destination.label },
          ),
        ).toHaveAttribute("href", destination.href);
      }
      const footer = within(screen.getByRole("navigation", { name: "Footer" }));
      expect(footer.getAllByRole("link")).toHaveLength(3);
      const github = footer.getByRole("link", {
        name: "FunkSpace project on GitHub",
      });
      expect(github).toHaveAttribute(
        "href",
        "https://github.com/DitmarF/funkspace-app",
      );
      expect(github.textContent).toBe("");
      expect(github.querySelector("svg")).toHaveAttribute(
        "aria-hidden",
        "true",
      );
    });
  }

  for (const [name, Page, metadata] of [
    ["Privacy", PrivacyPage, privacyMetadata],
    ["Legal notice", ImpressumPage, legalMetadata],
  ] as const) {
    it(`${name} supplies the operator and tested Workspace fallback without draft placeholders`, () => {
      document.body.innerHTML = renderToStaticMarkup(
        <ServiceProvider>
          <Page />
        </ServiceProvider>,
      );
      const article = screen.getByRole("article");
      expect(article).toHaveTextContent("Ditmar Funk");
      expect(article).toHaveTextContent("Thuringia, Germany");
      expect(article).not.toHaveTextContent(
        /Draft —|information is incomplete|not yet been supplied/,
      );
      expect(
        within(article).getByRole("link", { name: contactEmail }),
      ).toHaveAttribute("href", contactHref);
      expect(contactEmail).toBe("info@funkspace.de");
      expect(metadata.description).not.toMatch(/draft|incomplete/i);
      expect(article.querySelector("form, input, textarea")).toBeNull();
    });
  }

  it("explains disabled delivery, memory-only drafts, both preference keys and the selected mailbox policy", () => {
    document.body.innerHTML = renderToStaticMarkup(
      <ServiceProvider>
        <PrivacyPage />
      </ServiceProvider>,
    );
    const article = screen.getByRole("article");
    for (const text of [
      "Form delivery is currently disabled",
      "No form content is sent to Resend",
      "page memory only",
      "Google Workspace",
      "six calendar months after the conversation ends",
      "Cleanup is manual",
      "provider backups",
      "Your rights",
    ])
      expect(article).toHaveTextContent(text);
    expect(within(article).getByText("theme", { exact: true }).tagName).toBe(
      "CODE",
    );
    expect(
      within(article).getByText("funkspace.motion.preference.v1", {
        exact: true,
      }).tagName,
    ).toBe("CODE");
    expect(article).toHaveTextContent("When it is missing or invalid");
    expect(article).toHaveTextContent("without creating this key");
    expect(article).toHaveTextContent("FunkSpace sets no expiry");
    expect(
      within(article).getByRole("link", { name: /TLfDI/ }),
    ).toHaveAttribute("href", "https://tlfdi.de/kontakt/");
  });

  it("renders cornered Start and plain About without Contact or dead Contact links", () => {
    document.body.innerHTML = renderToStaticMarkup(
      <ServiceProvider>
        <Home />
      </ServiceProvider>,
    );
    const sections = Array.from(
      screen.getByRole("main").querySelectorAll("section"),
    );
    expect(sections.map((section) => section.id)).toEqual(["start", "about"]);
    for (const section of sections) {
      expect(section.textContent?.trim()).not.toBe("");
      expect(destinations[section.id as "start" | "about"].href).toBe(
        `/#${section.id}`,
      );
    }
    for (const paragraph of aboutContent.preview) {
      expect(screen.getByText(paragraph)).toBeVisible();
    }
    expect(sections[0].querySelectorAll(":scope > svg")).toHaveLength(4);
    expect(sections[1].querySelectorAll(":scope > svg")).toHaveLength(0);
    expect(
      document.querySelector(
        '#contact, a[href="/#contact"], a[href^="mailto:"]',
      ),
    ).toBeNull();
    expect(document.querySelector("form, input, textarea, canvas")).toBeNull();
    expect(
      screen.queryByRole("button", { name: /menu|send/i }),
    ).not.toBeInTheDocument();
  });
});
