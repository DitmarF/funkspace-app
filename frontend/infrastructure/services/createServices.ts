/**
 * Service Factory
 * Creates service instances with proper dependencies
 */

import { ThemeServiceImpl } from "@/application/theme/ThemeService";
import { ScrollServiceImpl } from "@/application/scroll/ScrollService";
import { AnimationServiceImpl } from "@/application/animations/AnimationService";
import { AnimationOrchestratorImpl } from "@/application/animations/AnimationOrchestrator";
import { LocalStorageAdapter } from "@/infrastructure/storage/LocalStorageAdapter";
import { DOMAdapter } from "@/infrastructure/dom/DOMAdapter";
import { AnimationAdapter } from "@/infrastructure/motion/AnimationAdapter";
import type { ServiceContextValue } from "@/application/providers/ServiceProvider";

/**
 * Create all services with their dependencies
 */
export function createServices(): ServiceContextValue {
  // Infrastructure adapters
  const storage = new LocalStorageAdapter();
  const dom = new DOMAdapter();
  const animationPort = new AnimationAdapter();

  // Application services
  const themeService = new ThemeServiceImpl(storage, dom);
  const scrollService = new ScrollServiceImpl();
  const animationOrchestrator = new AnimationOrchestratorImpl(animationPort);
  const animationService = new AnimationServiceImpl(animationOrchestrator);

  return {
    themeService,
    scrollService,
    animationService,
  };
}
