import { expect, it, vi } from "vitest";
import { MotionPolicyServiceImpl } from "./MotionPolicyService";
import { createMotionConsumerFixture } from "./MotionPolicy.fixture";
import {
  MOTION_PREFERENCE_KEY,
  type MotionPreference,
} from "@/domain/motion/MotionPolicy";
import type {
  MotionEnvironment,
  MotionEnvironmentPort,
} from "@/domain/ports/MotionEnvironmentPort";

function setup(stored: string | null = null) {
  const storage = {
    getItem: vi.fn(() => stored),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  };
  const callbacks: ((value: MotionEnvironment) => void)[] = [];
  const detach = vi.fn();
  const environment: MotionEnvironmentPort = {
    observe: vi.fn<MotionEnvironmentPort["observe"]>((callback) => {
      callbacks.push(callback);
      return {
        current: { systemMotion: "no-preference", documentVisible: true },
        unsubscribe: detach,
      };
    }),
  };
  const service = new MotionPolicyServiceImpl(storage, environment);
  return { service, storage, environment, callbacks, detach };
}

it("M1: construction/subscription is inert and initial snapshots are stable", () => {
  const { service, storage, environment } = setup("off");
  const initial = service.getSnapshot();
  expect(initial).toEqual({
    status: "pending",
    preference: "system",
    systemMotion: "unknown",
    documentVisible: false,
  });
  const listener = vi.fn();
  const stop = service.subscribe(listener);
  expect(listener).toHaveBeenCalledExactlyOnceWith(initial);
  expect(service.getSnapshot()).toBe(initial);
  expect(Object.isFrozen(initial)).toBe(true);
  expect(storage.getItem).not.toHaveBeenCalled();
  expect(environment.observe).not.toHaveBeenCalled();
  stop();
  stop();
  service.initialize();
  expect(listener).toHaveBeenCalledTimes(1);
});

it.each([null, "bad", '"off"', "", "system", "reduced", "off"])(
  "M3: validates storage %s and never normalizes by writing",
  (stored) => {
    const { service, storage } = setup(stored);
    service.initialize();
    expect(service.getSnapshot().preference).toBe(
      stored === "off" || stored === "reduced" ? stored : "system",
    );
    expect(service.getSnapshot().status).toBe("ready");
    expect(storage.getItem).toHaveBeenCalledExactlyOnceWith(
      MOTION_PREFERENCE_KEY,
    );
    expect(storage.setItem).not.toHaveBeenCalled();
  },
);

it("M3: denied reads/writes settle and retain live choice for all readers/reinitialization", () => {
  const { service, storage, callbacks } = setup("off");
  storage.getItem.mockImplementation(() => {
    throw Error("denied");
  });
  storage.setItem.mockImplementation(() => {
    throw Error("denied");
  });
  const release = service.initialize();
  service.setPreference("reduced");
  const fresh = vi.fn();
  service.subscribe(fresh);
  callbacks[0]({ systemMotion: "reduce", documentVisible: false });
  release();
  service.initialize();
  expect(service.getSnapshot()).toMatchObject({
    status: "ready",
    preference: "reduced",
  });
  expect(
    fresh.mock.calls.every(([snapshot]) => snapshot.preference === "reduced"),
  ).toBe(true);
  expect(storage.getItem).toHaveBeenCalledTimes(1);
  // Reload cannot recover a write that failed; a new authority safely reads again.
  const reloaded = new MotionPolicyServiceImpl(storage, {
    observe: () => {
      throw Error("missing");
    },
  });
  reloaded.initialize();
  expect(reloaded.getSnapshot()).toEqual({
    preference: "system",
    status: "ready",
    systemMotion: "unavailable",
    documentVisible: false,
  });
});

it("M3: early and reentrant choice beats stale initialization", () => {
  const early = setup("off");
  early.service.setPreference("reduced");
  expect(early.service.getSnapshot().status).toBe("pending");
  early.service.initialize();
  expect(early.storage.getItem).not.toHaveBeenCalled();
  const { service, storage } = setup("off");
  storage.getItem.mockImplementation(() => {
    service.setPreference("reduced");
    return "off";
  });
  service.initialize();
  expect(service.getSnapshot().preference).toBe("reduced");
});

it("M3/M6: nested delivery never delivers older values after newer ones; final write wins", () => {
  const { service, storage } = setup();
  service.subscribe((snapshot) => {
    if (snapshot.preference === "reduced") service.setPreference("off");
  });
  const observed: string[] = [];
  service.subscribe((snapshot) => observed.push(snapshot.preference));
  service.setPreference("reduced");
  expect(observed).toEqual(["system", "off"]);
  expect(storage.setItem.mock.calls).toEqual([
    [MOTION_PREFERENCE_KEY, "reduced"],
    [MOTION_PREFERENCE_KEY, "off"],
  ]);
  const snapshot = service.getSnapshot();
  service.setPreference("off");
  expect(service.getSnapshot()).toBe(snapshot);
  expect(observed).toEqual(["system", "off"]);
  expect(() => service.setPreference("bad" as MotionPreference)).toThrow(
    RangeError,
  );
  expect(service.getSnapshot()).toBe(snapshot);
});

it("M6: repeat setup, independent unsubscriptions and late old release/callback", () => {
  const { service, environment, callbacks, detach } = setup();
  const release = service.initialize();
  expect(service.initialize()).toBe(release);
  const listener = vi.fn();
  const stopA = service.subscribe(listener);
  const stopB = service.subscribe(listener);
  stopA();
  service.setPreference("off");
  expect(listener).toHaveBeenCalledTimes(3);
  stopB();
  release();
  release();
  expect(detach).toHaveBeenCalledTimes(1);
  expect(service.getSnapshot()).toMatchObject({
    preference: "off",
    status: "pending",
    systemMotion: "unknown",
    documentVisible: false,
  });
  const release2 = service.initialize();
  const current = service.getSnapshot();
  release();
  callbacks[0]({ systemMotion: "reduce", documentVisible: false });
  expect(service.getSnapshot()).toBe(current);
  expect(environment.observe).toHaveBeenCalledTimes(2);
  callbacks[1]({ systemMotion: "reduce", documentVisible: false });
  expect(service.getSnapshot()).toMatchObject({
    preference: "off",
    systemMotion: "reduce",
  });
  release2();
});

it("M6: unsubscribe during delivery and subscriber failures do not create leaked registrations", () => {
  const { service } = setup();
  let stop = () => {};
  service.subscribe((snapshot) => {
    if (snapshot.preference === "off") stop();
  });
  const later = vi.fn();
  stop = service.subscribe(later);
  service.setPreference("off");
  expect(later).toHaveBeenCalledTimes(1);
  expect(() =>
    service.subscribe(() => {
      throw Error("consumer");
    }),
  ).toThrow("consumer");
  expect(() => service.setPreference("system")).not.toThrow();
});

it.each(["storage", "observe"])(
  "M6: disposal during %s initialization cannot publish ready or leak resources",
  (phase) => {
    const { service, storage, environment, detach } = setup();
    if (phase === "storage")
      storage.getItem.mockImplementation(() => {
        service.dispose();
        return "off";
      });
    else
      vi.mocked(environment.observe).mockImplementation(() => {
        service.dispose();
        return {
          current: { systemMotion: "no-preference", documentVisible: true },
          unsubscribe: detach,
        };
      });
    const release = service.initialize();
    release();
    expect(service.getSnapshot().status).toBe("disposed");
    expect(detach).toHaveBeenCalledTimes(phase === "observe" ? 1 : 0);
  },
);

it("M6: terminal disposal cannot be reopened by cleanup or stale events", () => {
  const { service, callbacks, detach, environment, storage } = setup();
  const listener = vi.fn();
  service.subscribe(listener);
  service.initialize();
  detach.mockImplementation(() => {
    service.initialize();
    callbacks[0]({ systemMotion: "reduce", documentVisible: true });
  });
  service.dispose();
  service.dispose();
  service.setPreference("off");
  service.initialize();
  expect(service.getSnapshot()).toMatchObject({
    status: "disposed",
    preference: "system",
    documentVisible: false,
  });
  expect(environment.observe).toHaveBeenCalledTimes(1);
  expect(detach).toHaveBeenCalledTimes(1);
  expect(storage.setItem).not.toHaveBeenCalled();
  expect(listener.mock.calls.map(([s]) => s.status)).toEqual([
    "pending",
    "ready",
    "disposed",
  ]);
  const late = vi.fn();
  service.subscribe(late)();
  expect(late).toHaveBeenCalledExactlyOnceWith(service.getSnapshot());
});

it.each(["pending", "ready"])(
  "M6: a throwing %s subscriber rolls back initialization and permits retry",
  (status) => {
    const { service, environment, detach, callbacks } = setup("off");
    const error = Error("consumer failed");
    const stop = service.subscribe((snapshot) => {
      if (snapshot.preference === "off" && snapshot.status === status)
        throw error;
    });
    expect(() => service.initialize()).toThrow(error);
    expect(service.getSnapshot()).toMatchObject({
      status: "pending",
      preference: "off",
      systemMotion: "unknown",
      documentVisible: false,
    });
    expect(detach).toHaveBeenCalledTimes(status === "ready" ? 1 : 0);
    stop();
    const release = service.initialize();
    expect(service.getSnapshot().status).toBe("ready");
    expect(environment.observe).toHaveBeenCalledTimes(
      status === "ready" ? 2 : 1,
    );
    if (status === "ready") {
      callbacks[0]({ systemMotion: "reduce", documentVisible: false });
      expect(service.getSnapshot().systemMotion).toBe("no-preference");
    }
    release();
  },
);

it("M3: normal persistence is recovered by a fresh authority", () => {
  let stored: string | null = null;
  const storage = {
    getItem: () => stored,
    setItem: (_key: string, value: string) => {
      stored = value;
    },
    removeItem: vi.fn(),
  };
  const environment: MotionEnvironmentPort = {
    observe: () => ({
      current: { systemMotion: "no-preference", documentVisible: true },
      unsubscribe: vi.fn(),
    }),
  };
  const first = new MotionPolicyServiceImpl(storage, environment);
  first.initialize();
  first.setPreference("reduced");
  first.dispose();
  const next = new MotionPolicyServiceImpl(storage, environment);
  next.initialize();
  expect(next.getSnapshot().preference).toBe("reduced");
});

it.each(["off", "reduced", "unavailable", "release", "dispose"] as const)(
  "M4/M6: %s reaches both consumers despite earlier subscriber failures",
  (transition) => {
    const { service, callbacks, detach } = setup();
    const release = service.initialize();
    const firstError = Error("first consumer failed");
    const stopFirst = service.subscribe((snapshot) => {
      if (
        snapshot.status !== "ready" ||
        snapshot.preference !== "system" ||
        snapshot.systemMotion !== "no-preference"
      )
        throw firstError;
    });
    const stopSecond = service.subscribe((snapshot) => {
      if (
        snapshot.status !== "ready" ||
        snapshot.preference !== "system" ||
        snapshot.systemMotion !== "no-preference"
      )
        throw Error("second consumer failed");
    });
    const logo = createMotionConsumerFixture(service);
    const scene = createMotionConsumerFixture(service);
    logo.changeInputs({ locallyPaused: true });
    expect(scene.read().running).toBe(true);
    let thrown: unknown;
    try {
      if (transition === "off" || transition === "reduced")
        service.setPreference(transition);
      else if (transition === "unavailable")
        callbacks[0]({ systemMotion: "unavailable", documentVisible: true });
      else if (transition === "release") release();
      else service.dispose();
    } catch (error) {
      thrown = error;
    }
    expect(thrown).toBe(firstError);
    for (const consumer of [logo, scene]) {
      expect(consumer.read().snapshot).toBe(service.getSnapshot());
      expect(consumer.read().permission.mayRun).toBe(false);
      expect(consumer.read().running).toBe(false);
    }
    expect(logo.read().inputs.locallyPaused).toBe(true);
    stopFirst();
    stopSecond();
    if (transition === "off" || transition === "reduced") {
      service.setPreference(transition);
      expect(scene.read().snapshot).toBe(service.getSnapshot());
    }
    if (transition === "release" || transition === "dispose") {
      expect(detach).toHaveBeenCalledTimes(1);
      const settled = scene.read().snapshot;
      callbacks[0]({ systemMotion: "no-preference", documentVisible: true });
      expect(scene.read().snapshot).toBe(settled);
    }
    service.dispose();
    service.dispose();
    expect(detach).toHaveBeenCalledTimes(1);
    logo.unmount();
    scene.unmount();
  },
);

it("M3/M6: failure propagation retains the first error without delivering a superseded snapshot", () => {
  const { service } = setup();
  service.initialize();
  const firstError = Error("reduced failed first");
  const stopFault = service.subscribe((snapshot) => {
    if (snapshot.preference === "reduced") throw firstError;
    if (snapshot.preference === "off") throw Error("nested off failure");
  });
  service.subscribe((snapshot) => {
    if (snapshot.preference === "reduced") service.setPreference("off");
  });
  const observed: string[] = [];
  service.subscribe((snapshot) => observed.push(snapshot.preference));
  const consumer = createMotionConsumerFixture(service);
  let thrown: unknown;
  try {
    service.setPreference("reduced");
  } catch (error) {
    thrown = error;
  }
  expect(thrown).toBe(firstError);
  expect(observed).toEqual(["system", "off"]);
  expect(consumer.read().snapshot).toBe(service.getSnapshot());
  expect(consumer.read().running).toBe(false);
  stopFault();
  consumer.unmount();
  service.dispose();
});
