import { expect, test } from "@playwright/test";

for (const input of ["wheel", "touch"] as const) {
  test.describe(`customization ${input} scrolling`, () => {
    test.use({
      viewport:
        input === "touch"
          ? { width: 390, height: 700 }
          : { width: 1100, height: 700 },
      hasTouch: input === "touch",
      isMobile: input === "touch",
    });

    test("scrolls content both ways, reaches Reset and contains background scroll", async ({
      page,
    }) => {
      await page.addInitScript(() =>
        localStorage.setItem("funkspace.motion.preference.v1", "off"),
      );
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
      await expect(dialog).toBeVisible();
      const background = await page.evaluate(() => window.scrollY);
      const top = () => dialog.evaluate((node) => node.scrollTop);
      const initial = await top();
      const client =
        input === "touch" ? await page.context().newCDPSession(page) : null;
      const scroll = async (direction: 1 | -1) => {
        const box = await dialog.boundingBox();
        if (!box) throw new Error("Dialog has no geometry");
        // Inside the content's left padding, away from range thumbs and scrollbar.
        const x = box.x + 8;
        const y = box.y + box.height * (direction === 1 ? 0.78 : 0.3);
        if (!client) {
          await page.mouse.move(x, y);
          await page.mouse.wheel(0, direction * 450);
        } else {
          await client.send("Input.dispatchTouchEvent", {
            type: "touchStart",
            touchPoints: [{ x, y }],
          });
          for (let step = 1; step <= 12; step++) {
            await client.send("Input.dispatchTouchEvent", {
              type: "touchMove",
              touchPoints: [{ x, y: y - direction * step * 22 }],
            });
            await page.waitForTimeout(16);
          }
          await client.send("Input.dispatchTouchEvent", {
            type: "touchEnd",
            touchPoints: [],
          });
        }
        await page.waitForTimeout(300);
      };
      try {
        await scroll(1);
        await expect.poll(top).toBeGreaterThan(initial + 50);
        const down = await top();
        await scroll(-1);
        await expect.poll(top).toBeLessThan(down - 50);
        for (let attempt = 0; attempt < 15; attempt++) {
          if (
            await dialog.evaluate(
              (node) =>
                node.scrollTop + node.clientHeight >= node.scrollHeight - 2,
            )
          )
            break;
          await scroll(1);
        }
        await expect(
          dialog.getByRole("slider", {
            name: "Connection distance",
            exact: true,
          }),
        ).toBeInViewport();
        await scroll(1);
        expect(await page.evaluate(() => window.scrollY)).toBe(background);
        await page.keyboard.press("Escape");
        await expect(dialog).not.toBeVisible();
        await expect(trigger).toBeFocused();
        expect(await page.evaluate(() => window.scrollY)).toBe(background);
        expect(
          await page.evaluate(() => document.documentElement.style.overflow),
        ).not.toBe("hidden");
      } finally {
        await client?.detach();
      }
    });
  });
}
