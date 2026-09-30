import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import {
  configureParticles,
  createParticleScene,
  getParticleStill,
} from "@/domain/particles/ParticleScene";
import type {
  ParticleSceneHandle,
  ParticleSceneSnapshot,
} from "@/domain/ports/ParticleScenePort";
import type { MotionSnapshot } from "@/domain/motion/MotionPolicy";
import ParticleLifecycleFixture from "./ParticleLifecycleFixture";
import ParticleStill from "./ParticleStill";

const dependencies = vi.hoisted(() => ({ services: {} }));
vi.mock("@/application/providers/ServiceProvider", () => ({
  useServices: () => dependencies.services,
}));

function sceneDouble() {
  const state = createParticleScene({ width: 640, height: 360 });
  let snapshot: ParticleSceneSnapshot = {
    status: "ready",
    config: state.config,
    locallyPaused: false,
    reducedMotion: false,
    paletteUnavailable: false,
    frameReady: true,
    presentation: "motion-permitted",
    blockers: [],
  };
  const listeners = new Set<(value: ParticleSceneSnapshot) => void>();
  const publish = (patch: Partial<ParticleSceneSnapshot>) => {
    snapshot = { ...snapshot, ...patch };
    listeners.forEach((listener) => listener(snapshot));
  };
  const release = vi.fn();
  const scene = {
    getSnapshot: () => snapshot,
    getStill: vi.fn(() => getParticleStill(state)),
    subscribe: (listener: (value: ParticleSceneSnapshot) => void) => {
      listeners.add(listener);
      listener(snapshot);
      return () => {
        listeners.delete(listener);
        release();
      };
    },
    setPresentation: vi.fn(),
    configure: vi.fn((input: unknown) => {
      configureParticles(state, input);
      publish({ config: state.config });
      return state.config;
    }),
    pause: vi.fn(() => publish({ locallyPaused: true })),
    resume: vi.fn(() => publish({ locallyPaused: false })),
    reset: vi.fn(),
    destroy: vi.fn(),
  } satisfies ParticleSceneHandle;
  return { scene, publish, listeners, release };
}

let scenes: ReturnType<typeof sceneDouble>[];
let bind: ReturnType<typeof vi.fn>;
const motionListeners = new Set<(value: MotionSnapshot) => void>();
const setPreference = vi.fn();
const setTheme = vi.fn();
beforeEach(() => {
  vi.clearAllMocks();
  scenes = [];
  bind = vi.fn(() => {
    const entry = sceneDouble();
    scenes.push(entry);
    return entry.scene;
  });
  dependencies.services = {
    bindParticleScene: bind,
    motionPolicy: {
      setPreference,
      subscribe: (listener: (value: MotionSnapshot) => void) => {
        motionListeners.add(listener);
        listener({
          status: "ready",
          preference: "system",
          systemMotion: "no-preference",
          documentVisible: true,
        });
        return () => motionListeners.delete(listener);
      },
    },
    themeService: { subscribe: () => vi.fn(), setTheme },
    apertureAssets: {
      checkMask: (ready: (value: boolean) => void) => {
        ready(true);
        return vi.fn();
      },
      load: () => vi.fn(),
    },
  };
});
afterEach(() => {
  cleanup();
  expect(motionListeners.size).toBe(0);
  for (const entry of scenes) expect(entry.listeners.size).toBe(0);
});
const click = (name: string) =>
  fireEvent.click(screen.getByRole("button", { name }));

it("starts only on request, delegates controls and releases each mounted handle", () => {
  const view = render(<ParticleLifecycleFixture />);
  const still = view.container.querySelector("[data-particle-static]");
  expect(bind).not.toHaveBeenCalled();
  expect(screen.getByRole("button", { name: "Pause scene" })).toBeDisabled();
  expect(screen.getByRole("slider", { name: "Particle count" })).toBeDisabled();
  expect(still).toHaveStyle({ visibility: "visible" });
  click("Start scene");
  const { scene, release } = scenes[0];
  expect(bind).toHaveBeenCalledWith(expect.any(HTMLElement), {
    optedIn: true,
    presentation: { introReady: true, coverReady: true, occluded: false },
  });
  expect(still).toHaveStyle({ visibility: "hidden" });
  // This test covers control delegation, not maximum SVG throughput. Production
  // extrema have their own browser checks; keep this diagnostic DOM sample small.
  fireEvent.change(screen.getByRole("slider", { name: "Particle count" }), {
    target: { value: "10" },
  });
  expect(scene.configure).toHaveBeenCalledWith({ count: 10 });
  expect(screen.getByRole("status")).toHaveTextContent("10 particles");
  click("Pause scene");
  click("Reset seeded state");
  expect(scene.reset).toHaveBeenCalledOnce();
  expect(screen.getByRole("button", { name: "Resume scene" })).toBeEnabled();
  expect(scene.resume).not.toHaveBeenCalled();
  click("Resume scene");
  expect(scene.resume).toHaveBeenCalledOnce();
  click("Destroy scene");
  expect(release).toHaveBeenCalledOnce();
  expect(scene.destroy).toHaveBeenCalledOnce();
  expect(still).toHaveStyle({ visibility: "visible" });
  click("Start scene");
  expect(bind).toHaveBeenCalledTimes(2);
  view.unmount();
  expect(scenes[1].scene.destroy).toHaveBeenCalledOnce();
  expect(scenes[1].release).toHaveBeenCalledOnce();
});

it("changes aperture, frame and shared choices without replacing the scene", () => {
  const view = render(<ParticleLifecycleFixture aperture />);
  click("Start scene");
  const { scene } = scenes[0];
  expect(scene.setPresentation).toHaveBeenLastCalledWith({
    introReady: true,
    coverReady: true,
    occluded: false,
  });
  fireEvent.change(screen.getByLabelText("Aperture"), {
    target: { value: "technical-diamond" },
  });
  for (const size of ["compact", "large", "standard"]) {
    fireEvent.change(screen.getByLabelText("Frame width"), {
      target: { value: size },
    });
    expect(
      view.container.querySelector("[data-particle-fixture]"),
    ).toHaveAttribute("data-fixture-size", size);
    expect(screen.getByRole("status")).toHaveTextContent(`${size} frame`);
  }
  fireEvent.click(screen.getByRole("checkbox", { name: "Short frame (4:1)" }));
  expect(screen.getByRole("checkbox")).toBeChecked();
  click("Off");
  expect(setPreference).toHaveBeenCalledWith("off");
  click("Dark");
  expect(setTheme).toHaveBeenCalledWith("dark");
  expect(bind).toHaveBeenCalledOnce();
  expect(scene.destroy).not.toHaveBeenCalled();
  expect(scene.reset).not.toHaveBeenCalled();
});

it("keeps a usable still for pending/denied/failed snapshots and ignores missing bounds", () => {
  const view = render(<ParticleLifecycleFixture />);
  click("Start scene");
  const entry = scenes[0];
  const still = view.container.querySelector("[data-particle-static]");
  const firstParticle = still!.querySelector("circle");
  const retainedX = firstParticle!.getAttribute("cx");
  for (const status of ["preparing", "failed"] as const) {
    act(() => entry.publish({ status, frameReady: false }));
    expect(still).toHaveStyle({ visibility: "visible" });
    expect(screen.getByRole("status")).toHaveTextContent(status);
  }
  entry.scene.getStill.mockReturnValue({
    ...entry.scene.getStill(),
    bounds: null,
    particles: entry.scene.getStill().particles.map((particle) => ({
      ...particle,
      x: 0,
    })),
  });
  act(() =>
    entry.publish({ frameReady: true, presentation: "complete-static" }),
  );
  expect(still).toHaveStyle({ visibility: "visible" });
  expect(still!.querySelector("circle")).toBe(firstParticle);
  expect(firstParticle).toHaveAttribute("cx", retainedX);
  expect(view.container.querySelector("canvas")).toBeNull();
});

it("diagnostic static data fits fractionally while radii stay in CSS units, without constructing a runtime", () => {
  const state = createParticleScene({ width: 640, height: 360 }, { count: 10 });
  const data = getParticleStill(state);
  const view = render(<ParticleStill still={data} />);
  const svg = view.container.querySelector("svg")!;
  const circle = svg.querySelector("circle")!;
  expect(svg).toHaveAttribute("aria-hidden", "true");
  expect(circle).toHaveAttribute("cx", `${(data.particles[0].x / 640) * 100}%`);
  expect(circle).toHaveAttribute("r", String(data.particles[0].radius));
  view.rerender(<ParticleStill still={data} hidden />);
  expect(svg).toHaveStyle({ visibility: "hidden" });
  expect(svg.querySelector("circle")).toBe(circle);
  view.rerender(<ParticleStill still={{ ...data, bounds: null }} />);
  expect(circle).toHaveAttribute("cx", `${(data.particles[0].x / 640) * 100}%`);
  expect(svg).toHaveStyle({ visibility: "visible" });
  expect(bind).not.toHaveBeenCalled();
  expect(view.container.querySelector("canvas")).toBeNull();
});
