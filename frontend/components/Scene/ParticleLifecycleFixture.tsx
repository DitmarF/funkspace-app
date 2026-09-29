"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PARTICLE_SETTINGS } from "@/domain/particles/ParticleSettings";
import SceneAperture from "./SceneAperture";
import type { SceneApertureSelection } from "@/data/sceneApertures";
import ThemeSwitcher from "../ThemeSwitcher";
import { FunkSpaceLogoInline } from "../Logo/FunkSpaceLogoInline";
import ParticleStill from "./ParticleStill";
import { useServices } from "@/application/providers/ServiceProvider";
import {
  createParticleScene,
  DEFAULT_PARTICLE_CONFIG,
  getParticleStill,
  MAX_PARTICLE_COUNT,
} from "@/domain/particles/ParticleScene";
import type {
  ParticleSceneHandle,
  ParticleSceneSnapshot,
} from "@/domain/ports/ParticleScenePort";
import type { MotionPreference } from "@/domain/motion/MotionPolicy";
import Button from "../Controls/Button";
import MotionChoices from "../Layouts/MotionChoices";
import styles from "./ParticleLifecycleFixture.module.css";

const fallback = getParticleStill(
  createParticleScene({ width: 640, height: 360 }),
);

/** Diagnostic only. No automatic mount, homepage integration or product aperture. */
export default function ParticleLifecycleFixture({
  aperture = false,
}: {
  aperture?: boolean;
}) {
  const services = useServices();
  const host = useRef<HTMLDivElement>(null);
  const handle = useRef<ParticleSceneHandle | undefined>(undefined);
  const [mounted, setMounted] = useState(false);
  const [fixtureSize, setFixtureSize] = useState<
    "standard" | "compact" | "large"
  >("standard");
  const [short, setShort] = useState(false);
  const [selection, setSelection] = useState<SceneApertureSelection>("web");
  const [coverReady, setCoverReady] = useState(!aperture);
  const coverChanged = useCallback(
    (ready: boolean) => setCoverReady(ready),
    [],
  );
  const [snapshot, setSnapshot] = useState<ParticleSceneSnapshot>();
  const [still, setStill] = useState(fallback);
  const [preference, setPreference] = useState<MotionPreference>("system");
  useEffect(
    () =>
      services.motionPolicy.subscribe((value) =>
        setPreference(value.preference),
      ),
    [services],
  );
  useEffect(() => {
    if (!mounted || !host.current) return;
    const scene = services.bindParticleScene(host.current, {
      optedIn: true,
      presentation: {
        introReady: true,
        coverReady: !aperture,
        occluded: false,
      },
    });
    handle.current = scene;
    const release = scene.subscribe((value) => {
      setSnapshot(value);
      const preview = scene.getStill();
      if (preview.bounds) setStill(preview);
    });
    return () => {
      handle.current = undefined;
      release();
      scene.destroy();
    };
  }, [services, mounted, aperture]);
  useEffect(() => {
    handle.current?.setPresentation({
      introReady: true,
      coverReady,
      occluded: false,
    });
  }, [coverReady, mounted]);
  const showCanvas =
    mounted &&
    snapshot?.frameReady &&
    snapshot.presentation !== "complete-static";
  return (
    <main className={styles.fixture}>
      <h1>
        {aperture
          ? "Aperture replacement fixture"
          : "Particle lifecycle fixture"}
      </h1>
      <p>
        {aperture
          ? "FS-4.4 Work Sans WEB and repository-authored diamond diagnostic."
          : "Unmasked diagnostic for FS-4.3."}{" "}
        Start explicitly; motion choices and the build availability flag still
        apply. This is not the homepage animation.
      </p>
      {aperture && <ThemeSwitcher presentation="outlined" />}
      <MotionChoices
        value={preference}
        onChange={(value) => services.motionPolicy.setPreference(value)}
      />
      <div className={styles.controls}>
        {aperture && (
          <>
            <Button
              onClick={() =>
                setSelection((value) =>
                  value === "web" ? "technical-diamond" : "web",
                )
              }
            >
              Replace aperture
            </Button>
            <Button onClick={() => setShort((value) => !value)}>
              Toggle short frame
            </Button>
          </>
        )}
        <Button onClick={() => setMounted((value) => !value)}>
          {mounted ? "Destroy scene" : "Start scene"}
        </Button>
        <Button
          disabled={!mounted}
          onClick={() =>
            snapshot?.locallyPaused
              ? handle.current?.resume()
              : handle.current?.pause()
          }
        >
          {snapshot?.locallyPaused ? "Resume scene" : "Pause scene"}
        </Button>
        <Button disabled={!mounted} onClick={() => handle.current?.reset()}>
          Reset seeded state
        </Button>
        <Button
          onClick={() =>
            setFixtureSize((value) =>
              value === "standard"
                ? "compact"
                : value === "compact"
                  ? "large"
                  : "standard",
            )
          }
        >
          Resize fixture
        </Button>
        <Button
          disabled={!mounted}
          onClick={() =>
            handle.current?.configure({
              count:
                snapshot?.config.count === DEFAULT_PARTICLE_CONFIG.count
                  ? DEFAULT_PARTICLE_CONFIG.count === MAX_PARTICLE_COUNT
                    ? Math.max(
                        PARTICLE_SETTINGS.controls.count.min,
                        Math.floor(
                          MAX_PARTICLE_COUNT /
                            2 /
                            PARTICLE_SETTINGS.controls.count.step,
                        ) * PARTICLE_SETTINGS.controls.count.step,
                      )
                    : MAX_PARTICLE_COUNT
                  : DEFAULT_PARTICLE_CONFIG.count,
            })
          }
        >
          Toggle particle count
        </Button>
      </div>
      <p role="status">
        {mounted ? (snapshot?.status ?? "unprepared") : "unmounted"} ·{" "}
        {snapshot?.config.count ?? DEFAULT_PARTICLE_CONFIG.count} particles ·{" "}
        {fixtureSize} frame
      </p>
      <div
        className={`${styles.surface} ${fixtureSize === "compact" ? styles.compact : fixtureSize === "large" ? styles.large : ""} ${short ? styles.short : ""}`}
        data-particle-fixture
        data-fixture-size={fixtureSize}
      >
        <div
          ref={host}
          className={styles.runtime}
          style={{ opacity: coverReady ? 1 : 0 }}
        >
          {/* Fractional positions fill every aspect ratio; radii stay in CSS px.
              This also works before observation, after destroy and on failure. */}
          <ParticleStill
            still={still}
            hidden={Boolean(showCanvas)}
            className={styles.still}
          />
        </div>
        {aperture && (
          <SceneAperture selection={selection} onReady={coverChanged} />
        )}
      </div>
      {aperture && (
        <div className={styles.gallery} data-aperture-gallery>
          <FunkSpaceLogoInline className={styles.identity} />
          {(["web", "circle", "technical-diamond"] as const).map((shape) => (
            <div key={shape} className={styles.thumbnail}>
              <svg className={styles.still} aria-hidden="true">
                {fallback.particles.map((particle) => (
                  <circle
                    key={particle.id}
                    cx={`${(particle.x / 640) * 100}%`}
                    cy={`${(particle.y / 360) * 100}%`}
                    r={particle.radius}
                  />
                ))}
              </svg>
              <SceneAperture selection={shape} />
            </div>
          ))}
        </div>
      )}
      <p>
        The static representation is independent of Canvas. Reset here resets
        the current seeded configuration and retains local Pause; product Reset
        belongs to later customization work.
      </p>
    </main>
  );
}
