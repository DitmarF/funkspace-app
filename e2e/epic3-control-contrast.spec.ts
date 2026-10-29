import { expect, test } from "@playwright/test";
import {
  openAppearance,
  renderedPair,
  selectTheme,
  settleStyles,
  themes,
} from "./helpers/foundation";

for (const theme of themes) {
  test(`Q1 ${theme}: Motion text retains normal-text contrast in hover, active and keyboard-focus states`, async ({
    page,
  }) => {
    await page.goto("/");
    await selectTheme(page, theme);
    await openAppearance(page);
    const choice = page
      .getByRole("group", { name: "Motion", exact: true })
      .getByRole("button", { name: "On", exact: true });
    await expect(choice).toHaveAttribute("aria-pressed", "false");
    const samples = [];
    await page.mouse.move(0, 0);
    await page.keyboard.press("Tab");
    await choice.focus();
    await expect(choice).toBeFocused();
    await expect(choice).toHaveCSS("outline-style", "solid");
    await settleStyles(page);
    samples.push({
      state: "unselected-focus",
      ...(await renderedPair(choice)),
    });
    await choice.hover();
    await settleStyles(page);
    samples.push({
      state: "unselected-hover",
      ...(await renderedPair(choice)),
    });
    await page.mouse.down();
    await settleStyles(page);
    samples.push({
      state: "unselected-active",
      ...(await renderedPair(choice)),
    });
    await page.mouse.move(0, 0);
    await page.mouse.up();
    await choice.click();
    await expect(choice).toHaveAttribute("aria-pressed", "true");
    await settleStyles(page);
    samples.push({ state: "selected-hover", ...(await renderedPair(choice)) });
    await page.mouse.down();
    await settleStyles(page);
    samples.push({ state: "selected-active", ...(await renderedPair(choice)) });
    await page.mouse.move(0, 0);
    await page.mouse.up();
    await page.keyboard.press("Tab");
    await choice.focus();
    await expect(choice).toBeFocused();
    await expect(choice).toHaveCSS("outline-style", "solid");
    await settleStyles(page);
    samples.push({ state: "selected-focus", ...(await renderedPair(choice)) });
    await test.info().attach("motion-control-contrast.json", {
      body: JSON.stringify(samples, null, 2),
      contentType: "application/json",
    });
    expect(
      samples.filter((sample) => sample.ratio < 4.5),
      JSON.stringify(samples, null, 2),
    ).toEqual([]);
  });
}
