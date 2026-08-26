import type { GameMountOptions } from "../GameMountOptions.js";
import type { GameTheme } from "../GameTheme.js";
import type { GamePresentationPort } from "../domain/GamePresentationPort.js";
import { ARENA } from "../domain/arena/index.js";
import { PLAYER_COLLISION_RADIUS } from "../domain/state/index.js";
import { calculateAspectFit } from "./AspectFit.js";
import { calculateBackingResolution } from "./BackingResolution.js";

function getBrowserDevicePixelRatio(): number {
  return typeof window === "undefined" ? 1 : window.devicePixelRatio;
}

/**
 * Canvas ownership boundary for Wave Survivor.
 *
 * It owns responsive Canvas sizing and the static arena shell. Gameplay and
 * per-frame drawing remain absent, and browser rendering concerns stay out of
 * the application controller.
 */
export class CanvasGameRenderer implements GamePresentationPort {
  private canvas: HTMLCanvasElement | null;
  private context: CanvasRenderingContext2D | null;
  private destroyed = false;
  private resizeObserver: ResizeObserver | null = null;
  private theme: GameTheme | null;

  constructor(
    options: GameMountOptions,
    devicePixelRatio = getBrowserDevicePixelRatio(),
  ) {
    this.canvas = options.canvas;
    this.context = options.canvas.getContext("2d");
    this.theme = options.theme;

    this.resizeToViewport(options.viewport, devicePixelRatio);
    this.observeResize(options.viewport);
  }

  get mountedCanvas(): HTMLCanvasElement | null {
    return this.canvas;
  }

  get currentTheme(): GameTheme | null {
    return this.theme;
  }

  setTheme(theme: GameTheme): void {
    if (!this.destroyed && this.canvas) {
      this.theme = theme;
      this.drawArena();
    }
  }

  /** Update display and backing dimensions without changing logical units. */
  resize(
    availableWidth: number,
    availableHeight: number,
    devicePixelRatio = getBrowserDevicePixelRatio(),
  ): void {
    if (this.destroyed || !this.canvas || !this.context) return;

    const fit = calculateAspectFit(availableWidth, availableHeight);
    const resolution = calculateBackingResolution(
      fit.displayWidth,
      fit.displayHeight,
      devicePixelRatio,
    );

    this.canvas.style.display = "block";
    this.canvas.style.position = "absolute";
    this.canvas.style.left = "0px";
    this.canvas.style.top = "0px";
    this.canvas.style.width = `${fit.displayWidth}px`;
    this.canvas.style.height = `${fit.displayHeight}px`;
    // Layout margins can resize the observed parent and create resize feedback.
    this.canvas.style.margin = "0px";
    this.canvas.style.transform = `translate(${fit.horizontalOffset}px, ${fit.verticalOffset}px)`;
    this.canvas.width = resolution.backingWidth;
    this.canvas.height = resolution.backingHeight;

    if (fit.scale <= 0) return;

    const renderScale = fit.scale * resolution.effectiveDpr;
    this.context.setTransform(renderScale, 0, 0, renderScale, 0, 0);
    this.drawArena();
  }

  private drawArena(): void {
    if (!this.context || !this.theme) return;

    this.context.fillStyle = this.theme.colors.background;
    this.context.fillRect(0, 0, ARENA.width, ARENA.height);

    this.context.strokeStyle = this.theme.colors.effect;
    this.context.lineWidth = 1;
    this.context.strokeRect(0.5, 0.5, ARENA.width - 1, ARENA.height - 1);

    this.context.fillStyle = this.theme.colors.player;
    this.context.beginPath();
    this.context.arc(
      ARENA.width / 2,
      ARENA.height / 2,
      PLAYER_COLLISION_RADIUS,
      0,
      Math.PI * 2,
    );
    this.context.fill();
  }

  private resizeToViewport(
    viewport: HTMLElement,
    devicePixelRatio?: number,
  ): void {
    this.resize(viewport.clientWidth, viewport.clientHeight, devicePixelRatio);
  }

  private observeResize(target: HTMLElement): void {
    if (typeof ResizeObserver === "undefined") return;

    this.resizeObserver = new ResizeObserver(() => {
      this.resizeToViewport(target);
    });
    this.resizeObserver.observe(target);
  }

  destroy(): void {
    if (this.destroyed) return;

    this.destroyed = true;
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.context = null;
    this.canvas = null;
    this.theme = null;
  }
}
