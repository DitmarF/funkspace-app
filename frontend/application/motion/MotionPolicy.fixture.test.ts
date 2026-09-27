import { expect, it, vi } from "vitest";
import { createMotionConsumerFixture } from "./MotionPolicy.fixture";
import { MotionPolicyServiceImpl } from "./MotionPolicyService";
import type { MotionEnvironment } from "@/domain/ports/MotionEnvironmentPort";

it("M1/M4/M5/M6: two real-API consumers retain independent Pause, visibility and history", () => {
  let changeEnvironment: (value: MotionEnvironment) => void = () => {};
  const detach = vi.fn();
  const service = new MotionPolicyServiceImpl(
    {
      getItem: () => null,
      setItem: () => {
        throw Error("denied");
      },
      removeItem: vi.fn(),
    },
    {
      observe: (callback) => {
        changeEnvironment = callback;
        return {
          current: { systemMotion: "no-preference", documentVisible: true },
          unsubscribe: detach,
        };
      },
    },
  );
  const logo = createMotionConsumerFixture(service);
  const scene = createMotionConsumerFixture(service);
  expect(logo.read().permission.presentation).toBe("complete-static");
  expect(scene.read().starts).toBe(0);
  // Pause before preparation must survive every environmental change.
  logo.changeInputs({ locallyPaused: true });
  service.initialize();
  expect(logo.read().inputs.runtime).toBe("unprepared");
  expect(scene.read().running).toBe(true);
  scene.changeInputs({ visible: false });
  expect(scene.read().running).toBe(false);
  scene.changeInputs({ visible: true });
  for (const preference of ["off", "reduced", "on", "system"] as const) {
    service.setPreference(preference);
    changeEnvironment({ systemMotion: "reduce", documentVisible: false });
    changeEnvironment({ systemMotion: "no-preference", documentVisible: true });
    for (const featureAvailable of [false, true]) {
      logo.changeInputs({ featureAvailable });
      scene.changeInputs({ featureAvailable });
      expect(logo.read().inputs.locallyPaused).toBe(true);
      expect(logo.read().running).toBe(false);
    }
    expect(scene.read().snapshot.preference).toBe(preference);
  }
  // Explicit local resume is the only event clearing Pause; readiness is not a prerequisite.
  logo.changeInputs({ locallyPaused: false });
  expect(logo.read().running).toBe(true);
  logo.complete();
  const starts = logo.read().starts;
  service.setPreference("off");
  service.setPreference("system");
  changeEnvironment({ systemMotion: "no-preference", documentVisible: false });
  changeEnvironment({ systemMotion: "no-preference", documentVisible: true });
  expect(logo.read().starts).toBe(starts);
  expect(logo.read().running).toBe(false);
  logo.unmount();
  expect(detach).not.toHaveBeenCalled();
  scene.changeInputs({ runtime: "failed" });
  service.setPreference("reduced");
  service.setPreference("system");
  expect(scene.read().permission.presentation).toBe("complete-static");
  expect(scene.read().running).toBe(false);
  scene.unmount();
  service.dispose();
  expect(detach).toHaveBeenCalledTimes(1);
});
