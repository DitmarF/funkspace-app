import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const width of [320, 768, 1280]) {
  for (const theme of ["light", "dark", "muted", "highContrast"]) {
    test(`footer: ${theme} ${width}px`, async ({ page }, info) => {
      await page.setViewportSize({ width, height: 720 });
      await page.goto(
        `/iframe.html?id=layouts-portfoliofooternavigation--in-shell&viewMode=story&globals=theme:${theme}`,
      );
      const footer = page.getByRole("navigation", {
        name: "Footer",
        exact: true,
      });
      await expect(footer.getByRole("link")).toHaveCount(3);
      const legal = footer.getByRole("link", {
        name: "Legal notice",
        exact: true,
      });
      const privacy = footer.getByRole("link", {
        name: "Privacy policy",
        exact: true,
      });
      const github = footer.getByRole("link", {
        name: "FunkSpace project on GitHub",
      });
      await expect(legal).toHaveAttribute("href", "/impressum");
      await expect(privacy).toHaveAttribute("href", "/privacy");
      await expect(github).toHaveAttribute(
        "href",
        "https://github.com/DitmarF/funkspace-app",
      );
      await expect(github).toHaveText("");
      await expect(github.locator("svg")).toHaveAttribute(
        "viewBox",
        "0 0 36 34",
      );
      await expect(github.locator("svg")).toHaveCSS("width", "36px");
      await expect(github.locator("svg")).toHaveCSS("height", "36px");
      await expect(page.getByRole("contentinfo")).toHaveCSS(
        "padding-bottom",
        width < 768 ? "48px" : "32px",
      );
      await expect(legal).toHaveCSS("border-width", "0px");
      const workSans = await legal.evaluate((node) =>
        getComputedStyle(node).getPropertyValue("--font-work-sans").trim(),
      );
      expect(workSans).not.toBe("");
      await expect
        .poll(() =>
          legal.evaluate((node) =>
            getComputedStyle(node).fontFamily.replace(/["']/g, ""),
          ),
        )
        .toBe(workSans.replace(/["']/g, ""));
      const links = [legal, privacy, github];
      const boxes = [];
      for (const link of links) {
        await link.focus();
        await expect(link).toBeFocused();
        await expect(link).toHaveCSS("outline-style", "solid");
        await link.click({ trial: true });
        const box = (await link.boundingBox())!;
        expect(box.width).toBeGreaterThanOrEqual(48);
        expect(box.height).toBeGreaterThanOrEqual(48);
        boxes.push(box);
      }
      // Each wrapped line stays centered, with clear spacing between targets.
      const rows = new Map<number, typeof boxes>();
      for (const box of boxes) {
        const center = Math.round(box.y + box.height / 2);
        rows.set(center, [...(rows.get(center) ?? []), box]);
      }
      for (const row of rows.values()) {
        const left = row[0].x;
        const right = row.at(-1)!.x + row.at(-1)!.width;
        expect(Math.abs((left + right) / 2 - width / 2)).toBeLessThan(1);
        for (let i = 1; i < row.length; i++)
          expect(
            row[i].x - row[i - 1].x - row[i - 1].width,
          ).toBeGreaterThanOrEqual(width < 768 ? 32 : 48);
      }
      await legal.focus();
      await page.keyboard.press("Tab");
      await expect(privacy).toBeFocused();
      await page.keyboard.press("Tab");
      await expect(github).toBeFocused();
      expect(
        (
          await new AxeBuilder({ page })
            .include('nav[aria-label="Footer"]')
            .analyze()
        ).violations,
      ).toEqual([]);
      await page.screenshot({ path: info.outputPath("footer.png") });
      await page.addStyleTag({ content: "html { font-size: 200%; }" });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      for (const link of links) await link.click({ trial: true });
    });
  }
}
