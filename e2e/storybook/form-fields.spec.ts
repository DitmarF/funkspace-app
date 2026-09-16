import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { renderedPair, settleStyles, themes } from "../helpers/foundation";

async function open(page: Page, story: string, theme = "default") {
  const global =
    theme === "default"
      ? "light"
      : theme === "dark-high-contrast"
        ? "highContrast"
        : theme;
  await page.goto(
    `/iframe.html?id=controls-formfields--${story}&viewMode=story&globals=theme:${global}`,
  );
  await expect(page.locator("#storybook-root input").first()).toBeVisible();
  await expect
    .poll(
      async () =>
        (await page.locator("body").getAttribute("data-theme")) || "default",
    )
    .toBe(theme);
  await settleStyles(page);
}

for (const theme of themes) {
  test(`${theme}: normal, invalid, disabled and pending controlled fixtures`, async ({
    page,
  }, testInfo) => {
    const evidence = [];
    for (const state of ["normal", "invalid", "disabled", "pending"]) {
      await open(page, state, theme);
      const fields = page.getByRole("textbox");
      await expect(fields).toHaveCount(3);
      for (const [i, name] of ["Name", "Email", "Message"].entries()) {
        const field = page.getByRole("textbox", { name, exact: true });
        await expect(field).not.toHaveAttribute("required");
        if (state === "invalid") {
          await expect(field).toHaveAttribute("aria-invalid", "true");
          await expect(field).toHaveAccessibleDescription(/Error: Example/);
        } else await expect(field).not.toHaveAttribute("aria-invalid");
        if (state === "disabled") await expect(field).toBeDisabled();
        else await expect(field).toBeEnabled();
        if (state === "pending")
          await expect(field).toHaveAttribute("readonly");
        else await expect(field).not.toHaveAttribute("readonly");
        const text = await renderedPair(field);
        expect(text.ratio).toBeGreaterThanOrEqual(4.5);
        expect(text.fontSize).toBe("16px");
        evidence.push({ theme, state, name, text });
        expect(await fields.nth(i).inputValue()).not.toBe("");
      }
      await expect(
        page.getByRole("textbox", { name: "Email", exact: true }),
      ).toHaveAttribute("type", "email");
      await expect(page.getByRole("status")).toHaveCount(1);
      await expect(page.getByRole("alert")).toHaveCount(0);
      expect(
        (await new AxeBuilder({ page }).include("#storybook-root").analyze())
          .violations,
      ).toEqual([]);
      await page.screenshot({
        path: testInfo.outputPath(`fields-${theme}-${state}.png`),
        fullPage: true,
      });
    }
    await testInfo.attach("field-state-pairings", {
      body: JSON.stringify(evidence, null, 2),
      contentType: "application/json",
    });
  });

  test(`${theme}: actual field, feedback, boundary and focus pairings on both supported surfaces`, async ({
    page,
  }, testInfo) => {
    await open(page, "surface-pairings", theme);
    const evidence = [];
    const fonts = await page.evaluate(() => {
      const css = getComputedStyle(document.documentElement);
      return {
        display: css
          .getPropertyValue("--font-work-sans")
          .trim()
          .replace(/["']/g, ""),
        body: css
          .getPropertyValue("--font-space-grotesk")
          .trim()
          .replace(/["']/g, ""),
      };
    });
    expect(fonts.body).not.toBe("");
    expect(fonts.display).not.toBe("");
    for (const surface of ["background", "elevation-1"]) {
      const section = page.getByRole("region", { name: surface, exact: true });
      for (const element of await section.locator("label, p, input").all()) {
        const text = await renderedPair(element);
        expect(
          text.ratio,
          JSON.stringify({ surface, text }),
        ).toBeGreaterThanOrEqual(4.5);
        const tag = await element.evaluate((node) => node.tagName);
        expect(text.fontFamily).toContain(
          tag === "LABEL" ? fonts.display : fonts.body,
        );
        evidence.push({ theme, surface, kind: "text", text });
      }
      for (const name of ["Normal field", "Invalid field", "Read-only field"]) {
        const field = section.getByRole("textbox", { name, exact: true });
        const boundary = await renderedPair(field, "borderTopColor");
        expect(boundary.ratio).toBeGreaterThanOrEqual(3);
        await field.focus();
        const focus = await renderedPair(field, "outlineColor", true);
        const expectedFocus = {
          default: "rgb(59, 71, 204)",
          dark: "rgb(74, 186, 255)",
          muted: "rgb(30, 36, 102)",
          "dark-high-contrast": "rgb(74, 186, 255)",
        };
        expect(focus.foreground).toBe(expectedFocus[theme]);
        expect(focus.ratio).toBeGreaterThanOrEqual(3);
        expect(focus.outlineStyle).toBe("solid");
        expect(focus.outlineOffset).toBe("2px");
        await expect(field).toHaveCSS("clip-path", "none");
        evidence.push({ theme, surface, name, boundary, focus });
      }
    }
    expect(
      (await new AxeBuilder({ page }).include("#storybook-root").analyze())
        .violations,
    ).toEqual([]);
    await testInfo.attach("field-surface-pairings", {
      body: JSON.stringify(evidence, null, 2),
      contentType: "application/json",
    });
  });
}

test("caller-controlled drafts survive pending, disabled and error presentation; native FormData stays honest", async ({
  page,
}) => {
  await open(page, "normal");
  const draft = {
    name: "Changed name",
    email: "changed@example.test",
    message: "A preserved draft",
  };
  for (const [label, value] of [
    ["Name", draft.name],
    ["Email", draft.email],
    ["Message", draft.message],
  ]) {
    await page.getByRole("textbox", { name: label, exact: true }).fill(value);
  }
  for (const state of ["pending", "invalid", "disabled", "normal"]) {
    const trigger = page.getByRole("button", { name: state, exact: true });
    await trigger.click();
    await expect(trigger).toBeFocused();
    for (const [label, value] of [
      ["Name", draft.name],
      ["Email", draft.email],
      ["Message", draft.message],
    ]) {
      await expect(
        page.getByRole("textbox", { name: label, exact: true }),
      ).toHaveValue(value);
    }
    await page.getByRole("button", { name: "Inspect local values" }).click();
    const snapshot = JSON.parse(
      (await page.getByTestId("snapshot").textContent())!,
    );
    expect(snapshot).toEqual(state === "disabled" ? {} : draft);
  }
  await expect(page.getByRole("status")).toHaveText(
    "Fixture: normal presentation.",
  );
});

test("multiple instances preserve unique IDs, native label focus and merged descriptions", async ({
  page,
}) => {
  await open(page, "description-associations");
  const first = page.getByRole("textbox", { name: "First example" });
  await expect(first).toHaveAccessibleDescription(
    "Caller-provided description. Local help. Error: Caller-supplied error.",
  );
  await page.getByText("First example", { exact: true }).click();
  await expect(first).toBeFocused();
  const ids = await page
    .locator("#storybook-root [id]")
    .evaluateAll((nodes) => nodes.map((node) => node.id));
  expect(new Set(ids).size).toBe(ids.length);
  const descriptions = await page
    .getByRole("textbox")
    .evaluateAll((nodes) =>
      nodes.flatMap((node) =>
        (node.getAttribute("aria-describedby") || "").split(" "),
      ),
    );
  for (const id of descriptions)
    expect(
      await page.evaluate((id) => document.getElementById(id) !== null, id),
    ).toBe(true);
  await expect(page.getByRole("alert")).toHaveCount(0);
});

test("uncontrolled values and required wording follow native reset without premature invalid semantics", async ({
  page,
}) => {
  await open(page, "native-and-required");
  const field = page.getByRole("textbox", {
    name: "Example required text (required)",
  });
  await expect(field).toHaveAttribute("required");
  await expect(field).not.toHaveAttribute("aria-invalid");
  await field.fill("Changed");
  await page
    .getByRole("textbox", { name: "Optional notes" })
    .fill("Changed notes");
  await page.getByRole("button", { name: "Reset local values" }).click();
  await expect(field).toHaveValue("Uncontrolled value");
  await expect(
    page.getByRole("textbox", { name: "Optional notes" }),
  ).toHaveValue("Native textarea");
});

test("textarea scrolls and resizes; enlarged text stays usable at a narrow viewport", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await open(page, "normal");
  const textarea = page.getByRole("textbox", { name: "Message", exact: true });
  await textarea.fill(
    Array.from(
      { length: 60 },
      (_, i) => `Line ${i}: a retained long draft`,
    ).join("\n"),
  );
  await expect(textarea).toHaveCSS("resize", "vertical");
  expect(
    await textarea.evaluate((node) => node.scrollHeight > node.clientHeight),
  ).toBe(true);
  await textarea.evaluate((node) => {
    node.scrollTop = node.scrollHeight;
  });
  expect(await textarea.evaluate((node) => node.scrollTop)).toBeGreaterThan(0);
  await textarea.scrollIntoViewIfNeeded();
  const before = (await textarea.boundingBox())!;
  await page.mouse.move(
    before.x + before.width - 4,
    before.y + before.height - 4,
  );
  await page.mouse.down();
  await page.mouse.move(
    before.x + before.width - 4,
    before.y + before.height + 76,
    { steps: 8 },
  );
  await page.mouse.up();
  expect((await textarea.boundingBox())!.height).toBeGreaterThan(
    before.height + 40,
  );
  await page.addStyleTag({ content: "html { font-size: 200%; }" });
  await expect(textarea).toHaveCSS("font-size", "32px");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath("fields-enlarged.png"),
    fullPage: true,
  });
});

test("forced colors preserve error text, focus and native disabled cues", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await open(page, "surface-pairings");
  const section = page.getByRole("region", { name: "background", exact: true });
  const field = section.getByRole("textbox", { name: "Invalid field" });
  await field.focus();
  await expect(field).toHaveCSS("outline-style", "solid");
  await expect(field).toHaveAccessibleDescription(
    "Error: A readable caller-supplied error.",
  );
  await expect(
    section.getByRole("textbox", { name: "Disabled field" }),
  ).toHaveCSS("border-top-style", "dashed");
  const pair = await renderedPair(field);
  expect(pair.ratio).toBeGreaterThanOrEqual(4.5);
  await page.screenshot({
    path: testInfo.outputPath("fields-forced-colors.png"),
    fullPage: true,
  });
});
