import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { selectTheme, themes } from "./helpers/foundation";

async function visibleLogoState(page: Page) {
  const svg = page.locator("#start [data-funkspace-logo]");
  await expect(svg).toBeVisible();
  await expect(svg.locator("path, polygon")).toHaveCount(10);
  await expect(svg.locator("circle")).toHaveCount(9);
  const state = await svg
    .locator("path, polygon, circle")
    .evaluateAll((nodes) =>
      nodes.map((node) => {
        const style = getComputedStyle(node);
        return {
          opacity: Number(style.opacity),
          fillOpacity: Number(style.fillOpacity),
          strokeOffset: parseFloat(style.strokeDashoffset),
          display: style.display,
          visibility: style.visibility,
        };
      }),
    );
  for (const part of state) {
    expect(part.opacity).toBe(1);
    expect(part.fillOpacity).toBe(1);
    expect(part.strokeOffset).toBe(0);
    expect(part.display).not.toBe("none");
    expect(part.visibility).toBe("visible");
  }
  return state;
}

for (const viewport of [
  { width: 320, height: 480 },
  { width: 1440, height: 900 },
]) {
  test.describe(`Start at ${viewport.width}px`, () => {
    test.use({ viewport });
    for (const javaScriptEnabled of [true, false]) {
      test.describe(`JavaScript ${javaScriptEnabled ? "on" : "off"}`, () => {
        test.use({ javaScriptEnabled });
        test("fresh navigation contains a complete static logo and stable hydrated IDs", async ({
          page,
        }, testInfo) => {
          const errors: string[] = [];
          page.on("pageerror", (error) => errors.push(error.message));
          page.on("console", (message) => {
            if (message.type() === "error") errors.push(message.text());
          });
          const response = await page.goto("/");
          expect(response?.status()).toBe(200);
          const html = await response!.text();
          const serverIds = await page.evaluate((html) => {
            const doc = new DOMParser().parseFromString(html, "text/html");
            const svg = doc.querySelector("#start [data-funkspace-logo]")!;
            return [
              svg.id,
              ...[...svg.querySelectorAll("[id]")].map((node) => node.id),
            ];
          }, html);
          expect(serverIds.length).toBeGreaterThan(19);
          const first = await visibleLogoState(page);
          if (javaScriptEnabled) {
            await expect(
              page.getByRole("button", {
                name: "Menu: navigation and settings",
              }),
            ).toBeVisible();
            // Observe beyond the existing logo timeline's duration.
            await page.waitForTimeout(2100);
          }
          expect(await visibleLogoState(page)).toEqual(first);
          expect(
            await page
              .locator(
                "#start [data-funkspace-logo], #start [data-funkspace-logo] [id]",
              )
              .evaluateAll((nodes) => nodes.map((node) => node.id)),
          ).toEqual(serverIds);
          const ids = await page
            .locator("[id]")
            .evaluateAll((nodes) => nodes.map((node) => node.id));
          expect(new Set(ids).size).toBe(ids.length);
          await expect(
            page.getByRole("heading", { level: 1, name: "FunkSpace" }),
          ).toHaveCount(1);
          await expect(page.locator("#start p")).toHaveText(
            "FunkSpace is a design-system-first web experience built as a PNPM workspace.",
          );
          await expect(page.locator("#start").getByRole("img")).toHaveCount(0);
          await expect(page.locator("#start canvas")).toHaveCount(0);
          await expect(
            page.locator("#start").getByRole("button", {
              name: /next|previous|up|down|play|pause/i,
            }),
          ).toHaveCount(0);
          const layout = await page.locator("#start").evaluate((section) => {
            const frame = section
              .querySelector("[data-start-scene]")!
              .getBoundingClientRect();
            const copy = section.querySelector("p")!.getBoundingClientRect();
            const svg = section
              .querySelector("[data-funkspace-logo]")!
              .getBoundingClientRect();
            return {
              frameBottom: frame.bottom,
              copyTop: copy.top,
              frameHeight: frame.height,
              frameRatio: frame.width / frame.height,
              ratio: svg.width / svg.height,
              overflow: document.documentElement.scrollWidth > innerWidth,
            };
          });
          expect(layout.frameBottom).toBeLessThanOrEqual(layout.copyTop);
          expect(layout.frameHeight).toBeGreaterThan(100);
          expect(layout.frameRatio).toBeCloseTo(
            viewport.width < 768 ? 343 / 503 : 3 / 2,
            2,
          );
          expect(layout.ratio).toBeCloseTo(1652.1 / 849.75, 2);
          expect(layout.overflow).toBe(false);
          const brand = await page
            .getByRole("banner")
            .locator("svg")
            .boundingBox();
          expect(brand!.width).toBeLessThanOrEqual(144);
          expect(brand!.x).toBeLessThan(viewport.width / 4);
          await page.keyboard.press("Tab");
          await expect(
            page.getByRole("link", { name: "Skip to main content" }),
          ).toBeFocused();
          await page.keyboard.press("Enter");
          await expect(page.getByRole("main")).toBeFocused();
          await page.screenshot({
            path: testInfo.outputPath("start-static.png"),
            fullPage: true,
          });
          expect(errors).toEqual([]);
        });
      });
    }

    test("all supported themes preserve the static visual and accessible content", async ({
      page,
    }, testInfo) => {
      await page.goto("/");
      for (const theme of themes) {
        await selectTheme(page, theme);
        await visibleLogoState(page);
        const colors = await page.locator("#start").evaluate((section) => ({
          text: getComputedStyle(section.querySelector("p")!).color,
          stroke: getComputedStyle(section.querySelector("polygon")!).stroke,
          surface: getComputedStyle(
            section.querySelector("[data-start-scene]")!,
          ).backgroundColor,
        }));
        expect(colors.stroke).toBe(colors.text);
        expect(colors.stroke).not.toBe(colors.surface);
        const result = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "best-practice"])
          .analyze();
        expect(result.violations, JSON.stringify(result.violations)).toEqual(
          [],
        );
        await page.screenshot({
          path: testInfo.outputPath(`start-${theme}.png`),
          fullPage: true,
        });
      }
    });
  });
}
