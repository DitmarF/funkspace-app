import { EventEmitter } from "node:events";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { prepareStorybookPublic } from "./public-assets";

const roots: string[] = [];
afterEach(() => {
  for (const root of roots.splice(0))
    rmSync(root, { recursive: true, force: true });
});

describe("Storybook public assets", () => {
  it("preserves source files, synchronizes dev changes and cleans up", () => {
    const root = mkdtempSync(join(tmpdir(), "funkspace-public-test-"));
    roots.push(root);
    const source = join(root, "public");
    mkdirSync(source);
    const asset = join(source, "example.svg");
    const reserved = join(source, "design-tokens.source.json");
    writeFileSync(asset, "initial");
    writeFileSync(reserved, "user-owned");

    const isolated = prepareStorybookPublic(source);
    roots.push(isolated.publicDir);
    const outputAsset = join(isolated.publicDir, "example.svg");
    const outputGenerated = join(
      isolated.publicDir,
      "design-tokens.source.json",
    );
    expect(readFileSync(outputAsset, "utf8")).toBe("initial");
    expect(() => readFileSync(outputGenerated)).toThrow();
    writeFileSync(outputGenerated, "addon-generated");
    writeFileSync(asset, "changed-before-watch");

    const watcher = Object.assign(new EventEmitter(), { add: vi.fn() });
    const warn = vi.fn();
    isolated.plugin.configureServer({ watcher, config: { logger: { warn } } });
    expect(watcher.add).toHaveBeenCalledWith(source);
    expect(readFileSync(outputAsset, "utf8")).toBe("changed-before-watch");
    expect(readFileSync(outputGenerated, "utf8")).toBe("addon-generated");
    writeFileSync(asset, "updated");
    watcher.emit("all", "change", asset);
    expect(readFileSync(outputAsset, "utf8")).toBe("updated");

    const nested = join(source, "nested");
    const added = join(nested, "new.svg");
    mkdirSync(nested);
    watcher.emit("all", "addDir", nested);
    writeFileSync(added, "new");
    watcher.emit("all", "add", added);
    expect(
      readFileSync(join(isolated.publicDir, "nested/new.svg"), "utf8"),
    ).toBe("new");
    rmSync(asset);
    watcher.emit("all", "unlink", asset);
    expect(() => readFileSync(outputAsset)).toThrow();
    expect(readFileSync(outputGenerated, "utf8")).toBe("addon-generated");
    expect(readFileSync(reserved, "utf8")).toBe("user-owned");
    watcher.emit("all", "change", reserved);
    watcher.emit("all", "change", join(root, "outside.svg"));
    expect(readFileSync(outputGenerated, "utf8")).toBe("addon-generated");
    rmSync(nested, { recursive: true });
    watcher.emit("all", "unlinkDir", nested);
    expect(() =>
      readFileSync(join(isolated.publicDir, "nested/new.svg")),
    ).toThrow();
    expect(warn).not.toHaveBeenCalled();

    isolated.plugin.closeBundle();
    expect(watcher.listenerCount("all")).toBe(0);
    expect(() => readFileSync(outputGenerated)).toThrow();
    expect(readFileSync(reserved, "utf8")).toBe("user-owned");
  });

  it("never writes through a stale mirrored symlink after retargeting", () => {
    const root = mkdtempSync(join(tmpdir(), "funkspace-public-link-test-"));
    roots.push(root);
    const source = join(root, "public");
    const first = join(root, "first");
    const second = join(root, "second");
    mkdirSync(source);
    mkdirSync(first);
    mkdirSync(second);
    writeFileSync(join(first, "asset.svg"), "first");
    writeFileSync(join(second, "asset.svg"), "second");
    const link = join(source, "linked");
    symlinkSync(first, link, "dir");
    const isolated = prepareStorybookPublic(source);
    roots.push(isolated.publicDir);
    const watcher = Object.assign(new EventEmitter(), { add: vi.fn() });
    const warn = vi.fn();
    isolated.plugin.configureServer({ watcher, config: { logger: { warn } } });

    rmSync(link);
    symlinkSync(second, link, "dir");
    watcher.emit("all", "change", join(link, "asset.svg"));
    expect(readFileSync(join(first, "asset.svg"), "utf8")).toBe("first");
    expect(readFileSync(join(second, "asset.svg"), "utf8")).toBe("second");
    expect(
      readFileSync(join(isolated.publicDir, "linked/asset.svg"), "utf8"),
    ).toBe("second");
    expect(warn).not.toHaveBeenCalled();
    isolated.plugin.closeBundle();
  });
});
