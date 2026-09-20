import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { aboutContent } from "../frontend/data/aboutContent";
import { contactEmail } from "../frontend/data/contactContent";
import { openSettings, selectTheme, themes } from "./helpers/foundation";

for (const javaScriptEnabled of [true, false]) {
  test.describe(`About, JavaScript ${javaScriptEnabled ? "on" : "off"}`, () => {
    test.use({ javaScriptEnabled });

    test("preview, native Back, direct load, refresh and cross-page Contact", async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      const home = await page.goto("/");
      expect(await home!.text()).toContain(aboutContent.preview);
      const preview = page.getByRole("region", { name: "About", exact: true });
      await expect(preview.getByRole("heading", { level: 2 })).toHaveText(
        "About",
      );
      const more = preview.getByRole("link", { name: "More about FunkSpace" });
      await expect(more).toHaveAttribute("href", "/about");
      await more.focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL("/about");
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        "About FunkSpace",
      );
      await page.goBack();
      await expect(page).toHaveURL("/");
      await expect(more).toBeInViewport();

      const response = await page.goto("/about");
      expect(response?.status()).toBe(200);
      const html = await response!.text();
      for (const paragraph of aboutContent.paragraphs) {
        expect(html).toContain(paragraph);
        await expect(page.getByText(paragraph)).toBeVisible();
      }
      await expect(page.getByText(aboutContent.draftNotice)).toBeVisible();
      await page.reload();
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        "About FunkSpace",
      );
      if (javaScriptEnabled) await openSettings(page);
      const contact = page
        .getByRole("navigation", { name: "Primary" })
        .getByRole("link", { name: "Contact", exact: true });
      await expect(contact).toHaveAttribute("href", "/#contact");
      await contact.click();
      await expect(page).toHaveURL("/#contact");
      await expect(page.locator("#contact")).toBeInViewport();
      await expect(
        page.getByRole("link", { name: contactEmail }),
      ).toBeVisible();
      await page.goBack();
      await expect(page).toHaveURL("/about");
      await page.getByRole("link", { name: "FunkSpace", exact: true }).click();
      await expect(page).toHaveURL("/");
      expect(errors).toEqual([]);
    });

    test("narrow and short screens retain all content at enlarged text size", async ({
      page,
    }) => {
      for (const viewport of [
        { width: 320, height: 360 },
        { width: 844, height: 390 },
        { width: 1440, height: 900 },
      ]) {
        await page.setViewportSize(viewport);
        for (const route of ["/", "/about"]) {
          await page.goto(route);
          // Browser automation changes text sizing; application JS stays disabled
          // in the no-JavaScript context. No app script is injected or enabled.
          await page.evaluate(() =>
            document.documentElement.style.setProperty(
              "font-size",
              "200%",
              "important",
            ),
          );
          expect(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
          ).toBe(true);
          const content =
            route === "/" ? page.locator("#about") : page.getByRole("article");
          await expect(content).toBeVisible();
          expect(
            await content.evaluate((element) => {
              for (
                let node: Element | null = element;
                node;
                node = node.parentElement
              ) {
                const style = getComputedStyle(node);
                if (
                  ["hidden", "clip", "scroll", "auto"].includes(
                    style.overflowY,
                  ) &&
                  node.scrollHeight > node.clientHeight + 1
                )
                  return false;
              }
              return true;
            }),
          ).toBe(true);
          const last =
            route === "/"
              ? page.getByRole("link", { name: "More about FunkSpace" })
              : page.getByText(aboutContent.paragraphs[2]);
          await last.scrollIntoViewIfNeeded();
          await expect(last).toBeInViewport();
          if (route === "/") {
            await last.click();
            await expect(page).toHaveURL("/about");
          }
          const privacy = page
            .getByRole("contentinfo")
            .getByRole("link", { name: "Privacy" });
          await privacy.scrollIntoViewIfNeeded();
          await expect(privacy).toBeInViewport();
        }
      }
    });
  });
}

test("About preview and page remain accessible in all supported themes", async ({
  page,
}) => {
  for (const route of ["/", "/about"]) {
    await page.goto(route);
    for (const theme of themes) {
      await selectTheme(page, theme);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(results.violations).toEqual([]);
    }
  }
});
