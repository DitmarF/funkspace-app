import type { GameController } from "./GameController.js";
import type { GameMountOptions } from "./GameMountOptions.js";
import { GameControllerImpl } from "./application/GameControllerImpl.js";
import { GameRuntimeSession } from "./application/GameRuntimeSession.js";
import { createInitialRuntimeState } from "./domain/state/RuntimeState.js";
import { BrowserInputInterruptionGuard } from "./infrastructure/input/BrowserInputInterruptionGuard.js";
import { BrowserKeyboardInput } from "./infrastructure/input/BrowserKeyboardInput.js";
import { BrowserVirtualJoystickInput } from "./infrastructure/input/BrowserVirtualJoystickInput.js";
import { CompositeMovementInput } from "./infrastructure/input/CompositeMovementInput.js";
import { ZeroMovementInput } from "./infrastructure/input/ZeroMovementInput.js";
import {
  BrowserFrameScheduler,
  BrowserMonotonicClock,
} from "./infrastructure/loop/BrowserRuntimeTiming.js";
import { FixedStepLoop } from "./infrastructure/loop/FixedStepLoop.js";
import { SeededRandomSource } from "./infrastructure/random/SeededRandomSource.js";
import { CanvasGameRenderer } from "./renderer/CanvasGameRenderer.js";

const DEFAULT_GAMEPLAY_RANDOM_SEED = 0x5eed_c0de;

/**
 * Create an isolated Wave Survivor game instance.
 *
 * Rendering and gameplay dependencies will be composed here when they exist.
 * Mount options are optional while the package still supports lifecycle-only
 * use, but portfolio hosts provide them when embedding the game.
 */
export function createGame(options?: GameMountOptions): GameController {
  const presentation = options ? new CanvasGameRenderer(options) : null;
  const joystickInput = options
    ? new BrowserVirtualJoystickInput(options.canvas)
    : null;
  const deviceInput =
    options && joystickInput
      ? new CompositeMovementInput(
          // The interruption guard owns the production window-blur listener.
          new BrowserKeyboardInput(options.canvas, null),
          joystickInput,
        )
      : new ZeroMovementInput();
  const input = options
    ? new BrowserInputInterruptionGuard(deviceInput)
    : deviceInput;
  const session = new GameRuntimeSession(
    createInitialRuntimeState(),
    input,
    presentation,
    new SeededRandomSource(DEFAULT_GAMEPLAY_RANDOM_SEED),
    joystickInput ? () => joystickInput.readPresentationSnapshot() : null,
    options?.onStatusChange ?? null,
  );
  const loop = options
    ? new FixedStepLoop(
        new BrowserMonotonicClock(),
        new BrowserFrameScheduler(),
        {
          fixedUpdate: (deltaSeconds) => session.fixedUpdate(deltaSeconds),
          render: () => session.render(),
          isTerminal: () => session.phase === "lost",
        },
      )
    : null;

  return new GameControllerImpl(session, loop);
}
