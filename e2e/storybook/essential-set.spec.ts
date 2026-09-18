import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { renderedPair, settleStyles, themes } from "../helpers/foundation";

const globals = {
  default: "light",
  dark: "dark",
  muted: "muted",
  "dark-high-contrast": "highContrast",
};
async function fixture(
  page: Page,
  theme: (typeof themes)[number] = "default",
  story = "full-document",
) {
  await page.goto(
    `/iframe.html?id=controls-essentialset--${story}&viewMode=story&globals=theme:${globals[theme]}`,
  );
  await expect(page.getByTestId("resolved-theme")).toHaveText(
    `Resolved theme: ${theme}`,
  );
  await expect
    .poll(
      async () =>
        (await page.locator("body").getAttribute("data-theme")) || "default",
    )
    .toBe(theme);
  await settleStyles(page);
}
async function accessible(page: Page) {
  expect(
    (await new AxeBuilder({ page }).include("#storybook-root").analyze())
      .violations,
  ).toEqual([]);
}

for (const theme of themes) {
  test(`${theme}: complete composition uses resolved themes, fonts and native interactions`, async ({
    page,
  }, testInfo) => {
    // Explicit light must work even with an OS-dark preference and stored dark theme.
    await page.emulateMedia({ colorScheme: "dark" });
    await page.addInitScript(() => localStorage.setItem("theme", "dark"));
    await fixture(page, theme);
    expect(await page.evaluate(() => window.top === window)).toBe(true);
    const environment = await page.evaluate(() => {
      const css = getComputedStyle(document.documentElement);
      return {
        root: document.documentElement.dataset.theme || "default",
        body: document.body.dataset.theme || "default",
        background: getComputedStyle(document.body).backgroundColor,
        display: css
          .getPropertyValue("--font-work-sans")
          .trim()
          .replace(/["']/g, ""),
        sans: css
          .getPropertyValue("--font-space-grotesk")
          .trim()
          .replace(/["']/g, ""),
        fonts: [...document.fonts].map((font) => ({
          family: font.family.replace(/["']/g, ""),
          weight: font.weight,
          status: font.status,
        })),
      };
    });
    expect(environment.root).toBe(theme);
    expect(environment.body).toBe(theme);
    expect(environment.background).toBe(
      {
        default: "rgb(230, 230, 230)",
        dark: "rgb(26, 26, 26)",
        muted: "rgb(255, 255, 255)",
        "dark-high-contrast": "rgb(0, 0, 0)",
      }[theme],
    );
    const heading = await renderedPair(page.getByRole("heading", { level: 1 }));
    const field = await renderedPair(
      page.getByRole("textbox", { name: "Name", exact: true }),
    );
    const trigger = page.getByRole("button", {
      name: "Review example details",
    });
    const control = await renderedPair(trigger);
    expect(heading.fontFamily.replace(/["']/g, "")).toContain(
      environment.display,
    );
    expect(field.fontFamily.replace(/["']/g, "")).toContain(environment.sans);
    expect(control.fontFamily.replace(/["']/g, "")).toContain(
      environment.display,
    );
    expect([heading.fontWeight, field.fontWeight, control.fontWeight]).toEqual([
      "600",
      "400",
      "700",
    ]);
    for (const family of [environment.display, environment.sans])
      expect(
        environment.fonts.some(
          (font) => family.includes(font.family) && font.status === "loaded",
        ),
      ).toBe(true);
    await page
      .getByRole("textbox", { name: "Name", exact: true })
      .fill("Review draft");
    await page.getByLabel("Show an example field error").check();
    await expect(
      page.getByRole("textbox", { name: "Name", exact: true }),
    ).toHaveAccessibleDescription(
      /Keep these example values.*optional display name.*Error: Example caller-supplied name error/,
    );
    await expect(
      page.getByRole("textbox", { name: "Name", exact: true }),
    ).toHaveAttribute("aria-invalid", "true");
    await expect(
      page.getByRole("button", { name: "Unavailable example" }),
    ).toBeDisabled();
    await accessible(page);
    await trigger.hover();
    const hover = await renderedPair(trigger);
    expect(hover.ratio).toBeGreaterThanOrEqual(3);
    expect(hover.background).not.toEqual(control.background);
    await page.mouse.down();
    const pressed = await renderedPair(trigger);
    expect(pressed.ratio).toBeGreaterThanOrEqual(3);
    expect(pressed.background).not.toEqual(hover.background);
    await page.mouse.up();
    const dialog = page.getByRole("dialog", { name: "Review the example" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { level: 2 })).toBeFocused();
    await page.keyboard.press("Tab");
    const close = dialog.getByRole("button", { name: "Close", exact: true });
    await expect(close).toBeFocused();
    const focus = await renderedPair(close, "outlineColor", true);
    expect(focus.ratio).toBeGreaterThanOrEqual(3);
    await page.screenshot({
      path: testInfo.outputPath(`composition-${theme}.png`),
    });
    await dialog
      .getByRole("textbox", { name: "Preview message" })
      .fill("Retained dialog edit");
    const run = dialog.getByRole("button", { name: "Run local preview" });
    await run.scrollIntoViewIfNeeded();
    const before = await run.boundingBox();
    await run.click();
    await expect(run).toBeFocused();
    await expect(run).toHaveAttribute("aria-busy", "true");
    await expect(dialog.getByRole("textbox")).toHaveAttribute("readonly");
    await page.keyboard.press("Enter");
    await page.keyboard.press("Space");
    await run.evaluate((node) => {
      if (!(node instanceof HTMLButtonElement))
        throw new Error("Expected native button");
      node.click();
    });
    await expect(page.getByTestId("fixture-runs")).toHaveText(
      "Fixture runs: 1",
    );
    const after = await run.boundingBox();
    expect(after?.width).toBe(before?.width);
    expect(after?.height).toBe(before?.height);
    await accessible(page);
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
    await expect(
      page.getByRole("textbox", { name: "Message", exact: true }),
    ).toHaveValue("Retained dialog edit");
    const menu = page.getByRole("button", { name: "Menu", exact: true });
    await menu.click();
    await expect(run).toHaveAttribute("aria-busy", "true");
    await dialog.getByRole("button", { name: "Finish fixture work" }).click();
    await expect(
      dialog
        .getByRole("status")
        .filter({ hasText: "Fixture complete. Nothing was sent." }),
    ).toHaveCount(1);
    await expect(run).not.toHaveAttribute("aria-busy", "true");
    await close.click();
    await expect(menu).toBeFocused();
    await expect
      .poll(() => page.evaluate(() => document.body.style.position))
      .toBe("");
    await testInfo.attach("composition-evidence", {
      body: JSON.stringify(
        { theme, environment, heading, field, control, hover, pressed, focus },
        null,
        2,
      ),
      contentType: "application/json",
    });
  });
}

test("native fragment and new-tab links retain browser navigation", async ({
  page,
}) => {
  await fixture(page);
  await page.getByRole("link", { name: "Read fixture notes" }).click();
  await expect(page).toHaveURL(/#fixture-notes$/);
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(0);
  await expect(page.locator("#fixture-notes")).toBeInViewport();
  const popup = page.waitForEvent("popup");
  await page
    .getByRole("link", { name: "Open field examples in a new tab" })
    .click();
  const destination = await popup;
  await expect(destination).toHaveURL(/id=controls-formfields--normal/);
  await expect(
    destination.getByRole("textbox", { name: "Name", exact: true }),
  ).toBeVisible();
  await destination.close();
  await page.goBack();
  await expect(page).not.toHaveURL(/#fixture-notes$/);
});

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 320, height: 640 },
  { width: 844, height: 390 },
]) {
  test(`composition reflows at ${viewport.width}x${viewport.height} and enlarged text`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize(viewport);
    await fixture(page, "dark", "composition");
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "200%";
    });
    await page
      .getByRole("textbox", { name: "Name", exact: true })
      .fill("A long name to exercise an enlarged field");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.getByRole("button", { name: "Menu", exact: true }).click();
    const dialog = page.getByRole("dialog");
    await expect(
      dialog.getByRole("button", { name: "Close", exact: true }),
    ).toBeInViewport();
    expect(
      await dialog.evaluate((node) => node.scrollWidth <= node.clientWidth),
    ).toBe(true);
    const content = page.locator("dialog > div");
    expect(await content.evaluate((node) => node.clientHeight)).toBeGreaterThan(
      40,
    );
    await dialog
      .getByRole("button", { name: "Run local preview" })
      .scrollIntoViewIfNeeded();
    await expect(
      dialog.getByRole("button", { name: "Run local preview" }),
    ).toBeInViewport();
    expect(
      (await dialog
        .getByRole("button", { name: "Run local preview" })
        .boundingBox())!.height,
    ).toBeLessThanOrEqual(await content.evaluate((node) => node.clientHeight));
    await accessible(page);
    await page.screenshot({
      path: testInfo.outputPath(`reflow-${viewport.width}.png`),
    });
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("button", { name: "Menu", exact: true }),
    ).toBeFocused();
  });
}

test("forced colors preserves names, invalid feedback and focus separately", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ forcedColors: "active" });
  await fixture(page, "default", "composition");
  await page.getByLabel("Show an example field error").check();
  const field = page.getByRole("textbox", { name: "Name", exact: true });
  await field.focus();
  await expect(field).toHaveCSS("outline-style", "solid");
  await expect(field).toHaveAccessibleDescription(/Error:/);
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Close", exact: true }),
  ).toBeFocused();
  await accessible(page);
  await page.screenshot({ path: testInfo.outputPath("forced-colors.png") });
});

test("reduced motion keeps pending understandable without animation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await fixture(page, "default", "composition");
  await page.getByRole("button", { name: "Review example details" }).click();
  await page.getByRole("button", { name: "Run local preview" }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Working…" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Run local preview" }),
  ).toHaveAccessibleDescription("Working…");
  await accessible(page);
});

test("live toolbar themes agree with ThemeService and system preference", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto(
    "/?path=/story/controls-essentialset--composition&globals=theme:light",
  );
  const frame = page.frameLocator("#storybook-preview-iframe");
  for (const theme of [
    "dark",
    "muted",
    "dark-high-contrast",
    "default",
  ] as const) {
    await page.getByRole("button", { name: /^Theme / }).click();
    await page
      .getByRole("option", { name: globals[theme], exact: true })
      .click();
    await expect(frame.getByTestId("resolved-theme")).toHaveText(
      `Resolved theme: ${theme}`,
    );
    await expect
      .poll(
        async () =>
          (await frame.locator("html").getAttribute("data-theme")) || "default",
      )
      .toBe(theme);
    await expect
      .poll(
        async () =>
          (await frame.locator("body").getAttribute("data-theme")) || "default",
      )
      .toBe(theme);
  }
  await page.getByRole("button", { name: /^Theme / }).click();
  await page.getByRole("option", { name: "default", exact: true }).click();
  await expect(frame.getByTestId("resolved-theme")).toHaveText(
    "Resolved theme: dark",
  );
  await page.emulateMedia({ colorScheme: "light" });
  await expect(frame.getByTestId("resolved-theme")).toHaveText(
    "Resolved theme: default",
  );
  await expect(frame.locator("body")).toHaveCSS(
    "background-color",
    "rgb(230, 230, 230)",
  );
});

test("story switching disposes an open modal and resets local fixture state", async ({
  page,
}) => {
  await page.goto(
    "/?path=/story/controls-essentialset--composition&globals=theme:dark",
  );
  const frame = page.frameLocator("#storybook-preview-iframe");
  await frame
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Changed story draft");
  await frame.getByRole("button", { name: "Menu", exact: true }).click();
  await expect(frame.getByRole("dialog")).toBeVisible();
  await page.getByRole("link", { name: "Full Document", exact: true }).click();
  await expect(
    frame.getByRole("heading", { name: "Essential components together" }),
  ).toBeVisible();
  await expect(frame.getByRole("dialog")).not.toBeVisible();
  await expect(
    frame.getByRole("textbox", { name: "Name", exact: true }),
  ).toHaveValue("Alex");
  await expect(frame.getByTestId("resolved-theme")).toHaveText(
    "Resolved theme: dark",
  );
  expect(
    await frame.locator("body").evaluate((node) => node.style.position),
  ).toBe("");
  await page.getByRole("link", { name: "Composition", exact: true }).click();
  await expect(
    frame.getByRole("textbox", { name: "Name", exact: true }),
  ).toHaveValue("Alex");
  await expect(frame.getByTestId("resolved-theme")).toHaveText(
    "Resolved theme: dark",
  );
});
