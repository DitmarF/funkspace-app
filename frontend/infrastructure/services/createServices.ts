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
import { bindNativeLogoMotion } from "@/infrastructure/motion/NativeLogoMotionBinding";
import { bindHomeIntro } from "@/infrastructure/motion/HomeIntroBinding";
import { LogoMotionController } from "@/application/animations/LogoMotionController";
import { bindNativeDialog } from "@/infrastructure/dom/NativeDialogBinding";
import { ParticleSceneController } from "@/application/animations/ParticleSceneController";
import { bindParticleScene } from "@/infrastructure/particles/ParticleSceneBinding";
import { apertureAssets } from "@/infrastructure/particles/ApertureAssets";

import { createPortfolioNavigationHandoff } from "@/infrastructure/dom/PortfolioNavigationHandoff";

/**
 * Create all services with their dependencies
 */
export function createServices(fixture?: {
  decorativeMotionAvailable: boolean;
}): OwnedServices {
  // Infrastructure adapters
  const storage = new LocalStorageAdapter();
  const dom = new DOMAdapter();
  const animationPort = new AnimationAdapter();

  // Application services
  const themeService = new ThemeServiceImpl(storage, dom);
  const scrollService = new ScrollServiceImpl();
  const animationOrchestrator = new AnimationOrchestratorImpl(animationPort);
  const animationService = new AnimationServiceImpl(animationOrchestrator);
  const motionPolicy = new MotionPolicyServiceImpl(
    storage,
    new BrowserMotionEnvironment(),
  );
  // Explicit composition injection is reserved for controlled stories/tests.
  const decorativeMotionAvailable =
    fixture?.decorativeMotionAvailable ??
    process.env.NEXT_PUBLIC_ANIMATIONS_ENABLED === "true";

  return {
    apertureAssets,
    bindParticleScene: (target, options) => {
      const controller = new ParticleSceneController(
        motionPolicy,
        decorativeMotionAvailable,
        () => bindParticleScene(target, themeService),
        options,
      );
      controller.initialize();
      return controller;
    },
    bindHomeIntro,
    motionPolicy,
    decorativeMotionAvailable,
    bindLogoMotion: (root, options, history) => {
      const controller = new LogoMotionController(
        motionPolicy,
        decorativeMotionAvailable,
        (events) =>
          bindNativeLogoMotion(
            root,
            (target) => animationOrchestrator.buildLogoManifest(target),
            events,
          ),
        options,
        history,
      );
      controller.initialize();
      return controller;
    },
    themeService,
    scrollService,
    animationService,
    bindDialog: bindNativeDialog,
    navigationHandoff: createPortfolioNavigationHandoff(),
  };
}
