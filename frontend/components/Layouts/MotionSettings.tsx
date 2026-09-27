"use client";

import { useCallback, useSyncExternalStore } from "react";
import { useServices } from "@/application/providers/ServiceProvider";
import MotionChoices from "./MotionChoices";

export default function MotionSettings() {
  const { motionPolicy, decorativeMotionAvailable } = useServices();
  const subscribe = useCallback(
    (changed: () => void) => motionPolicy.subscribe(changed),
    [motionPolicy],
  );
  const read = useCallback(() => motionPolicy.getSnapshot(), [motionPolicy]);
  const snapshot = useSyncExternalStore(subscribe, read, read);
  const status =
    snapshot.status !== "ready"
      ? "Loading motion preference…"
      : snapshot.preference === "off"
        ? "Decorative animation is off."
        : !decorativeMotionAvailable
          ? "Animation is currently unavailable."
          : snapshot.preference === "reduced"
            ? snapshot.systemMotion === "unknown" ||
              snapshot.systemMotion === "unavailable"
              ? "Your device’s motion preference is unavailable. Artwork stays still."
              : "The logo uses a gentle fade-in. Decorative scenes stay still."
            : snapshot.preference === "on"
              ? "Animation is on, regardless of your device’s reduced-motion setting."
              : snapshot.systemMotion === "reduce"
                ? "Your device requests reduced motion. Artwork stays still."
                : snapshot.systemMotion !== "no-preference"
                  ? "Your device’s motion preference is unavailable. Artwork stays still."
                  : "Animation follows your device’s motion preference.";
  return (
    <div>
      <MotionChoices
        value={snapshot.preference}
        disabled={snapshot.status !== "ready"}
        onChange={(value) => motionPolicy.setPreference(value)}
      />
      <p role="status">{status}</p>
    </div>
  );
}
