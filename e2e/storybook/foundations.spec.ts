import { expect, test } from "@playwright/test";
import {
  renderedPair,
  settleStyles,
  themes,
  transitionPairs,
} from "../helpers/foundation";

for (const theme of themes) {
  for (const variant of [
    "primary",
    "secondary",
    "outlined",
    "accent-outlined",
  ]) {
    test(`${theme} ${variant}: real Button fonts, spacing and contrast through hover`, async ({
      page,
    }, testInfo) => {
      const global =
        theme === "default"
          ? "light"
          : theme === "dark-high-contrast"
            ? "highContrast"
            : theme;
      await page.goto(
        `/iframe.html?id=controls-button--${variant}&viewMode=story&globals=theme:${global}`,
      );
      const button = page.locator("#storybook-root button");
      await expect(button).toBeVisible();
      await expect
        .poll(
          async () =>
            (await page.locator("body").getAttribute("data-theme")) ||
            "default",
        )
        .toBe(theme);
      await page.mouse.move(0, 0);
      await settleStyles(page);
      await expect(button).toHaveCSS("padding", "8px 16px");
      const base = await renderedPair(button);
      expect(base.ratio).toBeGreaterThanOrEqual(4.5);
      const font = await page.evaluate(() =>
        getComputedStyle(document.documentElement)
          .getPropertyValue("--font-work-sans")
          .trim()
          .replace(/["']/g, ""),
      );
      expect(font).not.toBe("");
      expect(base.fontFamily).toContain(font);
      expect(base.fontSize).toBe("24px");
      expect(base.fontWeight).toBe("700");
      await button.hover();
      const frames = await transitionPairs(button);
      // Dimi approved Figma's large-text pairing. The 24px minimum is
      // asserted above; ordinary text retains its separate 4.5:1 checks.
      for (const frame of frames)
        expect(frame.ratio, JSON.stringify(frame)).toBeGreaterThanOrEqual(3);
      await page.mouse.down();
      expect((await renderedPair(button)).ratio).toBeGreaterThanOrEqual(4.5);
      await page.mouse.move(0, 0);
      await page.mouse.up();
      for (const frame of await transitionPairs(button))
        expect(frame.ratio, JSON.stringify(frame)).toBeGreaterThanOrEqual(4.5);
      await page.keyboard.press("Tab");
      await button.focus();
      const ring = await renderedPair(button, "outlineColor", true);
      expect(ring.outlineStyle).toBe("solid");
      expect(ring.outlineOffset).toBe("2px");
      expect(ring.ratio).toBeGreaterThanOrEqual(3);
      await testInfo.attach("actual-button-pairings", {
        body: JSON.stringify({ theme, variant, base, frames, ring }, null, 2),
        contentType: "application/json",
      });
    });
  }
}
