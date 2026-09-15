// @vitest-environment node
import { afterEach, beforeEach, expect, it } from "vitest";
import {
  mkdtemp,
  readFile,
  rm,
  stat,
  writeFile,
  readdir,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { runInNewContext } from "node:vm";
import { JSDOM } from "jsdom";
import { generate, watch } from "./build-theme-bootstrap.mjs";

let directory;
let entry;
let helper;
let output;
let dispose;
beforeEach(async () => {
  directory = await mkdtemp(join(tmpdir(), "theme-generator-test-"));
  entry = join(directory, "entry.ts");
  helper = join(directory, "helper.ts");
  output = join(directory, "generated.ts");
  await writeFile(helper, 'export const value: string = "first";');
  await writeFile(
    entry,
    'import { value } from "./helper"; document.documentElement.setAttribute("data-result", value);',
  );
});
afterEach(async () => {
  await dispose?.();
  dispose = undefined;
  await rm(directory, { recursive: true, force: true });
});

function payload(contents) {
  return runInNewContext(
    contents
      .slice(contents.indexOf("=") + 1)
      .trim()
      .replace(/;$/, ""),
  );
}

it("fails freshness before regeneration; preserves mtime on repeated identical generation", async () => {
  await expect(generate({ entry, output, check: true })).rejects.toThrow(
    "missing or stale",
  );
  await generate({ entry, output });
  const before = await stat(output);
  await generate({ entry, output });
  await generate({ entry, output, check: true });
  expect((await stat(output)).mtimeMs).toBe(before.mtimeMs);
  await writeFile(helper, 'export const value = "second";');
  await expect(generate({ entry, output, check: true })).rejects.toThrow(
    "missing or stale",
  );
  await generate({ entry, output });
  expect(await readFile(output, "utf8")).toContain("second");
  await writeFile(
    entry,
    'document.documentElement.setAttribute("data-result", "entry changed");',
  );
  await expect(generate({ entry, output, check: true })).rejects.toThrow(
    "missing or stale",
  );
  await generate({ entry, output });
  expect(await readFile(output, "utf8")).toContain("entry changed");
});

it("keeps the prior artifact intact on compile failure, with no partial output", async () => {
  await generate({ entry, output });
  const previous = await readFile(output, "utf8");
  await writeFile(entry, "this is not valid TypeScript {");
  await expect(generate({ entry, output })).rejects.toThrow();
  expect(await readFile(output, "utf8")).toBe(previous);
  expect(
    (await readdir(directory)).filter((name) => name.endsWith(".tmp")),
  ).toEqual([]);
});

it("embeds a terminating script literal without creating markup or changing its value", async () => {
  const dangerous =
    "</script><script>window.INJECTED=true</script><!--\u2028\u2029&>";
  await writeFile(
    helper,
    `export const value: string = ${JSON.stringify(dangerous)};`,
  );
  await generate({ entry, output });
  const script = payload(await readFile(output, "utf8"));
  expect(script).not.toMatch(/<\/script/i);
  const dom = new JSDOM(
    `<html><head><script>${script}</script></head><body>static</body></html>`,
    { runScripts: "dangerously" },
  );
  try {
    expect(dom.window.document.scripts).toHaveLength(1);
    expect(dom.window.document.documentElement.dataset.result).toBe(dangerous);
    expect(dom.window.INJECTED).toBeUndefined();
  } finally {
    dom.window.close();
  }
});

it("watches both entry and imported helper, reports errors, recovers and disposes", async () => {
  const events = [];
  dispose = await watch({
    entry,
    output,
    onBuild: (error) => events.push(error),
  });
  await expect.poll(() => events.length).toBe(1);
  await writeFile(helper, 'export const value = "watched helper";');
  await expect.poll(() => readFile(output, "utf8")).toContain("watched helper");
  await writeFile(
    entry,
    'document.documentElement.setAttribute("data-result", "watched entry");',
  );
  await expect.poll(() => readFile(output, "utf8")).toContain("watched entry");
  await writeFile(entry, "invalid syntax {");
  await expect.poll(() => events.some(Boolean)).toBe(true);
  expect(await readFile(output, "utf8")).toContain("watched entry");
  await writeFile(
    entry,
    'document.documentElement.setAttribute("data-result", "recovered");',
  );
  await expect.poll(() => readFile(output, "utf8")).toContain("recovered");
});

it("the actual maintained entry compiles self-contained browser code", async () => {
  await generate({ output });
  const script = payload(await readFile(output, "utf8"));
  expect(script).not.toMatch(
    /\b(?:require|import|process|React|__THEME_BOOTSTRAP_ENTRY__)\b|node:|eval\(|new Function/,
  );
  const dom = new JSDOM("<html></html>", {
    url: "https://example.test",
    runScripts: "outside-only",
  });
  try {
    dom.window.localStorage.setItem("theme", "dark-high-contrast");
    dom.window.eval(script);
    expect(dom.window.document.documentElement.dataset.theme).toBe(
      "dark-high-contrast",
    );
  } finally {
    dom.window.close();
  }
});

it("rejects unknown CLI arguments without generating", async () => {
  await expect(
    promisify(execFile)(process.execPath, [
      "scripts/build-theme-bootstrap.mjs",
      "--unknown",
    ]),
  ).rejects.toMatchObject({ code: 1 });
});
