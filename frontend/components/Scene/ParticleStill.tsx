"use client";

import { useMemo } from "react";
import { createParticleConnectionSampler } from "@/domain/particles/ParticleConnections";
import {
  createParticleScene,
  getParticleStill,
  type ParticleStill as Still,
} from "@/domain/particles/ParticleScene";

export const initialParticleStill = getParticleStill(
  createParticleScene({ width: 640, height: 360 }),
);

/** Shared bounded pure data; no Canvas, clock or independent simulation. */
export default function ParticleStill({
  still,
  hidden = false,
  className,
}: {
  still: Still;
  hidden?: boolean;
  className?: string;
}) {
  const artwork = useMemo(() => {
    const sample = createParticleConnectionSampler(
      (index) => still.particles[index].radius,
    )(still.particles, still.bounds);
    // Retain the element tree as well as the graph: a visibility-only change
    // must not reconcile every line when a menu covers the running scene.
    return (
      <>
        {sample.links.slice(0, sample.count).map((link) => (
          <line
            key={`${link.from}:${link.to}`}
            x1={`${(still.particles[link.from].x / (still.bounds?.width ?? 640)) * 100}%`}
            y1={`${(still.particles[link.from].y / (still.bounds?.height ?? 360)) * 100}%`}
            x2={`${(still.particles[link.to].x / (still.bounds?.width ?? 640)) * 100}%`}
            y2={`${(still.particles[link.to].y / (still.bounds?.height ?? 360)) * 100}%`}
            stroke="currentColor"
            strokeWidth={link.width}
            opacity={link.opacity}
          />
        ))}
        {still.particles.map((particle) => (
          <circle
            key={particle.id}
            cx={`${(particle.x / (still.bounds?.width ?? 640)) * 100}%`}
            cy={`${(particle.y / (still.bounds?.height ?? 360)) * 100}%`}
            r={particle.radius}
          />
        ))}
      </>
    );
  }, [still]);
  return (
    <svg
      className={className}
      style={{ visibility: hidden ? "hidden" : "visible" }}
      aria-hidden="true"
      data-particle-static
    >
      {artwork}
    </svg>
  );
}
