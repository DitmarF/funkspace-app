import { renderToStaticMarkup } from "react-dom/server";
import { screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import AboutPreview from "./AboutPreview";
import AboutPage, { metadata } from "@/app/about/page";
import { aboutContent } from "@/data/aboutContent";
import { ServiceProvider } from "@/application/providers/ServiceProvider";

afterEach(() => document.body.replaceChildren());

describe("About supplied content before hydration", () => {
  it("offers a short preview, its own H2 and a native link to the narrative", () => {
    document.body.innerHTML = renderToStaticMarkup(<AboutPreview />);
    expect(screen.getByRole("region", { name: "About" })).toHaveAttribute(
      "id",
      "about",
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "About",
    );
    for (const paragraph of aboutContent.preview) {
      expect(screen.getByText(paragraph)).toBeVisible();
    }
    expect(document.querySelector('[lang="la"]')).toBeNull();
    expect(screen.queryByText(/Draft content|Lorem ipsum/)).toBeNull();
    expect(
      screen.getByRole("link", { name: "More about FunkSpace" }),
    ).toHaveAttribute("href", "/about");
    expect(
      screen.getByRole("link", { name: "More about FunkSpace" }),
    ).toHaveTextContent(/^more$/);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    for (const paragraph of aboutContent.paragraphs) {
      expect(screen.queryByText(paragraph)).not.toBeInTheDocument();
    }
  });

  it("renders the complete narrative with ordered headings and its attributed quote", () => {
    document.body.innerHTML = renderToStaticMarkup(
      <ServiceProvider>
        <AboutPage />
      </ServiceProvider>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "About FunkSpace",
    );
    for (const paragraph of aboutContent.preview) {
      expect(screen.queryByText(paragraph)).not.toBeInTheDocument();
    }
    expect(metadata.description).toBe(aboutContent.description);
    expect(document.querySelector('[lang="la"]')).toBeNull();
    expect(screen.queryByText(/Draft content|Lorem ipsum/)).toBeNull();
    const article = screen.getByRole("article");
    for (const paragraph of aboutContent.paragraphs) {
      expect(screen.getByText(paragraph).parentElement).toBe(article);
    }
    expect(
      screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent),
    ).toEqual(aboutContent.sections.map((section) => section.heading));
    for (const section of aboutContent.sections) {
      for (const paragraph of section.paragraphs) {
        expect(screen.getByText(paragraph).closest("section")).toContainElement(
          screen.getByRole("heading", { name: section.heading }),
        );
      }
    }
    expect(article.querySelector("blockquote")).toHaveTextContent(
      "“Form ever follows function.”",
    );
    expect(article.querySelector("figcaption")).toHaveTextContent(
      "Louis Sullivan",
    );
  });
});
