import type { GameMountOptions } from "../GameMountOptions.js";
import type { GameTheme } from "../GameTheme.js";
import type { GamePresentationPort } from "../domain/GamePresentationPort.js";

/**
 * Canvas ownership boundary for Wave Survivor.
 *
 * Drawing is intentionally absent until gameplay is implemented. Keeping the
 * mounted canvas here prevents browser rendering concerns from entering the
 * application controller.
 */
export class CanvasGameRenderer implements GamePresentationPort {
  private canvas: HTMLCanvasElement | null;
  private theme: GameTheme | null;

  constructor(options: GameMountOptions) {
    this.canvas = options.canvas;
    this.theme = options.theme;
  }

  get mountedCanvas(): HTMLCanvasElement | null {
    return this.canvas;
  }

  get currentTheme(): GameTheme | null {
    return this.theme;
  }

  setTheme(theme: GameTheme): void {
    if (this.canvas) {
      this.theme = theme;
    }
  }

  destroy(): void {
    this.canvas = null;
    this.theme = null;
  }
}
