export type LogoMotionVariant = "draw" | "fade";
export type LogoPlaybackState = "pending" | "running" | "completed" | "static";

/** Narrow, per-logo renderer boundary. No preference or browser types. */
export interface LogoMotionBinding {
  prepare(variant: LogoMotionVariant): void;
  readonly duration: number;
  readonly time: number;
  showStatic(): void;
  play(): void;
  pause(): void;
  reverse(): void;
  seek(ms: number): void;
  setSpeed(value: number): void;
  destroy(): void;
}

export interface LogoMotionEvents {
  /** Optional observation of the existing renderer clock; never owns a loop. */
  position?(timeMs: number, durationMs: number): void;
  visibility(visible: boolean): void;
  completed(): void;
  failed(): void;
}

export type LogoMotionBindingFactory = (
  events: LogoMotionEvents,
) => LogoMotionBinding;
