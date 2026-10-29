import { expect, test } from "@playwright/test";

for (const width of [375, 1280]) {
  for (const keyboard of [false, true]) {
    test(`${width}px ${keyboard ? "keyboard" : "pointer"}: focus appearance follows navigation input`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/animations/aperture");
      const menu = page.getByRole("button", {
        name: "Menu: navigation and settings",
        exact: true,
      });
      await expect(menu).toBeVisible();
      if (keyboard) await menu.press("Enter");
      else await menu.click();
      const dialog = page.getByRole("dialog", {
        name: "Navigation and settings",
      });
      const close = dialog.getByRole("button", { name: "Close", exact: true });
      await expect(close).toBeFocused();
      await expect(close).toHaveCSS(
        "outline-style",
        keyboard ? "solid" : "none",
      );
      if (!keyboard) await expect(close).toHaveCSS("box-shadow", "none");
      const about = dialog.getByRole("link", { name: "About", exact: true });
      if (keyboard) await about.press("Enter");
      else await about.click();
      await expect(page).toHaveURL("/about");
      const main = page.locator("#main-content");
      await expect(main).toBeFocused();
      if (keyboard) await expect(main).not.toHaveCSS("outline-style", "none");
      else await expect(main).toHaveCSS("outline-style", "none");

      // Pointer use must not permanently disable keyboard focus indication.
      await page.keyboard.press("Tab");
      await expect(page.locator("html")).not.toHaveAttribute(
        "data-portfolio-pointer-focus",
      );
      await menu.press("Enter");
      await expect(close).toBeFocused();
      await expect(close).toHaveCSS("outline-style", "solid");
      await page.keyboard.press("Escape");
      await expect(menu).toBeFocused();
      await expect(menu).toHaveCSS("outline-style", "solid");
    });
  }
}

test("pointer customization opening preserves title focus and restores keyboard rings", async ({
  page,
}) => {
  await page.goto("/animations/aperture");
  const trigger = page.getByRole("button", {
    name: "Customize animation",
    exact: true,
  });
  await expect(trigger).toBeEnabled();
  await trigger.click();
  const dialog = page.getByRole("dialog", {
    name: "Customize animation",
    exact: true,
  });
  const title = dialog.getByRole("heading", { name: "Customize animation" });
  await expect(title).toBeFocused();
  await expect(title).toHaveCSS("outline-style", "none");
  await page.keyboard.press("Tab");
  const close = dialog.getByRole("button", { name: "Close", exact: true });
  await expect(close).toBeFocused();
  await expect(close).toHaveCSS("outline-style", "solid");
  await close.click();
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveCSS("outline-style", "none");
});
