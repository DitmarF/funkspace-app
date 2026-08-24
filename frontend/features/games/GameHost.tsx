"use client";

import { useEffect, useRef, useState } from "react";
import { useServices } from "@/application/providers/ServiceProvider";
import {
  gameLoader,
  type GameId,
  type GameModuleLoader,
  type HostedGameController,
} from "./GameLoader";
import { FunkSpaceGameThemeAdapter } from "./theme";

type GameHostStatus = "loading" | "ready" | "error";

const statusMessages: Record<GameHostStatus, string> = {
  loading: "Loading game…",
  ready: "Game ready.",
  error: "Game unavailable.",
};

export interface GameHostProps {
  readonly gameId?: GameId;
  readonly label?: string;
  readonly className?: string;
  readonly loader?: GameModuleLoader;
}

/**
 * Portfolio-owned React boundary for a standalone game.
 *
 * React mounts the canvas and coordinates host lifecycle only. Simulation,
 * rendering, input, and all other game behavior stay inside the game package.
 */
export function GameHost({
  gameId = "wave-survivor",
  label = "Wave Survivor game canvas",
  className,
  loader = gameLoader,
}: GameHostProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<GameHostStatus>("loading");
  const { themeService } = useServices();

  useEffect(() => {
    const viewport = viewportRef.current;
    const canvas = canvasRef.current;
    if (!viewport || !canvas) return;

    let cancelled = false;
    let controller: HostedGameController | null = null;
    const themeAdapter = new FunkSpaceGameThemeAdapter(themeService);
    let currentTheme = themeAdapter.getCurrentTheme();

    setStatus("loading");

    const unsubscribeTheme = themeAdapter.subscribe((theme) => {
      currentTheme = theme;
      controller?.setTheme(theme);
    });

    const handleVisibilityChange = () => {
      if (document.hidden) {
        controller?.pause();
      } else {
        controller?.resume();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    void loader
      .load(gameId)
      .then((gameModule) => {
        if (cancelled) return;

        controller = gameModule.createGame({
          canvas,
          viewport,
          theme: currentTheme,
        });
        controller.start();
        if (document.hidden) {
          controller.pause();
        }
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) {
          controller?.destroy();
          controller = null;
          setStatus("error");
        }
      });

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      unsubscribeTheme();
      controller?.destroy();
      controller = null;
    };
  }, [gameId, loader, themeService]);

  return (
    <div
      ref={viewportRef}
      className={className}
      data-game-status={status}
      style={{ overflow: "hidden", position: "relative" }}
    >
      <canvas ref={canvasRef} aria-label={label}>
        Your browser does not support the canvas element.
      </canvas>
      <p className="sr-only" role="status" aria-live="polite">
        {statusMessages[status]}
      </p>
    </div>
  );
}
