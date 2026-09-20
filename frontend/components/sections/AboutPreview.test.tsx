import { renderToStaticMarkup } from "react-dom/server";
import { screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import AboutPreview from "./AboutPreview";
import AboutPage from "@/app/about/page";
import { aboutContent } from "@/data/aboutContent";
import { ServiceProvider } from "@/application/providers/ServiceProvider";

afterEach(() => document.body.replaceChildren());

describe("About development content before hydration", () => {
  it("offers a short preview, its own H2 and a native link to the narrative", () => {
    document.body.innerHTML = renderToStaticMarkup(<AboutPreview />);
    expect(screen.getByRole("region", { name: "About" })).toHaveAttribute(
      "id",
      "about",
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "About",
    );
    expect(screen.getByText(aboutContent.draftNotice)).toBeVisible();
    expect(screen.getByText(aboutContent.preview)).toBeVisible();
    expect(
      screen.getByRole("link", { name: "More about FunkSpace" }),
    ).toHaveAttribute("href", "/about");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    for (const paragraph of aboutContent.paragraphs) {
      expect(screen.queryByText(paragraph)).not.toBeInTheDocument();
    }
  });

  it("renders the complete, distinct draft narrative in ordinary article flow", () => {
    document.body.innerHTML = renderToStaticMarkup(
      <ServiceProvider>
        <AboutPage />
      </ServiceProvider>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "About FunkSpace",
    );
    expect(screen.getByText(aboutContent.draftNotice)).toBeVisible();
    expect(screen.queryByText(aboutContent.preview)).not.toBeInTheDocument();
    const article = screen.getByRole("article");
    for (const paragraph of aboutContent.paragraphs) {
      expect(screen.getByText(paragraph).parentElement).toBe(article);
    }
  });
});
