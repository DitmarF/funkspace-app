import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { ServiceProvider } from "@/application/providers/ServiceProvider";
import ApertureDetails from "./ApertureDetails";

it("renders one shared cornered opening and a separate plain guide without JavaScript", () => {
  const container = document.createElement("div");
  container.innerHTML = renderToStaticMarkup(
    <ServiceProvider>
      <ApertureDetails />
    </ServiceProvider>,
  );
  const sections = container.querySelectorAll("article > section");
  expect(sections).toHaveLength(2);
  expect(sections[0].id).toBe("start");
  expect(sections[0].querySelectorAll(":scope > svg")).toHaveLength(4);
  expect(sections[0].querySelector("h1")?.textContent).toBe("Web Aperture");
  expect(sections[0].querySelector("p:not(.sr-only)")).toBeNull();
  expect(
    sections[0].querySelector('a[href="/animations/aperture"]'),
  ).toBeNull();
  expect(sections[0].querySelector("[data-aperture-fallback]")).not.toBeNull();
  expect(sections[1].querySelectorAll(":scope > svg")).toHaveLength(0);
  expect(sections[1].querySelector("h2")?.textContent).toBe("How it works");
  expect(
    [...sections[1].querySelectorAll("dt")].map((node) => node.textContent),
  ).toEqual(["Particles", "Speed", "Size", "Links", "Reach", "Full field"]);
  expect(sections[1].textContent).toContain("Reloading restores defaults.");
  expect(sections[1].textContent).toContain("Canvas is the drawing surface.");
  expect(sections[1].textContent).toContain(
    "An SVG mask makes the WEB-shaped opening",
  );
  expect(container.querySelectorAll("canvas")).toHaveLength(0);
});
