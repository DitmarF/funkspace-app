import { describe, expect, it } from "vitest";
import {
  isMotionPreference,
  resolveMotionPermission,
  type ConsumerMotionInputs,
  type MotionSnapshot,
} from "./MotionPolicy";

describe("M1/M2: permission matrix", () => {
  it("covers every independent input and preserves inputs (15,360 combinations)", () => {
    let combinations = 0;
    for (const supportsReducedMotion of [false, true])
      for (const status of ["pending", "ready", "disposed"] as const)
        for (const preference of ["system", "on", "reduced", "off"] as const)
          for (const systemMotion of [
            "unknown",
            "reduce",
            "no-preference",
            "unavailable",
          ] as const)
            for (const documentVisible of [false, true])
              for (const featureAvailable of [false, true])
                for (const optedIn of [false, true])
                  for (const visible of [false, true])
                    for (const locallyPaused of [false, true])
                      for (const runtime of [
                        "unprepared",
                        "preparing",
                        "ready",
                        "failed",
                        "disposed",
                      ] as const) {
                        const snapshot: MotionSnapshot = Object.freeze({
                          status,
                          preference,
                          systemMotion,
                          documentVisible,
                        });
                        const consumer: ConsumerMotionInputs = Object.freeze({
                          supportsReducedMotion,
                          featureAvailable,
                          optedIn,
                          visible,
                          locallyPaused,
                          runtime,
                        });
                        const permission = resolveMotionPermission(
                          snapshot,
                          consumer,
                        );
                        const hardDenied =
                          status !== "ready" ||
                          !(
                            preference === "on" ||
                            (preference === "system" &&
                              systemMotion === "no-preference") ||
                            (preference === "reduced" &&
                              supportsReducedMotion &&
                              (systemMotion === "reduce" ||
                                systemMotion === "no-preference"))
                          ) ||
                          !featureAvailable ||
                          !optedIn;
                        const suspended =
                          !documentVisible || !visible || locallyPaused;
                        expect(permission.mayRun).toBe(
                          !hardDenied && !suspended && runtime === "ready",
                        );
                        expect(permission.mayPrepare).toBe(
                          !hardDenied && !suspended && runtime === "unprepared",
                        );
                        expect(permission.presentation).toBe(
                          hardDenied || runtime !== "ready"
                            ? "complete-static"
                            : suspended
                              ? "hold-frame"
                              : "motion-permitted",
                        );
                        const reasons = [
                          [status === "pending", "policy-pending"],
                          [status === "disposed", "policy-disposed"],
                          [!featureAvailable, "feature-unavailable"],
                          [!optedIn, "opted-out"],
                          [
                            preference === "reduced" && !supportsReducedMotion,
                            "preference-reduced",
                          ],
                          [preference === "off", "preference-off"],
                          [
                            preference !== "on" &&
                              systemMotion === "reduce" &&
                              !(
                                preference === "reduced" &&
                                supportsReducedMotion
                              ),
                            "system-reduce",
                          ],
                          [
                            preference !== "on" && systemMotion === "unknown",
                            "system-unknown",
                          ],
                          [
                            preference !== "on" &&
                              systemMotion === "unavailable",
                            "system-unavailable",
                          ],
                          [!documentVisible, "document-hidden"],
                          [!visible, "consumer-hidden"],
                          [locallyPaused, "local-pause"],
                          [
                            runtime === "unprepared" || runtime === "preparing",
                            "runtime-not-ready",
                          ],
                          [runtime === "failed", "runtime-failed"],
                          [runtime === "disposed", "runtime-disposed"],
                        ];
                        expect(permission.blockers).toEqual(
                          reasons
                            .filter(([active]) => active)
                            .map(([, reason]) => reason),
                        );
                        combinations++;
                      }
    expect(combinations).toBe(15360);
  });
  it.each([undefined, null, "", "SYSTEM", "dark", 0, {}, '"off"'])(
    "rejects invalid preference %s",
    (value) => expect(isMotionPreference(value)).toBe(false),
  );
  it.each(["system", "on", "reduced", "off"])("accepts %s", (value) =>
    expect(isMotionPreference(value)).toBe(true),
  );
});
