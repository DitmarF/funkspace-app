import type { LogoPlaybackState } from "./LogoMotionPort";

/** One homepage's reveal; never a routing, preference or animation authority. */
export interface HomeIntroBinding {
  logoState(state: LogoPlaybackState): void;
  release(): void;
}
