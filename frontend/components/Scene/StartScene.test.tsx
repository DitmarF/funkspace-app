import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { ParticleSceneController } from "@/application/animations/ParticleSceneController";
import type { MotionSnapshot } from "@/domain/motion/MotionPolicy";
import type {
  ParticleSceneBinding,
  ParticleSceneOptions,
  ParticleRuntimeEvents,
  ParticleSurface,
} from "@/domain/ports/ParticleScenePort";
import { ScenePresentationContext } from "../Layouts/ScenePresentationContext";
import StartScene from "./StartScene";
import { StrictMode } from "react";

const dependencies = vi.hoisted(() => ({ services: {} }));
vi.mock("@/application/providers/ServiceProvider", () => ({
  useServices: () => dependencies.services,
}));
let snapshot: MotionSnapshot;
let available: boolean;
let failed: boolean;
let maskReady: boolean;
const listeners = new Set<(s: MotionSnapshot) => void>();
const runtime = {
  update: vi.fn(),
  pause: vi.fn(),
  resume: vi.fn(),
  reset: vi.fn(),
  destroy: vi.fn(),
  setGeometry: vi.fn(),
  setPalette: vi.fn(),
  setVisible: vi.fn(),
  invalidate: vi.fn(),
};
let binding: ParticleSceneBinding;
let bind: ReturnType<typeof vi.fn>;
beforeEach(() => {
  vi.clearAllMocks();
  available = true;
  failed = false;
  maskReady = true;
  snapshot = {
    status: "ready",
    preference: "on",
    systemMotion: "reduce",
    documentVisible: true,
  };
  const surface = {
    width: 640,
    height: 360,
    dpr: 1,
    visible: true,
    palette: { background: "white", particle: "black" },
  };
  binding = {
    getSnapshot: () => surface,
    subscribe: (cb) => {
      cb(surface);
      return vi.fn();
    },
    destroy: vi.fn(),
    prepare: vi.fn(async (_state, _current, events) => {
      if (failed) throw new Error("No context");
      events.frameReady(true);
      return runtime;
    }),
  };
  bind = vi.fn((_host: HTMLElement, options: ParticleSceneOptions) => {
    const controller = new ParticleSceneController(
      {
        getSnapshot: () => snapshot,
        setPreference: vi.fn(),
        subscribe: (cb) => {
          listeners.add(cb);
          cb(snapshot);
          return () => {
            listeners.delete(cb);
          };
        },
      },
      available,
      () => binding,
      options,
    );
    controller.initialize();
    return controller;
  });
  dependencies.services = {
    bindParticleScene: bind,
    apertureAssets: {
      checkMask: (cb: (ready: boolean) => void) => {
        cb(maskReady);
        return vi.fn();
      },
      load: () => vi.fn(),
    },
  };
});
afterEach(() => {
  cleanup();
  expect(listeners.size).toBe(0);
  listeners.clear();
});
const change = (patch: Partial<MotionSnapshot>) =>
  act(() => {
    snapshot = { ...snapshot, ...patch };
    listeners.forEach((cb) => cb(snapshot));
  });

it.each([
  ["system", "no-preference", true],
  ["system", "reduce", false],
  ["system", "unknown", false],
  ["system", "unavailable", false],
  ["on", "reduce", true],
  ["on", "unknown", true],
  ["on", "unavailable", true],
  ["reduced", "no-preference", true],
  ["reduced", "reduce", true],
  ["reduced", "unknown", false],
  ["reduced", "unavailable", false],
  ["off", "no-preference", false],
] as const)(
  "actual Start consumer: %s / %s prepares=%s",
  async (preference, systemMotion, prepares) => {
    snapshot = { ...snapshot, preference, systemMotion };
    const view = render(<StartScene />);
    await act(async () => {});
    expect(binding.prepare).toHaveBeenCalledTimes(prepares ? 1 : 0);
    expect(
      view.container.querySelectorAll(
        "[data-start-scene] line, [data-start-scene] circle",
      ),
    ).toHaveLength(0);
    expect(
      view.container.querySelectorAll("[data-aperture-fallback] path"),
    ).toHaveLength(prepares ? 0 : 1);
    expect(
      screen
        .getByRole("button", { name: "Pause animation" })
        .closest('[aria-hidden="true"]'),
    ).toBeNull();
    if (!prepares) expect(screen.getByRole("button")).toBeDisabled();
  },
);

it.each(["pending", "flag", "document", "intro", "cover", "occluded"])(
  "On cannot override %s",
  async (blocker) => {
    if (blocker === "pending") snapshot = { ...snapshot, status: "pending" };
    if (blocker === "flag") available = false;
    if (blocker === "document")
      snapshot = { ...snapshot, documentVisible: false };
    if (blocker === "cover") maskReady = false;
    render(
      <ScenePresentationContext.Provider
        value={{
          introReady: blocker !== "intro",
          occluded: blocker === "occluded",
        }}
      >
        <StartScene />
      </ScenePresentationContext.Provider>,
    );
    await act(async () => {});
    expect(binding.prepare).not.toHaveBeenCalled();
    expect(screen.getByRole("button")).toBeDisabled();
  },
);

it("retains local Pause through every policy/environment gate without replacing the owner", async () => {
  const view = (introReady = true, occluded = false) => (
    <ScenePresentationContext.Provider value={{ introReady, occluded }}>
      <StartScene />
    </ScenePresentationContext.Provider>
  );
  const mounted = render(view());
  await waitFor(() =>
    expect(screen.getByRole("status")).toHaveTextContent("playing"),
  );
  fireEvent.click(screen.getByRole("button", { name: "Pause animation" }));
  runtime.resume.mockClear();
  for (const preference of ["off", "reduced", "system", "on"] as const)
    change({ preference });
  change({ documentVisible: false });
  change({ documentVisible: true });
  mounted.rerender(view(false));
  mounted.rerender(view(true, true));
  mounted.rerender(view());
  expect(
    screen.getByRole("button", { name: "Resume animation" }),
  ).toBeEnabled();
  expect(runtime.resume).not.toHaveBeenCalled();
  expect(bind).toHaveBeenCalledTimes(1);
  expect(runtime.reset).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Resume animation" }));
  expect(runtime.resume).toHaveBeenCalled();
  mounted.unmount();
  expect(runtime.destroy).toHaveBeenCalledTimes(1);
});

it("failed preparation keeps complete static artwork and does not retry", async () => {
  failed = true;
  const { container } = render(<StartScene />);
  await waitFor(() =>
    expect(screen.getByRole("status")).toHaveTextContent("unavailable"),
  );
  change({ preference: "off" });
  change({ preference: "on" });
  expect(binding.prepare).toHaveBeenCalledTimes(1);
  expect(
    container.querySelector("[data-aperture-fallback] path"),
  ).toBeInTheDocument();
  expect(screen.getByRole("button")).toBeDisabled();
});

it.each(["on", "reduced"] as const)(
  "%s shows solid WEB for a rejected palette and recovers without replay or losing Pause",
  async (preference) => {
    snapshot = { ...snapshot, preference };
    const valid = binding.getSnapshot();
    let surface: ParticleSurface = { ...valid, palette: null };
    let notify: ((value: ParticleSurface) => void) | undefined;
    binding.getSnapshot = () => surface;
    binding.subscribe = (cb) => {
      notify = cb;
      cb(surface);
      return () => {
        notify = undefined;
      };
    };
    const view = render(<StartScene />);
    await act(async () => {});
    const scene = view.container.querySelector("[data-start-scene]");
    expect(binding.prepare).not.toHaveBeenCalled();
    expect(scene).toHaveAttribute("data-scene-reveal", "static");
    expect(
      view.container.querySelector("[data-aperture-fallback] path"),
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Scene colors are unavailable",
    );
    expect(screen.getByRole("button")).toBeDisabled();
    act(() => {
      surface = valid;
      notify!(surface);
    });
    await waitFor(() => expect(binding.prepare).toHaveBeenCalledTimes(1));
    expect(view.container.querySelector("[data-aperture-fallback]")).toBeNull();
    expect(scene).toHaveAttribute("data-scene-reveal", "static");
    if (preference === "reduced") expect(runtime.resume).not.toHaveBeenCalled();
    const controller = bind.mock.results[0].value as ParticleSceneController;
    act(() => controller.pause());
    runtime.resume.mockClear();
    act(() => {
      surface = { ...valid, palette: null };
      notify!(surface);
    });
    expect(
      view.container.querySelector("[data-aperture-fallback] path"),
    ).toBeInTheDocument();
    act(() => {
      surface = valid;
      notify!(surface);
    });
    expect(
      screen.getByRole("button", { name: "Resume animation" }),
    ).toBeInTheDocument();
    expect(runtime.resume).not.toHaveBeenCalled();
    expect(runtime.reset).not.toHaveBeenCalled();
    expect(binding.prepare).toHaveBeenCalledTimes(1);
    expect(view.container.querySelector("[data-aperture-fallback]")).toBeNull();
    expect(scene).toHaveAttribute("data-scene-reveal", "static");
  },
);

it("conceals the startup artwork until the first valid Canvas frame and reveals once", async () => {
  let events: ParticleRuntimeEvents | undefined;
  binding.prepare = vi.fn(async (_state, _current, next) => {
    events = next;
    return runtime;
  });
  const view = render(<StartScene />);
  await waitFor(() => expect(runtime.resume).toHaveBeenCalled());
  expect(view.container.querySelector("[data-start-scene]")).toHaveAttribute(
    "data-scene-reveal",
    "waiting",
  );
  expect(
    view.container.querySelector("[data-aperture-fallback] path"),
  ).toBeInTheDocument();
  act(() => events!.frameReady(true));
  expect(view.container.querySelector("[data-start-scene]")).toHaveAttribute(
    "data-scene-reveal",
    "fade",
  );
  expect(view.container.querySelector("[data-aperture-fallback]")).toBeNull();
  act(() => events!.failed(new Error("draw failed")));
  expect(
    view.container.querySelector("[data-aperture-fallback] path"),
  ).toBeInTheDocument();
  expect(runtime.destroy).toHaveBeenCalledTimes(1);
  expect(view.container.querySelector("[data-start-scene]")).toHaveAttribute(
    "data-scene-reveal",
    "static",
  );
});

it("finishes an in-flight reveal under Reduced and does not replay when On returns", async () => {
  const view = render(<StartScene />);
  await waitFor(() =>
    expect(view.container.querySelector("[data-start-scene]")).toHaveAttribute(
      "data-scene-reveal",
      "fade",
    ),
  );
  change({ preference: "reduced" });
  expect(view.container.querySelector("[data-start-scene]")).toHaveAttribute(
    "data-scene-reveal",
    "static",
  );
  change({ preference: "on" });
  expect(view.container.querySelector("[data-start-scene]")).toHaveAttribute(
    "data-scene-reveal",
    "static",
  );
});

it("Reduced displays the still Canvas without a fade or an enabled motion override", async () => {
  snapshot = { ...snapshot, preference: "reduced" };
  const view = render(<StartScene />);
  await waitFor(() => expect(binding.prepare).toHaveBeenCalledTimes(1));
  expect(runtime.resume).not.toHaveBeenCalled();
  expect(runtime.setVisible).toHaveBeenLastCalledWith(true);
  expect(screen.getByRole("status")).toHaveTextContent(
    "Reduced motion is selected",
  );
  expect(screen.getByRole("button")).toBeDisabled();
  expect(view.container.querySelector("[data-aperture-fallback]")).toBeNull();
  expect(view.container.querySelector("[data-start-scene]")).toHaveAttribute(
    "data-scene-reveal",
    "static",
  );
});

it("does not latch the unknown-System fallback while policy is still pending", async () => {
  snapshot = {
    ...snapshot,
    status: "pending",
    preference: "system",
    systemMotion: "unknown",
  };
  const view = render(<StartScene />);
  expect(view.container.querySelector("[data-start-scene]")).toHaveAttribute(
    "data-scene-reveal",
    "waiting",
  );
  change({ status: "ready", systemMotion: "no-preference" });
  await waitFor(() =>
    expect(view.container.querySelector("[data-start-scene]")).toHaveAttribute(
      "data-scene-reveal",
      "fade",
    ),
  );
});

it("holds the ready frame and uses solid WEB under restrictions without requesting particle previews", async () => {
  const view = (occluded: boolean) => (
    <ScenePresentationContext.Provider value={{ introReady: true, occluded }}>
      <StartScene />
    </ScenePresentationContext.Provider>
  );
  const mounted = render(view(false));
  await waitFor(() =>
    expect(screen.getByRole("status")).toHaveTextContent("playing"),
  );
  const controller = bind.mock.results[0].value as ParticleSceneController;
  const reads = vi.spyOn(controller, "getStill");
  fireEvent.click(screen.getByRole("button", { name: "Pause animation" }));
  expect(
    mounted.container.querySelector("[data-aperture-fallback]"),
  ).toBeNull();
  act(() => controller.configure({ size: 2 }));
  mounted.rerender(view(true));
  change({ preference: "off" });
  expect(reads).not.toHaveBeenCalled();
  mounted.rerender(view(false));
  expect(reads).not.toHaveBeenCalled();
  expect(
    mounted.container.querySelectorAll("[data-aperture-fallback] path"),
  ).toHaveLength(1);
  expect(
    mounted.container.querySelectorAll(
      "[data-start-scene] line, [data-start-scene] circle",
    ),
  ).toHaveLength(0);
  change({ preference: "on" });
  expect(
    mounted.container.querySelector("[data-aperture-fallback]"),
  ).toBeNull();
  expect(
    screen.getByRole("button", { name: "Resume animation" }),
  ).toBeEnabled();
  expect(runtime.destroy).not.toHaveBeenCalled();
  expect(bind).toHaveBeenCalledTimes(1);
});

it("Strict Mode mount/cleanup/mount retires the first owner before preparation", async () => {
  const view = render(
    <StrictMode>
      <StartScene />
    </StrictMode>,
  );
  await waitFor(() =>
    expect(screen.getByRole("status")).toHaveTextContent("playing"),
  );
  expect(bind).toHaveBeenCalledTimes(2);
  expect(binding.prepare).toHaveBeenCalledTimes(1);
  expect(binding.destroy).toHaveBeenCalledTimes(1);
  view.unmount();
  expect(binding.destroy).toHaveBeenCalledTimes(2);
  expect(runtime.destroy).toHaveBeenCalledTimes(1);
});
