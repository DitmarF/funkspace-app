import type { GameMountOptions } from "../GameMountOptions.js";
import type { GameTheme } from "../GameTheme.js";
import type {
  EnemyRenderSnapshot,
  GamePresentationPort,
  GameRenderSnapshot,
  JoystickRenderSnapshot,
  ProjectileRenderSnapshot,
} from "../domain/GamePresentationPort.js";
import { ARENA, VISIBLE_ARENA_BOUNDS } from "../domain/arena/index.js";
import { doesCircleIntersectBounds } from "../domain/geometry/index.js";
import { calculateAspectFit } from "./AspectFit.js";
import { calculateBackingResolution } from "./BackingResolution.js";
import {
  calculateEntryWarningGeometry,
  type EntryWarningGeometry,
} from "./EntryWarningGeometry.js";

const INACTIVE_JOYSTICK_BASE_ALPHA = 0.18;
const ACTIVE_JOYSTICK_BASE_ALPHA = 0.3;
const INACTIVE_JOYSTICK_KNOB_ALPHA = 0.35;
const ACTIVE_JOYSTICK_KNOB_ALPHA = 0.7;
const ENTRY_WARNING_BORDER_INSET = 2;
const ENTRY_WARNING_DEPTH = 12;
const ENTRY_WARNING_HALF_BASE = 6;
const ENEMY_LINE_WIDTH = 2;
const PLAYER_INVULNERABILITY_RING_GAP = 4;
const PLAYER_INVULNERABILITY_RING_LINE_WIDTH = 2;
const HEALTH_BAR_X = 10;
const HEALTH_BAR_Y = 10;
const HEALTH_BAR_WIDTH = 84;
const HEALTH_BAR_HEIGHT = 8;
const HEALTH_BAR_INSET = 1;
const KILL_COUNT_RIGHT_INSET = 10;
const KILL_COUNT_TOP_INSET = 10;
const KILL_COUNT_FONT = "600 12px sans-serif";
const TERMINAL_LABEL_FONT = "700 32px sans-serif";

function getBrowserDevicePixelRatio(): number {
  return typeof window === "undefined" ? 1 : window.devicePixelRatio;
}

/**
 * Canvas ownership boundary for Wave Survivor.
 *
 * It owns responsive Canvas sizing and draws immutable logical snapshots.
 * Gameplay rules and browser rendering concerns remain on opposite sides of
 * the presentation boundary.
 */
export class CanvasGameRenderer implements GamePresentationPort {
  private canvas: HTMLCanvasElement | null;
  private context: CanvasRenderingContext2D | null;
  private destroyed = false;
  private latestSnapshot: GameRenderSnapshot | null = null;
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

  render(snapshot: GameRenderSnapshot): void {
    if (this.destroyed) return;

    this.latestSnapshot = snapshot;
    this.drawFrame();
  }

  setTheme(theme: GameTheme): void {
    if (!this.destroyed && this.canvas) {
      this.theme = theme;
      this.drawFrame();
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
    this.drawFrame();
  }

  private drawFrame(): void {
    if (!this.context || !this.theme) return;

    this.context.fillStyle = this.theme.colors.background;
    this.context.fillRect(0, 0, ARENA.width, ARENA.height);

    this.context.strokeStyle = this.theme.colors.effect;
    this.context.lineWidth = 1;
    this.context.strokeRect(0.5, 0.5, ARENA.width - 1, ARENA.height - 1);

    if (!this.latestSnapshot) return;

    this.drawEntryWarnings(this.latestSnapshot);
    this.drawBossActions(this.latestSnapshot.enemies);
    this.drawEnemies(this.latestSnapshot.enemies);
    this.drawBossEntryAnnouncement(this.latestSnapshot);

    this.context.fillStyle = this.theme.colors.player;
    this.context.beginPath();
    this.context.arc(
      this.latestSnapshot.playerX,
      this.latestSnapshot.playerY,
      this.latestSnapshot.playerCollisionRadius,
      0,
      Math.PI * 2,
    );
    this.context.fill();

    if (this.latestSnapshot.isPlayerInvulnerable) {
      this.drawPlayerInvulnerabilityRing(this.latestSnapshot);
    }

    this.drawProjectiles(this.latestSnapshot.projectiles);

    if (this.latestSnapshot.joystick) {
      this.drawJoystick(this.latestSnapshot.joystick);
    }

    this.drawHealth(this.latestSnapshot);
    this.drawKillCount(this.latestSnapshot.killCount);

    if (
      this.latestSnapshot.phase === "lost" ||
      this.latestSnapshot.phase === "won"
    ) {
      this.drawTerminalState(this.latestSnapshot.phase);
    }
  }

  private drawEntryWarnings(snapshot: GameRenderSnapshot): void {
    if (!this.context || !this.theme) return;

    for (const enemy of snapshot.enemies) {
      if (enemy.entryWarning === "boss") continue;
      if (
        enemy.phase !== "entering" ||
        doesCircleIntersectBounds(
          { x: enemy.x, y: enemy.y },
          enemy.collisionRadius,
          VISIBLE_ARENA_BOUNDS,
        )
      ) {
        continue;
      }

      const warning = calculateEntryWarningGeometry(
        { x: enemy.x, y: enemy.y },
        { x: snapshot.playerX, y: snapshot.playerY },
        VISIBLE_ARENA_BOUNDS,
      );
      if (warning) {
        this.context.fillStyle = this.theme.colors.effect;
        this.drawEntryWarning(warning);
      }
    }
  }

  private drawEntryWarning(warning: EntryWarningGeometry): void {
    if (!this.context) return;

    const isHorizontalEdge =
      warning.edge === "top" || warning.edge === "bottom";
    const anchorX = isHorizontalEdge
      ? Math.max(
          ENTRY_WARNING_HALF_BASE,
          Math.min(warning.x, ARENA.width - ENTRY_WARNING_HALF_BASE),
        )
      : warning.x;
    const anchorY = isHorizontalEdge
      ? warning.y
      : Math.max(
          ENTRY_WARNING_HALF_BASE,
          Math.min(warning.y, ARENA.height - ENTRY_WARNING_HALF_BASE),
        );
    const tangentX = -warning.inwardDirectionY;
    const tangentY = warning.inwardDirectionX;
    const baseCenterX =
      anchorX + warning.inwardDirectionX * ENTRY_WARNING_BORDER_INSET;
    const baseCenterY =
      anchorY + warning.inwardDirectionY * ENTRY_WARNING_BORDER_INSET;

    this.context.beginPath();
    this.context.moveTo(
      baseCenterX + tangentX * ENTRY_WARNING_HALF_BASE,
      baseCenterY + tangentY * ENTRY_WARNING_HALF_BASE,
    );
    this.context.lineTo(
      baseCenterX - tangentX * ENTRY_WARNING_HALF_BASE,
      baseCenterY - tangentY * ENTRY_WARNING_HALF_BASE,
    );
    this.context.lineTo(
      anchorX + warning.inwardDirectionX * ENTRY_WARNING_DEPTH,
      anchorY + warning.inwardDirectionY * ENTRY_WARNING_DEPTH,
    );
    this.context.closePath();
    this.context.fill();
  }

  private drawEnemies(enemies: readonly EnemyRenderSnapshot[]): void {
    if (!this.context || !this.theme) return;

    for (const enemy of enemies) {
      if (enemy.phase === "entering" && enemy.entryWarning !== "boss") continue;

      if (enemy.phase === "dying") {
        this.context.strokeStyle = this.theme.colors.effect;
        this.context.lineWidth = ENEMY_LINE_WIDTH;
        this.context.beginPath();
        this.context.moveTo(
          enemy.x - enemy.collisionRadius,
          enemy.y - enemy.collisionRadius,
        );
        this.context.lineTo(
          enemy.x + enemy.collisionRadius,
          enemy.y + enemy.collisionRadius,
        );
        this.context.moveTo(
          enemy.x + enemy.collisionRadius,
          enemy.y - enemy.collisionRadius,
        );
        this.context.lineTo(
          enemy.x - enemy.collisionRadius,
          enemy.y + enemy.collisionRadius,
        );
        this.context.stroke();
        continue;
      }

      this.context.strokeStyle = this.theme.colors.enemy;
      this.context.lineWidth = ENEMY_LINE_WIDTH;
      this.context.beginPath();
      this.context.moveTo(enemy.x, enemy.y - enemy.collisionRadius);
      this.context.lineTo(enemy.x + enemy.collisionRadius, enemy.y);
      this.context.lineTo(enemy.x, enemy.y + enemy.collisionRadius);
      this.context.lineTo(enemy.x - enemy.collisionRadius, enemy.y);
      this.context.closePath();
      this.context.stroke();
    }
  }

  /** Essential static information, also the reduced-effects baseline. Geometry
   * and deadlines arrive from Domain; resizing/themes only redraw this snapshot.
   */
  private drawBossActions(enemies: readonly EnemyRenderSnapshot[]): void {
    const context = this.context;
    if (!context || !this.theme) return;
    for (const enemy of enemies) {
      const action = enemy.bossAction;
      if (enemy.phase !== "active" || !action) continue;
      context.strokeStyle = this.theme.colors.effect;
      context.fillStyle = this.theme.colors.effect;
      context.lineWidth = action.phase === "charge" ? 4 : 2;
      const path = action.chargePath;
      if (path) {
        const angle = Math.atan2(path.direction.y, path.direction.x);
        const nx = -path.direction.y * path.radius;
        const ny = path.direction.x * path.radius;
        // Outlined capsule is the swept boss body, including both circular ends.
        context.beginPath();
        context.moveTo(path.from.x + nx, path.from.y + ny);
        context.lineTo(path.to.x + nx, path.to.y + ny);
        context.arc(
          path.to.x,
          path.to.y,
          path.radius,
          angle + Math.PI / 2,
          angle - Math.PI / 2,
          true,
        );
        context.lineTo(path.from.x - nx, path.from.y - ny);
        context.arc(
          path.from.x,
          path.from.y,
          path.radius,
          angle - Math.PI / 2,
          angle + Math.PI / 2,
          true,
        );
        context.closePath();
        context.stroke();
        // Arrow sits inside the endpoint, so it remains visible at arena edges.
        context.beginPath();
        context.moveTo(
          path.to.x - path.direction.x * 12 - path.direction.y * 8,
          path.to.y - path.direction.y * 12 + path.direction.x * 8,
        );
        context.lineTo(path.to.x, path.to.y);
        context.lineTo(
          path.to.x - path.direction.x * 12 + path.direction.y * 8,
          path.to.y - path.direction.y * 12 - path.direction.x * 8,
        );
        context.stroke();
      }
      if (action.phase === "wind-up") {
        context.beginPath();
        context.arc(
          enemy.x,
          enemy.y,
          enemy.collisionRadius / 2,
          0,
          Math.PI * 2,
        );
        context.stroke();
      } else if (action.phase === "recovery") {
        context.beginPath();
        for (const offset of [-5, 5]) {
          context.moveTo(enemy.x - 10, enemy.y + offset);
          context.lineTo(enemy.x + 10, enemy.y + offset);
        }
        context.stroke();
      }
      const label =
        action.phase === "wind-up"
          ? "WIND-UP"
          : action.phase === "recovery"
            ? "RECOVER"
            : action.phase.toUpperCase();
      const remaining = Math.ceil(action.secondsRemaining * 10) / 10;
      const text =
        action.phase === "wind-up" || action.phase === "recovery"
          ? `${label} ${remaining.toFixed(1)}s`
          : label;
      const x = Math.max(74, Math.min(ARENA.width - 74, enemy.x));
      const y = Math.max(72, enemy.y - enemy.collisionRadius - 20);
      context.fillStyle = this.theme.colors.background;
      context.fillRect(x - 72, y - 2, 144, 18);
      context.fillStyle = this.theme.colors.effect;
      context.font = "700 12px sans-serif";
      context.textAlign = "center";
      context.textBaseline = "top";
      context.fillText(text, x, y);
    }
  }

  /** Static double chevron plus text; actors remain visible above the warning. */
  private drawBossEntryAnnouncement(snapshot: GameRenderSnapshot): void {
    if (!this.context || !this.theme) return;
    const boss = snapshot.enemies.find(
      (enemy) => enemy.entryWarning === "boss",
    );
    if (!boss) return;
    this.context.fillStyle = this.theme.colors.background;
    this.context.fillRect(ARENA.width / 2 - 120, 28, 240, 38);
    this.context.strokeStyle = this.theme.colors.effect;
    this.context.lineWidth = 3;
    this.context.beginPath();
    for (const y of [6, 16]) {
      this.context.moveTo(boss.x - 12, y);
      this.context.lineTo(boss.x, y + 8);
      this.context.lineTo(boss.x + 12, y);
    }
    this.context.stroke();
    this.context.fillStyle = this.theme.colors.effect;
    this.context.font = "700 16px sans-serif";
    this.context.textAlign = "center";
    this.context.textBaseline = "top";
    this.context.fillText("BOSS INCOMING", ARENA.width / 2, 30);
    this.context.font = "600 12px sans-serif";
    this.context.fillText("Move clear of the top entry", ARENA.width / 2, 49);
  }

  private drawProjectiles(
    projectiles: readonly ProjectileRenderSnapshot[],
  ): void {
    if (!this.context || !this.theme || projectiles.length === 0) return;

    this.context.fillStyle = this.theme.colors.projectile;

    for (const projectile of projectiles) {
      this.context.beginPath();
      this.context.arc(
        projectile.x,
        projectile.y,
        projectile.collisionRadius,
        0,
        Math.PI * 2,
      );
      this.context.fill();
    }
  }

  private drawPlayerInvulnerabilityRing(snapshot: GameRenderSnapshot): void {
    if (!this.context || !this.theme) return;

    this.context.strokeStyle = this.theme.colors.effect;
    this.context.lineWidth = PLAYER_INVULNERABILITY_RING_LINE_WIDTH;
    this.context.beginPath();
    this.context.arc(
      snapshot.playerX,
      snapshot.playerY,
      snapshot.playerCollisionRadius + PLAYER_INVULNERABILITY_RING_GAP,
      0,
      Math.PI * 2,
    );
    this.context.stroke();
  }

  private drawKillCount(killCount: number): void {
    if (!this.context || !this.theme) return;

    this.context.fillStyle = this.theme.colors.effect;
    this.context.font = KILL_COUNT_FONT;
    this.context.textAlign = "right";
    this.context.textBaseline = "top";
    this.context.fillText(
      `Kills: ${killCount}`,
      ARENA.width - KILL_COUNT_RIGHT_INSET,
      KILL_COUNT_TOP_INSET,
    );
  }

  private drawHealth(snapshot: GameRenderSnapshot): void {
    if (!this.context || !this.theme) return;

    const healthRatio =
      snapshot.playerMaximumHealth > 0
        ? Math.max(
            0,
            Math.min(
              1,
              snapshot.playerCurrentHealth / snapshot.playerMaximumHealth,
            ),
          )
        : 0;

    this.context.strokeStyle = this.theme.colors.effect;
    this.context.lineWidth = 1;
    this.context.strokeRect(
      HEALTH_BAR_X + 0.5,
      HEALTH_BAR_Y + 0.5,
      HEALTH_BAR_WIDTH - 1,
      HEALTH_BAR_HEIGHT - 1,
    );

    if (healthRatio <= 0) return;

    this.context.fillStyle = this.theme.colors.player;
    this.context.fillRect(
      HEALTH_BAR_X + HEALTH_BAR_INSET,
      HEALTH_BAR_Y + HEALTH_BAR_INSET,
      (HEALTH_BAR_WIDTH - HEALTH_BAR_INSET * 2) * healthRatio,
      HEALTH_BAR_HEIGHT - HEALTH_BAR_INSET * 2,
    );
  }

  private drawTerminalState(outcome: "won" | "lost"): void {
    if (!this.context || !this.theme) return;

    this.context.fillStyle = this.theme.colors.effect;
    this.context.font = TERMINAL_LABEL_FONT;
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    this.context.fillText(
      outcome.toUpperCase(),
      ARENA.width / 2,
      ARENA.height / 2,
    );
  }

  private drawJoystick(snapshot: JoystickRenderSnapshot): void {
    if (!this.context || !this.theme) return;

    const previousGlobalAlpha = this.context.globalAlpha;
    this.context.fillStyle = this.theme.colors.effect;

    try {
      this.context.globalAlpha = snapshot.active
        ? ACTIVE_JOYSTICK_BASE_ALPHA
        : INACTIVE_JOYSTICK_BASE_ALPHA;
      this.context.beginPath();
      this.context.arc(
        snapshot.centerX,
        snapshot.centerY,
        snapshot.baseRadius,
        0,
        Math.PI * 2,
      );
      this.context.fill();

      this.context.globalAlpha = snapshot.active
        ? ACTIVE_JOYSTICK_KNOB_ALPHA
        : INACTIVE_JOYSTICK_KNOB_ALPHA;
      this.context.beginPath();
      this.context.arc(
        snapshot.knobX,
        snapshot.knobY,
        snapshot.knobRadius,
        0,
        Math.PI * 2,
      );
      this.context.fill();
    } finally {
      this.context.globalAlpha = previousGlobalAlpha;
    }
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
    this.latestSnapshot = null;
    this.theme = null;
  }
}
