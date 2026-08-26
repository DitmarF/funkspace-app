/**
 * Browser clocks, input, persistence, audio, and other external adapters
 * belong here.
 */
export {
  BrowserKeyboardInput,
  BrowserVirtualJoystickInput,
  VIRTUAL_JOYSTICK_GEOMETRY,
  ZeroMovementInput,
} from "./input/index.js";
export type { VirtualJoystickPresentationSnapshot } from "./input/index.js";
export {
  BrowserFrameScheduler,
  BrowserMonotonicClock,
  FIXED_SIMULATION_STEP_SECONDS,
  FixedStepLoop,
  MAX_FIXED_UPDATES_PER_FRAME,
  MAX_FRAME_GAP_MILLISECONDS,
} from "./loop/index.js";
export type { FixedStepLoopCallbacks } from "./loop/index.js";
