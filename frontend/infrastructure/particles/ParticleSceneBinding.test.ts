import { afterEach, expect, it, vi } from "vitest";
import { bindParticleScene } from "./ParticleSceneBinding";
import { createParticleScene } from "@/domain/particles/ParticleScene";
import type { ThemeSubscriber } from "@/application/theme/ThemeService";

function fixture() {
  const host = document.createElement("div");
  document.body.append(host);
  host.style.setProperty("--fs-color-surface-background", "white");
  host.style.setProperty("--fs-color-content-primary", "black");
  Object.defineProperties(host, {
    clientWidth: { value: 640, configurable: true },
    clientHeight: { value: 360, configurable: true },
  });
  let resize!: ResizeObserverCallback;
  let intersection!: IntersectionObserverCallback;
  const disconnectResize = vi.fn();
  const disconnectIntersection = vi.fn();
  const observe = vi.fn();
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(cb: ResizeObserverCallback) {
        resize = cb;
      }
      observe = observe;
      disconnect = disconnectResize;
    },
  );
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(cb: IntersectionObserverCallback) {
        intersection = cb;
      }
      observe = observe;
      disconnect = disconnectIntersection;
    },
  );
  const queries: {
    addEventListener: ReturnType<typeof vi.fn>;
    removeEventListener: ReturnType<typeof vi.fn>;
  }[] = [];
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => {
      const q = { addEventListener: vi.fn(), removeEventListener: vi.fn() };
      queries.push(q);
      return q;
    }),
  );
  let themeCallback!: ThemeSubscriber;
  const unsubscribe = vi.fn();
  const theme = {
    subscribe: vi.fn((cb: ThemeSubscriber) => {
      themeCallback = cb;
      cb({ selectedTheme: "default", resolvedTheme: "default" });
      return unsubscribe;
    }),
  };
  const visible = (value: boolean) =>
    intersection(
      [
        {
          target: host,
          isIntersecting: value,
        } as unknown as IntersectionObserverEntry,
      ],
      {} as IntersectionObserver,
    );
  return {
    host,
    theme,
    visible,
    queries,
    disconnectResize,
    disconnectIntersection,
    observe,
    unsubscribe,
    themeChange: () =>
      themeCallback({ selectedTheme: "dark", resolvedTheme: "dark" }),
    resize: () =>
      resize(
        [
          {
            target: host,
            contentRect: { width: 320, height: 180 },
          } as unknown as ResizeObserverEntry,
        ],
        {} as ResizeObserver,
      ),
  };
}
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.body.replaceChildren();
});
it("times out a stalled import, ignores late completion and releases its deadline", async () => {
  vi.useFakeTimers();
  const f = fixture();
  let finish!: (value: typeof import("./CanvasParticleScene")) => void;
  const binding = bindParticleScene(
    f.host,
    f.theme,
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  const pending = binding.prepare(createParticleScene(null), () => true, {
    frameReady: vi.fn(),
    failed: vi.fn(),
  });
  const rejected = expect(pending).rejects.toThrow("timed out");
  await vi.advanceTimersByTimeAsync(5000);
  await rejected;
  const createCanvasParticleScene = vi.fn();
  finish({ createCanvasParticleScene });
  await Promise.resolve();
  expect(createCanvasParticleScene).not.toHaveBeenCalled();
  expect(vi.getTimerCount()).toBe(0);
  binding.destroy();
});
it("observes geometry, theme, DPR and intersection before any Canvas load", () => {
  const f = fixture();
  const load = vi.fn();
  const binding = bindParticleScene(f.host, f.theme, load);
  expect(load).not.toHaveBeenCalled();
  expect(binding.getSnapshot()).toMatchObject({
    width: 640,
    height: 360,
    visible: false,
  });
  f.visible(true);
  expect(binding.getSnapshot().visible).toBe(true);
  f.resize();
  expect(binding.getSnapshot().width).toBe(320);
  f.host.style.setProperty("--fs-color-content-primary", "red");
  f.themeChange();
  expect(binding.getSnapshot().palette?.particle).toBe("red");
  expect(binding.getSnapshot().width).toBe(320);
  f.visible(false);
  expect(binding.getSnapshot().width).toBe(320);
  f.queries[0].addEventListener.mock.calls[0][1]();
  expect(f.queries[0].removeEventListener).toHaveBeenCalledTimes(1);
  expect(f.queries).toHaveLength(2);
  binding.destroy();
  binding.destroy();
  expect(f.disconnectResize).toHaveBeenCalledTimes(1);
  expect(f.disconnectIntersection).toHaveBeenCalledTimes(1);
  expect(f.unsubscribe).toHaveBeenCalledTimes(1);
  expect(f.queries[1].removeEventListener).toHaveBeenCalledTimes(1);
});
it("caches immutable palette values and denies invalid or context-dependent colors", () => {
  const f = fixture();
  const binding = bindParticleScene(f.host, f.theme);
  const palette = binding.getSnapshot().palette;
  expect(Object.isFrozen(palette)).toBe(true);
  f.visible(true);
  expect(binding.getSnapshot().palette).toBe(palette);
  for (const color of [
    "",
    "var(--missing)",
    "not-a-color",
    "currentColor",
    "inherit",
  ]) {
    f.host.style.setProperty("--fs-color-content-primary", color);
    f.themeChange();
    expect(binding.getSnapshot().palette).toBeNull();
  }
  f.host.style.setProperty("--fs-color-content-primary", "red");
  f.themeChange();
  expect(binding.getSnapshot().palette).toEqual({
    background: "white",
    particle: "red",
  });
  binding.destroy();
});
it("does not construct after cancellation or destroy during lazy loading", async () => {
  const f = fixture();
  let resolve!: (v: typeof import("./CanvasParticleScene")) => void;
  const load = vi.fn(
    () =>
      new Promise<typeof import("./CanvasParticleScene")>((r) => {
        resolve = r;
      }),
  );
  const binding = bindParticleScene(f.host, f.theme, load);
  f.visible(true);
  const createCanvasParticleScene = vi.fn();
  const pending = binding.prepare(createParticleScene(null), () => true, {
    frameReady: vi.fn(),
    failed: vi.fn(),
  });
  binding.destroy();
  resolve({ createCanvasParticleScene });
  await expect(pending).rejects.toThrow("canceled");
  expect(createCanvasParticleScene).not.toHaveBeenCalled();
});
it("denied preparation does not even request the module", async () => {
  const f = fixture();
  const load = vi.fn();
  const binding = bindParticleScene(f.host, f.theme, load);
  await expect(
    binding.prepare(createParticleScene(null), () => false, {
      frameReady: vi.fn(),
      failed: vi.fn(),
    }),
  ).rejects.toThrow("canceled");
  expect(load).not.toHaveBeenCalled();
  binding.destroy();
});
it("rolls back partial observation and attempts all cleanup despite exceptions", () => {
  const f = fixture();
  f.observe
    .mockImplementationOnce(() => {})
    .mockImplementationOnce(() => {
      throw Error("observe");
    });
  f.disconnectResize.mockImplementation(() => {
    throw Error("disconnect");
  });
  expect(() => bindParticleScene(f.host, f.theme)).toThrow("observe");
  expect(f.disconnectResize).toHaveBeenCalledTimes(1);
  expect(f.disconnectIntersection).toHaveBeenCalledTimes(1);
});
it("mount/cleanup/mount owns independent subscriptions and never document visibility", () => {
  const f = fixture();
  const doc = vi.spyOn(document, "addEventListener");
  const first = bindParticleScene(f.host, f.theme);
  first.destroy();
  const second = bindParticleScene(f.host, f.theme);
  second.destroy();
  expect(f.unsubscribe).toHaveBeenCalledTimes(2);
  expect(f.disconnectResize).toHaveBeenCalledTimes(2);
  expect(doc.mock.calls.some(([name]) => name === "visibilitychange")).toBe(
    false,
  );
});
