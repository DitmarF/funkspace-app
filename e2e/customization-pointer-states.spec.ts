import { expect, test, type Locator } from "@playwright/test";

const appearance = (button: Locator) =>
  button.evaluate((node) => {
    const style = getComputedStyle(node);
    return {
      color: style.color,
      background: style.backgroundColor,
      border: style.borderTopColor,
    };
  });

for (const touch of [true, false]) {
  for (const width of touch ? [375, 820] : [375, 1280]) {
    test(`${touch ? "touch" : "mouse"} ${width}px: customization has no stuck hover and retains focus`, async ({
      browser,
      baseURL,
    }) => {
      const context = await browser.newContext({
        baseURL,
        viewport: { width, height: 900 },
        hasTouch: touch,
        reducedMotion: "no-preference",
      });
      try {
        const page = await context.newPage();
        await page.goto("/animations/aperture");
        const trigger = page.getByRole("button", {
          name: "Customize animation",
          exact: true,
        });
        await expect(trigger).toBeEnabled();
        if (touch) await trigger.tap();
        else await trigger.click();
        const dialog = page.getByRole("dialog", {
          name: "Customize animation",
          exact: true,
        });
        await expect(dialog).toBeVisible();
        const reset = dialog.getByRole("button", { name: "Reset animation" });
        const fullField = dialog.getByRole("switch", { name: "Full field" });
        const resting = await appearance(reset);
        expect(
          await page.evaluate(() => matchMedia("(hover: hover)").matches),
        ).toBe(!touch);

        if (touch) {
          await fullField.tap();
          await expect(fullField).toHaveAttribute("aria-checked", "true");
          await expect.poll(() => appearance(fullField)).toEqual(resting);
          await reset.tap();
          await expect(fullField).toHaveAttribute("aria-checked", "false");
          await expect.poll(() => appearance(reset)).toEqual(resting);
          // Keep native focus: removing focus is not a touch-hover repair.
          await expect(reset).toBeFocused();
        } else {
          await reset.hover();
          await expect.poll(() => appearance(reset)).not.toEqual(resting);
          await page.mouse.down();
          await expect(reset).toHaveCSS("background-color", resting.color);
          await page.mouse.up();
          await page.mouse.move(0, 0);
          await expect.poll(() => appearance(reset)).toEqual(resting);
        }

        await page.keyboard.press("Tab");
        await expect(fullField).toBeFocused();
        await expect(fullField).toHaveCSS("outline-style", "solid");
        await expect(fullField).toHaveCSS("outline-width", "2px");
        await page.keyboard.press("Space");
        await expect(fullField).toHaveAttribute("aria-checked", "true");
        await page.keyboard.press("Escape");
        await expect(dialog).not.toBeVisible();
        await expect(trigger).toBeFocused();
      } finally {
        await context.close();
      }
    });
  }
}
