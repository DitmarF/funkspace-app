import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const story of [
  "focus-padding-with-sticky-header",
  "scroll-padding-without-sticky",
]) {
  test(`${story}: legacy button-style demo links and native buttons share typography`, async ({
    page,
  }) => {
    await page.goto(
      `/iframe.html?id=layouts-fullscreenscroll-focus-a11y--${story}&viewMode=story`,
    );
    const controls = page.locator("#storybook-root button, #storybook-root a");
    await expect(controls.first()).toBeVisible();
    for (const control of await controls.all()) {
      await expect(control).toHaveCSS("font-weight", "500");
      const source = (await control.textContent())!.trim();
      expect(await control.innerText()).toBe(
        source[0].toLowerCase() + source.slice(1),
      );
    }
  });
}

for (const theme of ["light", "dark", "muted", "highContrast"]) {
  test(`${theme}: medium text with a lowercase initial preserves names and inner capitalization`, async ({
    page,
  }, info) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto(
      `/iframe.html?id=controls-button--text-typography&viewMode=story&globals=theme:${theme};a11y.manual:!true`,
    );
    const root = page.locator("#storybook-root");
    const reset = root.getByRole("button", { name: "Reset WEB animation" });
    await expect(reset).toBeVisible();
    await expect(reset).toBeDisabled();
    for (const control of await root.locator("button, a").all()) {
      await expect(control).toHaveCSS("font-weight", "500");
      const source = (await control.textContent())!.trim();
      expect(await control.innerText()).toBe(
        source[0].toLowerCase() + source.slice(1),
      );
    }
    const overlay = root.getByRole("button", {
      name: "Transparent WEB overlay: Off",
    });
    expect(await overlay.innerText()).toBe("transparent WEB overlay: Off");
    expect(await root.getByRole("link").innerText()).toBe(
      "more about FunkSpace",
    );
    await overlay.focus();
    await expect(overlay).toBeFocused();
    expect(
      (await new AxeBuilder({ page }).include("#storybook-root").analyze())
        .violations,
    ).toEqual([]);
    await page.screenshot({ path: info.outputPath("button-text.png") });
  });
}
