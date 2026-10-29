import { expect, test } from "@playwright/test";

const canvas = "canvas[data-particle-canvas]";
const available = process.env.FS35_AVAILABLE === "true";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem("funkspace.motion.preference.v1", "on"),
  );
});

for (const sceneRoute of ["/", "/animations/aperture"]) {
  test(`${sceneRoute}: WEB grows only on mobile, including without JavaScript`, async ({
    browser,
  }, info) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    try {
      await page.goto(sceneRoute);
      for (const width of [320, 375, 639, 640, 768, 1280]) {
        await page.setViewportSize({ width, height: 850 });
        const aperture = page.locator(
          "[data-start-scene] [data-scene-aperture]",
        );
        const geometry = await aperture.evaluate((element) => {
          const cover = element.getBoundingClientRect();
          // The unused mask image has no rendered bounds in the no-JS solid
          // state. Compare its declared fitting with the visible fallback.
          const image = element.querySelector("image")!;
          const fallbackElement = element.querySelector(
            "[data-aperture-fallback]",
          )!;
          // SVG viewport bounding boxes differ between engines. Transform the
          // declared artwork viewBox through its actual screen matrix instead.
          const svg = fallbackElement as SVGSVGElement;
          const box = svg.viewBox.baseVal;
          const matrix = svg.querySelector("path")!.getScreenCTM()!;
          const first = new DOMPoint(box.x, box.y).matrixTransform(matrix);
          const last = new DOMPoint(
            box.x + box.width,
            box.y + box.height,
          ).matrixTransform(matrix);
          const fallback = {
            x: first.x,
            y: first.y,
            width: last.x - first.x,
            height: last.y - first.y,
          };
          const path = element
            .querySelector("[data-aperture-fallback] path")!
            .getBoundingClientRect();
          return {
            width: fallback.width / cover.width,
            aspect: fallback.width / fallback.height,
            centeredY:
              fallback.y + fallback.height / 2 - (cover.y + cover.height / 2),
            inset: (fallback.x - cover.x) / cover.width,
            matchingFallback:
              ["x", "y", "width", "height", "preserveAspectRatio"].every(
                (attribute) =>
                  image.getAttribute(attribute) ===
                  fallbackElement.getAttribute(attribute),
              ) &&
              getComputedStyle(image.parentElement!).transform ===
                getComputedStyle(fallbackElement.parentElement!).transform,
            contained:
              path.left >= cover.left &&
              path.right <= cover.right &&
              path.top >= cover.top &&
              path.bottom <= cover.bottom,
            overflow: document.documentElement.scrollWidth > innerWidth,
          };
        });
        const fraction = width < 640 ? 0.96 : 0.8;
        expect(geometry.width).toBeCloseTo(fraction, 3);
        expect(geometry.aspect).toBeCloseTo(2347 / 660, 3);
        expect(geometry.centeredY).toBeCloseTo(0, 2);
        expect(geometry.inset).toBeCloseTo((1 - fraction) / 2, 3);
        expect(geometry.matchingFallback).toBe(true);
        expect(geometry.contained).toBe(true);
        expect(geometry.overflow).toBe(false);
        await expect(page.locator("[data-start-scene] canvas")).toHaveCount(0);
        if (width === 375 || width === 768)
          await page.screenshot({
            path: info.outputPath(`static-${width}.png`),
          });
      }
    } finally {
      await context.close();
    }
  });

  for (const assetState of ["missing", "delayed"] as const) {
    test(`${sceneRoute}: ${assetState} WEB export cannot replace the built-in WEB`, async ({
      page,
    }, info) => {
      await page.addInitScript(
        (theme) => localStorage.setItem("theme", theme),
        assetState === "missing" ? "dark" : "default",
      );
      await page.setViewportSize({
        width: assetState === "missing" ? 1280 : 375,
        height: 850,
      });
      let requests = 0;
      let release!: () => void;
      const gate = new Promise<void>((resolve) => {
        release = resolve;
      });
      await page.route(
        "**/scene-apertures/web-work-sans.svg",
        async (request) => {
          requests++;
          if (assetState === "delayed") await gate;
          await request.fulfill({ status: 404, body: "" });
        },
      );
      try {
        await page.goto(sceneRoute);
        const scene = page.locator("[data-start-scene]");
        const aperture = scene.locator("[data-scene-aperture]");
        await scene.scrollIntoViewIfNeeded();
        await expect(aperture).toHaveAttribute("data-aperture", "web");
        await expect(aperture).toHaveAttribute("data-mask-ready", "true");
        // Definitions have no painted bounds in Firefox. Inspect native image
        // fitting and its composed scale; retained screenshots cover masking.
        const openingFraction = await aperture
          .locator("mask image")
          .evaluate((image) => {
            const scale = new DOMMatrixReadOnly(
              getComputedStyle(image.parentElement!).transform,
            ).a;
            return (
              (Number.parseFloat(image.getAttribute("width")!) / 100) * scale
            );
          });
        expect(openingFraction).toBeCloseTo(
          assetState === "delayed" ? 0.96 : 0.8,
          3,
        );
        const href = await aperture.locator("mask image").getAttribute("href");
        expect(decodeURIComponent(href!)).toContain('<path d="M187 660');
        expect(decodeURIComponent(href!)).not.toContain("<circle");
        await expect(aperture.locator("circle")).toHaveCount(0);
        if (available) await expect(scene.locator(canvas)).toBeVisible();
        else {
          await expect(scene.locator(canvas)).toHaveCount(0);
          await expect(
            aperture.locator("[data-aperture-fallback] path"),
          ).toBeVisible();
        }
        expect(requests).toBe(0);
        await page.screenshot({ path: info.outputPath("built-in-web.png") });
      } finally {
        release();
        await page.unrouteAll({ behavior: "wait" });
      }
    });
  }
}
