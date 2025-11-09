/**
 * Animation Service
 * Application service for animation orchestration
 */

import type { AnimationOrchestrator } from "./AnimationOrchestrator";

export interface AnimationService {
  /**
   * Get the animation orchestrator
   */
  getOrchestrator(): AnimationOrchestrator;
}

export class AnimationServiceImpl implements AnimationService {
  constructor(private readonly orchestrator: AnimationOrchestrator) {}

  getOrchestrator(): AnimationOrchestrator {
    return this.orchestrator;
  }
}
