import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { aboutContent } from "../frontend/data/aboutContent";
import {
  openSettings,
  openFallbackNavigation,
  selectTheme,
  themes,
} from "./helpers/foundation";

test("full-width preview typography and reading spacing respond to the viewport", async ({
  page,
}, info) => {
  for (const width of [375, 767, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#about");
    const preview = page.locator("#about");
    const copy = preview.locator("p").first();
    await expect(copy).toHaveCSS("font-size", width < 768 ? "20px" : "24px");
    await expect(copy).toHaveCSS("line-height", "32px");
    await expect(copy).toHaveCSS("font-weight", width < 768 ? "400" : "500");
    const geometry = await preview.evaluate((section) => {
      const block = section.querySelector("p")!.parentElement!;
      const outer = section.getBoundingClientRect();
      const inner = block.getBoundingClientRect();
      const heading = section.querySelector("h2")!.getBoundingClientRect();
      return {
        center: inner.x + inner.width / 2,
        outerCenter: outer.x + outer.width / 2,
        copyLeft: inner.x,
        copyRight: inner.right,
        expectedRight:
          outer.right - parseFloat(getComputedStyle(section).paddingRight),
        copyGap: getComputedStyle(block).rowGap,
        headingGap: inner.top - heading.bottom,
        headingLeft: heading.x,
        expectedLeft:
          outer.x + parseFloat(getComputedStyle(section).paddingLeft),
        gap: getComputedStyle(section.parentElement!).rowGap,
      };
    });
    expect(geometry.center).toBeCloseTo(geometry.outerCenter, 0);
    expect(geometry.headingLeft).toBeCloseTo(geometry.expectedLeft, 0);
    expect(geometry.copyLeft).toBeCloseTo(geometry.headingLeft, 0);
    expect(geometry.copyRight).toBeCloseTo(geometry.expectedRight, 0);
    expect(geometry.copyGap).toBe("48px");
    expect(geometry.headingGap).toBeCloseTo(64, 0);
    expect(geometry.gap).toBe(width < 768 ? "64px" : "96px");
    const more = preview.getByRole("link", { name: "More about FunkSpace" });
    await expect(more).toHaveText("more");
    await expect(more).toHaveCSS("border-width", "2px");
    await expect(more).toHaveCSS("font-weight", "600");
    const moreBounds = await more.boundingBox();
    const copyBounds = await copy.boundingBox();
    expect(moreBounds!.x).toBeCloseTo(copyBounds!.x, 0);
    await expect(page.locator("#about-heading")).toHaveCSS(
      "font-size",
      width < 768 ? "32px" : "40px",
    );
    await expect(page.locator("#about-heading")).toHaveCSS(
      "font-weight",
      width < 768 ? "500" : "700",
    );
    await expect(page.locator("#contact")).toHaveCount(0);
    const positions = await more.evaluate((link) => ({
      icon: link.querySelector("svg")!.getBoundingClientRect().x,
      label: link.querySelector("span")!.getBoundingClientRect().right,
    }));
    expect(positions.icon).toBeGreaterThan(positions.label);
    if (width === 375 || width === 1280) {
      await preview.screenshot({
        path: info.outputPath(`about-preview-${width}.png`),
      });
    }
    await page.goto("/about");
    await expect(page.locator("article")).toHaveCSS(
      "margin-top",
      width < 768 ? "32px" : "64px",
    );
    await expect(page.locator("article > p").first()).toHaveCSS(
      "font-size",
      width < 768 ? "17.6px" : "20px",
    );
  }
});

for (const javaScriptEnabled of [true, false]) {
  test.describe(`About, JavaScript ${javaScriptEnabled ? "on" : "off"}`, () => {
    test.use({ javaScriptEnabled });

    test("preview, native Back, direct load, refresh and cross-page Home", async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      const home = await page.goto("/");
      const homeHtml = await home!.text();
      for (const paragraph of aboutContent.preview) {
        expect(homeHtml).toContain(paragraph);
      }
      const preview = page.getByRole("region", { name: "About", exact: true });
      await expect(preview.getByRole("heading", { level: 2 })).toHaveText(
        "About",
      );
      const more = preview.getByRole("link", { name: "More about FunkSpace" });
      await expect(more).toHaveAttribute("href", "/about");
      await more.focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL("/about");
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        "About FunkSpace",
      );
      await page.goBack();
      await expect(page).toHaveURL("/");
      await expect(more).toBeInViewport();

      const response = await page.goto("/about");
      expect(response?.status()).toBe(200);
      const html = await response!.text();
      for (const paragraph of [
        ...aboutContent.paragraphs,
        ...aboutContent.sections.flatMap((section) => section.paragraphs),
      ]) {
        expect(html).toContain(paragraph);
        await expect(page.getByText(paragraph)).toBeVisible();
      }
      await expect(page.getByText(/Draft content|Lorem ipsum/)).toHaveCount(0);
      await expect(page.locator('article [lang="la"]')).toHaveCount(0);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        "content",
        aboutContent.description,
      );
      await expect(page.locator("article h2")).toHaveText(
        aboutContent.sections.map((section) => section.heading),
      );
      await expect(page.locator("article blockquote")).toHaveText(
        "“Form ever follows function.”",
      );
      await page.reload();
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        "About FunkSpace",
      );
      if (javaScriptEnabled) await openSettings(page);
      else await openFallbackNavigation(page);
      const homeLink = page
        .getByRole("navigation", { name: "Primary" })
        .getByRole("link", { name: "Home", exact: true });
      await expect(homeLink).toHaveAttribute("href", "/");
      await homeLink.click();
      await expect(page).toHaveURL("/");
      await expect(page.locator("#start")).toBeInViewport();
      await expect(page.locator("#about")).toBeVisible();
      await page.goBack();
      await expect(page).toHaveURL("/about");
      await page.getByRole("link", { name: "FunkSpace", exact: true }).click();
      await expect(page).toHaveURL("/");
      expect(errors).toEqual([]);
    });

    test("narrow and short screens retain all content at enlarged text size", async ({
      page,
    }) => {
      for (const viewport of [
        { width: 320, height: 360 },
        { width: 844, height: 390 },
        { width: 1440, height: 900 },
      ]) {
        await page.setViewportSize(viewport);
        for (const route of ["/", "/about"]) {
          await page.goto(route);
          // Browser automation changes text sizing; application JS stays disabled
          // in the no-JavaScript context. No app script is injected or enabled.
          await page.evaluate(() =>
            document.documentElement.style.setProperty(
              "font-size",
              "200%",
              "important",
            ),
          );
          expect(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
          ).toBe(true);
          const content =
            route === "/" ? page.locator("#about") : page.getByRole("article");
          await expect(content).toBeVisible();
          expect(
            await content.evaluate((element) => {
              for (
                let node: Element | null = element;
                node;
                node = node.parentElement
              ) {
                const style = getComputedStyle(node);
                if (
                  ["hidden", "clip", "scroll", "auto"].includes(
                    style.overflowY,
                  ) &&
                  node.scrollHeight > node.clientHeight + 1
                )
                  return false;
              }
              return true;
            }),
          ).toBe(true);
          const last =
            route === "/"
              ? page.getByRole("link", { name: "More about FunkSpace" })
              : page.getByText(aboutContent.sections[4].paragraphs[1]);
          await last.scrollIntoViewIfNeeded();
          await expect(last).toBeInViewport();
          if (route === "/") {
            await last.click();
            await expect(page).toHaveURL("/about");
          }
          const privacy = page
            .getByRole("contentinfo")
            .getByRole("link", { name: "Privacy" });
          await privacy.scrollIntoViewIfNeeded();
          await expect(privacy).toBeInViewport();
        }
      }
    });
  });
}

test("About preview and page remain accessible in all supported themes", async ({
  page,
}) => {
  for (const route of ["/", "/about"]) {
    await page.goto(route);
    for (const theme of themes) {
      await selectTheme(page, theme);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(results.violations).toEqual([]);
    }
  }
});
