import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { renderedPair, settleStyles, themes } from "../helpers/foundation";

async function fixture(page: Page, story = "short-content", theme = "light") {
  await page.goto(
    `/iframe.html?id=controls-dialog--${story}&viewMode=story&globals=theme:${theme}`,
  );
  await expect(
    page.getByRole("heading", { name: "Shared dialog examples" }),
  ).toBeVisible();
  await settleStyles(page);
}
async function open(page: Page, name = "Open dialog") {
  await page.getByRole("button", { name, exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator("dialog")).toHaveJSProperty("open", true);
  expect(
    await page.locator("dialog").evaluate((node) => node.matches(":modal")),
  ).toBe(true);
}

async function documentState(page: Page) {
  return page.evaluate(() => ({
    x: scrollX,
    y: scrollY,
    body: ["position", "top", "left", "width", "padding-right", "color"].map(
      (name) => [
        name,
        document.body.style.getPropertyValue(name),
        document.body.style.getPropertyPriority(name),
      ],
    ),
    root: [
      document.documentElement.style.getPropertyValue("overflow"),
      document.documentElement.style.getPropertyPriority("overflow"),
    ],
  }));
}

for (const name of ["Open dialog", "Menu"]) {
  test(`${name}: native keys, initial focus, tab order, Escape and return`, async ({
    page,
  }) => {
    await fixture(page);
    const trigger = page.getByRole("button", { name, exact: true });
    for (const key of ["Enter", "Space"]) {
      await trigger.focus();
      await page.keyboard.press(key);
      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();
      await expect(dialog.getByRole("heading")).toBeFocused();
      await page.keyboard.press("Tab");
      await expect(dialog.getByRole("button", { name: "Close" })).toBeFocused();
      await page.keyboard.press("Tab");
      await expect(
        dialog.getByRole("textbox", { name: "Example name" }),
      ).toBeFocused();
      await page.keyboard.press("Tab");
      await expect(
        dialog.getByRole("textbox", { name: "Example notes" }),
      ).toBeFocused();
      await page.keyboard.press("Tab");
      // Chromium may traverse browser chrome at the boundary. It must never
      // focus an outside page control; next Tab returns to the modal.
      expect(
        await page.evaluate(
          () =>
            document.activeElement === document.body ||
            !!document.activeElement?.closest("dialog"),
        ),
      ).toBe(true);
      if (await page.evaluate(() => document.activeElement === document.body))
        await page.keyboard.press("Tab");
      await expect(dialog.getByRole("button", { name: "Close" })).toBeFocused();
      await page.keyboard.press("Shift+Tab");
      if (await page.evaluate(() => document.activeElement === document.body))
        await page.keyboard.press("Shift+Tab");
      await expect(
        dialog.getByRole("textbox", { name: "Example notes" }),
      ).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(dialog).not.toBeVisible();
      await expect(trigger).toBeFocused();
    }
    await expect(page.getByTestId("fixture-events")).toHaveText(
      "Requests: cancel,cancel; background: 0",
    );
  });

  test(`${name}: ten cycles retain values and release scroll lock`, async ({
    page,
  }) => {
    await fixture(page);
    for (let index = 0; index < 10; index++) {
      await open(page, name);
      const input = page.getByRole("textbox", { name: "Example name" });
      if (index === 0) await input.fill("Retained value");
      await expect(input).toHaveValue("Retained value");
      await page.getByRole("button", { name: "Close", exact: true }).click();
      await expect(page.locator("dialog")).not.toBeVisible();
      await expect(
        page.getByRole("button", { name, exact: true }),
      ).toBeFocused();
      expect(await page.evaluate(() => document.body.style.position)).toBe("");
    }
    await expect(page.getByTestId("fixture-events")).toHaveText(
      `Requests: ${Array(10).fill("close-button").join(",")}; background: 0`,
    );
  });
}

test("controlled and external native closure, repeated effects and removed trigger", async ({
  page,
}) => {
  await fixture(page, "lifecycle");
  await page.getByLabel("Initially focus the field").check();
  await open(page);
  await expect(
    page.getByRole("textbox", { name: "Example name" }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Rapid reopen" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Controlled close" }).click();
  await expect(page.locator("dialog")).not.toBeVisible();
  await expect(page.getByTestId("fixture-events")).toHaveText(
    "Requests: none; background: 0",
  );
  await open(page);
  await page.getByRole("button", { name: "Native close", exact: true }).click();
  await expect(page.locator("dialog")).not.toBeVisible();
  await expect(page.getByTestId("fixture-events")).toHaveText(
    "Requests: native-close; background: 0",
  );
  await open(page);
  await page.getByRole("button", { name: "Remove triggers" }).click();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("heading", { name: "Shared dialog examples" }),
  ).toBeFocused();
});

test("one outstanding request with delayed consumer acknowledgment", async ({
  page,
}) => {
  await fixture(page, "lifecycle");
  await open(page);
  await page.getByLabel("Delay fixture acknowledgment").check();
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByTestId("fixture-events")).toHaveText(
    "Requests: close-button; background: 0",
  );
  await page.getByRole("button", { name: "Controlled close" }).click();
  await expect(page.locator("dialog")).not.toBeVisible();
});

test("Strict Mode initially open, unmount while open, and destination override", async ({
  page,
}) => {
  await fixture(page, "initially-open");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog").getByRole("heading")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("heading", { name: "Shared dialog examples" }),
  ).toBeFocused();
  await fixture(page, "lifecycle");
  for (let index = 0; index < 3; index++) {
    await open(page);
    await page.getByRole("button", { name: "Unmount dialog" }).click();
    await expect(page.locator("dialog")).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "Open dialog", exact: true }),
    ).toBeFocused();
    expect(await page.evaluate(() => document.body.style.position)).toBe("");
  }
  await open(page);
  const url = page.url();
  await page.getByRole("button", { name: "Focus destination" }).click();
  await expect(
    page.getByRole("heading", { name: "Example destination" }),
  ).toBeFocused();
  expect(page.url()).toBe(url);
});

test("full document: inactivity, backdrop/drag policy, internal scrolling and restored page", async ({
  page,
}) => {
  await fixture(page, "full-document");
  expect(
    await page.evaluate(
      () =>
        window.top === window &&
        document.documentElement.scrollHeight > innerHeight,
    ),
  ).toBe(true);
  const trigger = page.getByRole("button", {
    name: "Open dialog",
    exact: true,
  });
  await trigger.evaluate((node) =>
    node.scrollIntoView({ block: "center", behavior: "instant" }),
  );
  await page.evaluate(() => {
    document.body.style.setProperty("position", "relative", "important");
    document.body.style.setProperty("color", "rgb(1, 2, 3)");
  });
  const before = await documentState(page);
  expect(before.y).toBeGreaterThan(0);
  await open(page);
  await page.evaluate(() =>
    document.body.style.setProperty("--external-dialog-fixture", "preserved"),
  );
  await page.evaluate(() => {
    document
      .querySelector<HTMLButtonElement>("main > div button:last-child")
      ?.focus();
  });
  expect(
    await page.evaluate(() => !!document.activeElement?.closest("dialog")),
  ).toBe(true);
  const locked = await page.evaluate(() => scrollY);
  await page.mouse.click(2, 2);
  await page.mouse.wheel(0, 800);
  await page.keyboard.press("PageDown");
  expect(await page.evaluate(() => scrollY)).toBe(locked);
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByTestId("fixture-events")).toContainText(
    "background: 0",
  );
  const content = page.locator("dialog > div");
  await content.evaluate((node) => {
    node.scrollTop = 0;
  });
  await content.hover();
  await page.mouse.wheel(0, 700);
  await expect
    .poll(() => content.evaluate((node) => node.scrollTop))
    .toBeGreaterThan(0);
  const box = await page.getByRole("dialog").boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box!.x + 12, box!.y + 12);
  await page.mouse.down();
  await page.mouse.move(2, 2);
  await page.mouse.up();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Close", exact: true }).click();
  expect(await documentState(page)).toEqual(before);
  expect(
    await page.evaluate(() =>
      document.body.style.getPropertyValue("--external-dialog-fixture"),
    ),
  ).toBe("preserved");
  await expect(trigger).toBeFocused();
});

test("nonzero document scroll is restored on controlled/native close and open unmount", async ({
  page,
}) => {
  for (const action of ["Controlled close", "Native close", "Unmount dialog"]) {
    await fixture(page, "full-document");
    const trigger = page.getByRole("button", { name: "Menu", exact: true });
    await trigger.evaluate((node) =>
      node.scrollIntoView({ block: "center", behavior: "instant" }),
    );
    const before = await documentState(page);
    expect(before.y).toBeGreaterThan(0);
    await open(page, "Menu");
    await page.getByRole("button", { name: action, exact: true }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(trigger).toBeFocused();
    // Native close dispatches its cleanup event in a later browser task.
    await expect.poll(() => documentState(page)).toEqual(before);
  }
});

for (const theme of themes) {
  test(`${theme}: resolved typography, text/focus contrast and unfiltered accessibility`, async ({
    page,
  }, testInfo) => {
    await fixture(
      page,
      "short-content",
      theme === "default"
        ? "light"
        : theme === "dark-high-contrast"
          ? "highContrast"
          : theme,
    );
    await expect
      .poll(() => page.locator("html").getAttribute("data-theme"))
      .toBe(theme === "default" ? null : theme);
    await open(page);
    const dialog = page.getByRole("dialog");
    const title = dialog.getByRole("heading");
    const evidence = {
      title: await renderedPair(title),
      body: await renderedPair(dialog.locator("p").first()),
    };
    expect(evidence.title.ratio).toBeGreaterThanOrEqual(4.5);
    expect(evidence.body.ratio).toBeGreaterThanOrEqual(4.5);
    expect(evidence.title.fontWeight).toBe("600");
    const fonts = await page.evaluate(() => ({
      title: getComputedStyle(document.documentElement)
        .getPropertyValue("--font-work-sans")
        .trim()
        .replace(/["']/g, ""),
      body: getComputedStyle(document.documentElement)
        .getPropertyValue("--font-space-grotesk")
        .trim()
        .replace(/["']/g, ""),
    }));
    expect(evidence.title.fontFamily.replace(/["']/g, "")).toContain(
      fonts.title,
    );
    expect(evidence.body.fontFamily.replace(/["']/g, "")).toContain(fonts.body);
    await page.keyboard.press("Tab");
    const close = dialog.getByRole("button", { name: "Close" });
    await expect(close).toBeFocused();
    await expect(close).toHaveText("");
    await expect(close).toHaveAttribute("type", "button");
    const target = (await close.boundingBox())!;
    expect(target.width).toBe(52);
    expect(target.height).toBe(52);
    const icon = close.locator("svg").nth(1);
    await expect(icon).toHaveAttribute("viewBox", "0 0 26 26");
    await expect(icon).toHaveAttribute("aria-hidden", "true");
    await expect(icon).toHaveCSS("width", "24px");
    const closePaints = await close.evaluate((node) => ({
      background: getComputedStyle(node.querySelector("svg path")!).fill,
      foreground: getComputedStyle(node.querySelectorAll("svg")[1]).color,
      fills: [...node.querySelectorAll("svg:nth-of-type(2) path")].map(
        (path) => getComputedStyle(path).fill,
      ),
    }));
    expect(closePaints.fills).toEqual([
      closePaints.foreground,
      closePaints.foreground,
    ]);
    expect(closePaints.foreground).not.toBe(closePaints.background);
    const focus = await renderedPair(close, "outlineColor", true);
    expect(focus.ratio).toBeGreaterThanOrEqual(3);
    expect(
      (await new AxeBuilder({ page }).include("dialog").analyze()).violations,
    ).toEqual([]);
    await testInfo.attach("resolved-pairings", {
      body: JSON.stringify({ theme, ...evidence, focus, closePaints }, null, 2),
      contentType: "application/json",
    });
    await page.screenshot({ path: testInfo.outputPath(`${theme}.png`) });
  });
}

test("narrow enlarged text, forced colors and reduced motion remain usable", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.emulateMedia({ reducedMotion: "reduce", forcedColors: "active" });
  await fixture(page, "long-content");
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });
  await open(page);
  const dialog = page.getByRole("dialog");
  expect(
    await dialog.evaluate((node) => node.scrollWidth <= node.clientWidth),
  ).toBe(true);
  const close = dialog.getByRole("button", { name: "Close" });
  await expect(close).toBeInViewport();
  await page.screenshot({
    path: testInfo.outputPath("enlarged-forced-colors.png"),
  });
  await page
    .getByRole("textbox", { name: "Example notes" })
    .scrollIntoViewIfNeeded();
  await expect(
    page.getByRole("textbox", { name: "Example notes" }),
  ).toBeInViewport();
  await close.click();
  await expect(dialog).not.toBeVisible();
});

test("touch scrolling is contained in the modal on a mobile viewport", async ({
  browser,
}, testInfo) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  try {
    await page.goto(
      "http://127.0.0.1:6006/iframe.html?id=controls-dialog--full-document&viewMode=story&globals=theme:light",
    );
    await page.getByRole("button", { name: "Menu", exact: true }).tap();
    const session = await context.newCDPSession(page);
    const swipe = async (x: number, y: number) => {
      await session.send("Input.dispatchTouchEvent", {
        type: "touchStart",
        touchPoints: [{ x, y }],
      });
      for (let step = 1; step <= 5; step++)
        await session.send("Input.dispatchTouchEvent", {
          type: "touchMove",
          touchPoints: [{ x, y: y - step * 35 }],
        });
      await session.send("Input.dispatchTouchEvent", {
        type: "touchEnd",
        touchPoints: [],
      });
    };
    const locked = await page.evaluate(() => scrollY);
    await swipe(3, 650);
    expect(await page.evaluate(() => scrollY)).toBe(locked);
    await page.screenshot({
      path: testInfo.outputPath("mobile-long-content.png"),
    });
    const content = page.locator("dialog > div");
    const box = await content.boundingBox();
    expect(box).not.toBeNull();
    await swipe(box!.x + box!.width / 2, box!.y + box!.height * 0.8);
    await expect
      .poll(() => content.evaluate((node) => node.scrollTop))
      .toBeGreaterThan(0);
    expect(await page.evaluate(() => scrollY)).toBe(locked);
    await page.getByRole("button", { name: "Close", exact: true }).tap();
    await expect(
      page.getByRole("button", { name: "Menu", exact: true }),
    ).toBeFocused();
  } finally {
    await context.close();
  }
});

test("embedded preview keeps its background inactive without locking the Storybook host", async ({
  page,
}) => {
  await page.goto("/?path=/story/controls-dialog--short-content");
  const frame = page.frameLocator("#storybook-preview-iframe");
  await frame.getByRole("button", { name: "Open dialog", exact: true }).click();
  await expect(frame.getByRole("dialog")).toBeVisible();
  await frame
    .getByRole("button", { name: "Background action" })
    .evaluate((node) => node.focus());
  await expect(
    frame.getByRole("button", { name: "Background action" }),
  ).not.toBeFocused();
  // A host-owned sentinel verifies the document boundary independently of
  // Storybook toolbar naming/version. It is removed with this test page.
  await page.evaluate(() => {
    const button = document.createElement("button");
    button.textContent = "Host boundary sentinel";
    button.style.cssText = "position:fixed;top:0;right:0;z-index:999999";
    document.body.append(button);
  });
  await page.getByRole("button", { name: "Host boundary sentinel" }).click();
  await expect(
    page.getByRole("button", { name: "Host boundary sentinel" }),
  ).toBeFocused();
  await expect(frame.getByRole("dialog")).toBeVisible();
});
