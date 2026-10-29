import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const [story, width] of [
  ["available", 1280],
  ["narrow", 390],
  ["unavailable", 768],
] as const) {
  test(`details and compact customization story: ${story}`, async ({
    page,
  }, info) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(
      `/iframe.html?id=scene-customization--${story}&viewMode=story`,
    );
    await expect(
      page.getByRole("heading", { name: "How it works" }),
    ).toBeVisible();
    await expect(page.locator("#start > svg")).toHaveCount(4);
    const customize = page.getByRole("button", {
      name: "Customize animation",
      exact: true,
    });
    await expect(customize).toBeEnabled();
    await customize.click();
    const dialog = page.getByRole("dialog", { name: "Customize animation" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("slider")).toHaveCount(5);
    await dialog.getByRole("slider", { name: "Particles" }).fill("100");
    await expect(
      dialog.getByRole("slider", { name: "Particles" }),
    ).toHaveAttribute("aria-valuetext", "100 particles");
    await expect(dialog.getByRole("switch", { name: "Full field" })).toHaveText(
      "Full field: Off",
    );
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.screenshot({ path: info.outputPath("dialog.png") });
    await page.keyboard.press("Escape");
    await expect(customize).toBeFocused();
  });
}
