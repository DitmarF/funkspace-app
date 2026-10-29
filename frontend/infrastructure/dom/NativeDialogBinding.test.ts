import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { bindNativeDialog } from "./NativeDialogBinding";

function fixture() {
  document.body.innerHTML =
    '<button id="trigger">Open</button><h2 id="fallback" tabindex="-1">Fallback</h2><dialog><h2 tabindex="-1">Title</h2><input></dialog>';
  const dialog = document.querySelector("dialog")!;
  const trigger = document.getElementById("trigger")!;
  const fallback = document.getElementById("fallback")!;
  const title = dialog.querySelector("h2")!;
  const events: Array<() => void> = [];
  const show = vi.fn(() => dialog.setAttribute("open", ""));
  const close = vi.fn(() => {
    dialog.removeAttribute("open");
    events.push(() => dialog.dispatchEvent(new Event("close")));
  });
  Object.assign(dialog, { showModal: show, close });
  const options = {
    onCloseRequest: vi.fn(),
    initialFocus: () => null as HTMLElement | null,
    defaultFocus: () => title,
    returnFocus: () => null as HTMLElement | null,
    fallbackFocus: () => fallback,
  };
  trigger.focus();
  return {
    dialog,
    trigger,
    fallback,
    title,
    options,
    show,
    close,
    flush: () => {
      events.splice(0).forEach((event) => event());
    },
  };
}

beforeEach(() => {
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  vi.spyOn(HTMLElement.prototype, "getClientRects").mockImplementation(
    function (this: HTMLElement) {
      const rects = this.hidden ? [] : [new DOMRect(0, 0, 100, 40)];
      return Object.assign(rects, { item: (index: number) => rects[index] });
    },
  );
  const query = document.querySelector.bind(document);
  vi.spyOn(document, "querySelector").mockImplementation((selector: string) =>
    query(selector === "dialog:modal" ? "dialog[open]" : selector),
  );
});
afterEach(() => {
  document.body.innerHTML = "";
  document.body.removeAttribute("style");
  document.documentElement.removeAttribute("style");
  vi.restoreAllMocks();
});

describe("per-dialog native binding (platform fakes, not modality proof)", () => {
  it("deduplicates effects and intents; acknowledges controlled closure without echo", () => {
    const f = fixture();
    const binding = bindNativeDialog(f.dialog, f.options);
    binding.sync(true);
    binding.sync(true);
    expect(f.show).toHaveBeenCalledOnce();
    expect(document.activeElement).toBe(f.title);
    binding.requestClose();
    const cancel = new Event("cancel", { cancelable: true });
    f.dialog.dispatchEvent(cancel);
    expect(cancel.defaultPrevented).toBe(true);
    expect(f.options.onCloseRequest).toHaveBeenCalledExactlyOnceWith(
      "close-button",
    );
    expect(f.dialog.open).toBe(true);
    binding.sync(false);
    f.flush();
    expect(document.activeElement).toBe(f.trigger);
    expect(f.options.onCloseRequest).toHaveBeenCalledOnce();
    binding.destroy();
    binding.destroy();
    expect(f.close).toHaveBeenCalledOnce();
  });

  it("waits for false acknowledgment after native closure", () => {
    const f = fixture();
    const binding = bindNativeDialog(f.dialog, f.options);
    binding.sync(true);
    f.dialog.close();
    f.flush();
    expect(f.options.onCloseRequest).toHaveBeenCalledExactlyOnceWith(
      "native-close",
    );
    expect(document.body.style.position).toBe("");
    binding.sync(true);
    expect(f.show).toHaveBeenCalledOnce();
    binding.sync(false);
    binding.sync(true);
    expect(f.show).toHaveBeenCalledTimes(2);
    binding.destroy();
  });

  it("ignores old queued close events across rapid reopen and binding replacement", () => {
    const f = fixture();
    let binding = bindNativeDialog(f.dialog, f.options);
    binding.sync(true);
    binding.sync(false);
    binding.sync(true);
    f.flush();
    expect(f.dialog.open).toBe(true);
    expect(f.options.onCloseRequest).not.toHaveBeenCalled();
    binding.destroy();
    binding = bindNativeDialog(f.dialog, f.options);
    binding.sync(true);
    f.flush();
    expect(f.dialog.open).toBe(true);
    expect(f.options.onCloseRequest).not.toHaveBeenCalled();
    binding.destroy();
  });

  it("restores owned properties/priorities and scroll coordinates, preserving another writer", () => {
    const f = fixture();
    vi.spyOn(window, "scrollX", "get").mockReturnValue(12);
    vi.spyOn(window, "scrollY", "get").mockReturnValue(360);
    document.body.style.setProperty("position", "relative", "important");
    document.body.style.setProperty("width", "80%");
    document.body.style.setProperty("color", "red");
    document.documentElement.style.setProperty("overflow", "auto", "important");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const binding = bindNativeDialog(f.dialog, f.options);
    binding.sync(true);
    expect(document.body.style.top).toBe("-360px");
    document.body.style.setProperty("width", "90%");
    binding.destroy();
    expect(document.body.style.position).toBe("relative");
    expect(document.body.style.getPropertyPriority("position")).toBe(
      "important",
    );
    expect(document.body.style.width).toBe("90%");
    expect(document.body.style.color).toBe("red");
    expect(document.documentElement.style.overflow).toBe("auto");
    expect(document.documentElement.style.getPropertyPriority("overflow")).toBe(
      "important",
    );
    expect(window.scrollTo).toHaveBeenLastCalledWith({
      left: 12,
      top: 360,
      behavior: "instant",
    });
    expect(warn).toHaveBeenCalledWith(
      "[Dialog] Preserving externally changed width",
    );
  });

  it("rolls back a failed opening without leaving a lock", () => {
    const f = fixture();
    f.show.mockImplementation(() => {
      throw new Error("native failure");
    });
    const before = document.body.style.cssText;
    const binding = bindNativeDialog(f.dialog, f.options);
    expect(() => binding.sync(true)).toThrow("native failure");
    expect(document.body.style.cssText).toBe(before);
    expect(document.documentElement.style.overflow).toBe("");
    binding.destroy();
  });

  it("uses field initial focus, then explicit destination, or fallback for a removed trigger", () => {
    const f = fixture();
    const input = f.dialog.querySelector("input")!;
    f.options.initialFocus = () => input;
    const binding = bindNativeDialog(f.dialog, f.options);
    binding.sync(true);
    expect(document.activeElement).toBe(input);
    f.trigger.remove();
    binding.sync(false);
    expect(document.activeElement).toBe(f.fallback);
    f.options.returnFocus = () => f.fallback;
    binding.sync(true);
    binding.sync(false);
    expect(document.activeElement).toBe(f.fallback);
    binding.destroy();
  });

  it("rejects a competing modal before changing its lock", () => {
    const f = fixture();
    const other = document.createElement("dialog");
    other.open = true;
    document.body.append(other);
    const binding = bindNativeDialog(f.dialog, f.options);
    expect(() => binding.sync(true)).toThrow("no other modal");
    expect(document.body.style.position).toBe("");
    binding.destroy();
  });

  it("balances native listeners and resources over ten open/dispose cycles", () => {
    const f = fixture();
    const add = vi.spyOn(f.dialog, "addEventListener");
    const remove = vi.spyOn(f.dialog, "removeEventListener");
    for (let index = 0; index < 10; index++) {
      const binding = bindNativeDialog(f.dialog, f.options);
      binding.sync(true);
      binding.destroy();
      binding.destroy();
      f.flush();
      expect(f.dialog.open).toBe(false);
      expect(document.body.style.position).toBe("");
    }
    expect(add).toHaveBeenCalledTimes(20);
    expect(remove).toHaveBeenCalledTimes(20);
    for (const [index, call] of add.mock.calls.entries())
      expect(remove.mock.calls[index]).toEqual(call);
    expect(f.options.onCloseRequest).not.toHaveBeenCalled();
  });
});

it("suppresses every restoration path and releases overflow before acknowledging navigation", () => {
  const f = fixture();
  const returns = vi.fn(() => f.trigger);
  const fallback = vi.fn(() => f.fallback);
  const ack = vi.fn(() => {
    expect(document.body.style.overflow).toBe("");
    expect(document.documentElement.style.overflow).toBe("");
    expect(window.scrollTo).not.toHaveBeenCalled();
  });
  const binding = bindNativeDialog(f.dialog, {
    ...f.options,
    returnFocus: returns,
    fallbackFocus: fallback,
    scrollLock: "document-overflow",
    closeDisposition: () => "navigation",
    onReleased: ack,
  });
  binding.sync(true);
  expect(document.body.style.position).toBe("");
  expect(document.body.style.top).toBe("");
  binding.sync(false);
  binding.destroy();
  f.flush();
  expect(returns).not.toHaveBeenCalled();
  expect(fallback).not.toHaveBeenCalled();
  expect(ack).toHaveBeenCalledExactlyOnceWith("navigation");
});
it("reads late disposition and explicit teardown override, leaving newer locks intact", () => {
  const f = fixture();
  let mode: "dismiss" | "navigation" = "dismiss";
  const binding = bindNativeDialog(f.dialog, {
    ...f.options,
    closeDisposition: () => mode,
    scrollLock: "document-overflow",
  });
  binding.sync(true);
  mode = "navigation";
  binding.sync(false);
  expect(window.scrollTo).not.toHaveBeenCalled();
  mode = "dismiss";
  binding.sync(true);
  binding.destroy("navigation");
  expect(window.scrollTo).not.toHaveBeenCalled();
  const next = bindNativeDialog(f.dialog, {
    ...f.options,
    scrollLock: "document-overflow",
  });
  next.sync(true);
  binding.destroy();
  f.flush();
  expect(f.dialog.open).toBe(true);
  expect(document.body.style.overflow).toBe("hidden");
  next.destroy();
});
it.each(["hidden", "disabled", "inert"])(
  "dismissal skips a %s invoker and uses the logical fallback",
  (state) => {
    const f = fixture();
    const binding = bindNativeDialog(f.dialog, {
      ...f.options,
      returnFocus: () => f.trigger,
      scrollLock: "document-overflow",
    });
    binding.sync(true);
    f.trigger.setAttribute(state, "");
    binding.sync(false);
    expect(document.activeElement).toBe(f.fallback);
    binding.destroy();
  },
);
it("failed overflow opening rolls back without a successful release acknowledgment", () => {
  const f = fixture();
  const ack = vi.fn();
  f.show.mockImplementation(() => {
    throw Error("blocked");
  });
  const binding = bindNativeDialog(f.dialog, {
    ...f.options,
    scrollLock: "document-overflow",
    closeDisposition: () => "navigation",
    onReleased: ack,
  });
  expect(() => binding.sync(true)).toThrow("blocked");
  expect(document.body.style.overflow).toBe("");
  expect(window.scrollTo).toHaveBeenCalledOnce();
  binding.destroy();
  expect(ack).not.toHaveBeenCalled();
});

it("owns responsive anchor offsets per overflow cycle and removes resize work before release", () => {
  const f = fixture();
  const y = vi.spyOn(window, "scrollY", "get").mockReturnValue(300);
  const add = vi.spyOn(window, "addEventListener");
  const remove = vi.spyOn(window, "removeEventListener");
  const style = document.documentElement.style;
  style.setProperty("--dialog-page-scroll-y", "7px");
  const binding = bindNativeDialog(f.dialog, {
    ...f.options,
    scrollLock: "document-overflow",
  });
  for (let index = 0; index < 10; index++) {
    binding.sync(true);
    y.mockReturnValue(index * 20);
    window.dispatchEvent(new Event("resize"));
    expect(style.getPropertyValue("--dialog-page-scroll-y")).toBe(
      `${index * 20}px`,
    );
    binding.sync(false);
    expect(style.getPropertyValue("--dialog-page-scroll-y")).toBe("7px");
    window.dispatchEvent(new Event("resize"));
    expect(style.getPropertyValue("--dialog-page-scroll-y")).toBe("7px");
  }
  binding.destroy();
  const added = add.mock.calls.filter(([name]) => name === "resize");
  expect(added).toHaveLength(10);
  expect(remove.mock.calls.filter(([name]) => name === "resize")).toEqual(
    added,
  );
});
