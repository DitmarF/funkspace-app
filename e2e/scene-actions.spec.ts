import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";

const available = process.env.FS35_AVAILABLE === "true";
const firstPath = (name: string, size = 24) =>
  readFileSync(`frontend/public/svg/icons/${name}-${size}.svg`, "utf8").match(
    /<path\b[^>]*\bd="([^"]+)"/,
  )![1];

for (const route of ["/", "/animations/aperture"]) {
  test(`${route}: paired scene actions preserve layout, keyboard and focus`, async ({
    page,
  }, info) => {
    await page.addInitScript(() =>
      localStorage.setItem("funkspace.motion.preference.v1", "on"),
    );
    await page.goto(route);
    const actions = page.locator("[data-scene-actions]");
    const pause = actions.getByRole("button", { name: "Pause animation" });
    const secondary =
      route === "/"
        ? actions.getByRole("link", { name: "More about Aperture - 1" })
        : actions.getByRole("button", { name: "Customize animation" });
    await expect(pause).toBeVisible();
    await expect(secondary).toBeVisible();
    await expect(secondary).toHaveText(route === "/" ? "More" : "Customize");
    await expect(secondary.locator("svg path").first()).toHaveAttribute(
      "d",
      firstPath(route === "/" ? "more" : "playground"),
    );
    if (available) await expect(pause).toBeEnabled();
    await expect(
      pause.locator("svg").last().locator("path").first(),
    ).toHaveAttribute("d", firstPath("pause"));
    for (const width of [320, 375, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      await actions.scrollIntoViewIfNeeded();
      const [row, left, right, scene] = await Promise.all([
        actions.boundingBox(),
        pause.boundingBox(),
        secondary.boundingBox(),
        page.locator("[data-start-scene]").boundingBox(),
      ]);
      expect(left!.x).toBeCloseTo(row!.x - 2, 1);
      expect(right!.x + right!.width).toBeCloseTo(row!.x + row!.width, 1);
      expect(left!.x + left!.width).toBeLessThan(right!.x);
      expect(
        Math.abs(left!.y + left!.height / 2 - right!.y - right!.height / 2),
      ).toBeLessThan(1);
      expect(row!.y).toBeGreaterThanOrEqual(scene!.y + scene!.height);
      expect(left!.width).toBe(52);
      expect(left!.height).toBe(52);
      await expect(pause.locator("svg").last()).toHaveCSS("width", "16px");
      await expect(pause.locator("svg").last()).toHaveCSS("height", "16px");
      if (width === 375)
        await page.screenshot({ path: info.outputPath("mobile-actions.png") });
    }
    await page.setViewportSize({ width: 320, height: 900 });
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "200%";
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "";
    });
    if (available) {
      await expect(pause).toBeEnabled();
      await pause.focus();
      await page.keyboard.press("Space");
      const resume = actions.getByRole("button", { name: "Resume animation" });
      await expect(resume).toBeFocused();
      await expect(resume.locator("svg").last()).toHaveCSS("width", "16px");
      await expect(resume.locator("svg").last()).toHaveCSS("height", "16px");
      await expect(
        resume.locator("svg").last().locator("path").first(),
      ).toHaveAttribute("d", firstPath("play"));
      await expect(resume.locator("svg").last()).toHaveCSS(
        "transform",
        "matrix(1, 0, 0, 1, 1, 0)",
      );
      const pausedStatus = page
        .getByRole("status")
        .filter({ hasText: "Animation paused here." });
      await expect(pausedStatus).toHaveClass("sr-only");
      expect((await pausedStatus.boundingBox())!.height).toBe(1);
      await page.screenshot({ path: info.outputPath("paused-actions.png") });
      await page.keyboard.press("Enter");
      await expect(pause).toBeFocused();
      const status = page
        .getByRole("status")
        .filter({ hasText: "Animation playing." });
      await expect(status).toHaveClass("sr-only");
      expect((await status.boundingBox())!.height).toBe(1);
    } else await expect(pause).toBeDisabled();
    await secondary.focus();
    await page.keyboard.press("Enter");
    if (route === "/") await expect(page).toHaveURL(/\/animations\/aperture$/);
    else {
      await expect(
        page.getByRole("dialog", { name: "Customize animation" }),
      ).toBeVisible();
      const dialog = page.getByRole("dialog", { name: "Customize animation" });
      const backgroundStatus = actions.locator("..").locator(":scope > p");
      if (available)
        await expect(backgroundStatus).toContainText("Animation waits until");
      await expect(backgroundStatus).toHaveCSS("position", "absolute");
      expect((await backgroundStatus.boundingBox())!.height).toBe(1);
      for (const text of await dialog
        .locator("h2, p, label, output, button")
        .all()) {
        await expect(text).toHaveCSS("text-align", "left");
      }
      await page.screenshot({
        path: info.outputPath("customization-left-aligned.png"),
      });
      await page.keyboard.press("Escape");
      await expect(secondary).toBeFocused();
    }
  });
}

test("no-JavaScript homepage retains the More link without dead playback/customization controls", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 375, height: 900 },
  });
  const page = await context.newPage();
  try {
    await page.goto("/");
    await expect(page.locator("[data-scene-actions] button")).toHaveCount(0);
    const staticStatus = page.getByText(
      "Static artwork. Animation follows your motion settings.",
      { exact: true },
    );
    await expect(staticStatus).toHaveCSS("position", "absolute");
    expect((await staticStatus.boundingBox())!.height).toBe(1);
    const more = page.getByRole("link", { name: "More about Aperture - 1" });
    await expect(more).toHaveAttribute("href", "/animations/aperture");
    await more.click();
    await expect(page).toHaveURL(/\/animations\/aperture$/);
    await expect(page.locator("[data-scene-actions] button")).toHaveCount(0);
    await expect(page.locator("[data-aperture-fallback] path")).toBeVisible();
  } finally {
    await context.close();
  }
});
