import type { GameTheme } from "../GameTheme.js";
import type {
  GamePresentationPort,
  GameRenderSnapshot,
  JoystickRenderSnapshot,
} from "../domain/GamePresentationPort.js";
import type { MovementInputPort } from "../domain/MovementInputPort.js";
import { calculateNextPlayerPosition } from "../domain/movement/PlayerMovement.js";
import {
  createInitialRuntimeState,
  type RuntimePhase,
  type RuntimeState,
} from "../domain/state/RuntimeState.js";

/** Owns the current deterministic session and coordinates one fixed update. */
export class GameRuntimeSession {
  constructor(
    private state: RuntimeState,
    private input: MovementInputPort | null,
    private presentation: GamePresentationPort | null,
    private readJoystickSnapshot:
      | (() => JoystickRenderSnapshot | null)
      | null = null,
  ) {}

  get phase(): RuntimePhase {
    return this.state.phase;
  }

  start(): boolean {
    if (this.state.phase !== "idle") return false;

    this.state.phase = "playing";
    return true;
  }

  pause(): boolean {
    if (this.state.phase !== "playing") return false;

    this.state.phase = "paused";
    this.input?.reset();
    return true;
  }

  resume(): boolean {
    if (this.state.phase !== "paused") return false;

    this.state.phase = "playing";
    return true;
  }

  restart(): void {
    this.input?.reset();
    this.state = createInitialRuntimeState();
    this.state.phase = "playing";
  }

  fixedUpdate(deltaSeconds: number): void {
    if (this.state.phase !== "playing" || !this.input) return;

    const movementIntent = this.input.readMovementIntent();
    this.state.movementIntent = movementIntent;
    this.state.player.position = calculateNextPlayerPosition(
      this.state.player,
      movementIntent,
      deltaSeconds,
    );
    this.state.simulationTimeSeconds += deltaSeconds;
  }

  render(): void {
    if (!this.presentation) return;

    const snapshot: GameRenderSnapshot = {
      phase: this.state.phase,
      simulationTimeSeconds: this.state.simulationTimeSeconds,
      playerX: this.state.player.position.x,
      playerY: this.state.player.position.y,
      playerCollisionRadius: this.state.player.collisionRadius,
      joystick: this.readJoystickSnapshot?.() ?? null,
    };
    this.presentation.render(snapshot);
  }

  setTheme(theme: GameTheme): void {
    this.presentation?.setTheme(theme);
  }

  destroy(): void {
    this.input?.reset();
    this.input?.destroy();
    this.input = null;
    this.readJoystickSnapshot = null;

    this.presentation?.destroy();
    this.presentation = null;
  }
}
