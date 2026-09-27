"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useCallback,
  type ComponentPropsWithoutRef,
} from "react";
import { FunkSpaceLogoInline } from "./FunkSpaceLogoInline";
import { useServices } from "@/application/providers/ServiceProvider";
import type {
  LogoMotionHandle,
  LogoPlaybackHistory,
} from "@/application/animations/LogoMotionController";
import type { LogoPlaybackState } from "@/domain/ports/LogoMotionPort";

export interface LogoMotionRef {
  play(): void;
  pause(): void;
  reverse(): void;
  seek(ms: number): void;
  setSpeed(f: number): void;
  isReady(): boolean;
  /** Retire this mount's automatic introduction without changing local Pause. */
  cancelIntroduction(): void;
}

export interface LogoMotionProps
  extends Omit<ComponentPropsWithoutRef<typeof FunkSpaceLogoInline>, "ref"> {
  autoPlay?: boolean;
  speed?: number;
  /** Compatibility only: the existing manifest always contains the complete logo. */
  pathCount?: number;
  /** Applied on permitted playback; never hides artwork during pending/denied state. */
  startAtMs?: number;
  /** Opt-in only. True cannot override the composition's feature availability. */
  enabled?: boolean;
  /** Lifecycle notification for the bounded homepage reveal; never a frame callback. */
  onPlaybackState?: (state: LogoPlaybackState) => void;
}

export const LogoMotion = forwardRef<LogoMotionRef, LogoMotionProps>(
  function LogoMotion(
    {
      autoPlay = true,
      speed = 1,
      startAtMs,
      enabled = true,
      onPlaybackState,
      className,
      "aria-label": ariaLabel,
    },
    ref,
  ) {
    const svgRef = useRef<SVGSVGElement>(null);
    const controller = useRef<LogoMotionHandle | null>(null);
    const history = useRef<LogoPlaybackHistory>({
      paused: false,
      started: false,
      completed: false,
      time: 0,
      reversed: false,
    });
    const { bindLogoMotion } = useServices();
    const callback = useRef(onPlaybackState);
    useEffect(() => {
      callback.current = onPlaybackState;
    }, [onPlaybackState]);
    const notify = useCallback(
      (state: LogoPlaybackState) => callback.current?.(state),
      [],
    );
    const options = useRef({
      autoPlay,
      speed,
      startAtMs,
      enabled,
      onPlaybackState: notify,
    });
    // Options are updated separately; theme/menu renders never recreate this binding.
    useEffect(() => {
      if (!svgRef.current) return;
      const owned = bindLogoMotion(
        svgRef.current,
        options.current,
        history.current,
      );
      controller.current = owned;
      return () => {
        owned.release();
        if (controller.current === owned) controller.current = null;
      };
    }, [bindLogoMotion]);
    useEffect(() => {
      options.current = {
        autoPlay,
        speed,
        startAtMs,
        enabled,
        onPlaybackState: notify,
      };
      controller.current?.update(options.current);
    }, [autoPlay, speed, startAtMs, enabled, notify]);
    useImperativeHandle(
      ref,
      () => ({
        play: () => controller.current?.play(),
        pause: () => {
          history.current.paused = true;
          controller.current?.pause();
        },
        reverse: () => controller.current?.reverse(),
        seek: (ms) => controller.current?.seek(ms),
        setSpeed: (value) => controller.current?.setSpeed(value),
        isReady: () => controller.current?.isReady() ?? false,
        cancelIntroduction: () => {
          history.current.autoPlayCancelled = true;
          controller.current?.cancelIntroduction();
        },
      }),
      [],
    );
    return (
      <FunkSpaceLogoInline
        ref={svgRef}
        className={className}
        aria-label={ariaLabel}
      />
    );
  },
);
