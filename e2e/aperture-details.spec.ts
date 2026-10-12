import { expect, test } from "@playwright/test";

for (const width of [390, 768, 1280]) {
  test(`details reuse the homepage opening and keep instructions outside the dialog at ${width}`, async ({
    page,
  }, info) => {
    await page.setViewportSize({ width, height: 900 });
    await page.addInitScript(() =>
      localStorage.setItem("funkspace.motion.preference.v1", "off"),
    );
    await page.goto("/");
    await expect(
      page.getByRole("button", { name: "Pause animation" }),
    ).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    const home = await page.locator("#start").evaluate((section) => {
      const scene = section
        .querySelector("[data-start-scene]")!
        .getBoundingClientRect();
      return {
        width: section.getBoundingClientRect().width,
        sceneWidth: scene.width,
        sceneHeight: scene.height,
      };
    });
    await page.getByRole("link", { name: "More about Web Aperture" }).click();
    await expect(page).toHaveURL(/\/animations\/aperture$/);
    const customize = page.getByRole("button", {
      name: "Customize animation",
      exact: true,
    });
    await expect(customize).toBeEnabled();
    const opening = page.locator("#start");
    const details = await opening.evaluate((section) => {
      const scene = section
        .querySelector("[data-start-scene]")!
        .getBoundingClientRect();
      return {
        width: section.getBoundingClientRect().width,
        sceneWidth: scene.width,
        sceneHeight: scene.height,
      };
    });
    expect(details).toEqual(home);
    await expect(opening.locator(":scope > svg")).toHaveCount(4);
    await expect(opening.locator(":scope > p")).toHaveCount(0);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Web Aperture",
    );
    const guide = page.getByRole("region", { name: "How it works" });
    await expect(guide.locator(":scope > svg")).toHaveCount(0);
    await expect(guide.locator("dt")).toHaveText([
      "Particles",
      "Speed",
      "Size",
      "Links",
      "Reach",
      "Full field",
    ]);
    await expect(guide).toContainText("Reloading restores defaults.");
    await expect(guide).toContainText("Canvas is the drawing surface.");
    await expect(guide).toContainText(
      "An SVG mask makes the WEB-shaped opening",
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: info.outputPath("details-page.png"),
      fullPage: true,
    });
    await customize.click();
    const dialog = page.getByRole("dialog", { name: "Customize animation" });
    await expect(dialog.getByRole("slider")).toHaveCount(5);
    await expect(dialog.locator("output")).toHaveCount(5);
    const size = dialog.getByRole("slider", { name: "Size" });
    await expect(size).toHaveAccessibleDescription("Dot width: 0.2–0.6 px.");
    await size.fill("2");
    await expect(size).toHaveAccessibleDescription("Dot width: 4–12 px.");
    await expect(dialog).not.toContainText("Reloading restores defaults.");
    await expect(dialog.getByRole("switch", { name: "Full field" })).toHaveText(
      "Full field: Off",
    );
    await expect(
      dialog.getByRole("button", { name: "Reset animation" }),
    ).toHaveText("Reset");
    await page.screenshot({ path: info.outputPath("compact-dialog.png") });
    await page.keyboard.press("Escape");
    await expect(customize).toBeFocused();
  });
}
