import { expect, test } from "@playwright/test";

for (const theme of ["default", "dark", "muted", "dark-high-contrast"]) {
  test(`${theme}: external icon symbols preserve the inline artwork pixels and inherited paint`, async ({
    page,
    request,
  }, info) => {
    await page.goto("/about");
    await page.evaluate((theme) => {
      document.documentElement.dataset.theme = theme === "default" ? "" : theme;
    }, theme);
    const response = await request.get("/svg/icons/sprite.svg");
    expect(response.ok()).toBe(true);
    const sprite = await response.text();
    // Same box and source geometry, changing only how the artwork is referenced.
    // No screenshot tolerance: external use must match the original inline paint.
    for (const name of [
      "home",
      "about",
      "contact",
      "animations",
      "games",
      "s-web",
      "github",
      "linkedin",
      "privacy",
      "privacy-policy",
      "legal-notice",
    ]) {
      for (const size of [24, 36, 48]) {
        await page.evaluate(
          ({ sprite, name, size }) => {
            document.getElementById("sprite-proof")?.remove();
            const source = new DOMParser().parseFromString(
              sprite,
              "image/svg+xml",
            );
            const symbol = source.getElementById(`${name}-${size}`)!;
            const svg = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "svg",
            );
            svg.id = "sprite-proof";
            svg.setAttribute("viewBox", symbol.getAttribute("data-view-box")!);
            svg.setAttribute("fill", "none");
            svg.style.cssText = `position:fixed;z-index:100;top:0;left:0;width:${size}px;height:${size}px;color:var(--fs-color-content-primary);background:var(--fs-color-surface-background);--fs-icon-background:var(--fs-color-surface-background)`;
            const use = document.createElementNS(svg.namespaceURI, "use");
            use.setAttribute("href", `/svg/icons/sprite.svg#${name}-${size}`);
            svg.append(use);
            document.body.append(svg);
          },
          { sprite, name, size },
        );
        await page.evaluate(
          () =>
            new Promise<void>((resolve) =>
              requestAnimationFrame(() =>
                requestAnimationFrame(() => resolve()),
              ),
            ),
        );
        const icon = page.locator("#sprite-proof");
        const external = await icon.screenshot({
          path: info.outputPath(`${name}-${size}-external.png`),
        });
        const wrapper = await icon.evaluate(
          (svg, { sprite, name, size }) => {
            const source = new DOMParser().parseFromString(
              sprite,
              "image/svg+xml",
            );
            const group = source.getElementById(`${name}-${size}`)!;
            // Compare the complete referenced group, including its attributes.
            svg.replaceChildren(document.importNode(group, true));
            return {
              attributes: group.getAttributeNames().sort(),
              fill: group.getAttribute("fill"),
              localName: group.localName,
              namespace: group.namespaceURI,
            };
          },
          { sprite, name, size },
        );
        // Do not let a shared transform, clip or paint change hide a mismatch.
        expect(wrapper).toEqual({
          attributes: ["data-view-box", "fill", "id"],
          fill: "none",
          localName: "g",
          namespace: "http://www.w3.org/2000/svg",
        });
        expect(
          await icon.screenshot({
            path: info.outputPath(`${name}-${size}-inline.png`),
          }),
          `${name}-${size}`,
        ).toEqual(external);
      }
    }
  });
}

test("unavailable icon asset leaves named navigation operable", async ({
  page,
}) => {
  await page.route("**/svg/icons/sprite.svg", (route) => route.abort());
  await page.goto("/about");
  const trigger = page.getByRole("button", {
    name: "Menu: navigation and settings",
    exact: true,
  });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page
    .getByRole("dialog")
    .getByRole("link", { name: "Home", exact: true })
    .click();
  await expect(page).toHaveURL("/");
});
