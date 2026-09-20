import { renderToStaticMarkup } from "react-dom/server";
import { screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import Contact from "./Contact";

afterEach(() => document.body.replaceChildren());

it("provides Dimi's exact public address as a readable native link before hydration", () => {
  document.body.innerHTML = renderToStaticMarkup(<Contact />);
  expect(screen.getByRole("region", { name: "Contact" })).toHaveAttribute(
    "id",
    "contact",
  );
  expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
    "Contact",
  );
  expect(
    screen.getByRole("link", { name: "diamondfunk13@gmail.com" }),
  ).toHaveAttribute("href", "mailto:diamondfunk13@gmail.com");
  expect(document.querySelector("form, input, textarea, button")).toBeNull();
  expect(document.querySelector("p")).toBeNull(); // Dimi chose heading/address only.
});
