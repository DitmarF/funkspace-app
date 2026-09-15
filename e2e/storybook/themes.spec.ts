import { expect, test } from "@playwright/test";

test("explicit light overrides system dark; default continues to follow the system", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto(
    "/iframe.html?id=controls-button--primary&viewMode=story&globals=theme:default",
  );
  await expect(page.getByRole("button", { name: "Click me" })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(26, 26, 26)",
  );

  await page.goto(
    "/iframe.html?id=controls-button--primary&viewMode=story&globals=theme:light",
  );
  await expect(page.getByRole("button", { name: "Click me" })).toBeVisible();
  await expect(page.locator("html")).not.toHaveAttribute("data-theme");
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(230, 230, 230)",
  );
  await expect(page.getByRole("button", { name: "Click me" })).toHaveCSS(
    "background-color",
    "rgb(59, 71, 204)",
  );

  await page.emulateMedia({ colorScheme: "light" });
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(230, 230, 230)",
  );
  await page.reload();
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(230, 230, 230)",
  );

  await page.goto(
    "/iframe.html?id=controls-button--primary&viewMode=story&globals=theme:default",
  );
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).not.toHaveAttribute("data-theme");
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(230, 230, 230)",
  );
});
