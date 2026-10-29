import { StrictMode, useEffect } from "react";
import { render, act } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, expect, it, vi } from "vitest";
import {
  ServiceProvider,
  useServices,
  type ServiceContextValue,
} from "./ServiceProvider";
import { createMotionConsumerFixture } from "../motion/MotionPolicy.fixture";
import { MOTION_PREFERENCE_KEY } from "@/domain/motion/MotionPolicy";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  localStorage.clear();
});

function setupMedia() {
  const active = new Set<() => void>();
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: false,
    addEventListener: (_: string, callback: () => void) => {
      if (query.includes("reduced-motion")) active.add(callback);
    },
    removeEventListener: (_: string, callback: () => void) => {
      if (query.includes("reduced-motion")) active.delete(callback);
    },
  }));
  vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
  return active;
}

it("M1: server and first client render share a static snapshot without construction effects", () => {
  setupMedia();
  const storage = vi.spyOn(Storage.prototype, "getItem");
  const snapshots: unknown[] = [];
  function Reader() {
    const { motionPolicy } = useServices();
    snapshots.push(motionPolicy.getSnapshot());
    return <output>{motionPolicy.getSnapshot().status}</output>;
  }
  expect(
    renderToString(
      <ServiceProvider>
        <Reader />
      </ServiceProvider>,
    ),
  ).toContain("pending");
  expect(storage).not.toHaveBeenCalled();
  const view = render(
    <ServiceProvider>
      <Reader />
    </ServiceProvider>,
  );
  expect(snapshots[0]).toEqual(snapshots[1]);
  expect(snapshots[0]).toMatchObject({
    status: "pending",
    systemMotion: "unknown",
    documentVisible: false,
  });
  view.unmount();
});

it("M4/M5/M6: Strict Mode, two provider trees, consumer unmount, themes and terminal unmount", () => {
  const active = setupMedia();
  const services: ServiceContextValue[] = [];
  const fakes: ReturnType<typeof createMotionConsumerFixture>[] = [];
  function Reader({ id }: { id: number }) {
    const context = useServices();
    services[id] = context;
    useEffect(() => {
      const fixture = createMotionConsumerFixture(context.motionPolicy);
      fixture.changeInputs({ locallyPaused: true });
      fakes[id] = fixture;
      return fixture.unmount;
    }, [context, id]);
    return null;
  }
  function Trees({ show = true }: { show?: boolean }) {
    return (
      <StrictMode>
        <ServiceProvider>{show && <Reader id={0} />}</ServiceProvider>
        <ServiceProvider>
          <Reader id={1} />
        </ServiceProvider>
      </StrictMode>
    );
  }
  const view = render(<Trees />);
  expect(active.size).toBe(2);
  expect(services[0].motionPolicy).not.toBe(services[1].motionPolicy);
  act(() => {
    services[0].motionPolicy.setPreference("off");
    for (const theme of [
      "default",
      "dark",
      "muted",
      "dark-high-contrast",
      "system",
    ] as const)
      services[0].themeService.setTheme(theme);
  });
  expect(services[1].motionPolicy.getSnapshot().preference).toBe("system");
  expect(fakes[0].read().inputs.locallyPaused).toBe(true);
  expect(fakes[1].read().inputs.locallyPaused).toBe(true);
  view.rerender(<Trees show={false} />);
  expect(active.size).toBe(2);
  act(() => services[1].motionPolicy.setPreference("reduced"));
  expect(fakes[1].read().snapshot.preference).toBe("reduced");
  const callbacks = [...active];
  view.unmount();
  expect(active.size).toBe(0);
  const snapshot = services[1].motionPolicy.getSnapshot();
  callbacks.forEach((callback) => callback());
  expect(services[1].motionPolicy.getSnapshot()).toBe(snapshot);
  expect(snapshot.status).toBe("pending");
  expect(localStorage.getItem(MOTION_PREFERENCE_KEY)).toBe("reduced");
});

it("consumer context exposes no lifecycle capability at compile time", () => {
  type PublicKeys = keyof ServiceContextValue["motionPolicy"];
  const noLifecycle: Extract<PublicKeys, "initialize" | "dispose"> extends never
    ? true
    : false = true;
  expect(noLifecycle).toBe(true);
});

it.each(["setup", "cleanup"])(
  "M6: %s failure releases motion, navigation and theme while propagating the original error",
  (phase) => {
    const active = setupMedia();
    const error = Error("motion subscriber failed");
    let cancel = vi.fn();
    let destroy = vi.fn();
    let armed = false;
    function FaultyConsumer() {
      const services = useServices();
      useEffect(() => {
        cancel = vi.spyOn(services.navigationHandoff, "cancel");
        destroy = vi.spyOn(services.themeService, "destroy");
        return services.motionPolicy.subscribe((snapshot) => {
          if (snapshot.status === "ready") {
            armed = true;
            if (phase === "setup") throw error;
          }
          if (phase === "cleanup" && armed && snapshot.status === "pending")
            throw error;
        });
      }, [services]);
      return null;
    }
    // React reports the intentionally propagated exception as well as throwing it.
    vi.spyOn(console, "error").mockImplementation(() => {});
    if (phase === "setup") {
      expect(() =>
        render(
          <ServiceProvider>
            <FaultyConsumer />
          </ServiceProvider>,
        ),
      ).toThrow(error);
    } else {
      const view = render(
        <ServiceProvider>
          <FaultyConsumer />
        </ServiceProvider>,
      );
      expect(() => view.unmount()).toThrow(error);
    }
    expect(active.size).toBe(0);
    expect(cancel).toHaveBeenCalledTimes(1);
    expect(destroy).toHaveBeenCalledTimes(1);
  },
);
