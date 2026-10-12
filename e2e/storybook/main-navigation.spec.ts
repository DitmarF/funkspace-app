import { expect, test } from "@playwright/test";

for (const width of [320, 768, 1280]) {
  for (const theme of ["light", "dark", "muted", "highContrast"]) {
    test(`header navigation: ${theme} ${width}px`, async ({ page }, info) => {
      await page.setViewportSize({ width, height: 720 });
      await page.goto(
        `/iframe.html?id=layouts-portfoliomainnavigation--in-header&viewMode=story&globals=theme:${theme}`,
      );
      const nav = page.getByRole("navigation", { name: "Main", exact: true });
      await expect(nav).toBeVisible();
      await expect(nav.getByRole("button", { name: "Contact" })).toBeDisabled();
      const home = nav.getByRole("button", { name: "Home", exact: true });
      const about = nav.getByRole("link", { name: "About" });
      await expect(home).toBeDisabled();
      await expect(home).toHaveAttribute("aria-current", "page");
      await expect(about).toHaveAttribute("href", "/about");
      await about.focus();
      await page.keyboard.press("Tab");
      await expect(
        page.getByRole("button", {
          name: "Menu: navigation and settings",
          exact: true,
        }),
      ).toBeFocused();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({ path: info.outputPath("header.png") });
    });
  }
}

for (const [story, landmark, label, group] of [
  ["layouts-portfoliomainnavigation--about-active", "Main", "About", ""],
  ["layouts-portfolionavigationtree--about-active", "Primary", "About", ""],
  [
    "layouts-portfolionavigationtree--aperture-active",
    "Primary",
    "Web Aperture",
    "Animations",
  ],
]) {
  test(`current-page story: ${story}`, async ({ page }) => {
    await page.goto(`/iframe.html?id=${story}&viewMode=story`);
    const nav = page.getByRole("navigation", { name: landmark, exact: true });
    if (group)
      await expect(
        nav.locator("summary").filter({ hasText: group }).locator(".."),
      ).toHaveAttribute("open", "");
    const current = nav.getByRole("button", { name: label, exact: true });
    await expect(current).toBeVisible();
    await expect(current).toBeDisabled();
    await expect(current).toHaveAttribute("aria-current", "page");
    await expect(current).not.toHaveAttribute("href");
    await expect(
      nav.getByRole("link", { name: label, exact: true }),
    ).toHaveCount(0);
  });
}
