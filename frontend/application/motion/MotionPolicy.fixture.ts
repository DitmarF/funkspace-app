/** Test-only consuming example. No renderer, timer, scene or production controls. */
import type { MotionPolicyConsumer } from "./MotionPolicyService";
import {
  resolveMotionPermission,
  type ConsumerMotionInputs,
} from "@/domain/motion/MotionPolicy";

export function createMotionConsumerFixture(policy: MotionPolicyConsumer) {
  let inputs: ConsumerMotionInputs = {
    featureAvailable: true,
    optedIn: true,
    visible: true,
    locallyPaused: false,
    runtime: "unprepared",
  };
  let snapshot = policy.getSnapshot();
  let completed = false;
  let running = false;
  let starts = 0;
  const update = () => {
    let permission = resolveMotionPermission(snapshot, inputs);
    if (permission.mayPrepare) {
      // The fake prepares inertly and synchronously; actual consumers own async work.
      inputs = { ...inputs, runtime: "ready" };
      permission = resolveMotionPermission(snapshot, inputs);
    }
    const nextRunning = permission.mayRun && !completed;
    if (nextRunning && !running) starts++;
    running = nextRunning;
  };
  const unsubscribe = policy.subscribe((next) => {
    snapshot = next;
    update();
  });
  return {
    read: () => ({
      snapshot,
      inputs,
      running,
      starts,
      permission: resolveMotionPermission(snapshot, inputs),
    }),
    changeInputs: (next: Partial<ConsumerMotionInputs>) => {
      inputs = { ...inputs, ...next };
      update();
    },
    complete: () => {
      completed = true;
      update();
    },
    unmount: () => {
      unsubscribe();
      inputs = { ...inputs, runtime: "disposed" };
      running = false;
    },
  };
}
