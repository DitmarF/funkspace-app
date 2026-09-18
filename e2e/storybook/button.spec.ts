import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { renderedPair, settleStyles, themes } from "../helpers/foundation";

const story = (id: string, theme = "default") =>
  `/iframe.html?id=${id}&viewMode=story&globals=theme:${theme === "default" ? "light" : theme === "dark-high-contrast" ? "highContrast" : theme}`;

// Independently check each actually painted focus band against the pixels it
// replaces. At least one band must remain distinguishable on Hero's artwork.
function bandContrast(foreground: string, background: number[]) {
  const luminance = (rgb: number[]) =>
    rgb
      .map((value) => value / 255)
      .map((value) =>
        value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
      )
      .reduce(
        (sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index],
        0,
      );
  const a = luminance(
    (foreground.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number),
  );
  const b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

for (const theme of themes) {
  test(`${theme}: focus stays visible on the existing Hero artwork surface`, async ({
    page,
  }, testInfo) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(story("sections-hero--default", theme));
    const button = page.locator("#storybook-root button");
    await expect(button).toBeVisible();
    await expect
      .poll(
        async () =>
          (await page.locator("body").getAttribute("data-theme")) || "default",
      )
      .toBe(theme);
    await page.keyboard.press("Tab");
    await button.focus();
    await settleStyles(page);
    const outline = await renderedPair(button, "outlineColor", true);
    const shadow = await button.evaluate(
      (node) => getComputedStyle(node).boxShadow,
    );
    const colors = shadow.match(/rgba?\([^)]+\)/g) ?? [];
    expect(colors).toHaveLength(2);
    expect(shadow).toContain("0px 0px 0px 2px");
    expect(shadow).toContain("0px 0px 0px 6px");
    const ratios = colors.map((color) =>
      bandContrast(color, outline.background),
    );
    expect(Math.max(...ratios)).toBeGreaterThanOrEqual(3);
    expect(outline.outlineStyle).toBe("solid");
    expect(outline.outlineWidth).toBe("2px");
    expect(outline.outlineOffset).toBe("2px");
    await testInfo.attach("hero-focus-bands", {
      body: JSON.stringify({ theme, outline, shadow, ratios }, null, 2),
      contentType: "application/json",
    });
    await page.screenshot({
      path: testInfo.outputPath(`hero-focus-${theme}.png`),
      fullPage: true,
    });
  });
}

test("native default, Enter/Space, explicit reset and submit", async ({
  page,
}) => {
  await page.goto(story("controls-button--native-form"));
  const action = page.getByRole("button", { name: "Action", exact: true });
  await action.focus();
  await expect(action).toHaveAttribute("type", "button");
  await page.keyboard.press("Enter");
  await expect(page.getByText("Actions: 1; submissions: 0")).toBeVisible();
  await page.keyboard.press("Space");
  await expect(page.getByText("Actions: 2; submissions: 0")).toBeVisible();
  await page.getByRole("textbox").fill("Changed");
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(page.getByRole("textbox")).toHaveValue("Initial value");
  const submit = page.getByRole("button", { name: "Submit example" });
  await submit.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText("Actions: 2; submissions: 1")).toBeVisible();
  await expect(submit).toBeFocused();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Space");
  await submit.click({ force: true });
  await submit.evaluate((node: HTMLButtonElement) => node.click());
  // Implicit form submission is also the example controller's responsibility.
  await page.getByRole("textbox").press("Enter");
  await expect(page.getByText("Actions: 2; submissions: 1")).toBeVisible();
});

for (const suffix of ["interaction", "leading-icon", "trailing-icon"]) {
  test(`pending ${suffix}: stable layout/name, focus and repeated activation`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(story(`controls-button--pending-${suffix}`));
    const button = page.getByRole("button", { name: "Send message" });
    await settleStyles(page);
    await button.focus();
    const before = await button.boundingBox();
    expect(before!.height).toBe(48);
    await expect(button.locator("svg")).toHaveCount(1);
    const labelBefore = await button
      .locator("span")
      .filter({ hasText: /^Send message$/ })
      .boundingBox();
    const groupBefore = await button.locator("..").boundingBox();
    const slot = button.locator(':scope > span[aria-hidden="true"]');
    const iconBefore = (await slot.boundingBox())!;
    if (suffix !== "leading-icon") {
      expect(iconBefore.x).toBeGreaterThanOrEqual(
        labelBefore!.x + labelBefore!.width,
      );
    }
    expect(
      Math.abs(
        iconBefore.y +
          iconBefore.height / 2 -
          (labelBefore!.y + labelBefore!.height / 2),
      ),
    ).toBeLessThan(1);
    await page.keyboard.press("Space");
    await expect(button).toHaveAttribute("aria-busy", "true");
    await expect(slot).toHaveText("…");
    await expect(button.locator("svg")).toHaveCount(0);
    expect(await slot.boundingBox()).toEqual(iconBefore);
    await expect(button).toBeFocused();
    expect(
      await button.evaluate((node: HTMLButtonElement) => node.disabled),
    ).toBe(false);
    await expect(button).toHaveAccessibleName("Send message");
    await expect(page.getByRole("status")).toHaveText("Working…");
    expect(await button.boundingBox()).toEqual(before);
    expect(
      await button
        .locator("span")
        .filter({ hasText: /^Send message$/ })
        .boundingBox(),
    ).toEqual(labelBefore);
    expect(await button.locator("..").boundingBox()).toEqual(groupBefore);
    // Playwright intentionally refuses normal clicks on aria-disabled controls;
    // force a real pointer click to verify the component's guard, then .click().
    await button.click({ force: true });
    await page.keyboard.press("Enter");
    await page.keyboard.press("Space");
    await button.evaluate((node: HTMLButtonElement) => node.click());
    await expect(page.getByText("Activations: 1")).toBeVisible();
    expect(await button.evaluate((node) => node.getAnimations().length)).toBe(
      0,
    );
    await page.getByRole("button", { name: "Finish example" }).click();
    await expect(button).not.toHaveAttribute("aria-busy", "true");
    await expect(button.locator("svg")).toHaveCount(1);
    await button.click();
    await expect(page.getByText("Activations: 2")).toBeVisible();
  });
}

for (const arrangement of ["leading-icon", "trailing-icon", "paired-icons"]) {
  test(`pending ${arrangement}: constrained enlarged labels retain layout and behavior`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const size of ["small", "medium", "large"]) {
      await page.goto(
        `${story(`controls-button--pending-${arrangement}`)}&args=size:${size}`,
      );
      const button = page.getByRole("button", { name: "Send message" });
      await settleStyles(page);
      // Constrain the real pending wrapper, without changing its layout rules.
      await button.locator("..").evaluate((node) => {
        node.style.width = "240px";
      });
      for (const rootSize of [16, 32]) {
        await page.evaluate((value) => {
          document.documentElement.style.fontSize = `${value}px`;
        }, rootSize);
        await button.focus();
        const layout = () =>
          button.evaluate((node) => {
            const rect = (element: Element) => {
              const { x, y, width, height, right, bottom } =
                element.getBoundingClientRect();
              // Returning from Finish may scroll a tall enlarged control into
              // view. Compare document geometry, not that viewport movement.
              return {
                x: x + window.scrollX,
                y: y + window.scrollY,
                width,
                height,
                right: right + window.scrollX,
                bottom: bottom + window.scrollY,
              };
            };
            const children = [...node.children].map(rect);
            const label = node.querySelector("span:not([aria-hidden])")!;
            const range = document.createRange();
            range.selectNodeContents(label);
            return {
              button: rect(node),
              group: rect(node.parentElement!),
              children,
              label: rect(label),
              text: [...range.getClientRects()].map((r) => ({
                x: r.x + window.scrollX,
                right: r.right + window.scrollX,
              })),
              fontSize: parseFloat(getComputedStyle(node).fontSize),
              documentWidth: document.documentElement.scrollWidth,
            };
          });
        const before = await layout();
        expect(before.fontSize).toBe(
          rootSize * (size === "large" ? 3 : size === "medium" ? 2.25 : 1.5),
        );
        expect(before.documentWidth).toBe(320);
        expect(before.label.width).toBeGreaterThanOrEqual(before.fontSize * 2);
        for (const [index, child] of before.children.entries()) {
          expect(child.x).toBeGreaterThanOrEqual(before.button.x);
          expect(child.right).toBeLessThanOrEqual(before.button.right);
          expect(child.y).toBeGreaterThanOrEqual(before.button.y);
          expect(child.bottom).toBeLessThanOrEqual(before.button.bottom);
          for (const other of before.children.slice(index + 1)) {
            expect(
              child.right <= other.x ||
                other.right <= child.x ||
                child.bottom <= other.y ||
                other.bottom <= child.y,
            ).toBe(true);
          }
        }
        for (const line of before.text) {
          expect(line.x).toBeGreaterThanOrEqual(before.label.x);
          expect(line.right).toBeLessThanOrEqual(before.label.right);
        }
        await page.keyboard.press("Space");
        await expect(button).toHaveAttribute("aria-busy", "true");
        await expect(button).toBeFocused();
        await expect(button).toHaveAccessibleName("Send message");
        await expect(
          button
            .locator(':scope > span[aria-hidden="true"]')
            .filter({ hasText: "…" }),
        ).toHaveCount(1);
        await expect(button.locator("svg")).toHaveCount(
          arrangement === "paired-icons" ? 1 : 0,
        );
        expect(await layout()).toEqual(before);
        const count = await page.getByText(/^Activations:/).textContent();
        await button.click({ force: true });
        await page.keyboard.press("Enter");
        await page.keyboard.press("Space");
        await expect(page.getByText(/^Activations:/)).toHaveText(count!);
        await testInfo.attach(`${size}-${rootSize}px-root`, {
          body: JSON.stringify(before, null, 2),
          contentType: "application/json",
        });
        if (size === "large" && rootSize === 32) {
          await page.screenshot({
            path: testInfo.outputPath(`pending-${arrangement}-enlarged.png`),
            fullPage: true,
          });
        }
        await page.getByRole("button", { name: "Finish example" }).click();
        await expect(button).not.toHaveAttribute("aria-busy", "true");
        await button.focus();
        expect(await layout()).toEqual(before);
      }
    }
  });
}

test("native links preserve Space, Enter, click and new-tab navigation", async ({
  page,
  context,
}) => {
  const source = story("controls-buttonlink--navigation");
  await page.goto(source);
  const link = page.getByRole("link", { name: "View primary button" });
  await link.focus();
  await page.keyboard.press("Space");
  await expect(page).toHaveURL(new RegExp("controls-buttonlink--navigation"));
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "Click me" })).toBeVisible();
  await expect(page).toHaveURL(/controls-button--primary/);
  await page.goBack();
  await link.click();
  await expect(page.getByRole("button", { name: "Click me" })).toBeVisible();
  await page.goto(story("controls-buttonlink--new-tab"));
  const newPage = context.waitForEvent("page");
  await page.getByRole("link", { name: "View primary button" }).click();
  const opened = await newPage;
  await expect(opened.getByRole("button", { name: "Click me" })).toBeVisible();
  await opened.close();
});

for (const theme of themes) {
  test(`${theme}: real Standard matrix on both surfaces`, async ({
    page,
  }, testInfo) => {
    await page.goto(story("controls-button--surface-matrix", theme));
    await expect(
      page.getByRole("button", { name: "Primary", exact: true }).first(),
    ).toBeVisible();
    await expect
      .poll(
        async () =>
          (await page.locator("body").getAttribute("data-theme")) || "default",
      )
      .toBe(theme);
    await settleStyles(page);
    const pairs = [];
    for (const section of await page.locator("#storybook-root section").all()) {
      const surface = await section.getAttribute("aria-label");
      for (const button of await section.getByRole("button").all()) {
        const name = await button.textContent();
        const base = await renderedPair(button);
        expect((await button.boundingBox())?.height).toBeGreaterThanOrEqual(48);
        pairs.push({ surface, name, state: "default", ...base });
        if ((await button.getAttribute("disabled")) !== null) {
          await expect(button).toHaveCSS("border-style", "solid");
          continue;
        }
        expect(base.ratio).toBeGreaterThanOrEqual(4.5);
        expect(parseFloat(base.fontSize)).toBeGreaterThanOrEqual(24);
        await button.hover({ force: true });
        const hover = await renderedPair(button);
        expect(hover.ratio).toBeGreaterThanOrEqual(3);
        pairs.push({ surface, name, state: "hover", ...hover });
        await page.mouse.down();
        expect((await renderedPair(button)).ratio).toBeGreaterThanOrEqual(4.5);
        await page.mouse.move(0, 0);
        await page.mouse.up();
        await page.keyboard.press("Tab");
        await button.focus();
        const ring = await renderedPair(button, "outlineColor", true);
        expect(ring.outlineStyle).toBe("solid");
        expect(ring.ratio).toBeGreaterThanOrEqual(3);
        pairs.push({ surface, name, state: "focus", ...ring });
      }
      const outlined = section.getByRole("button", { name: "Customize" });
      expect(
        (await renderedPair(outlined, "borderTopColor", true)).ratio,
      ).toBeGreaterThanOrEqual(3);
      expect(
        (await renderedPair(section.getByRole("status"))).ratio,
      ).toBeGreaterThanOrEqual(4.5);
    }
    const result = await new AxeBuilder({ page })
      .include("#storybook-root")
      .analyze();
    expect(
      result.violations,
      JSON.stringify(result.violations, null, 2),
    ).toEqual([]);
    await testInfo.attach("standard-pairings", {
      body: JSON.stringify(pairs, null, 2),
      contentType: "application/json",
    });
    await page.screenshot({
      path: testInfo.outputPath(`matrix-${theme}.png`),
      fullPage: true,
    });
  });
}

test("long labels grow without clipping at a narrow viewport and 200% text", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto(story("controls-button--long-label"));
  const button = page.getByRole("button");
  await expect(button).toBeVisible();
  await settleStyles(page);
  for (const size of [16, 32]) {
    await page.evaluate((size) => {
      document.documentElement.style.fontSize = `${size}px`;
    }, size);
    const bounds = await button.boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.height).toBeGreaterThanOrEqual(size * 3);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(320);
    expect(
      await button.evaluate((node) => node.scrollWidth <= node.clientWidth),
    ).toBe(true);
    expect(
      await button.evaluate((node) => node.scrollHeight <= node.clientHeight),
    ).toBe(true);
  }
});

test("forced colors preserves native disabled and visible keyboard focus", async ({
  page,
}) => {
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await page.goto(story("controls-button--surface-matrix"));
  const primary = page
    .getByRole("button", { name: "Primary", exact: true })
    .first();
  await page.keyboard.press("Tab");
  await primary.focus();
  await expect(primary).toBeFocused();
  await expect(primary).toHaveCSS("outline-style", "solid");
  await expect(primary).toHaveCSS("outline-width", "2px");
  const disabled = page.getByRole("button", { name: "Unavailable" }).first();
  await expect(disabled).toBeDisabled();
  await expect(disabled).toHaveCSS("border-style", "solid");
  await expect(page.getByRole("status").first()).toHaveText("Working…");
});

for (const id of [
  "modules-card--default",
  "templates-hometemplate--default",
  "sections-hero--default",
  "layouts-container--in-section-context",
]) {
  test(`${id}: existing callers retain readable regular controls`, async ({
    page,
  }, testInfo) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto(story(id));
    const buttons = page.locator("#storybook-root button");
    await expect(buttons.first()).toBeVisible();
    await settleStyles(page);
    for (const button of await buttons.all()) {
      await expect(button).toHaveAttribute("type", "button");
      await expect(button).toHaveCSS("font-size", "24px");
      await expect(button).toHaveCSS("font-weight", "700");
      const box = await button.boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(48);
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(375);
      expect(
        await button.evaluate((node) => node.scrollWidth <= node.clientWidth),
      ).toBe(true);
    }
    await page.screenshot({
      path: testInfo.outputPath(`${id}.png`),
      fullPage: true,
    });
  });
}
