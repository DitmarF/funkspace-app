import { expect, test, type Locator } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { colors } from "@funkspace/common/tokens/colors";
import { themes, settleStyles } from "../helpers/foundation";

const globalName = (theme: string) =>
  theme === "default"
    ? "light"
    : theme === "dark-high-contrast"
      ? "highContrast"
      : theme;
const url = (story: string, theme: string) =>
  `/iframe.html?id=foundations-tokens--${story}&viewMode=story&globals=theme:${globalName(theme)}`;
const rgb = (hex: string) =>
  `rgb(${[1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16)).join(", ")})`;

async function checkColors(root: Locator, entries: Record<string, string>) {
  await expect(root.locator("[data-color-token]")).toHaveCount(
    Object.keys(entries).length,
  );
  for (const [name, value] of Object.entries(entries)) {
    const card = root.locator(`[data-color-token="${name}"]`);
    await expect(card.locator("[data-color-value]")).toHaveText(
      value.toUpperCase(),
    );
    // Compare the actual CSS-variable paint against independently generated TS.
    await expect(card.locator("span[aria-hidden]")).toHaveCSS(
      "background-color",
      rgb(value),
    );
  }
}

for (const theme of themes) {
  for (const view of ["palettes", "semantic-colors"] as const) {
    test(`${theme} ${view}: complete values and readable reference`, async ({
      page,
    }, testInfo) => {
      await page.goto(url(view, theme));
      const root = page.locator("main");
      await expect(root).toHaveAttribute("data-resolved-theme", theme);
      await settleStyles(page);
      await checkColors(
        root,
        colors[theme][view === "palettes" ? "primitive" : "semantic"],
      );
      expect(
        (await new AxeBuilder({ page }).include("main").analyze()).violations,
      ).toEqual([]);
      await page.screenshot({
        path: testInfo.outputPath(`${view}-${theme}.png`),
        fullPage: true,
      });
      await page.setViewportSize({ width: 320, height: 800 });
      await page.evaluate(() => {
        document.documentElement.style.fontSize = "200%";
      });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
    });
  }
}

test("all theme panels stay explicit on a dark operating system", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto(
    "/iframe.html?id=foundations-tokens--theme-comparison&viewMode=story&globals=theme:default",
  );
  await expect(page.locator("main")).toHaveAttribute(
    "data-resolved-theme",
    "dark",
  );
  for (const [theme, label] of [
    ["default", "Light"],
    ["dark", "Dark"],
    ["muted", "Muted"],
    ["dark-high-contrast", "High contrast"],
  ] as const) {
    const panel = page.getByRole("region", { name: label, exact: true });
    await checkColors(panel, {
      ...colors[theme].primitive,
      ...colors[theme].semantic,
    });
    await expect(panel).toHaveCSS(
      "background-color",
      rgb(colors[theme].semantic["surface-background"]),
    );
  }
  expect(
    (await new AxeBuilder({ page }).include("main").analyze()).violations,
  ).toEqual([]);
});

test("the existing overview is populated and follows system theme changes", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto(
    "/iframe.html?id=foundations-tokens--overview&viewMode=story&globals=theme:default",
  );
  await expect(
    page.getByRole("heading", { name: "Color palettes", exact: true }),
  ).toBeVisible();
  await expect(page.locator("main")).toHaveAttribute(
    "data-resolved-theme",
    "dark",
  );
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("main")).toHaveAttribute(
    "data-resolved-theme",
    "default",
  );
  await checkColors(page.locator("main"), colors.default.primitive);
});
