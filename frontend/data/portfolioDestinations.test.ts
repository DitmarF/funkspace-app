import { describe, expect, it } from "vitest";
import { portfolioDestinations } from "./portfolioDestinations";

describe("portfolio destination contract", () => {
  it("keeps the approved section/page distinction and root-prefixed anchors", () => {
    expect(portfolioDestinations).toEqual({
      home: { focusId: "main-content", label: "FunkSpace", href: "/" },
      start: { focusId: "start", label: "Start", href: "/#start" },
      about: { focusId: "about", label: "About", href: "/#about" },
      contact: { focusId: "contact", label: "Contact", href: "/#contact" },
      aboutPage: {
        focusId: "main-content",
        label: "More about FunkSpace",
        href: "/about",
      },
      aperture: {
        focusId: "main-content",
        label: "More about Aperture - 1",
        href: "/animations/aperture",
      },
      impressum: {
        focusId: "main-content",
        label: "Legal notice",
        href: "/impressum",
      },
      privacy: { focusId: "main-content", label: "Privacy", href: "/privacy" },
    });
    const hrefs = Object.values(portfolioDestinations).map(({ href }) => href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });
});
