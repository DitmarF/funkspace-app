import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { bindHomeIntro, homeIntroBootstrapScript } from "./HomeIntroBinding";
import { MOTION_PREFERENCE_KEY } from "@/domain/motion/MotionPolicy";

let root: HTMLDivElement;
let reduced = false;
beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
  history.replaceState(null, "", "/");
  reduced = false;
  root = document.createElement("div");
  root.dataset.homeIntro = "visible";
  root.innerHTML =
    '<script></script><div data-home-menu><button>Menu</button></div><main data-home-content><a href="/#contact">Contact</a></main>';
  document.body.append(root);
  vi.spyOn(document, "currentScript", "get").mockReturnValue(
    root.querySelector("script"),
  );
  vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
  vi.stubGlobal("IntersectionObserver", class {});
  vi.stubGlobal("matchMedia", () => ({ matches: reduced }));
  vi.spyOn(performance, "getEntriesByType").mockReturnValue([]);
});
afterEach(() => {
  root.remove();
  bindHomeIntro(root).release();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
function start(available = true) {
  vi.runOnlyPendingTimers(); // Flush jsdom's queued storage events from fixture setup.
  new Function(homeIntroBootstrapScript(available))();
}

it.each(["deadline", "interaction"])(
  "%s cancellation survives late binding and Strict Mode subscription replacement",
  (reason) => {
    start();
    if (reason === "deadline") vi.advanceTimersByTime(5100);
    else window.dispatchEvent(new Event("pointerdown"));
    const first = vi.fn();
    const second = vi.fn();
    const old = bindHomeIntro(root, first);
    expect(first).toHaveBeenCalledTimes(1);
    const current = bindHomeIntro(root, second);
    expect(second).toHaveBeenCalledTimes(1);
    old.release();
    current.logoState("running");
    vi.advanceTimersByTime(10000);
    expect(root.dataset.homeIntro).toBe("visible");
    expect(second).toHaveBeenCalledTimes(1);
    current.release();
    const replay = vi.fn();
    const renewed = bindHomeIntro(root, replay);
    expect(replay).toHaveBeenCalledTimes(1);
    renewed.release();
  },
);

it("cancellation notifies only the current owner and tolerates synchronous static feedback", () => {
  start();
  const first = vi.fn();
  const old = bindHomeIntro(root, first);
  const cancel = vi.fn(() => current.logoState("static"));
  const current = bindHomeIntro(root, cancel);
  old.release();
  window.dispatchEvent(new Event("pointerdown"));
  expect(cancel).toHaveBeenCalledTimes(1);
  expect(first).not.toHaveBeenCalled();
  expect(root.dataset.homeIntro).toBe("visible");
  expect(vi.getTimerCount()).toBe(0);
  current.release();
});

it("normal completion and detached cleanup do not notify a retired cancellation owner", () => {
  start();
  const cancel = vi.fn();
  const binding = bindHomeIntro(root, cancel);
  binding.logoState("completed");
  window.dispatchEvent(new Event("pointerdown"));
  expect(cancel).not.toHaveBeenCalled();
  root.remove();
  binding.release();
  vi.advanceTimersByTime(10000);
  expect(cancel).not.toHaveBeenCalled();
});

it("revealing content during an already running introduction preserves playback", () => {
  start();
  const cancel = vi.fn();
  const binding = bindHomeIntro(root, cancel);
  binding.logoState("running");
  window.dispatchEvent(new Event("pointerdown"));
  expect(root.dataset.homeIntro).toBe("visible");
  expect(cancel).not.toHaveBeenCalled();
  binding.release();
});

it.each(["on", "reduced", "system"])(
  "%s waits for actual completion, fades once and releases resources",
  (preference) => {
    localStorage.setItem(MOTION_PREFERENCE_KEY, preference);
    reduced = preference !== "system";
    start();
    expect(root.dataset.homeIntro).toBe("preparing");
    const binding = bindHomeIntro(root);
    binding.logoState("pending");
    expect(root.dataset.homeIntro).toBe("preparing");
    binding.logoState("running");
    vi.advanceTimersByTime(500);
    expect(root.dataset.homeIntro).toBe("waiting");
    binding.logoState("completed");
    expect(root.dataset.homeIntro).toBe("menu");
    root
      .querySelector("main")!
      .dispatchEvent(new Event("animationend", { bubbles: true }));
    expect(root.dataset.homeIntro).toBe("menu");
    root
      .querySelector("[data-home-menu]")!
      .dispatchEvent(new Event("animationend", { bubbles: true }));
    expect(root.dataset.homeIntro).toBe("fading");
    root
      .querySelector("main")!
      .dispatchEvent(new Event("animationend", { bubbles: true }));
    expect(root.dataset.homeIntro).toBe("visible");
    expect(vi.getTimerCount()).toBe(0);
    binding.logoState("running");
    binding.logoState("completed");
    expect(root.dataset.homeIntro).toBe("visible");
    binding.release();
  },
);

it.each(["off", "os", "flag", "storage", "observer", "hash", "history"])(
  "%s never hides content",
  (reason) => {
    if (reason === "off") localStorage.setItem(MOTION_PREFERENCE_KEY, "off");
    if (reason === "os") reduced = true;
    if (reason === "storage")
      vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw Error("denied");
      });
    if (reason === "observer") vi.stubGlobal("IntersectionObserver", undefined);
    if (reason === "hash") history.replaceState(null, "", "/#contact");
    if (reason === "history")
      vi.mocked(performance.getEntriesByType).mockReturnValue([
        { type: "back_forward" } as PerformanceNavigationTiming,
      ]);
    start(reason !== "flag");
    expect(root.dataset.homeIntro).toBe("visible");
    const binding = bindHomeIntro(root);
    binding.logoState("running");
    binding.logoState("completed");
    expect(root.dataset.homeIntro).toBe("visible");
    expect(vi.getTimerCount()).toBe(0);
    binding.release();
  },
);

it.each([
  "keydown",
  "focusin",
  "pointerdown",
  "pagehide",
  "popstate",
  "hashchange",
])("%s reveals and cancels all pending work", (event) => {
  start();
  const binding = bindHomeIntro(root);
  window.dispatchEvent(new Event(event));
  expect(root.dataset.homeIntro).toBe("visible");
  expect(vi.getTimerCount()).toBe(0);
  binding.logoState("completed");
  expect(root.dataset.homeIntro).toBe("visible");
  binding.release();
});

it("a background tab waits for first visibility before starting its bounded deadline", () => {
  const visibility = vi.spyOn(document, "visibilityState", "get");
  visibility.mockReturnValue("hidden");
  start();
  const binding = bindHomeIntro(root);
  binding.logoState("pending");
  vi.advanceTimersByTime(10000);
  expect(root.dataset.homeIntro).toBe("preparing");
  expect(vi.getTimerCount()).toBe(0);
  visibility.mockReturnValue("visible");
  document.dispatchEvent(new Event("visibilitychange"));
  expect(root.dataset.homeIntro).toBe("preparing");
  expect(vi.getTimerCount()).toBe(1);
  binding.logoState("running");
  binding.logoState("completed");
  expect(root.dataset.homeIntro).toBe("menu");
  binding.logoState("static");
  expect(vi.getTimerCount()).toBe(0);
  binding.release();
});

it("activation with failed hydration fails open, and later hiding cannot rearm it", () => {
  const visibility = vi.spyOn(document, "visibilityState", "get");
  visibility.mockReturnValue("hidden");
  start();
  visibility.mockReturnValue("visible");
  document.dispatchEvent(new Event("visibilitychange"));
  vi.advanceTimersByTime(5000);
  expect(root.dataset.homeIntro).toBe("visible");
  visibility.mockReturnValue("hidden");
  document.dispatchEvent(new Event("visibilitychange"));
  visibility.mockReturnValue("visible");
  document.dispatchEvent(new Event("visibilitychange"));
  expect(vi.getTimerCount()).toBe(0);
});

it("hiding an already presented intro reveals content and never replays it", () => {
  start();
  const visibility = vi.spyOn(document, "visibilityState", "get");
  visibility.mockReturnValue("hidden");
  document.dispatchEvent(new Event("visibilitychange"));
  expect(root.dataset.homeIntro).toBe("visible");
  expect(vi.getTimerCount()).toBe(0);
  visibility.mockReturnValue("visible");
  document.dispatchEvent(new Event("visibilitychange"));
  expect(vi.getTimerCount()).toBe(0);
});

it("failed or delayed hydration is bounded and never hides again", () => {
  start();
  vi.advanceTimersByTime(5000);
  expect(root.dataset.homeIntro).toBe("visible");
  const binding = bindHomeIntro(root);
  binding.logoState("running");
  expect(root.dataset.homeIntro).toBe("visible");
  binding.release();
});

it.each(["pending", "running", "completed"] as const)(
  "Off/failure after %s reveals the logo and content immediately",
  (state) => {
    start();
    const binding = bindHomeIntro(root);
    binding.logoState(state);
    binding.logoState("static");
    expect(root.dataset.homeIntro).toBe("visible");
    expect(vi.getTimerCount()).toBe(0);
    binding.release();
  },
);

it("Strict Mode reattachment keeps the handoff, detached cleanup cancels and stale bindings cannot touch a new mount", () => {
  start();
  const old = bindHomeIntro(root);
  old.release();
  expect(root.dataset.homeIntro).toBe("preparing");
  const next = bindHomeIntro(root);
  old.logoState("completed");
  expect(root.dataset.homeIntro).toBe("preparing");
  root.remove();
  next.release();
  expect(vi.getTimerCount()).toBe(0);
  expect(root.dataset.homeIntro).toBe("visible");
});

it("missing enhanced menu skips only its fade and retains ordinary content", () => {
  root.querySelector("[data-home-menu]")!.remove();
  start();
  const binding = bindHomeIntro(root);
  binding.logoState("completed");
  expect(root.dataset.homeIntro).toBe("fading");
  binding.release();
});

it.each(["menu", "fading"])(
  "interaction during %s reveals everything and ignores late animation events",
  (stage) => {
    start();
    const binding = bindHomeIntro(root);
    binding.logoState("completed");
    const menu = root.querySelector("[data-home-menu]")!;
    if (stage === "fading")
      menu.dispatchEvent(new Event("animationend", { bubbles: true }));
    expect(root.dataset.homeIntro).toBe(stage);
    window.dispatchEvent(new Event("pointerdown"));
    expect(root.dataset.homeIntro).toBe("visible");
    menu.dispatchEvent(new Event("animationend", { bubbles: true }));
    expect(root.dataset.homeIntro).toBe("visible");
    expect(vi.getTimerCount()).toBe(0);
    binding.release();
  },
);
