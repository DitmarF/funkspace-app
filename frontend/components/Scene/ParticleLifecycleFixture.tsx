"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  createParticleConnectionSampler,
  PARTICLE_CONNECTIONS,
} from "@/domain/particles/ParticleConnections";
import { useServices } from "@/application/providers/ServiceProvider";
import {
  createParticleScene,
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

const fallback = getParticleStill(
  createParticleScene({ width: 640, height: 360 }),
);

/** Diagnostic only. No automatic mount, homepage integration or product aperture. */
export default function ParticleLifecycleFixture() {
  const services = useServices();
  const host = useRef<HTMLDivElement>(null);
  const handle = useRef<ParticleSceneHandle | undefined>(undefined);
  const [mounted, setMounted] = useState(false);
  const [compact, setCompact] = useState(false);
  const [snapshot, setSnapshot] = useState<ParticleSceneSnapshot>();
  const [still, setStill] = useState(fallback);
  const connections = useMemo(() => {
    const sample = createParticleConnectionSampler()(still.particles);
    return sample.links.slice(0, sample.count);
  }, [still]);
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
      presentation: { introReady: true, coverReady: true, occluded: false },
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
  }, [services, mounted]);
  const showCanvas =
    mounted &&
    snapshot?.frameReady &&
    snapshot.presentation !== "complete-static";
  return (
    <main className={styles.fixture}>
      <h1>Particle lifecycle fixture</h1>
      <p>
        Unmasked diagnostic for FS-4.3. Start explicitly; motion choices and the
        build availability flag still apply. This is not the homepage animation.
      </p>
      <MotionChoices
        value={preference}
        onChange={(value) => services.motionPolicy.setPreference(value)}
      />
      <div className={styles.controls}>
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
        <Button onClick={() => setCompact((value) => !value)}>
          Resize fixture
        </Button>
        <Button
          disabled={!mounted}
          onClick={() =>
            handle.current?.configure({
              count: snapshot?.config.count === 120 ? 240 : 120,
            })
          }
        >
          Toggle particle count
        </Button>
      </div>
      <p role="status">
        {mounted ? (snapshot?.status ?? "unprepared") : "unmounted"} ·{" "}
        {snapshot?.config.count ?? 120} particles
      </p>
      <div
        ref={host}
        className={`${styles.surface} ${compact ? styles.compact : ""}`}
        data-particle-fixture
      >
        <svg
          className={styles.still}
          style={{ visibility: showCanvas ? "hidden" : "visible" }}
          viewBox={`0 0 ${still.bounds?.width ?? 640} ${still.bounds?.height ?? 360}`}
          aria-hidden="true"
          data-particle-static
        >
          {connections.map((link) => (
            <line
              key={`${link.from}:${link.to}`}
              x1={still.particles[link.from].x}
              y1={still.particles[link.from].y}
              x2={still.particles[link.to].x}
              y2={still.particles[link.to].y}
              stroke="currentColor"
              strokeWidth={PARTICLE_CONNECTIONS.width}
              opacity={link.opacity}
            />
          ))}
          {still.particles.map((particle) => (
            <circle
              key={particle.id}
              cx={particle.x}
              cy={particle.y}
              r={particle.radius}
            />
          ))}
        </svg>
      </div>
      <p>
        The static representation is independent of Canvas. Reset here resets
        the current seeded configuration and retains local Pause; product Reset
        belongs to later customization work.
      </p>
    </main>
  );
}
