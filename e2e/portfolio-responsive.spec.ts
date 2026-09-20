import { expect, test, type Locator, type Page } from "@playwright/test";
import { themes } from "./helpers/foundation";

test.describe.configure({ mode: "parallel" });

const viewports = [
  { width: 320, height: 568 },
  { width: 390, height: 844 },
  { width: 844, height: 390 },
  { width: 768, height: 1024 },
  { width: 1280, height: 720 },
  { width: 1440, height: 900 },
];
const routes = ["/", "/about", "/impressum", "/privacy"];

test("document menu clearance is conditional on the portfolio shell", async ({
  page,
}) => {
  await page.setViewportSize(viewports[0]);
  await page.goto("/");
  expect(
    await page
      .locator("html")
      .evaluate((node) =>
        parseFloat(getComputedStyle(node).scrollPaddingBottom),
      ),
  ).toBeGreaterThan(0);
  // Remove only the shell class in this fixture, without creating a play route.
  await page
    .locator("main")
    .evaluate((main) => main.parentElement!.removeAttribute("class"));
  await expect(page.locator("html")).toHaveCSS("scroll-padding-bottom", "auto");
});

async function expectDocumentFlow(page: Page) {
  expect(
    await page.evaluate(() => {
      const failures: string[] = [];
      if (document.documentElement.scrollWidth > innerWidth + 1)
        failures.push("horizontal document overflow");
      for (const node of document.querySelectorAll(
        "html, body, header, main, footer, main article, main section",
      )) {
        const css = getComputedStyle(node);
        if (css.scrollSnapType !== "none")
          failures.push(`${node.tagName}: snap`);
        if (
          ["hidden", "clip", "scroll", "auto"].includes(css.overflowY) &&
          node.scrollHeight > node.clientHeight + 1 &&
          node !== document.documentElement
        )
          failures.push(`${node.tagName}: nested or clipped content`);
      }
      return failures;
    }),
  ).toEqual([]);
  for (const role of ["banner", "main", "contentinfo"] as const)
    await expect(page.getByRole(role)).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
}

async function expectClearFocus(link: Locator) {
  await expect(link).toBeFocused();
  expect(
    await link.evaluate((node) => {
      const box = node.getBoundingClientRect();
      const css = getComputedStyle(node);
      const point = document.elementFromPoint(
        box.x + box.width / 2,
        box.y + box.height / 2,
      );
      const trigger = document.querySelector(
        'button[aria-label="Menu: navigation and settings"]',
      );
      const triggerBox = trigger?.getBoundingClientRect();
      const overlapsTrigger =
        trigger !== node &&
        triggerBox &&
        box.left < triggerBox.right &&
        box.right > triggerBox.left &&
        box.top < triggerBox.bottom &&
        box.bottom > triggerBox.top;
      return (
        box.left >= 0 &&
        box.right <= innerWidth + 1 &&
        box.top >= 0 &&
        box.bottom <= innerHeight + 1 &&
        css.outlineStyle !== "none" &&
        parseFloat(css.outlineWidth) > 0 &&
        !overlapsTrigger &&
        (node === point || node.contains(point))
      );
    }),
  ).toBe(true);
}

for (const viewport of viewports) {
  for (const textScale of [100, 200]) {
    test(`${viewport.width}×${viewport.height}, ${textScale}% text: routes, themes, scroll and keyboard`, async ({
      page,
    }) => {
      test.setTimeout(90_000);
      await page.setViewportSize(viewport);
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      await page.goto("/");
      for (const theme of themes) {
        await page.evaluate(
          (value) => localStorage.setItem("theme", value),
          theme,
        );
        for (const route of routes) {
          await page.goto(route);
          const menu = page.getByRole("button", {
            name: "Menu: navigation and settings",
            exact: true,
          });
          await expect(menu).toBeVisible();
          if (theme === "default")
            await expect(page.locator("html")).not.toHaveAttribute(
              "data-theme",
            );
          else
            await expect(page.locator("html")).toHaveAttribute(
              "data-theme",
              theme,
            );
          // Text-only enlargement: retain the CSS viewport and double rem text/spacing.
          await page.evaluate(
            (scale) =>
              document.documentElement.style.setProperty(
                "font-size",
                `${scale}%`,
              ),
            textScale,
          );
          await page.evaluate(() => document.fonts.ready);
          await expectDocumentFlow(page);

          await page.keyboard.press("Tab");
          const skip = page.getByRole("link", { name: "Skip to main content" });
          await expectClearFocus(skip);
          await page.keyboard.press("Enter");
          await expect(page.getByRole("main")).toBeFocused();
          // Walk the real tab sequence, including email/footer links; never activate mailto.
          const focusableCount = await page
            .locator("main a, footer a, footer button")
            .count();
          for (let index = 0; index < focusableCount; index++) {
            await page.keyboard.press("Tab");
            const focused = page.locator(":focus");
            await expectClearFocus(focused);
          }
          await page.keyboard.press("End");
          const footer = page.getByRole("navigation", { name: "Footer" });
          await expect(footer).toBeInViewport();
          for (const name of ["Contact", "Impressum", "Privacy"])
            await footer
              .getByRole("link", { name, exact: true })
              .click({ trial: true });

          await page.keyboard.press("Home");
          await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
          await page.mouse.move(viewport.width / 2, viewport.height / 2);
          const max = await page.evaluate(
            () => document.documentElement.scrollHeight - innerHeight,
          );
          await page.mouse.wheel(0, 180);
          if (max > 0)
            await expect
              .poll(() => page.evaluate(() => scrollY))
              .toBeGreaterThan(0);
          const before = await page.evaluate(() => scrollY);
          await page.keyboard.press("PageDown");
          if (before < max)
            await expect
              .poll(() => page.evaluate(() => scrollY))
              .toBeGreaterThan(before);
          if (route === "/") {
            expect(
              await page
                .locator("main section > svg")
                .evaluateAll(
                  (marks) =>
                    marks.length === 12 &&
                    marks.every(
                      (mark) =>
                        mark.getAttribute("aria-hidden") === "true" &&
                        mark.getAttribute("focusable") === "false" &&
                        getComputedStyle(mark).pointerEvents === "none",
                    ),
                ),
            ).toBe(true);
            if (viewport.width >= 768) {
              await page.keyboard.press("End");
              await expect(menu).not.toBeInViewport();
            }
          }
        }
      }
      expect(errors).toEqual([]);
    });
  }
}

test.describe("fresh no-JavaScript reading and long-content fixtures", () => {
  test.use({ javaScriptEnabled: false });
  for (const viewport of viewports) {
    test(`${viewport.width}×${viewport.height}: enlarged copy and navigation remain in document flow`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      for (const route of routes) {
        await page.goto(route);
        await page.evaluate(() =>
          document.documentElement.style.setProperty("font-size", "200%"),
        );
        await expect(
          page.getByRole("navigation", { name: "Primary" }),
        ).toBeVisible();
        await expect(page.getByRole("button", { name: /Menu/ })).toHaveCount(0);
        // Browser-only stress fixtures; no invented public copy or extra production UI.
        await page.evaluate(() => {
          document.querySelector("h1")!.textContent =
            "LongUnbrokenHeading".repeat(5);
          const paragraph = document.querySelector("main p")!;
          paragraph.textContent =
            `https://example.invalid/${"long-path".repeat(30)} ` +
            "Long legal text. ".repeat(150);
          const link =
            document.querySelector<HTMLAnchorElement>("footer nav a")!;
          link.querySelector("span")!.textContent =
            "LongNavigationLabel".repeat(8);
          const mail =
            document.querySelector<HTMLAnchorElement>('a[href^="mailto:"]');
          if (mail)
            mail.querySelector("span")!.textContent =
              `${"long-address".repeat(12)}@example.invalid`;
        });
        await expectDocumentFlow(page);
        const privacy = page
          .getByRole("navigation", { name: "Footer" })
          .getByRole("link", { name: "Privacy", exact: true });
        await privacy.click();
        await expect(page).toHaveURL("/privacy");
        await page
          .getByRole("navigation", { name: "Footer" })
          .getByRole("link", { name: "Contact", exact: true })
          .click();
        await expect(page).toHaveURL("/#contact");
        await expect(
          page.getByRole("link", {
            name: "diamondfunk13@gmail.com",
            exact: true,
          }),
        ).toBeInViewport();
      }
    });
  }
});

test("safe-area spacing fixture keeps shell and mobile trigger inside insets", async ({
  page,
}) => {
  for (const viewport of [viewports[0], viewports[2]]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const menu = page.getByRole("button", {
      name: "Menu: navigation and settings",
      exact: true,
    });
    await expect(menu).toBeVisible();
    // Simulated nonzero insets, not evidence from physical notched hardware.
    await page.locator("main").evaluate((main) => {
      const shell = main.parentElement!;
      for (const edge of ["left", "right", "top", "bottom"])
        shell.style.setProperty(`--shell-safe-${edge}`, "32px");
    });
    const section = await page.locator("#start").boundingBox();
    expect(section!.x).toBeGreaterThanOrEqual(32);
    expect(section!.x + section!.width).toBeLessThanOrEqual(
      viewport.width - 32,
    );
    const box = await menu.boundingBox();
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width - 32);
    if (viewport.width < 768)
      expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height - 32);
    else expect(box!.y).toBeGreaterThanOrEqual(32);
    await expectDocumentFlow(page);
  }
});

test("emulated touch scroll moves the document and reaches the footer", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: viewports[0],
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  try {
    await page.goto("http://localhost:3000/");
    const session = await context.newCDPSession(page);
    await session.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: 160, y: 450 }],
    });
    for (const y of [390, 330, 270, 210, 150])
      await session.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: 160, y }],
      });
    await session.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
    const privacy = page
      .getByRole("navigation", { name: "Footer" })
      .getByRole("link", { name: "Privacy" });
    await privacy.tap();
    await expect(page).toHaveURL("http://localhost:3000/privacy");
    await expectDocumentFlow(page);
  } finally {
    await context.close();
  }
});
