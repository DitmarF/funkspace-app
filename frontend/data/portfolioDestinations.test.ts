import { describe, expect, it } from "vitest";
import { portfolioDestinations } from "./portfolioDestinations";

describe("portfolio destination contract", () => {
  it("keeps the approved section/page distinction and root-prefixed anchors", () => {
    expect(portfolioDestinations).toEqual({
      home: { label: "FunkSpace", href: "/" },
      start: { label: "Start", href: "/#start" },
      about: { label: "About", href: "/#about" },
      contact: { label: "Contact", href: "/#contact" },
      aboutPage: { label: "More about FunkSpace", href: "/about" },
      impressum: { label: "Impressum", href: "/impressum" },
      privacy: { label: "Privacy", href: "/privacy" },
    });
    const hrefs = Object.values(portfolioDestinations).map(({ href }) => href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });
});
