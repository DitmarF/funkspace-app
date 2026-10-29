import { afterEach, expect, it, vi } from "vitest";
import { BrowserMotionEnvironment } from "./BrowserMotionEnvironment";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it.each(["modern", "legacy"])(
  "M6: %s subscription precedes sample and cleanup ignores queued callbacks",
  (kind) => {
    let changed = () => {};
    let reduced = false;
    let attached = false;
    const add = vi.fn((...args: unknown[]) => {
      changed = args.at(-1) as () => void;
      attached = true;
      changed(); // Defensive: even a hostile add must not synchronously publish.
    });
    const remove = vi.fn();
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({
        get matches() {
          expect(attached).toBe(true);
          return reduced;
        },
        ...(kind === "modern"
          ? { addEventListener: add, removeEventListener: remove }
          : { addListener: add, removeListener: remove }),
      })),
    );
    const visibility = vi
      .spyOn(document, "visibilityState", "get")
      .mockReturnValue("visible");
    const removeDocument = vi.spyOn(document, "removeEventListener");
    const listener = vi.fn();
    const adapter = new BrowserMotionEnvironment();
    expect(add).not.toHaveBeenCalled();
    const binding = adapter.observe(listener);
    expect(binding.current).toEqual({
      systemMotion: "no-preference",
      documentVisible: true,
    });
    expect(listener).not.toHaveBeenCalled();
    reduced = true;
    changed();
    expect(listener).toHaveBeenLastCalledWith({
      systemMotion: "reduce",
      documentVisible: true,
    });
    visibility.mockReturnValue("hidden");
    document.dispatchEvent(new Event("visibilitychange"));
    expect(listener).toHaveBeenLastCalledWith({
      systemMotion: "reduce",
      documentVisible: false,
    });
    binding.unsubscribe();
    binding.unsubscribe();
    changed();
    document.dispatchEvent(new Event("visibilitychange"));
    expect(listener).toHaveBeenCalledTimes(2);
    expect(remove).toHaveBeenCalledTimes(1);
    expect(removeDocument).toHaveBeenCalledWith(
      "visibilitychange",
      expect.any(Function),
    );
  },
);

it.each(["absent", "query", "subscription", "read"])(
  "M1/M3: %s media failure is unavailable and rolls back partial attachment",
  (failure) => {
    const remove = vi.fn();
    vi.stubGlobal(
      "matchMedia",
      failure === "absent"
        ? undefined
        : () => {
            if (failure === "query") throw Error("denied");
            return {
              get matches() {
                if (failure === "read") throw Error("read");
                return false;
              },
              addEventListener() {
                if (failure === "subscription") throw Error("partial");
              },
              removeEventListener: remove,
            };
          },
    );
    const binding = new BrowserMotionEnvironment().observe(vi.fn());
    expect(binding.current.systemMotion).toBe("unavailable");
    if (failure === "subscription") expect(remove).toHaveBeenCalledTimes(1);
    binding.unsubscribe();
    if (failure === "subscription" || failure === "read")
      expect(remove).toHaveBeenCalledTimes(1);
  },
);

it.each(["read", "subscribe"])(
  "M3/M6: visibility %s failure stays hidden; all cleanups are attempted",
  (failure) => {
    const removeMedia = vi.fn(() => {
      throw Error("remove failed");
    });
    vi.stubGlobal("matchMedia", () => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: removeMedia,
    }));
    const removeDocument = vi.spyOn(document, "removeEventListener");
    if (failure === "read")
      vi.spyOn(document, "visibilityState", "get").mockImplementation(() => {
        throw Error("read");
      });
    else
      vi.spyOn(document, "addEventListener").mockImplementation(() => {
        throw Error("partial");
      });
    const binding = new BrowserMotionEnvironment().observe(vi.fn());
    expect(binding.current).toEqual({
      systemMotion: "no-preference",
      documentVisible: false,
    });
    binding.unsubscribe();
    expect(removeMedia).toHaveBeenCalledTimes(1);
    expect(removeDocument).toHaveBeenCalledWith(
      "visibilitychange",
      expect.any(Function),
    );
  },
);
