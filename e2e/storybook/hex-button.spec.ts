import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { renderedPair, settleStyles, themes } from "../helpers/foundation";

async function open(
  page: Page,
  story: string,
  theme = "default",
  size = "medium",
) {
  const global =
    theme === "default"
      ? "light"
      : theme === "dark-high-contrast"
        ? "highContrast"
        : theme;
  await page.goto(
    `/iframe.html?id=controls-hexbutton--${story}&viewMode=story&globals=theme:${global}&args=size:${size}`,
  );
  await expect(page.locator("#storybook-root button").first()).toBeVisible();
  await expect
    .poll(
      async () =>
        (await page.locator("body").getAttribute("data-theme")) || "default",
    )
    .toBe(theme);
  await settleStyles(page);
}

function contrast(a: string, b: string) {
  const luminance = (color: string) =>
    (color.match(/[\d.]+/g) ?? [])
      .slice(0, 3)
      .map(Number)
      .map((value) => {
        const channel = value / 255;
        return channel <= 0.04045
          ? channel / 12.92
          : ((channel + 0.055) / 1.055) ** 2.4;
      })
      .reduce((sum, value, i) => sum + value * [0.2126, 0.7152, 0.0722][i], 0);
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

for (const theme of themes) {
  test(`${theme}: Hex icon-only samples, paints, focus and inactive states`, async ({
    page,
  }, testInfo) => {
    await open(page, "figma-matrix", theme);
    const root = page.locator("#storybook-root");
    const evidence = [];
    await expect(root.getByRole("button")).toHaveCount(24);
    for (const [size, dimension, fontSize, weight] of [
      ["small", 48, 16, "600"],
      ["medium", 72, 16, "600"],
      ["large", 96, 24, "700"],
    ] as const) {
      for (const variant of [
        "accent-outlined",
        "primary",
        "outlined",
        "secondary",
      ]) {
        const section = root.getByRole("region", {
          name: `${size}-${variant}`,
          exact: true,
        });
        const button = section
          .getByRole("button", { name: "Menu", exact: true })
          .first();
        await expect(button).toHaveText("");
        await expect(button).toHaveAccessibleName("Menu");
        const box = (await button.boundingBox())!;
        expect(box.width).toBe(dimension + 4);
        expect(box.height).toBe(dimension + 4);
        await expect(button).toHaveCSS("font-size", `${fontSize}px`);
        await expect(button).toHaveCSS("font-weight", weight);
        const font = await page.evaluate(() =>
          getComputedStyle(document.documentElement)
            .getPropertyValue("--font-work-sans")
            .trim()
            .replace(/["']/g, ""),
        );
        expect((await renderedPair(button)).fontFamily).toContain(font);
        await expect(button.locator("svg").nth(0)).toHaveCSS(
          "width",
          `${dimension}px`,
        );
        await expect(button.locator("svg").nth(1)).toHaveCSS(
          "width",
          `${dimension / 2}px`,
        );
        await expect(button).not.toHaveAttribute("aria-pressed");
        const sample = async (state: string) => {
          const surface = (await renderedPair(button)).background;
          const paints = await button.evaluate((node) => {
            const shape = getComputedStyle(node.querySelector("svg path")!);
            const paths = [...node.querySelectorAll("svg:nth-child(2) path")];
            return {
              fill: shape.fill,
              stroke: shape.stroke,
              icons: paths.map((path) => getComputedStyle(path).fill),
            };
          });
          expect(paints.icons).toHaveLength(4);
          for (const color of paints.icons)
            expect(contrast(color, paints.fill)).toBeGreaterThanOrEqual(3);
          if (theme === "default" && state === "hover") {
            expect(
              variant.includes("outlined") ? paints.stroke : paints.fill,
            ).toBe("rgb(204, 103, 59)");
          }
          const boundary = contrast(
            variant.includes("outlined") && state !== "pressed"
              ? paints.stroke
              : paints.fill,
            `rgb(${surface.join(", ")})`,
          );
          // The icon and/or hexagonal border identify the control, even where
          // a pressed filled treatment becomes the inverse surface.
          expect(
            Math.max(
              boundary,
              contrast(paints.stroke, `rgb(${surface.join(", ")})`),
            ),
          ).toBeGreaterThanOrEqual(3);
          evidence.push({
            theme,
            size,
            variant,
            state,
            surface,
            paints,
            iconRatio: contrast(paints.icons[0], paints.fill),
            boundary,
          });
        };
        await page.mouse.move(0, 0);
        await sample("default");
        await button.hover();
        await sample("hover");
        await page.mouse.down();
        await sample("pressed");
        await page.mouse.move(0, 0);
        await page.mouse.up();
        await page.keyboard.press("Tab");
        await button.focus();
        await sample("focus");
        const ring = await renderedPair(button, "outlineColor", true);
        expect(ring.ratio).toBeGreaterThanOrEqual(3);
        expect(ring.outlineStyle).toBe("solid");
        expect(ring.outlineOffset).toBe("2px");
        await expect(button).toHaveCSS("clip-path", "none");
        await expect(button).toHaveCSS("overflow", "visible");
        evidence.push({ theme, variant, ring });
        const disabled = section.getByRole("button").nth(1);
        await expect(disabled).toBeDisabled();
        const disabledPair = await renderedPair(disabled);
        evidence.push({
          theme,
          variant,
          state: "disabled",
          target: "inactive-control exception",
          disabledPair,
        });
      }
    }
    expect(
      (await new AxeBuilder({ page }).include("#storybook-root").analyze())
        .violations,
    ).toEqual([]);
    await testInfo.attach("hex-rendered-pairings", {
      body: JSON.stringify(evidence, null, 2),
      contentType: "application/json",
    });
    await page.screenshot({
      path: testInfo.outputPath(`hex-${theme}.png`),
      fullPage: true,
    });
  });
}

for (const size of ["small", "medium", "large"]) {
  test(`${size}: rectangle corners, accessible name, keyboard and neighbors activate only their native button`, async ({
    page,
  }) => {
    await open(page, "interaction", "default", size);
    const button = page.getByRole("button", { name: "Menu", exact: true });
    const box = (await button.boundingBox())!;
    const art = (await button.locator("svg").first().boundingBox())!;
    const points = [
      [box.x + 2, box.y + 2],
      [box.x + box.width - 2, box.y + box.height - 2],
      [art.x + 1, art.y + 1],
      [art.x + art.width - 1, art.y + art.height - 1],
    ];
    let activations = 0;
    for (const [x, y] of points) {
      expect(
        await page.evaluate(
          ({ x, y }) => document.elementFromPoint(x, y)?.tagName,
          { x, y },
        ),
      ).toBe("BUTTON");
      await page.mouse.click(x, y);
      await expect(page.getByRole("status")).toHaveText(
        `Menu activations: ${++activations}; next action: 0`,
      );
    }
    await expect(button).toHaveText("");
    await expect(button).toHaveAccessibleName("Menu");
    await button.focus();
    for (const key of ["Enter", "Space"]) {
      await page.keyboard.press(key);
      await expect(page.getByRole("status")).toHaveText(
        `Menu activations: ${++activations}; next action: 0`,
      );
    }
    const disabled = page.getByRole("button", { name: "Unavailable menu" });
    await disabled.click({ force: true });
    await expect(page.getByRole("status")).toHaveText(
      `Menu activations: ${activations}; next action: 0`,
    );
    await button.focus();
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("button", { name: "Next action" }),
    ).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("status")).toHaveText(
      `Menu activations: ${activations}; next action: 1`,
    );
  });

  test(`${size}: touch corners outside the visible hexagon activate once`, async ({
    browser,
  }, testInfo) => {
    const context = await browser.newContext({
      hasTouch: true,
      isMobile: true,
      viewport: { width: 390, height: 844 },
      baseURL: "http://127.0.0.1:6006",
    });
    const page = await context.newPage();
    try {
      await open(page, "interaction", "default", size);
      const button = page.getByRole("button", { name: "Menu", exact: true });
      const box = (await button.locator("svg").first().boundingBox())!;
      for (const [i, [x, y]] of [
        [box.x + 1, box.y + 1],
        [box.x + box.width - 1, box.y + box.height - 1],
      ].entries()) {
        await page.touchscreen.tap(x, y);
        await expect(page.getByRole("status")).toHaveText(
          `Menu activations: ${i + 1}; next action: 0`,
        );
      }
      await page.screenshot({
        path: testInfo.outputPath("hex-touch.png"),
        fullPage: true,
      });
    } finally {
      await context.close();
    }
  });
}

test("long and enlarged labels wrap without clipping or horizontal page overflow", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 320, height: 640 });
  for (const story of ["long-label", "enlarged-text"]) {
    await open(page, story);
    const button = page.locator("#storybook-root button");
    const result = await button.evaluate((node) => {
      const label = node.lastElementChild!;
      const rect = node.getBoundingClientRect(),
        text = label.getBoundingClientRect();
      return {
        overflow:
          node.scrollWidth > node.clientWidth ||
          node.scrollHeight > node.clientHeight,
        pageOverflow: document.documentElement.scrollWidth > innerWidth,
        contained:
          text.left >= rect.left &&
          text.right <= rect.right &&
          text.bottom <= rect.bottom,
      };
    });
    expect(result).toEqual({
      overflow: false,
      pageOverflow: false,
      contained: true,
    });
    await page.keyboard.press("Tab");
    await button.focus();
    await expect(button).toHaveCSS("outline-style", "solid");
    await page.screenshot({
      path: testInfo.outputPath(`hex-${story}.png`),
      fullPage: true,
    });
  }
});

test("forced colors preserve a rectangular boundary, disabled cue and focus", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await open(page, "interaction");
  const button = page.getByRole("button", { name: "Menu", exact: true });
  const disabled = page.getByRole("button", { name: "Unavailable menu" });
  await page.keyboard.press("Tab");
  await button.focus();
  await expect(button).toHaveCSS("outline-style", "solid");
  await expect(button).toHaveCSS("border-top-style", "solid");
  await expect(button).toHaveCSS("overflow", "visible");
  const normal = await renderedPair(button, "borderTopColor");
  const inactive = await renderedPair(disabled, "borderTopColor");
  expect(normal.ratio).toBeGreaterThanOrEqual(3);
  expect(normal.foreground).not.toBe(inactive.foreground);
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toHaveText(
    "Menu activations: 1; next action: 0",
  );
  await testInfo.attach("forced-color-pairings", {
    body: JSON.stringify({ normal, inactive }),
    contentType: "application/json",
  });
  await page.screenshot({
    path: testInfo.outputPath("hex-forced-colors.png"),
    fullPage: true,
  });
});
