import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { renderedPair, settleStyles, themes } from "../helpers/foundation";

for (const theme of themes) {
  test(`${theme}: complete icon gallery preserves size, paints and accessibility`, async ({
    page,
  }, testInfo) => {
    const global =
      theme === "default"
        ? "light"
        : theme === "dark-high-contrast"
          ? "highContrast"
          : theme;
    await page.setViewportSize({ width: 2048, height: 800 });
    await page.goto(
      `/iframe.html?id=icons-library--gallery&viewMode=story&globals=theme:${global}`,
    );
    const root = page.locator("#storybook-root");
    await expect(root.locator("svg")).toHaveCount(24);
    await expect
      .poll(
        async () =>
          (await page.locator("body").getAttribute("data-theme")) || "default",
      )
      .toBe(theme);
    await settleStyles(page);
    for (const size of [24, 36, 48]) {
      const section = page.getByRole("region", { name: `${size}px icons` });
      await expect(section.getByRole("listitem")).toHaveCount(8);
      for (const item of await section.getByRole("listitem").all()) {
        expect((await renderedPair(item)).ratio).toBeGreaterThanOrEqual(4.5);
        const svg = item.locator("svg");
        await expect(svg).toHaveAttribute("aria-hidden", "true");
        const sourceSize =
          (await item.innerText()).trim() === "close"
            ? ({ 24: 26, 36: 40, 48: 48 } as const)[size as 24 | 36 | 48]
            : size;
        await expect(svg).toHaveAttribute(
          "viewBox",
          `0 0 ${sourceSize} ${sourceSize}`,
        );
        const box = await svg.boundingBox();
        expect(box!.width).toBe(size);
        expect(box!.height).toBe(size);
        const paints = await svg.evaluate((node) => {
          const css = getComputedStyle(node);
          return {
            foreground: css.color,
            background: getComputedStyle(node.closest("ul")!).backgroundColor,
            fills: [...node.querySelectorAll("path")].map(
              (path) => getComputedStyle(path).fill,
            ),
          };
        });
        expect(
          paints.fills.every(
            (fill) => fill === paints.foreground || fill === paints.background,
          ),
        ).toBe(true);
      }
    }
    const ids = await root
      .locator("[id]")
      .evaluateAll((nodes) => nodes.map((n) => n.id));
    expect(new Set(ids).size).toBe(ids.length);
    expect(
      (await new AxeBuilder({ page }).include("#storybook-root").analyze())
        .violations,
    ).toEqual([]);
    await page.screenshot({
      path: testInfo.outputPath(`icons-${theme}.png`),
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
