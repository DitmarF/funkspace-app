import { expect, test } from "@playwright/test";
import { openSettings } from "./helpers/foundation";

for (const width of [320, 375, 768, 1254, 1454, 2365]) {
  test(`navigation spacing stays consistent at ${width}px`, async ({
    page,
  }, info) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/about");
    await openSettings(page);
    const dialog = page.getByRole("dialog");
    const buttons = await Promise.all(
      [
        "Menu: close navigation and settings",
        "Navigation",
        "Languages",
        "Accessibility",
        "Chat-bot",
      ].map(
        async (name) =>
          (await dialog
            .getByRole("button", { name, exact: true })
            .boundingBox())!,
      ),
    );
    const positions = buttons.sort((a, b) => a.y - b.y);
    const gaps = positions
      .slice(1)
      .map(
        (box, index) => box.y - positions[index].y - positions[index].height,
      );
    expect(Math.max(...gaps) - Math.min(...gaps)).toBeLessThan(0.5);
    const title = (await dialog
      .getByRole("heading", { name: "Navigation", exact: true })
      .boundingBox())!;
    const tree = (await dialog
      .getByRole("navigation", { name: "Primary" })
      .boundingBox())!;
    expect(Math.abs(tree.x - title.x)).toBeLessThan(0.5);
    if (width >= 768) {
      const close = (await dialog
        .getByRole("button", { name: "Close", exact: true })
        .boundingBox())!;
      expect(title.x - (close.x + close.width)).toBeGreaterThan(0);
      expect(title.x - (close.x + close.width)).toBeLessThanOrEqual(32);
      expect(
        Math.abs(title.y + title.height / 2 - close.y - close.height / 2),
      ).toBeLessThan(0.5);
    }
    await page.screenshot({ path: info.outputPath(`navigation-${width}.png`) });
  });
}

for (const route of ["/about", "/privacy", "/impressum"]) {
  for (const width of [375, 1280]) {
    test(`${route} at ${width}px: reload keeps the same hex trigger without fallback text or arrow`, async ({
      page,
    }, info) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      await page.setViewportSize({ width, height: 720 });
      await page.addInitScript(
        (theme) => localStorage.setItem("theme", theme),
        width < 768 ? "default" : "dark",
      );
      // Capture the browser's actual paint without waiting for document.fonts.ready:
      // deferred application scripts are intentionally held before DOMContentLoaded.
      const capture = await page.context().newCDPSession(page);
      for (const reload of [false, true]) {
        let release!: () => void;
        const held = new Promise<void>((resolve) => {
          release = resolve;
        });
        await page.route("**/_next/static/**/*.js", async (request) => {
          await held;
          await request.continue();
        });
        try {
          if (reload) await page.reload({ waitUntil: "commit" });
          else await page.goto(route, { waitUntil: "commit" });
          const tree = page.locator('footer nav[aria-label="Primary"]');
          await expect(tree).toBeAttached();
          await expect(tree).toBeHidden();
          // Keep this case idle to verify the unchanged pre/post-hydration paint.
          // Active keyboard continuity is covered in navigation-hydration.spec.ts.
          const fallback = page.locator("footer details").first();
          const summary = fallback.locator(":scope > summary");
          await expect(summary).toHaveAccessibleName("Navigation");
          expect(await summary.textContent()).toBe("");
          expect(
            await summary.evaluate(
              (node) => getComputedStyle(node).listStyleType,
            ),
          ).toBe("none");
          const initialBox = (await summary.boundingBox())!;
          expect(initialBox.height).toBeGreaterThanOrEqual(44);
          const initialArtwork = await capture.send("Page.captureScreenshot", {
            format: "png",
            clip: { ...initialBox, scale: 1 },
          });
          await expect(
            tree.getByRole("link", {
              name: "About",
              exact: true,
              includeHidden: true,
            }),
          ).toHaveAttribute("href", "/about");
          release();
          const menu = page.getByRole("button", {
            name: "Menu: navigation and settings",
            exact: true,
          });
          await expect(menu).toBeVisible();
          expect(await menu.boundingBox()).toEqual(initialBox);
          const enhancedArtwork = await capture.send("Page.captureScreenshot", {
            format: "png",
            clip: { ...initialBox, scale: 1 },
          });
          expect(enhancedArtwork.data).toEqual(initialArtwork.data);
          await info.attach(`identical-trigger-${reload ? "reload" : "load"}`, {
            body: Buffer.from(initialArtwork.data, "base64"),
            contentType: "image/png",
          });
          await expect(
            page.locator('footer details[class*="fallback"]'),
          ).toHaveCount(0);
          await expect(tree).toBeHidden();
          expect(errors).toEqual([]);
        } finally {
          release();
          await page.unrouteAll({ behavior: "wait" });
        }
      }
      await capture.detach();
    });
  }
}
