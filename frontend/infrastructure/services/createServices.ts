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
import type { OwnedServices } from "@/application/providers/ServiceProvider";
import { MotionPolicyServiceImpl } from "@/application/motion/MotionPolicyService";
import { BrowserMotionEnvironment } from "@/infrastructure/motion/BrowserMotionEnvironment";
import { bindNativeDialog } from "@/infrastructure/dom/NativeDialogBinding";

import { createPortfolioNavigationHandoff } from "@/infrastructure/dom/PortfolioNavigationHandoff";

/**
 * Create all services with their dependencies
 */
export function createServices(): OwnedServices {
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
    motionPolicy: new MotionPolicyServiceImpl(
      storage,
      new BrowserMotionEnvironment(),
    ),
    decorativeMotionAvailable:
      process.env.NEXT_PUBLIC_ANIMATIONS_ENABLED === "true",
    themeService,
    scrollService,
    animationService,
    bindDialog: bindNativeDialog,
    navigationHandoff: createPortfolioNavigationHandoff(),
  };
}
