import { expect, test } from "@playwright/test";

for (const theme of ["light", "dark", "muted", "highContrast"]) {
  test(`smart sticky header: ${theme}`, async ({ page }, info) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(
      `/iframe.html?id=layouts-portfolioshell--smart-sticky-header&viewMode=story&globals=theme:${theme}`,
    );
    const shell = page.locator("[data-sticky-header]");
    await expect(shell).toHaveCount(1);
    await page.evaluate(() => scrollTo(0, 600));
    await expect(shell).toHaveAttribute("data-header-hidden", "true");
    await page.evaluate(() => scrollTo(0, 570));
    await expect(shell).toHaveAttribute("data-header-hidden", "false");
    await expect
      .poll(async () => (await page.getByRole("banner").boundingBox())!.y)
      .toBe(0);
    await page.screenshot({ path: info.outputPath(`sticky-${theme}.png`) });
    const trigger = page.getByRole("button", {
      name: "Menu: navigation and settings",
      exact: true,
    });
    await trigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
  });
}

test("stationary header leaves keyboard focus clear", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.addInitScript(() =>
    localStorage.setItem("funkspace.motion.preference.v1", "off"),
  );
  await page.goto(
    "/iframe.html?id=layouts-portfolioshell--smart-sticky-header&viewMode=story",
  );
  await expect(page.locator("[data-sticky-header]")).toHaveCount(1);
  const link = page.getByRole("link", { name: "Back to content" }).nth(4);
  await link.evaluate((node) =>
    scrollTo(0, node.getBoundingClientRect().top + scrollY - 20),
  );
  await link.focus();
  const header = (await page.getByRole("banner").boundingBox())!;
  expect((await link.boundingBox())!.y).toBeGreaterThanOrEqual(
    header.y + header.height,
  );
});
