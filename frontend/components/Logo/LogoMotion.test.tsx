import { act, fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { createRef, StrictMode, useEffect } from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { LogoMotion, type LogoMotionRef } from "./LogoMotion";
import MotionSettings from "../Layouts/MotionSettings";
import { ServiceProvider } from "@/application/providers/ServiceProvider";
import { createServices } from "@/infrastructure/services/createServices";
import { MOTION_PREFERENCE_KEY } from "@/domain/motion/MotionPolicy";
import { AnimationTimeline } from "@/infrastructure/motion/timeline";
import { createTimeline } from "@funkspace/common/motion";

it("reports the renderer position through one clock, including seek and terminal cleanup", () => {
  localStorage.setItem(MOTION_PREFERENCE_KEY, "on");
  const services = createServices({ decorativeMotionAvailable: true });
  const factory = () => services;
  const ref = createRef<LogoMotionRef>();
  const first = vi.fn();
  const latest = vi.fn();
  const tree = (onPosition: (time: number, duration: number) => void) => (
    <ServiceProvider serviceFactory={factory}>
      <LogoMotion ref={ref} autoPlay={false} onPosition={onPosition} />
    </ServiceProvider>
  );
  const view = render(tree(first));
  visible();
  expect(first.mock.lastCall?.[0]).toBe(0);
  const duration = first.mock.lastCall![1];
  expect(duration).toBeGreaterThan(0);
  expect(frames.size).toBe(0);
  act(() => ref.current!.play());
  advance(100);
  expect(first).toHaveBeenLastCalledWith(100, duration);
  expect(frames.size).toBe(1);
  view.rerender(tree(latest));
  const previousCalls = first.mock.calls.length;
  advance(100);
  expect(first).toHaveBeenCalledTimes(previousCalls);
  expect(latest).toHaveBeenLastCalledWith(200, duration);
  act(() => {
    ref.current!.pause();
    ref.current!.seek(duration / 2);
  });
  expect(latest).toHaveBeenLastCalledWith(duration / 2, duration);
  expect(frames.size).toBe(0);
  act(() => ref.current!.play());
  const stale = [...frames.values()];
  view.unmount();
  const calls = latest.mock.calls.length;
  act(() => stale.forEach((callback) => callback(9999)));
  expect(latest).toHaveBeenCalledTimes(calls);
  expect(frames.size).toBe(0);
});

it.each(["on", "reduced", "system"] as const)(
  "%s cancelled automatic introduction survives Strict Mode and permits explicit playback",
  (preference) => {
    localStorage.setItem(MOTION_PREFERENCE_KEY, preference);
    const services = createServices({ decorativeMotionAvailable: true });
    const bind = vi.spyOn(services, "bindLogoMotion");
    const factory = () => services;
    const ref = createRef<LogoMotionRef>();
    function Page({ autoPlay = true }: { autoPlay?: boolean }) {
      useEffect(() => ref.current!.cancelIntroduction(), []);
      return <LogoMotion ref={ref} autoPlay={autoPlay} />;
    }
    const tree = (autoPlay: boolean) => (
      <StrictMode>
        <ServiceProvider serviceFactory={factory}>
          <Page autoPlay={autoPlay} />
        </ServiceProvider>
      </StrictMode>
    );
    const view = render(tree(true));
    visible();
    advance(100);
    complete(screen.getByRole("img"));
    expect(frames.size).toBe(0);
    view.rerender(tree(false));
    view.rerender(tree(true));
    visible(false);
    visible(true);
    act(() => services.themeService.setTheme("dark"));
    advance(10000);
    complete(screen.getByRole("img"));
    expect(frames.size).toBe(0);
    expect(services.motionPolicy.getSnapshot().preference).toBe(preference);
    act(() => ref.current!.play());
    expect(frames.size).toBe(1);
    advance(100);
    act(() => ref.current!.cancelIntroduction());
    complete(screen.getByRole("img"));
    expect(frames.size).toBe(0);
    act(() => {
      ref.current!.pause();
      ref.current!.seek(0);
      ref.current!.cancelIntroduction();
      services.motionPolicy.setPreference("off");
      services.motionPolicy.setPreference(preference);
    });
    visible(false);
    visible(true);
    complete(screen.getByRole("img"));
    expect(bind.mock.calls.at(-1)![2].paused).toBe(true);
    expect(frames.size).toBe(0);
    act(() => {
      // A changed variant may need preparation after Pause. Completed work
      // still requires an explicit seek before replay, as in the public API.
      ref.current!.play();
      ref.current!.seek(0);
      ref.current!.play();
    });
    expect(frames.size).toBe(1);
    view.unmount();
    expect(frames.size).toBe(0);
    expect(observers.size).toBe(0);
    // The retirement belongs to this mount, not the shared policy/provider.
    const next = render(
      <ServiceProvider
        serviceFactory={() =>
          createServices({ decorativeMotionAvailable: true })
        }
      >
        <LogoMotion />
      </ServiceProvider>,
    );
    visible();
    expect(frames.size).toBe(1);
    next.unmount();
  },
);

it.each([false, true])(
  "Reduced fades complete artwork for exactly the normal duration (device reduction=%s)",
  (deviceReduce) => {
    reduce = deviceReduce;
    localStorage.setItem(MOTION_PREFERENCE_KEY, "reduced");
    const services = createServices({ decorativeMotionAvailable: true });
    const build = vi.spyOn(
      services.animationService.getOrchestrator(),
      "buildLogoManifest",
    );
    const view = render(
      <StrictMode>
        <ServiceProvider serviceFactory={() => services}>
          <LogoMotion aria-label="Animated" />
          <LogoMotion enabled={false} aria-label="Static" />
        </ServiceProvider>
      </StrictMode>,
    );
    const svg = screen.getByRole("img", {
      name: "Animated",
    }) as unknown as SVGSVGElement;
    complete(svg);
    visible();
    const duration = createTimeline(
      build.mock.results.at(-1)!.value.steps,
    ).duration;
    expect(duration).toBeGreaterThan(0);
    expect(svg.style.opacity).toBe("0");
    expect(frames.size).toBe(1);
    advance(duration / 2);
    expect(Number(svg.style.opacity)).toBeCloseTo(0.5);
    for (const part of svg.querySelectorAll<SVGElement>("[data-logo-part]")) {
      expect(part.style.opacity).toBe("1");
      expect(part.style.fillOpacity).toBe("1");
      expect(part.style.strokeDasharray).toBe("none");
      expect(part.style.strokeDashoffset).toBe("0");
    }
    complete(screen.getByRole("img", { name: "Static" }));
    advance(duration / 2);
    complete(svg);
    expect(frames.size).toBe(0);
    visible(false);
    visible(true);
    act(() => {
      services.themeService.setTheme("dark");
      services.motionPolicy.setPreference("on");
    });
    expect(frames.size).toBe(0);
    view.unmount();
    expect(observers.size).toBe(0);
  },
);

it("Reduced retains the cursor on suspension, preserves Pause and permits explicit reverse playback", () => {
  localStorage.setItem(MOTION_PREFERENCE_KEY, "reduced");
  const services = createServices({ decorativeMotionAvailable: true });
  const ref = createRef<LogoMotionRef>();
  const view = render(
    <ServiceProvider serviceFactory={() => services}>
      <LogoMotion ref={ref} />
    </ServiceProvider>,
  );
  const svg = screen.getByRole("img") as unknown as SVGSVGElement;
  visible();
  advance(300);
  const opacity = Number(svg.style.opacity);
  expect(opacity).toBeGreaterThan(0);
  expect(opacity).toBeLessThan(1);
  visible(false);
  complete(svg);
  expect(frames.size).toBe(0);
  visible(true);
  expect(Number(svg.style.opacity)).toBeCloseTo(opacity);
  act(() => ref.current!.pause());
  complete(svg);
  visible(false);
  visible(true);
  act(() => services.themeService.setTheme("dark"));
  expect(frames.size).toBe(0);
  act(() => {
    ref.current!.seek(99999);
    ref.current!.reverse();
  });
  expect(frames.size).toBe(0);
  act(() => ref.current!.play());
  advance(300);
  expect(Number(svg.style.opacity)).toBeGreaterThan(0);
  expect(Number(svg.style.opacity)).toBeLessThan(1);
  advance(10000);
  complete(svg);
  expect(frames.size).toBe(0);
  act(() => {
    ref.current!.reverse();
    ref.current!.play();
  });
  advance(300);
  expect(Number(svg.style.opacity)).toBeLessThan(1);
  act(() => services.motionPolicy.setPreference("off"));
  complete(svg);
  act(() => {
    ref.current!.seek(0);
    ref.current!.reverse();
    ref.current!.play();
  });
  complete(svg);
  expect(frames.size).toBe(0);
  act(() => services.motionPolicy.setPreference("reduced"));
  complete(svg);
  expect(frames.size).toBe(0);
  view.unmount();
  expect(observers.size).toBe(0);
});

it.each([
  "pending",
  "flag",
  "unavailable",
  "prepare-failure",
  "frame-failure",
] as const)(
  "Reduced retains complete static artwork with %s",
  (restriction) => {
    localStorage.setItem(MOTION_PREFERENCE_KEY, "reduced");
    if (restriction === "unavailable") vi.stubGlobal("matchMedia", undefined);
    const services = createServices({
      decorativeMotionAvailable: restriction !== "flag",
    });
    if (restriction === "pending")
      services.motionPolicy.initialize = () => () => {};
    if (restriction === "prepare-failure")
      vi.spyOn(
        services.animationService.getOrchestrator(),
        "buildLogoManifest",
      ).mockImplementation(() => {
        throw Error("unavailable");
      });
    const ref = createRef<LogoMotionRef>();
    const view = render(
      <ServiceProvider serviceFactory={() => services}>
        <LogoMotion ref={ref} />
      </ServiceProvider>,
    );
    const svg = screen.getByRole("img");
    complete(svg);
    visible();
    if (restriction === "frame-failure") {
      vi.spyOn(AnimationTimeline.prototype, "update").mockImplementationOnce(
        () => {
          throw Error("failed frame");
        },
      );
      advance(100);
    }
    act(() => {
      ref.current!.play();
      ref.current!.seek(100);
      ref.current!.reverse();
    });
    complete(svg);
    expect(frames.size).toBe(0);
    view.unmount();
    expect(observers.size).toBe(0);
  },
);

it("Reduced may be selected before preparation without clearing Pause or duplicating the runtime", () => {
  const services = createServices({ decorativeMotionAvailable: true });
  const ref = createRef<LogoMotionRef>();
  const view = render(
    <ServiceProvider serviceFactory={() => services}>
      <LogoMotion ref={ref} autoPlay={false} />
    </ServiceProvider>,
  );
  visible();
  act(() => {
    ref.current!.pause();
    services.motionPolicy.setPreference("reduced");
  });
  complete(screen.getByRole("img"));
  expect(frames.size).toBe(0);
  act(() => ref.current!.play());
  advance(300);
  expect(
    Number((screen.getByRole("img") as unknown as SVGElement).style.opacity),
  ).toBeLessThan(1);
  expect(frames.size).toBe(1);
  const callbacks = [...frames.values()];
  const oldObservers = [...observers];
  view.unmount();
  act(() => {
    callbacks.forEach((callback) => callback(now + 100));
    oldObservers.forEach((observer) =>
      observer.callback([
        {
          target: observer.target,
          isIntersecting: true,
          intersectionRatio: 1,
        } as IntersectionObserverEntry,
      ]),
    );
  });
  expect(frames.size).toBe(0);
  expect(observers.size).toBe(0);
});

let now = 0;
let nextFrame = 0;
let frames: Map<number, FrameRequestCallback>;
let observers: Set<{
  target?: Element;
  callback: (entries: IntersectionObserverEntry[]) => void;
}>;
let media: Set<() => void>;
let reduce = false;

it.each(["on", "reduced"] as const)(
  "%s reports actual completion for the homepage without frame notifications",
  (preference) => {
    localStorage.setItem(MOTION_PREFERENCE_KEY, preference);
    const services = createServices({ decorativeMotionAvailable: true });
    const callback = vi.fn();
    const view = render(
      <ServiceProvider serviceFactory={() => services}>
        <LogoMotion onPlaybackState={callback} />
      </ServiceProvider>,
    );
    expect(callback).toHaveBeenLastCalledWith("pending");
    visible();
    expect(callback).toHaveBeenLastCalledWith("running");
    const count = callback.mock.calls.length;
    advance(200);
    expect(callback).toHaveBeenCalledTimes(count);
    advance(10000);
    expect(callback).toHaveBeenLastCalledWith("completed");
    act(() => services.motionPolicy.setPreference("off"));
    expect(callback).toHaveBeenLastCalledWith("static");
    view.unmount();
    const end = callback.mock.calls.length;
    advance(10000);
    expect(callback).toHaveBeenCalledTimes(end);
  },
);

it.each(["on", "reduced"] as const)(
  "%s keeps an unstarted background introduction pending until activation",
  (preference) => {
    localStorage.setItem(MOTION_PREFERENCE_KEY, preference);
    const visibility = vi.spyOn(document, "visibilityState", "get");
    visibility.mockReturnValue("hidden");
    const services = createServices({ decorativeMotionAvailable: true });
    const callback = vi.fn();
    const view = render(
      <ServiceProvider serviceFactory={() => services}>
        <LogoMotion onPlaybackState={callback} />
      </ServiceProvider>,
    );
    visible();
    expect(callback).toHaveBeenLastCalledWith("pending");
    expect(frames.size).toBe(0);
    visibility.mockReturnValue("visible");
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    expect(callback).toHaveBeenLastCalledWith("running");
    advance(10000);
    expect(callback).toHaveBeenLastCalledWith("completed");
    view.unmount();
  },
);

beforeEach(() => {
  localStorage.clear();
  now = 0;
  nextFrame = 0;
  reduce = false;
  frames = new Map();
  observers = new Set();
  media = new Set();
  vi.spyOn(performance, "now").mockImplementation(() => now);
  vi.stubGlobal(
    "requestAnimationFrame",
    vi.fn((callback: FrameRequestCallback) => {
      frames.set(++nextFrame, callback);
      return nextFrame;
    }),
  );
  vi.stubGlobal(
    "cancelAnimationFrame",
    vi.fn((id: number) => frames.delete(id)),
  );
  vi.stubGlobal("matchMedia", (query: string) => ({
    get matches() {
      return query.includes("reduced-motion") && reduce;
    },
    addEventListener: (_: string, callback: () => void) => {
      if (query.includes("reduced-motion")) media.add(callback);
    },
    removeEventListener: (_: string, callback: () => void) => {
      media.delete(callback);
    },
  }));
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      target?: Element;
      constructor(
        public callback: (entries: IntersectionObserverEntry[]) => void,
      ) {
        observers.add(this);
      }
      observe(target: Element) {
        this.target = target;
      }
      disconnect() {
        observers.delete(this);
      }
    },
  );
  vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
  Object.defineProperty(SVGElement.prototype, "getTotalLength", {
    configurable: true,
    value: () => 100,
  });
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  delete (SVGElement.prototype as unknown as { getTotalLength?: unknown })
    .getTotalLength;
});

function visible(value = true) {
  act(() =>
    observers.forEach((observer) =>
      observer.callback([
        {
          target: observer.target,
          isIntersecting: value,
          intersectionRatio: value ? 1 : 0,
        } as IntersectionObserverEntry,
      ]),
    ),
  );
}
function advance(ms: number) {
  act(() => {
    now += ms;
    const callbacks = [...frames.values()];
    frames.clear();
    callbacks.forEach((callback) => callback(now));
  });
}
function complete(svg: Element) {
  expect(
    (svg as SVGElement).style.opacity === "" ||
      (svg as SVGElement).style.opacity === "1",
  ).toBe(true);
  expect(svg.querySelectorAll("[data-logo-part]")).toHaveLength(19);
  for (const part of svg.querySelectorAll<SVGElement>("[data-logo-part]")) {
    expect(part.style.opacity === "" || part.style.opacity === "1").toBe(true);
    expect(
      part.style.fillOpacity === "" || part.style.fillOpacity === "1",
    ).toBe(true);
    expect(
      part.style.strokeDashoffset === "" || part.style.strokeDashoffset === "0",
    ).toBe(true);
  }
}

it("Reduced preserves reverse direction across an unprepared Off transition", () => {
  localStorage.setItem(MOTION_PREFERENCE_KEY, "reduced");
  const services = createServices({ decorativeMotionAvailable: true });
  const ref = createRef<LogoMotionRef>();
  const view = render(
    <ServiceProvider serviceFactory={() => services}>
      <LogoMotion ref={ref} autoPlay={false} />
    </ServiceProvider>,
  );
  visible();
  act(() => {
    ref.current!.seek(99999);
    ref.current!.reverse();
    ref.current!.play();
  });
  advance(200);
  act(() => {
    ref.current!.pause();
    services.motionPolicy.setPreference("off");
    services.motionPolicy.setPreference("reduced");
  });
  complete(screen.getByRole("img"));
  expect(frames.size).toBe(0);
  act(() => ref.current!.play()); // Explicit resume prepares, but does not replay consumed work.
  expect(frames.size).toBe(0);
  act(() => {
    ref.current!.seek(99999);
    ref.current!.play();
  });
  advance(200);
  const opacity = Number(
    (screen.getByRole("img") as unknown as SVGElement).style.opacity,
  );
  expect(opacity).toBeGreaterThan(0);
  expect(opacity).toBeLessThan(1);
  expect(frames.size).toBe(1);
  view.unmount();
  expect(frames.size).toBe(0);
});

it.each(["pending", "off", "os", "flag", "unavailable"] as const)(
  "L1: %s stays complete and imperative calls cannot bypass it",
  (restriction) => {
    if (restriction === "off")
      localStorage.setItem(MOTION_PREFERENCE_KEY, restriction);
    reduce = restriction === "os";
    if (restriction === "unavailable") vi.stubGlobal("matchMedia", undefined);
    const services = createServices({
      decorativeMotionAvailable: restriction !== "flag",
    });
    if (restriction === "pending")
      services.motionPolicy.initialize = () => () => {};
    const ref = createRef<LogoMotionRef>();
    const view = render(
      <ServiceProvider serviceFactory={() => services}>
        <LogoMotion ref={ref} enabled />
      </ServiceProvider>,
    );
    visible();
    act(() => {
      ref.current!.play();
      ref.current!.reverse();
      ref.current!.seek(100);
      ref.current!.setSpeed(2);
    });
    complete(screen.getByRole("img"));
    expect(frames.size).toBe(0);
    expect(ref.current!.isReady()).toBe(false);
    view.unmount();
    expect(observers.size).toBe(0);
  },
);

it("L1: SSR and delayed initialization/visibility are complete before any drawing", () => {
  const services = createServices({ decorativeMotionAvailable: true });
  const factory = () => services;
  const markup = renderToString(
    <ServiceProvider serviceFactory={factory}>
      <LogoMotion />
    </ServiceProvider>,
  );
  expect(markup).not.toContain("stroke-dashoffset");
  expect(observers.size).toBe(0);
  expect(frames.size).toBe(0);
  const initialize = services.motionPolicy.initialize.bind(
    services.motionPolicy,
  );
  services.motionPolicy.initialize = () => () => {};
  const view = render(
    <ServiceProvider serviceFactory={factory}>
      <LogoMotion />
    </ServiceProvider>,
  );
  visible();
  complete(screen.getByRole("img"));
  expect(frames.size).toBe(0);
  let release = () => {};
  act(() => {
    release = initialize();
  });
  expect(frames.size).toBe(1);
  view.unmount();
  release();
  expect(frames.size).toBe(0);
});

it.each(["off", "reduced"] as const)(
  "L1/L3: live %s mid-draw restores every part and consumes introduction",
  (preference) => {
    const services = createServices({ decorativeMotionAvailable: true });
    const ref = createRef<LogoMotionRef>();
    const view = render(
      <ServiceProvider serviceFactory={() => services}>
        <LogoMotion ref={ref} />
        <MotionSettings />
      </ServiceProvider>,
    );
    visible();
    advance(300);
    expect(frames.size).toBe(1);
    fireEvent.click(
      screen.getByRole("button", {
        name: preference === "off" ? "Off" : "Reduced",
      }),
    );
    if (preference === "off")
      act(() => {
        ref.current!.play();
        ref.current!.reverse();
        ref.current!.seek(100);
      });
    complete(screen.getByRole("img"));
    expect(frames.size).toBe(0);
    fireEvent.click(screen.getByRole("button", { name: "System" }));
    visible();
    expect(frames.size).toBe(0);
    complete(screen.getByRole("img"));
    act(() => ref.current!.play());
    expect(frames.size).toBe(0);
    act(() => {
      ref.current!.seek(0);
      ref.current!.play();
    });
    expect(frames.size).toBe(1);
    view.unmount();
    expect(frames.size).toBe(0);
  },
);

it("L2/L3: Pause survives visibility, preferences, theme and autoplay updates; explicit resume works before readiness", () => {
  const services = createServices({ decorativeMotionAvailable: true });
  const factory = () => services;
  const ref = createRef<LogoMotionRef>();
  const view = render(
    <ServiceProvider serviceFactory={factory}>
      <LogoMotion ref={ref} autoPlay={false} />
    </ServiceProvider>,
  );
  act(() => ref.current!.pause());
  visible();
  expect(ref.current!.isReady()).toBe(false);
  act(() => ref.current!.play());
  advance(200);
  expect(ref.current!.isReady()).toBe(true);
  act(() => ref.current!.pause());
  expect(frames.size).toBe(0);
  visible(false);
  visible(true);
  act(() => {
    services.themeService.setTheme("dark");
    services.motionPolicy.setPreference("off");
    services.motionPolicy.setPreference("system");
  });
  view.rerender(
    <ServiceProvider serviceFactory={factory}>
      <LogoMotion ref={ref} autoPlay />
    </ServiceProvider>,
  );
  expect(frames.size).toBe(0);
  act(() => ref.current!.seek(100)); // Scrub is permitted while paused, without resuming.
  expect(frames.size).toBe(0);
  act(() => {
    ref.current!.reverse();
    ref.current!.setSpeed(2);
  });
  expect(frames.size).toBe(0);
  act(() => ref.current!.play());
  expect(frames.size).toBe(1);
  advance(1000);
  expect(frames.size).toBe(0);
  view.unmount();
});

it("L3: unfinished work resumes from its cursor; completed work never restarts on theme/menu-like rerenders or visibility", () => {
  const services = createServices({ decorativeMotionAvailable: true });
  const factory = () => services;
  const view = render(
    <ServiceProvider serviceFactory={factory}>
      <LogoMotion />
    </ServiceProvider>,
  );
  visible();
  advance(300);
  const svg = screen.getByRole("img");
  const before = [...svg.querySelectorAll<SVGElement>("[data-logo-part]")].map(
    (part) => part.style.cssText,
  );
  visible(); // Repeated visible observations cannot rewind.
  expect(
    [...svg.querySelectorAll<SVGElement>("[data-logo-part]")].map(
      (part) => part.style.cssText,
    ),
  ).toEqual(before);
  visible(false);
  expect(frames.size).toBe(0);
  complete(svg);
  visible(true);
  expect(
    [...svg.querySelectorAll<SVGElement>("[data-logo-part]")].map(
      (part) => part.style.cssText,
    ),
  ).toEqual(before);
  advance(10000);
  expect(frames.size).toBe(0);
  complete(svg);
  for (const theme of [
    "default",
    "dark",
    "muted",
    "dark-high-contrast",
    "system",
  ] as const)
    act(() => services.themeService.setTheme(theme));
  view.rerender(
    <ServiceProvider serviceFactory={factory}>
      <LogoMotion className="menu-render" />
    </ServiceProvider>,
  );
  visible(false);
  visible(true);
  expect(frames.size).toBe(0);
  complete(svg);
  view.unmount();
  expect(observers.size).toBe(0);
});

it("L1/L2: actual manifest failures restore geometry; multiple copies have unique ids and one runtime", () => {
  const services = createServices({ decorativeMotionAvailable: true });
  const view = render(
    <StrictMode>
      <ServiceProvider serviceFactory={() => services}>
        <LogoMotion aria-label="Animated" />
        <LogoMotion enabled={false} aria-label="Static" />
      </ServiceProvider>
    </StrictMode>,
  );
  visible();
  expect(frames.size).toBe(1);
  complete(screen.getByRole("img", { name: "Static" }));
  const ids = [...view.container.querySelectorAll("[id]")].map(
    (node) => node.id,
  );
  expect(new Set(ids).size).toBe(ids.length);
  const queued = [...frames.values()];
  const observerCallbacks = [...observers];
  view.unmount();
  expect(frames.size).toBe(0);
  expect(observers.size).toBe(0);
  act(() => {
    queued.forEach((callback) => callback(now + 10));
    observerCallbacks.forEach((observer) =>
      observer.callback([
        {
          target: observer.target,
          isIntersecting: true,
          intersectionRatio: 1,
        } as IntersectionObserverEntry,
      ]),
    );
  });
  expect(frames.size).toBe(0);
});

it.each(["empty", "throw"] as const)(
  "L1: %s manifest is a complete static failure without retry",
  (failure) => {
    const services = createServices({ decorativeMotionAvailable: true });
    const build = vi
      .spyOn(services.animationService.getOrchestrator(), "buildLogoManifest")
      .mockImplementation(() => {
        if (failure === "throw") throw Error("failed");
        return { steps: [] };
      });
    const view = render(
      <ServiceProvider serviceFactory={() => services}>
        <LogoMotion />
      </ServiceProvider>,
    );
    visible();
    complete(screen.getByRole("img"));
    expect(frames.size).toBe(0);
    visible();
    act(() => services.motionPolicy.setPreference("off"));
    act(() => services.motionPolicy.setPreference("system"));
    expect(build).toHaveBeenCalledTimes(1);
    view.unmount();
  },
);

it.each(["reduced", "on"] as const)(
  "live %s settings survive restrictions and denied writes/reopening",
  (preference) => {
    localStorage.setItem(MOTION_PREFERENCE_KEY, "system");
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw Error("denied");
    });
    const services = createServices({ decorativeMotionAvailable: false });
    const factory = () => services;
    const view = render(
      <ServiceProvider serviceFactory={factory}>
        <MotionSettings />
      </ServiceProvider>,
    );
    const label = preference === "on" ? "On" : "Reduced";
    fireEvent.click(screen.getByRole("button", { name: label }));
    view.rerender(
      <ServiceProvider serviceFactory={factory}>
        <div />
      </ServiceProvider>,
    );
    view.rerender(
      <ServiceProvider serviceFactory={factory}>
        <MotionSettings />
      </ServiceProvider>,
    );
    expect(screen.getByRole("button", { name: label })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(services.motionPolicy.getSnapshot().preference).toBe(preference);
    expect(localStorage.getItem(MOTION_PREFERENCE_KEY)).toBe("system");
    view.unmount();
  },
);

it.each(["reduce", "unavailable"] as const)(
  "explicit On overrides device %s but preserves Pause and completed history",
  (device) => {
    reduce = device === "reduce";
    if (device === "unavailable") vi.stubGlobal("matchMedia", undefined);
    const services = createServices({ decorativeMotionAvailable: true });
    const ref = createRef<LogoMotionRef>();
    const view = render(
      <ServiceProvider serviceFactory={() => services}>
        <LogoMotion ref={ref} />
        <MotionSettings />
      </ServiceProvider>,
    );
    visible();
    complete(screen.getByRole("img"));
    expect(frames.size).toBe(0);
    act(() => ref.current!.pause());
    fireEvent.click(screen.getByRole("button", { name: "On" }));
    expect(screen.getByRole("button", { name: "On" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "regardless of your device",
    );
    complete(screen.getByRole("img"));
    expect(frames.size).toBe(0);
    act(() => ref.current!.play());
    expect(frames.size).toBe(1);
    advance(300);
    reduce = !reduce;
    act(() => media.forEach((callback) => callback()));
    expect(services.motionPolicy.getSnapshot().preference).toBe("on");
    expect(frames.size).toBe(1);
    advance(10000);
    complete(screen.getByRole("img"));
    expect(frames.size).toBe(0);
    fireEvent.click(screen.getByRole("button", { name: "Off" }));
    fireEvent.click(screen.getByRole("button", { name: "On" }));
    expect(frames.size).toBe(0);
    complete(screen.getByRole("img"));
    view.unmount();
    expect(observers.size).toBe(0);
  },
);

it("stored On cannot bypass the feature gate through autoplay or public methods", () => {
  localStorage.setItem(MOTION_PREFERENCE_KEY, "on");
  reduce = true;
  const services = createServices({ decorativeMotionAvailable: false });
  const ref = createRef<LogoMotionRef>();
  const view = render(
    <ServiceProvider serviceFactory={() => services}>
      <LogoMotion ref={ref} />
      <MotionSettings />
    </ServiceProvider>,
  );
  visible();
  act(() => {
    ref.current!.play();
    ref.current!.seek(300);
    ref.current!.reverse();
  });
  expect(screen.getByRole("button", { name: "On" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(screen.getByRole("status")).toHaveTextContent("currently unavailable");
  complete(screen.getByRole("img"));
  expect(frames.size).toBe(0);
  expect(ref.current!.isReady()).toBe(false);
  view.unmount();
});

it("L1/L2: prepared autoplay=false stays complete; initial position waits for permitted play", () => {
  const services = createServices({ decorativeMotionAvailable: true });
  const ref = createRef<LogoMotionRef>();
  const view = render(
    <ServiceProvider serviceFactory={() => services}>
      <LogoMotion ref={ref} autoPlay={false} startAtMs={99999} />
    </ServiceProvider>,
  );
  visible();
  expect(ref.current!.isReady()).toBe(true);
  complete(screen.getByRole("img"));
  expect(frames.size).toBe(0);
  act(() => ref.current!.play());
  complete(screen.getByRole("img"));
  expect(frames.size).toBe(0);
  act(() => {
    ref.current!.seek(0);
    ref.current!.play();
  });
  expect(frames.size).toBe(1);
  view.unmount();
});

it("L1: a runtime frame error restores complete artwork and cancels scheduling", () => {
  const services = createServices({ decorativeMotionAvailable: true });
  const view = render(
    <ServiceProvider serviceFactory={() => services}>
      <LogoMotion />
    </ServiceProvider>,
  );
  visible();
  vi.spyOn(AnimationTimeline.prototype, "update").mockImplementationOnce(() => {
    throw Error("frame failure");
  });
  advance(100);
  complete(screen.getByRole("img"));
  expect(frames.size).toBe(0);
  expect(observers.size).toBe(0);
  view.unmount();
});

it("L3: document suspension resumes unfinished work but an OS reduction consumes it without changing selected preference", () => {
  const services = createServices({ decorativeMotionAvailable: true });
  const view = render(
    <ServiceProvider serviceFactory={() => services}>
      <LogoMotion />
      <MotionSettings />
    </ServiceProvider>,
  );
  visible();
  advance(100);
  const visibility = vi.spyOn(document, "visibilityState", "get");
  visibility.mockReturnValue("hidden");
  act(() => document.dispatchEvent(new Event("visibilitychange")));
  expect(frames.size).toBe(0);
  complete(screen.getByRole("img"));
  visibility.mockReturnValue("visible");
  act(() => document.dispatchEvent(new Event("visibilitychange")));
  expect(frames.size).toBe(1);
  act(() => {
    reduce = true;
    media.forEach((callback) => callback());
  });
  expect(screen.getByRole("button", { name: "System" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  complete(screen.getByRole("img"));
  expect(frames.size).toBe(0);
  act(() => {
    reduce = false;
    media.forEach((callback) => callback());
  });
  expect(frames.size).toBe(0);
  view.unmount();
});

for (const direction of ["forward", "backward"] as const) {
  it(`L2/L3: reversing at the ${direction} endpoint while running retains one active frame chain`, () => {
    const services = createServices({ decorativeMotionAvailable: true });
    const ref = createRef<LogoMotionRef>();
    const view = render(
      <ServiceProvider serviceFactory={() => services}>
        <LogoMotion ref={ref} />
      </ServiceProvider>,
    );
    visible();
    advance(200);
    act(() => {
      if (direction === "backward") ref.current!.reverse();
      ref.current!.seek(direction === "forward" ? 99999 : 0);
      ref.current!.reverse();
    });
    expect(frames.size).toBe(1);
    visible();
    act(() => services.motionPolicy.setPreference("on"));
    expect(frames.size).toBe(1);
    advance(300);
    expect(
      [
        ...screen
          .getByRole("img")
          .querySelectorAll<SVGElement>("[data-logo-part]"),
      ].some((part) => part.style.fillOpacity !== "1"),
    ).toBe(true);
    advance(10000);
    complete(screen.getByRole("img"));
    expect(frames.size).toBe(0);
    view.unmount();
    expect(observers.size).toBe(0);
  });
  for (const arrival of ["seek", "playback"] as const) {
    it.each([false, true])(
      `L2/L3: reversing after ${direction} ${arrival} completion permits explicit playback without automatic replay (paused=%s)`,
      (paused) => {
        const services = createServices({ decorativeMotionAvailable: true });
        const factory = () => services;
        const ref = createRef<LogoMotionRef>();
        const view = render(
          <ServiceProvider serviceFactory={factory}>
            <LogoMotion ref={ref} autoPlay={false} />
          </ServiceProvider>,
        );
        visible();
        expect(ref.current!.isReady()).toBe(true);
        act(() => {
          if (direction === "backward") {
            ref.current!.reverse();
            ref.current!.seek(99999);
          }
          if (arrival === "seek")
            ref.current!.seek(direction === "forward" ? 99999 : 0);
          else ref.current!.play();
        });
        if (arrival === "playback") advance(10000);
        expect(frames.size).toBe(0);
        act(() => {
          if (paused) ref.current!.pause();
          ref.current!.reverse();
        });
        expect(frames.size).toBe(0);
        visible(false);
        visible(true);
        act(() => {
          services.themeService.setTheme("dark");
          services.motionPolicy.setPreference("on");
        });
        expect(frames.size).toBe(0);
        if (paused) {
          view.rerender(
            <ServiceProvider serviceFactory={factory}>
              <LogoMotion ref={ref} autoPlay />
            </ServiceProvider>,
          );
          expect(frames.size).toBe(0); // Reverse never clears explicit Pause.
        }
        act(() => ref.current!.play());
        expect(frames.size).toBe(1);
        advance(300);
        expect(
          [
            ...screen
              .getByRole("img")
              .querySelectorAll<SVGElement>("[data-logo-part]"),
          ].some((part) => part.style.fillOpacity !== "1"),
        ).toBe(true);
        advance(10000);
        expect(frames.size).toBe(0);
        complete(screen.getByRole("img"));
        visible(false);
        visible(true);
        expect(frames.size).toBe(0);
        view.unmount();
        expect(observers.size).toBe(0);
      },
    );
  }
}
