import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { renderedPair, settleStyles, themes } from "../helpers/foundation";

for (const theme of themes) {
  test(`${theme}: Figma sizes, treatments and both icon paints through native states`, async ({
    page,
  }, testInfo) => {
    const global =
      theme === "default"
        ? "light"
        : theme === "dark-high-contrast"
          ? "highContrast"
          : theme;
    await page.goto(
      `/iframe.html?id=controls-button--figma-matrix&viewMode=story&globals=theme:${global}`,
    );
    const root = page.locator("#storybook-root");
    await expect(root.getByRole("button")).toHaveCount(24);
    await expect
      .poll(
        async () =>
          (await page.locator("body").getAttribute("data-theme")) || "default",
      )
      .toBe(theme);
    await settleStyles(page);
    const evidence = [];
    for (const [size, height, fontSize, weight] of [
      ["small", 48, 24, "700"],
      ["medium", 72, 36, "600"],
      ["large", 96, 48, "500"],
    ] as const) {
      const section = root.getByRole("region", { name: size, exact: true });
      for (const variant of [
        "accent-outlined",
        "primary",
        "outlined",
        "secondary",
      ]) {
        const button = section
          .getByRole("button", { name: variant, exact: true })
          .first();
        await expect(button).toHaveCSS("font-size", `${fontSize}px`);
        await expect(button).toHaveCSS("font-weight", weight);
        // Long labels may grow; the Figma dimension is an accessible minimum.
        expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(
          height,
        );
        const sample = async (state: string, target: number) => {
          const pair = await renderedPair(button);
          expect(
            pair.ratio,
            JSON.stringify({ theme, size, variant, state, pair }),
          ).toBeGreaterThanOrEqual(target);
          const paints = await button.evaluate((node) => {
            const css = getComputedStyle(node);
            const paths = [...node.querySelectorAll("svg path")];
            return {
              foreground: css.color,
              background: css.backgroundColor,
              fills: paths.map((path) => getComputedStyle(path).fill),
              arrowStroke: getComputedStyle(paths[1]).stroke,
              icons: [...node.querySelectorAll("svg")].map((icon) => ({
                width: icon.getBoundingClientRect().width,
                height: icon.getBoundingClientRect().height,
              })),
              overflow:
                node.scrollWidth > node.clientWidth ||
                node.scrollHeight > node.clientHeight,
            };
          });
          expect(paints.fills).toEqual([
            paints.foreground,
            paints.background,
            ...Array(4).fill(paints.foreground),
          ]);
          expect(paints.arrowStroke).toBe(paints.foreground);
          expect(paints.icons).toEqual([
            { width: fontSize, height: fontSize },
            { width: fontSize, height: fontSize },
          ]);
          expect(paints.overflow).toBe(false);
          evidence.push({ theme, size, variant, state, target, pair, paints });
        };
        await page.mouse.move(0, 0);
        await sample("default", 4.5);
        await button.hover();
        await sample("hover", 3);
        if (theme === "default") {
          const property = variant.includes("outlined")
            ? "color"
            : "background-color";
          await expect(button).toHaveCSS(property, "rgb(204, 103, 59)");
        }
        await page.mouse.down();
        await sample("pressed", 4.5);
        await page.mouse.move(0, 0);
        await page.mouse.up();
        await button.focus();
        await sample("focus", 4.5);
        await expect(button).not.toHaveAttribute("aria-pressed");
        const disabled = section
          .getByRole("button", { name: variant, exact: true })
          .nth(1);
        await expect(disabled).toBeDisabled();
        const disabledPair = await renderedPair(disabled);
        evidence.push({
          theme,
          size,
          variant,
          state: "disabled",
          target: "WCAG inactive-control exception",
          pair: disabledPair,
        });
      }
    }
    const ids = await root
      .locator("clipPath")
      .evaluateAll((nodes) => nodes.map((node) => node.id));
    expect(new Set(ids).size).toBe(ids.length);
    const result = await new AxeBuilder({ page })
      .include("#storybook-root")
      .analyze();
    expect(result.violations).toEqual([]);
    await testInfo.attach("figma-matrix-pairings", {
      body: JSON.stringify(evidence, null, 2),
      contentType: "application/json",
    });
    await page.setViewportSize({ width: 1600, height: 1200 });
    await page.screenshot({
      path: testInfo.outputPath(`figma-matrix-${theme}.png`),
      fullPage: true,
    });
  });
}
