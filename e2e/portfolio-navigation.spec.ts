import { expect, test } from "@playwright/test";
import { portfolioDestinations as destinations } from "../frontend/data/portfolioDestinations";
import { openSettings } from "./helpers/foundation";

for (const javaScriptEnabled of [true, false]) {
  test.describe(`portfolio navigation, JavaScript ${javaScriptEnabled ? "on" : "off"}`, () => {
    test.use({ javaScriptEnabled });

    for (const route of ["/", "/about", "/impressum", "/privacy"]) {
      test(`${route} has unique landmarks, a working skip link and native footer destinations`, async ({
        page,
      }) => {
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        page.on("console", (message) => {
          if (message.type() === "error") errors.push(message.text());
        });
        const response = await page.goto(route);
        expect(response?.status()).toBe(200);
        await expect(page.getByRole("banner")).toHaveCount(1);
        await expect(page.getByRole("main")).toHaveCount(1);
        await expect(page.getByRole("contentinfo")).toHaveCount(1);
        await expect(page.locator("header")).toHaveCount(1);
        await expect(page.locator("footer")).toHaveCount(1);
        await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
        const ids = await page
          .locator("[id]")
          .evaluateAll((nodes) => nodes.map((node) => node.id));
        expect(new Set(ids).size).toBe(ids.length);
        for (const destination of [
          destinations.contact,
          destinations.impressum,
          destinations.privacy,
        ]) {
          await expect(
            page
              .getByRole("navigation", { name: "Footer" })
              .getByRole("link", { name: destination.label }),
          ).toHaveAttribute("href", destination.href);
        }
        await page.keyboard.press("Tab");
        await expect(
          page.getByRole("link", { name: "Skip to main content" }),
        ).toBeFocused();
        await page.keyboard.press("Enter");
        await expect(page.getByRole("main")).toBeFocused();
        await page.reload();
        await expect(page.getByRole("main")).toBeVisible();
        expect(errors).toEqual([]);
      });
    }

    test("secondary-page links return to the homepage sections and native Back restores Privacy", async ({
      page,
    }) => {
      await page.goto("/privacy");
      for (const destination of [
        destinations.start,
        destinations.about,
        destinations.contact,
      ]) {
        if (javaScriptEnabled) await openSettings(page);
        const link = page
          .getByRole("navigation", { name: "Primary" })
          .getByRole("link", { name: destination.label, exact: true });
        await expect(link).toHaveAttribute("href", destination.href);
        await link.click();
        await expect(page).toHaveURL(destination.href);
        await expect(page.locator(destination.href.slice(1))).toBeInViewport();
        await expect(page.locator("main section")).toHaveCount(3);
        await page.goBack();
        await expect(page).toHaveURL("/privacy");
      }
      await page.getByRole("link", { name: "FunkSpace", exact: true }).click();
      await expect(page).toHaveURL("/");
      for (const id of ["start", "about", "contact"]) {
        await expect(page.locator(`#${id}`)).toHaveCount(1);
      }
      await page
        .getByRole("contentinfo")
        .getByRole("link", { name: "Privacy" })
        .click();
      await expect(page).toHaveURL("/privacy");
      await expect(
        page.getByText(
          "Fonts are self-hosted. Work Sans and Space Grotesk are loaded from this site.",
        ),
      ).toBeVisible();
    });
  });
}
