import type { AnimationRuntime } from "@funkspace/common/motion";
import type {
  ParticleSceneState,
  ParticleConfig,
  ParticleStill,
} from "../particles/ParticleScene";
import type {
  ConsumerMotionInputs,
  MotionPermission,
} from "../motion/MotionPolicy";

export type ParticlePalette = Readonly<{
  background: string;
  particle: string;
}>;
export type ParticleGeometry = Readonly<{
  width: number;
  height: number;
  dpr: number;
}>;
export type ParticleSurface = ParticleGeometry &
  Readonly<{
    visible: boolean;
    palette: ParticlePalette | null;
  }>;

export interface ParticleRuntimeEvents {
  frameReady(ready: boolean): void;
  failed(error: unknown): void;
}

/** Only the concrete renderer owns a frame clock. State is one per-instance handle. */
export interface ParticleSceneRuntime extends AnimationRuntime {
  setGeometry(value: ParticleGeometry): void;
  setPalette(value: ParticlePalette): void;
  setVisible(visible: boolean): void;
  invalidate(): void;
}

/** Lightweight observation exists before prepare can import optional renderer code. */
export interface ParticleSceneBinding {
  getSnapshot(): ParticleSurface;
  subscribe(listener: (surface: ParticleSurface) => void): () => void;
  prepare(
    state: ParticleSceneState,
    current: () => boolean,
    events: ParticleRuntimeEvents,
  ): Promise<ParticleSceneRuntime>;
  destroy(): void;
}

export type ParticlePresentation = Readonly<{
  introReady: boolean;
  coverReady: boolean;
  occluded: boolean;
}>;

export type ParticleSceneOptions = Readonly<{
  optedIn?: boolean;
  config?: unknown;
  seed?: unknown;
  presentation?: ParticlePresentation;
}>;

export type ParticleSceneSnapshot = Readonly<{
  status: ConsumerMotionInputs["runtime"];
  config: ParticleConfig;
  locallyPaused: boolean;
  /** Explicit Reduced renders a still without changing the user's local Pause. */
  reducedMotion: boolean;
  /** Measured geometry has no valid palette; independent artwork can be shown. */
  paletteUnavailable: boolean;
  frameReady: boolean;
  presentation: MotionPermission["presentation"];
  blockers: MotionPermission["blockers"];
}>;

export interface ParticleSceneHandle {
  getSnapshot(): ParticleSceneSnapshot;
  getStill(): ParticleStill;
  subscribe(listener: (snapshot: ParticleSceneSnapshot) => void): () => void;
  setPresentation(value: ParticlePresentation): void;
  configure(input: unknown): ParticleConfig;
  pause(): void;
  resume(): void;
  reset(): void;
  destroy(): void;
}

/** Browser targets are specialized only by the existing composition root. */
export type ParticleSceneFactory<TTarget> = (
  target: TTarget,
  options: ParticleSceneOptions,
) => ParticleSceneHandle;
