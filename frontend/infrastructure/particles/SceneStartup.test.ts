import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { bindSceneStartup, sceneStartupScript } from "./SceneStartup";

let root: HTMLDivElement;
let release: (() => void) | undefined;
beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(Storage.prototype, "getItem").mockReturnValue(null);
  root = document.createElement("div");
  root.dataset.sceneReveal = "pending";
  document.body.append(root);
  vi.stubGlobal("matchMedia", () => ({ matches: false }));
});
afterEach(() => {
  release?.();
  release = undefined;
  root.remove();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

it.each(["on", "reduced", "off", "system"])(
  "%s conceals only startup and releases on actual draw",
  async (preference) => {
    vi.mocked(Storage.prototype.getItem).mockReturnValue(preference);
    release = bindSceneStartup(root, true);
    expect(root.dataset.sceneStartup).toBe("waiting");
    expect(vi.getTimerCount()).toBe(1);
    root.dataset.sceneReveal = "fade";
    await Promise.resolve();
    expect(root.dataset.sceneStartup).toBe("ready");
    expect(vi.getTimerCount()).toBe(0);
  },
);

it.each(["flag", "os-reduce", "storage", "unknown-system"])(
  "%s retains static artwork",
  (reason) => {
    if (reason === "os-reduce")
      vi.stubGlobal("matchMedia", () => ({ matches: true }));
    if (reason === "unknown-system") vi.stubGlobal("matchMedia", undefined);
    if (reason === "storage")
      vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw Error("blocked");
      });
    release = bindSceneStartup(root, reason !== "flag");
    expect(root.dataset.sceneStartup).toBe("static");
    expect(vi.getTimerCount()).toBe(0);
  },
);

it("deadline is terminal across late hydration; cleanup retires observation", async () => {
  release = bindSceneStartup(root, true);
  expect(bindSceneStartup(root, true)).toBe(release);
  vi.advanceTimersByTime(5000);
  expect(root.dataset.sceneStartup).toBe("expired");
  release = bindSceneStartup(root, true);
  root.dataset.sceneReveal = "waiting";
  await Promise.resolve();
  expect(root.dataset.sceneStartup).toBe("expired");
  expect(vi.getTimerCount()).toBe(0);
});

it("cleanup/setup replay retains one deadline and terminal cleanup ignores stale updates", async () => {
  release = bindSceneStartup(root, true);
  release();
  release = bindSceneStartup(root, true);
  expect(vi.getTimerCount()).toBe(1);
  release();
  root.dataset.sceneReveal = "fade";
  await Promise.resolve();
  expect(root.dataset.sceneStartup).toBe("waiting");
  expect(vi.getTimerCount()).toBe(0);
});

it("serialized parser source is self-contained and hands its ownership to hydration", () => {
  const script = document.createElement("script");
  root.append(script);
  vi.spyOn(document, "currentScript", "get").mockReturnValue(script);
  new Function(sceneStartupScript(true))();
  expect(root.dataset.sceneStartup).toBe("waiting");
  expect(vi.getTimerCount()).toBe(1);
  release = bindSceneStartup(root, true);
  expect(vi.getTimerCount()).toBe(1);
});
