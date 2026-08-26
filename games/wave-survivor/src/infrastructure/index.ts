/**
 * Browser clocks, input, persistence, audio, and other external adapters
 * belong here.
 */
export {
  BrowserFrameScheduler,
  BrowserMonotonicClock,
  FIXED_SIMULATION_STEP_SECONDS,
  FixedStepLoop,
  MAX_FIXED_UPDATES_PER_FRAME,
  MAX_FRAME_GAP_MILLISECONDS,
} from "./loop/index.js";
export type { FixedStepLoopCallbacks } from "./loop/index.js";
