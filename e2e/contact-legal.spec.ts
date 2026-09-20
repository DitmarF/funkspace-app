import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { selectTheme, themes } from "./helpers/foundation";

const email = "diamondfunk13@gmail.com";

for (const javaScriptEnabled of [true, false]) {
  test.describe(`Contact/legal, JavaScript ${javaScriptEnabled ? "on" : "off"}`, () => {
    test.use({ javaScriptEnabled });

    for (const route of ["/about", "/impressum", "/privacy"]) {
      test(`${route} loads directly, refreshes and returns to the real email fallback`, async ({
        page,
      }) => {
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        page.on("console", (message) => {
          if (message.type() === "error") errors.push(message.text());
        });
        const response = await page.goto(route);
        expect(response?.status()).toBe(200);
        if (route !== "/about") {
          expect(await response!.text()).toContain(email);
          await expect(
            page.getByRole("article").getByText(/Draft —/),
          ).toBeVisible();
          await expect(page.getByRole("heading", { level: 1 })).toHaveText(
            route === "/privacy" ? "Privacy" : "Impressum",
          );
          await expect(
            page.getByRole("heading", { level: 2 }).first(),
          ).toBeVisible();
        }
        await expect(page.locator("#contact")).toHaveCount(0);
        await page.reload();
        const contact = page
          .getByRole("navigation", { name: "Footer" })
          .getByRole("link", { name: "Contact", exact: true });
        await expect(contact).toHaveAttribute("href", "/#contact");
        await contact.focus();
        await page.keyboard.press("Enter");
        await expect(page).toHaveURL("/#contact");
        const section = page.getByRole("region", {
          name: "Contact",
          exact: true,
        });
        await expect(section).toBeInViewport();
        await expect(section.getByRole("heading", { level: 2 })).toHaveText(
          "Contact",
        );
        const mail = section.getByRole("link", { name: email, exact: true });
        await expect(mail).toHaveAttribute("href", `mailto:${email}`);
        await mail.focus();
        await expect(mail).toBeFocused();
        // Check pointer actionability without launching a mail application or sending.
        await mail.click({ trial: true });
        await expect(page.locator("form, input, textarea")).toHaveCount(0);
        await expect(
          page.getByRole("button", { name: /send|copy/i }),
        ).toHaveCount(0);
        await page.goBack();
        await expect(page).toHaveURL(route);
        for (const [label, href] of [
          ["Impressum", "/impressum"],
          ["Privacy", "/privacy"],
        ]) {
          await page
            .getByRole("navigation", { name: "Footer" })
            .getByRole("link", { name: label, exact: true })
            .click();
          await expect(page).toHaveURL(href);
          await expect(page.getByRole("heading", { level: 1 })).toHaveText(
            label,
          );
        }
        expect(errors).toEqual([]);
      });
    }

    test("long address and legal content reflow without clipping or nested scrolling", async ({
      page,
    }, testInfo) => {
      for (const viewport of [
        { width: 320, height: 360 },
        { width: 844, height: 390 },
        { width: 1440, height: 900 },
      ]) {
        await page.setViewportSize(viewport);
        for (const route of ["/", "/impressum", "/privacy"]) {
          await page.goto(route);
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
            route === "/"
              ? page.locator("#contact")
              : page.getByRole("article");
          expect(
            await content.evaluate((element) => {
              for (
                let node: Element | null = element;
                node;
                node = node.parentElement
              ) {
                const css = getComputedStyle(node);
                if (
                  ["hidden", "clip", "auto", "scroll"].includes(
                    css.overflowY,
                  ) &&
                  node.scrollHeight > node.clientHeight + 1
                )
                  return false;
              }
              return true;
            }),
          ).toBe(true);
          const mail = content.getByRole("link", { name: email, exact: true });
          await expect(mail).toHaveAttribute("href", `mailto:${email}`);
          await mail.scrollIntoViewIfNeeded();
          await mail.focus();
          await expect(mail).toBeFocused();
          await mail.click({ trial: true });
          await page.screenshot({
            path: testInfo.outputPath(
              `${route === "/" ? "contact" : route.slice(1)}-${viewport.width}-200percent.png`,
            ),
          });
          const privacy = page
            .getByRole("navigation", { name: "Footer" })
            .getByRole("link", { name: "Privacy", exact: true });
          await privacy.click();
          await expect(page).toHaveURL("/privacy");
        }
      }
    });
  });
}

test("legal drafts retain accessible headings and contrast in supported themes", async ({
  page,
}) => {
  for (const route of ["/impressum", "/privacy"]) {
    await page.goto(route);
    for (const theme of themes) {
      await selectTheme(page, theme);
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    }
  }
});
