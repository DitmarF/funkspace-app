import { afterEach, expect, it, vi } from "vitest";
import { createPortfolioNavigationHandoff } from "./PortfolioNavigationHandoff";

const cleanups: (() => void)[] = [];
function setup() {
  document.body.innerHTML =
    '<details><summary>Navigation</summary><a href="/about">About</a></details><button>Outside</button>';
  const disclosure = document.querySelector("details")!;
  const summary = document.querySelector("summary")!;
  const link = document.querySelector("a")!;
  const outside = document.querySelector("button")!;
  const handoff = createPortfolioNavigationHandoff();
  const notify = vi.fn();
  const observe = () => {
    const stop = handoff.whenFallbackIdle(disclosure, notify);
    cleanups.push(stop);
    return stop;
  };
  const toggle = (open: boolean) => {
    disclosure.open = open;
    disclosure.dispatchEvent(new Event("toggle"));
  };
  return { disclosure, summary, link, outside, notify, observe, toggle };
}
afterEach(() => {
  cleanups.splice(0).forEach((stop) => stop());
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

it("notifies once after setup for an untouched disclosure and removes its listeners", async () => {
  const { disclosure, notify, observe, toggle } = setup();
  const remove = vi.spyOn(disclosure, "removeEventListener");
  observe();
  expect(notify).not.toHaveBeenCalled();
  await Promise.resolve();
  expect(notify).toHaveBeenCalledOnce();
  expect(remove).toHaveBeenCalledWith("toggle", expect.any(Function));
  expect(remove).toHaveBeenCalledWith("focusout", expect.any(Function));
  toggle(true);
  toggle(false);
  await Promise.resolve();
  expect(notify).toHaveBeenCalledOnce();
});

it.each(["summary", "link"] as const)(
  "retains open state and %s focus until closed and unfocused",
  async (active) => {
    const fixture = setup();
    const { disclosure, summary, outside, notify, observe, toggle } = fixture;
    toggle(true);
    fixture[active].focus();
    observe();
    await Promise.resolve();
    expect(notify).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(fixture[active]);
    outside.focus();
    await Promise.resolve();
    expect(notify).not.toHaveBeenCalled();
    summary.focus();
    toggle(false);
    await Promise.resolve();
    expect(notify).not.toHaveBeenCalled();
    expect(disclosure.open).toBe(false);
    expect(document.activeElement).toBe(summary);
    outside.focus();
    await Promise.resolve();
    expect(notify).toHaveBeenCalledOnce();
    expect(document.activeElement).toBe(outside);
  },
);

it("does not replace a closed but focused summary", async () => {
  const { summary, outside, notify, observe } = setup();
  summary.focus();
  observe();
  await Promise.resolve();
  expect(notify).not.toHaveBeenCalled();
  outside.focus();
  await Promise.resolve();
  expect(notify).toHaveBeenCalledOnce();
});

it("rechecks new focus and rapid reopening before queued work", async () => {
  const { summary, outside, notify, observe, toggle } = setup();
  observe();
  summary.focus();
  await Promise.resolve();
  expect(notify).not.toHaveBeenCalled();
  outside.focus();
  toggle(true);
  await Promise.resolve();
  expect(notify).not.toHaveBeenCalled();
  toggle(false);
  toggle(true);
  await Promise.resolve();
  expect(notify).not.toHaveBeenCalled();
  toggle(false);
  await Promise.resolve();
  expect(notify).toHaveBeenCalledOnce();
});

it("cancels queued work on cleanup and tolerates Strict Mode setup/cleanup/setup", async () => {
  const { notify, observe } = setup();
  const stop = observe();
  stop();
  stop();
  await Promise.resolve();
  expect(notify).not.toHaveBeenCalled();
  observe();
  await Promise.resolve();
  expect(notify).toHaveBeenCalledOnce();
});

it("ignores a detached old disclosure", async () => {
  const { disclosure, notify, observe } = setup();
  observe();
  disclosure.remove();
  await Promise.resolve();
  expect(notify).not.toHaveBeenCalled();
});
