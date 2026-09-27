import type { SystemMotion } from "../ports/MotionEnvironmentPort";

export type MotionPreference = "system" | "on" | "reduced" | "off";
export const MOTION_PREFERENCE_KEY = "funkspace.motion.preference.v1";
export const MOTION_CHOICES = Object.freeze([
  Object.freeze({ value: "system", label: "Follow system" }),
  Object.freeze({ value: "on", label: "On" }),
  Object.freeze({ value: "reduced", label: "Reduced" }),
  Object.freeze({ value: "off", label: "Off" }),
] as const);

export function isMotionPreference(value: unknown): value is MotionPreference {
  return (
    value === "system" ||
    value === "on" ||
    value === "reduced" ||
    value === "off"
  );
}

export type MotionSnapshot = Readonly<{
  status: "pending" | "ready" | "disposed";
  preference: MotionPreference;
  systemMotion: SystemMotion | "unknown";
  documentVisible: boolean;
}>;

export type ConsumerMotionInputs = Readonly<{
  /** Opt-in only for an implemented reduced alternative; default consumers stay static. */
  supportsReducedMotion?: boolean;
  featureAvailable: boolean;
  optedIn: boolean;
  visible: boolean;
  locallyPaused: boolean;
  runtime: "unprepared" | "preparing" | "ready" | "failed" | "disposed";
}>;

export type MotionBlocker =
  | "policy-pending"
  | "policy-disposed"
  | "feature-unavailable"
  | "opted-out"
  | "preference-reduced"
  | "preference-off"
  | "system-reduce"
  | "system-unknown"
  | "system-unavailable"
  | "document-hidden"
  | "consumer-hidden"
  | "local-pause"
  | "runtime-not-ready"
  | "runtime-failed"
  | "runtime-disposed";

export type MotionPermission = Readonly<{
  mayPrepare: boolean;
  mayRun: boolean;
  presentation: "complete-static" | "hold-frame" | "motion-permitted";
  blockers: readonly MotionBlocker[];
}>;

/** Permission only: this function never owns a runtime, clock or playback intent. */
export function resolveMotionPermission(
  snapshot: MotionSnapshot,
  consumer: ConsumerMotionInputs,
): MotionPermission {
  const blockers: MotionBlocker[] = [];
  if (snapshot.status === "pending") blockers.push("policy-pending");
  if (snapshot.status === "disposed") blockers.push("policy-disposed");
  if (!consumer.featureAvailable) blockers.push("feature-unavailable");
  if (!consumer.optedIn) blockers.push("opted-out");
  const reducedAlternative =
    snapshot.preference === "reduced" &&
    consumer.supportsReducedMotion === true;
  if (snapshot.preference === "reduced" && !reducedAlternative)
    blockers.push("preference-reduced");
  if (snapshot.preference === "off") blockers.push("preference-off");
  // Explicit On overrides only the device preference, never other gates.
  if (snapshot.preference !== "on") {
    if (snapshot.systemMotion === "reduce" && !reducedAlternative)
      blockers.push("system-reduce");
    if (snapshot.systemMotion === "unknown") blockers.push("system-unknown");
    if (snapshot.systemMotion === "unavailable")
      blockers.push("system-unavailable");
  }
  const hardDenied = blockers.length > 0;
  if (!snapshot.documentVisible) blockers.push("document-hidden");
  if (!consumer.visible) blockers.push("consumer-hidden");
  if (consumer.locallyPaused) blockers.push("local-pause");
  const suspended =
    !snapshot.documentVisible || !consumer.visible || consumer.locallyPaused;
  if (consumer.runtime === "unprepared" || consumer.runtime === "preparing")
    blockers.push("runtime-not-ready");
  if (consumer.runtime === "failed") blockers.push("runtime-failed");
  if (consumer.runtime === "disposed") blockers.push("runtime-disposed");

  return Object.freeze({
    mayPrepare: !hardDenied && !suspended && consumer.runtime === "unprepared",
    mayRun: !hardDenied && !suspended && consumer.runtime === "ready",
    presentation:
      hardDenied || consumer.runtime !== "ready"
        ? "complete-static"
        : suspended
          ? "hold-frame"
          : "motion-permitted",
    blockers: Object.freeze(blockers),
  });
}
