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
} from "@/domain/particles/ParticleScene";
import type {
  ParticleSceneHandle,
  ParticleSceneSnapshot,
} from "@/domain/ports/ParticleScenePort";
import type { MotionPreference } from "@/domain/motion/MotionPolicy";
import Button from "../Controls/Button";
import MotionChoices from "../Layouts/MotionChoices";
import styles from "./ParticleLifecycleFixture.module.css";
import controls from "../Controls/AnimationFixture.module.css";
import fields from "../Controls/fields.module.css";

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
    <main className={`${styles.fixture} ${controls.panel}`}>
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
      <fieldset className={controls.group}>
        <legend>Playback</legend>
        <div className={controls.row}>
          <Button onClick={() => setMounted((value) => !value)}>
            {mounted ? "Destroy scene" : "Start scene"}
          </Button>
          <Button
            variant="outlined"
            disabled={!mounted}
            onClick={() =>
              snapshot?.locallyPaused
                ? handle.current?.resume()
                : handle.current?.pause()
            }
          >
            {snapshot?.locallyPaused ? "Resume scene" : "Pause scene"}
          </Button>
          <Button
            variant="outlined"
            disabled={!mounted}
            onClick={() => handle.current?.reset()}
          >
            Reset seeded state
          </Button>
        </div>
      </fieldset>
      <fieldset className={controls.group}>
        <legend>Scene & frame</legend>
        <div className={controls.fields}>
          {aperture && (
            <label className={fields.field}>
              <span className={fields.label}>Aperture</span>
              <select
                className={fields.control}
                value={selection}
                onChange={(event) =>
                  setSelection(event.target.value as SceneApertureSelection)
                }
              >
                <option value="web">WEB</option>
                <option value="technical-diamond">Diamond</option>
              </select>
            </label>
          )}
          <label className={fields.field}>
            <span className={fields.label}>Frame width</span>
            <select
              className={fields.control}
              value={fixtureSize}
              onChange={(event) =>
                setFixtureSize(event.target.value as typeof fixtureSize)
              }
            >
              <option value="compact">Compact · 320 px</option>
              <option value="standard">Standard · 640 px</option>
              <option value="large">Large · 1280 px</option>
            </select>
          </label>
          <label className={controls.timeline}>
            <span>
              Particle count ·{" "}
              {snapshot?.config.count ?? DEFAULT_PARTICLE_CONFIG.count}
            </span>
            <input
              type="range"
              aria-label="Particle count"
              disabled={!mounted}
              min={PARTICLE_SETTINGS.controls.count.min}
              max={PARTICLE_SETTINGS.controls.count.max}
              step={PARTICLE_SETTINGS.controls.count.step}
              value={snapshot?.config.count ?? DEFAULT_PARTICLE_CONFIG.count}
              onChange={(event) =>
                handle.current?.configure({ count: Number(event.target.value) })
              }
            />
          </label>
        </div>
        {aperture && (
          <label className={controls.row}>
            <input
              type="checkbox"
              checked={short}
              onChange={(event) => setShort(event.target.checked)}
            />
            Short frame (4:1)
          </label>
        )}
      </fieldset>
      <div className={controls.group}>
        <MotionChoices
          value={preference}
          onChange={(value) => services.motionPolicy.setPreference(value)}
        />
        {aperture && (
          <fieldset className={controls.theme}>
            <legend>Theme</legend>
            <ThemeSwitcher presentation="outlined" />
          </fieldset>
        )}
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
          {(["web", "technical-diamond"] as const).map((shape) => (
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
        the current seeded configuration and retains local Pause. To restore
        default controls, use the animation details page’s customization dialog.
      </p>
    </main>
  );
}
