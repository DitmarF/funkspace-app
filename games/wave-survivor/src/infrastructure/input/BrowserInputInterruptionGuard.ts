import type { MovementInputPort } from "../../domain/MovementInputPort.js";
import {
  ZERO_MOVEMENT_INTENT,
  type MovementIntent,
} from "../../domain/movement/MovementIntent.js";

function getBrowserWindow(): Window | null {
  return typeof window === "undefined" ? null : window;
}

function getBrowserDocument(): Document | null {
  return typeof document === "undefined" ? null : document;
}

/**
 * Owns browser-wide interruption handling for a complete movement-input tree.
 * Surface-specific focus and pointer cancellation remain with their adapters.
 */
export class BrowserInputInterruptionGuard implements MovementInputPort {
  private destroyed = false;

  constructor(
    private source: MovementInputPort | null,
    private windowTarget: Window | null = getBrowserWindow(),
    private documentTarget: Document | null = getBrowserDocument(),
  ) {
    this.windowTarget?.addEventListener("blur", this.handleWindowBlur);
    this.documentTarget?.addEventListener(
      "visibilitychange",
      this.handleVisibilityChange,
    );
  }

  readMovementIntent(): MovementIntent {
    return this.destroyed || !this.source
      ? ZERO_MOVEMENT_INTENT
      : this.source.readMovementIntent();
  }

  reset(): void {
    if (!this.destroyed) {
      this.source?.reset();
    }
  }

  destroy(): void {
    if (this.destroyed) return;

    this.destroyed = true;
    this.windowTarget?.removeEventListener("blur", this.handleWindowBlur);
    this.documentTarget?.removeEventListener(
      "visibilitychange",
      this.handleVisibilityChange,
    );

    const source = this.source;
    this.source = null;
    this.windowTarget = null;
    this.documentTarget = null;
    source?.reset();
    source?.destroy();
  }

  private readonly handleWindowBlur = (): void => {
    this.reset();
  };

  private readonly handleVisibilityChange = (): void => {
    if (this.documentTarget?.hidden) {
      this.reset();
    }
  };
}
