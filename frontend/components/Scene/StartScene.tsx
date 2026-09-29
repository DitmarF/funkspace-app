"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { useServices } from "@/application/providers/ServiceProvider";
import type { MotionBlocker } from "@/domain/motion/MotionPolicy";
import type {
  ParticleSceneHandle,
  ParticleSceneSnapshot,
} from "@/domain/ports/ParticleScenePort";
import { useScenePresentation } from "../Layouts/ScenePresentationContext";
import Button from "../Controls/Button";
import SceneAperture from "./SceneAperture";
import styles from "./StartScene.module.css";

const reasons: Record<MotionBlocker, string> = {
  "policy-pending": "Loading motion preference. Artwork stays still.",
  "policy-disposed": "Animation is unavailable. Artwork stays still.",
  "feature-unavailable": "Animation is unavailable. Artwork stays still.",
  "opted-out": "Animation is unavailable. Artwork stays still.",
  "preference-reduced": "Reduced motion is selected. This scene stays still.",
  "preference-off": "Decorative animation is off. This scene stays still.",
  "system-reduce":
    "Your device requests reduced motion. This scene stays still.",
  "system-unknown":
    "Your device’s motion preference is unknown. Artwork stays still.",
  "system-unavailable":
    "Your device’s motion preference is unavailable. Artwork stays still.",
  "document-hidden": "Animation waits until this page is visible.",
  "consumer-hidden": "Animation waits until the scene is visible and ready.",
  "local-pause": "Animation paused here.",
  "runtime-not-ready": "Preparing animation. Artwork stays still.",
  "runtime-failed": "Animation is unavailable. Artwork stays still.",
  "runtime-disposed": "Animation is unavailable. Artwork stays still.",
};

/** Owns one scene handle; shared services and preferences remain provider-owned. */
export default function StartScene() {
  const { bindParticleScene } = useServices();
  const { introReady, occluded } = useScenePresentation();
  const host = useRef<HTMLDivElement>(null);
  const handle = useRef<ParticleSceneHandle | undefined>(undefined);
  const [coverReady, setCoverReady] = useState<boolean>();
  const [snapshot, setSnapshot] = useState<ParticleSceneSnapshot>();
  const [reveal, setReveal] = useState<"fade" | "static">();
  const statusId = useId();
  useEffect(() => {
    if (!host.current) return;
    // Gates are delivered separately; creation can never race the intro/cover.
    const scene = bindParticleScene(host.current, { optedIn: true });
    handle.current = scene;
    const release = scene.subscribe(setSnapshot);
    return () => {
      handle.current = undefined;
      try {
        release();
      } finally {
        scene.destroy();
      }
    };
  }, [bindParticleScene]);
  // Runs before the next browser frame, including when a fullscreen dialog opens.
  useLayoutEffect(() => {
    handle.current?.setPresentation({
      introReady,
      coverReady: coverReady === true,
      occluded,
    });
  }, [introReady, coverReady, occluded, snapshot?.status]);
  const showCanvas = Boolean(
    snapshot?.frameReady && snapshot.presentation !== "complete-static",
  );
  // This is a once-per-mount reveal, not a new intro sequence. Keep dimensions
  // observable while waiting; opacity must not become a preparation gate.
  const fallbackSettled = Boolean(
    snapshot &&
      !snapshot.blockers.includes("policy-pending") &&
      (coverReady === false ||
        snapshot.paletteUnavailable ||
        snapshot.locallyPaused ||
        snapshot.blockers.some(
          (value) =>
            ![
              "policy-pending",
              "consumer-hidden",
              "document-hidden",
              "runtime-not-ready",
            ].includes(value),
        )),
  );
  useLayoutEffect(() => {
    if (!reveal && (showCanvas || fallbackSettled))
      setReveal(showCanvas && !snapshot?.reducedMotion ? "fade" : "static");
    // A restriction also finishes an in-flight reveal immediately. Keeping the
    // static latch prevents On/visibility restoration from replaying that fade.
    else if (reveal === "fade" && snapshot?.presentation !== "motion-permitted")
      setReveal("static");
  }, [
    reveal,
    showCanvas,
    fallbackSettled,
    snapshot?.reducedMotion,
    snapshot?.presentation,
  ]);
  const restriction =
    snapshot?.status === "failed"
      ? "runtime-failed"
      : snapshot?.blockers.find(
          (value) => value !== "local-pause" && value !== "runtime-not-ready",
        );
  const message = snapshot?.paletteUnavailable
    ? "Scene colors are unavailable. Artwork stays still."
    : restriction
      ? reasons[restriction]
      : snapshot?.reducedMotion
        ? reasons["preference-reduced"]
        : snapshot?.locallyPaused
          ? reasons["local-pause"]
          : snapshot?.status !== "ready"
            ? reasons["runtime-not-ready"]
            : "Animation playing.";
  return (
    <>
      <div
        data-start-scene=""
        data-scene-reveal={reveal ?? (snapshot ? "waiting" : "pending")}
        aria-hidden="true"
        className={styles.scene}
      >
        <div
          ref={host}
          className={styles.runtime}
          style={{ opacity: coverReady ? 1 : 0 }}
        />
        <SceneAperture
          selection="web"
          showStatic={!showCanvas}
          onReady={setCoverReady}
        />
      </div>
      <div className={styles.controls}>
        <div className={styles.action}>
          {snapshot && (
            <Button
              variant="outlined"
              disabled={Boolean(restriction) || snapshot.reducedMotion}
              aria-describedby={statusId}
              onClick={() =>
                snapshot.locallyPaused
                  ? handle.current?.resume()
                  : handle.current?.pause()
              }
            >
              {snapshot.locallyPaused ? "Resume animation" : "Pause animation"}
            </Button>
          )}
        </div>
        <p id={statusId} role={snapshot ? "status" : undefined}>
          {snapshot
            ? message
            : "Static artwork. Animation follows your motion settings."}
          {restriction && snapshot?.locallyPaused
            ? " Your local Pause is retained."
            : ""}
        </p>
      </div>
    </>
  );
}
