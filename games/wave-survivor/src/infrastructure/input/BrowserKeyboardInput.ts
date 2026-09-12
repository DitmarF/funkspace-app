import type { MovementInputPort } from "../../domain/MovementInputPort.js";
import {
  createMovementIntent,
  ZERO_MOVEMENT_INTENT,
  type MovementIntent,
} from "../../domain/movement/MovementIntent.js";

const MOVEMENT_KEY_CODES = [
  "KeyW",
  "ArrowUp",
  "KeyS",
  "ArrowDown",
  "KeyA",
  "ArrowLeft",
  "KeyD",
  "ArrowRight",
] as const;

type MovementKeyCode = (typeof MOVEMENT_KEY_CODES)[number];

const MOVEMENT_KEY_CODE_SET: ReadonlySet<string> = new Set(MOVEMENT_KEY_CODES);

function isMovementKeyCode(code: string): code is MovementKeyCode {
  return MOVEMENT_KEY_CODE_SET.has(code);
}

function getBrowserWindow(): Window | null {
  return typeof window === "undefined" ? null : window;
}

/** Surface-scoped browser keyboard adapter for WASD and arrow movement. */
export class BrowserKeyboardInput implements MovementInputPort {
  private destroyed = false;
  private readonly didModifyTabIndex: boolean;
  private readonly heldKeys = new Set<MovementKeyCode>();
  private readonly previousTabIndexAttribute: string | null;
  private surface: HTMLCanvasElement | null;
  private windowTarget: Window | null;

  constructor(
    surface: HTMLCanvasElement,
    windowTarget: Window | null = getBrowserWindow(),
  ) {
    this.surface = surface;
    this.windowTarget = windowTarget;
    this.previousTabIndexAttribute = surface.getAttribute("tabindex");
    this.didModifyTabIndex = surface.tabIndex < 0;

    if (this.didModifyTabIndex) {
      surface.tabIndex = 0;
    }

    surface.addEventListener("keydown", this.handleKeyDown);
    surface.addEventListener("keyup", this.handleKeyUp);
    surface.addEventListener("blur", this.handleBlur);
    windowTarget?.addEventListener("blur", this.handleBlur);
  }

  readMovementIntent(): MovementIntent {
    if (this.destroyed) return ZERO_MOVEMENT_INTENT;

    const horizontal =
      Number(this.isAnyHeld("KeyD", "ArrowRight")) -
      Number(this.isAnyHeld("KeyA", "ArrowLeft"));
    const vertical =
      Number(this.isAnyHeld("KeyS", "ArrowDown")) -
      Number(this.isAnyHeld("KeyW", "ArrowUp"));

    return createMovementIntent(horizontal, vertical);
  }

  reset(): void {
    this.heldKeys.clear();
  }

  destroy(): void {
    if (this.destroyed) return;

    this.destroyed = true;
    this.reset();
    this.surface?.removeEventListener("keydown", this.handleKeyDown);
    this.surface?.removeEventListener("keyup", this.handleKeyUp);
    this.surface?.removeEventListener("blur", this.handleBlur);
    this.windowTarget?.removeEventListener("blur", this.handleBlur);
    this.restoreTabIndex();
    this.surface = null;
    this.windowTarget = null;
  }

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    if (this.destroyed || !isMovementKeyCode(event.code)) return;

    event.preventDefault();
    // A held key must not re-enter the cleared set after replay or interruption.
    if (event.repeat) return;
    this.heldKeys.add(event.code);
  };

  private readonly handleKeyUp = (event: KeyboardEvent): void => {
    if (this.destroyed || !isMovementKeyCode(event.code)) return;

    event.preventDefault();
    this.heldKeys.delete(event.code);
  };

  private readonly handleBlur = (): void => {
    this.reset();
  };

  private isAnyHeld(...codes: readonly MovementKeyCode[]): boolean {
    return codes.some((code) => this.heldKeys.has(code));
  }

  private restoreTabIndex(): void {
    if (!this.surface || !this.didModifyTabIndex) return;

    if (this.previousTabIndexAttribute === null) {
      this.surface.removeAttribute("tabindex");
    } else {
      this.surface.setAttribute("tabindex", this.previousTabIndexAttribute);
    }
  }
}
