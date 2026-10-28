import { afterEach, expect, it, vi } from "vitest";
import { createServices } from "./createServices";
import {
  DEFAULT_PARTICLE_CONFIG,
  MOBILE_WEB_PARTICLE_CONFIG,
} from "@/domain/particles/ParticleSettings";

const dependencies = vi.hoisted(() => ({ destroy: vi.fn() }));
vi.mock("@/infrastructure/particles/ParticleSceneBinding", () => ({
  bindParticleScene: () => {
    const surface = {
      width: 320,
      height: 180,
      dpr: 1,
      visible: false,
      palette: null,
    };
    return {
      getSnapshot: () => surface,
      subscribe: (listener: (value: typeof surface) => void) => {
        listener(surface);
        return () => {};
      },
      prepare: vi.fn(),
      destroy: dependencies.destroy,
    };
  },
}));

function fixture(mobile: boolean) {
  const listeners = new Set<() => void>();
  const query = {
    matches: mobile,
    addEventListener: vi.fn((_event: string, listener: () => void) =>
      listeners.add(listener),
    ),
    removeEventListener: vi.fn((_event: string, listener: () => void) =>
      listeners.delete(listener),
    ),
  };
  const matchMedia = vi.fn(() => query);
  vi.stubGlobal("matchMedia", matchMedia);
  const services = createServices({ decorativeMotionAvailable: false });
  const target = document.createElement("div");
  const scene = services.bindParticleScene(target, {
    optedIn: true,
    responsiveDefaults: true,
  });
  const resize = (matches: boolean) => {
    query.matches = matches;
    for (const listener of listeners) listener();
  };
  return { scene, services, target, query, matchMedia, listeners, resize };
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

it.each([true, false])(
  "uses only the requested mobile WEB changes (mobile=%s)",
  (mobile) => {
    const f = fixture(mobile);
    expect(f.matchMedia).toHaveBeenCalledWith("(width < 640px)");
    expect(f.scene.getSnapshot().config).toEqual(
      mobile ? MOBILE_WEB_PARTICLE_CONFIG : DEFAULT_PARTICLE_CONFIG,
    );
    expect(MOBILE_WEB_PARTICLE_CONFIG).toEqual({
      ...DEFAULT_PARTICLE_CONFIG,
      speed: 0.1,
      connectionDistance: 5,
    });
    f.scene.destroy();
    expect(f.listeners.size).toBe(0);
    expect(dependencies.destroy).toHaveBeenCalledOnce();
  },
);

it("updates untouched defaults across the WEB breakpoint, retains custom settings and Pause, and resets to the current profile", () => {
  const f = fixture(false);
  f.scene.pause();
  f.scene.configure({ count: 400, speed: 0.5 });
  f.resize(true);
  expect(f.scene.getSnapshot().config).toEqual({
    ...MOBILE_WEB_PARTICLE_CONFIG,
    count: 400,
    speed: 0.5,
  });
  expect(f.scene.getSnapshot().locallyPaused).toBe(true);
  f.scene.reset();
  expect(f.scene.getSnapshot().config.speed).toBe(0.5);
  f.scene.reset(true);
  expect(f.scene.getSnapshot().config).toEqual(MOBILE_WEB_PARTICLE_CONFIG);
  expect(f.scene.getSnapshot().locallyPaused).toBe(true);
  f.resize(false);
  expect(f.scene.getSnapshot().config).toEqual(DEFAULT_PARTICLE_CONFIG);
  f.scene.destroy();
  f.resize(true);
  expect(f.scene.getSnapshot().config).toEqual(DEFAULT_PARTICLE_CONFIG);
});

it("preserves explicit configs and unrequested particle consumers", () => {
  const f = fixture(true);
  f.scene.destroy();
  const explicit = f.services.bindParticleScene(f.target, {
    optedIn: true,
    responsiveDefaults: true,
    config: { speed: 0.7, connectionDistance: 9 },
  });
  expect(explicit.getSnapshot().config).toEqual({
    ...DEFAULT_PARTICLE_CONFIG,
    speed: 0.7,
    connectionDistance: 9,
  });
  explicit.destroy();
  const generic = f.services.bindParticleScene(f.target, { optedIn: true });
  expect(generic.getSnapshot().config).toEqual(DEFAULT_PARTICLE_CONFIG);
  generic.destroy();
  expect(f.listeners.size).toBe(0);
});
