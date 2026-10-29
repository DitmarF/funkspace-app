import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { selectTheme, themes } from "./helpers/foundation";

const email = "info@funkspace.de";

for (const javaScriptEnabled of [true, false]) {
  test.describe(`Contact/legal, JavaScript ${javaScriptEnabled ? "on" : "off"}`, () => {
    test.use({ javaScriptEnabled });

    for (const route of ["/about", "/impressum", "/privacy"]) {
      test(`${route} loads directly, refreshes and retains legal email access`, async ({
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
          const article = page.getByRole("article");
          await expect(article).toContainText("Ditmar Funk");
          await expect(
            article.getByText(/Draft —|Information still to be completed/),
          ).toHaveCount(0);
          if (route === "/privacy") {
            for (const text of [
              "Google Workspace",
              "funkspace.motion.preference.v1",
              "six calendar months",
              "shows whether form submission is available",
              "When the form is available, submitting sends",
              "through Resend to the Google Workspace inquiry mailbox",
              "not arrival in the mailbox",
              "United States",
              "30 days",
              "seven days",
              "page memory only",
            ])
              await expect(article).toContainText(text);
            const formDisclosure = article.getByRole("region", {
              name: "Contact form and drafts",
            });
            await expect(
              formDisclosure.getByRole("link", { name: "Contact page" }),
            ).toHaveAttribute("href", "/contact");
            await expect(formDisclosure).not.toContainText(
              "Form delivery is currently disabled",
            );
            await expect(
              article.getByRole("link", { name: /TLfDI/ }),
            ).toHaveAttribute("href", "https://tlfdi.de/kontakt/");
          }
          await expect(page.getByRole("heading", { level: 1 })).toHaveText(
            route === "/privacy" ? "Privacy" : "Legal notice",
          );
          await expect(
            page.getByRole("heading", { level: 2 }).first(),
          ).toBeVisible();
        }
        await expect(page.locator("#contact")).toHaveCount(0);
        await page.reload();
        await expect(page.locator('a[href="/#contact"]')).toHaveCount(0);
        for (const [label, href, heading] of [
          ["Legal notice", "/impressum", "Legal notice"],
          ["Privacy policy", "/privacy", "Privacy"],
        ]) {
          await page
            .getByRole("navigation", { name: "Footer" })
            .getByRole("link", { name: label, exact: true })
            .click();
          await expect(page).toHaveURL(href);
          await expect(page.getByRole("heading", { level: 1 })).toHaveText(
            heading,
          );
          const mail = page
            .getByRole("article")
            .getByRole("link", { name: email, exact: true });
          await expect(mail).toHaveAttribute("href", `mailto:${email}`);
          await mail.focus();
          await expect(mail).toBeFocused();
          // Verify actionability without opening a mail application.
          await mail.click({ trial: true });
          await expect(page.locator("form, input, textarea")).toHaveCount(0);
          await expect(
            page.getByRole("button", { name: /send|copy/i }),
          ).toHaveCount(0);
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
        for (const route of ["/impressum", "/privacy"]) {
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
          const content = page.getByRole("article");
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
              `${route.slice(1)}-${viewport.width}-200percent.png`,
            ),
          });
          const privacy = page
            .getByRole("navigation", { name: "Footer" })
            .getByRole("link", { name: "Privacy policy", exact: true });
          await privacy.click();
          await expect(page).toHaveURL("/privacy");
        }
      }
    });
  });
}

test("legal information retains accessible headings and contrast in supported themes", async ({
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
