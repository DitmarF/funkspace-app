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
import { bindStickyHeader } from "@/infrastructure/dom/StickyHeaderBinding";
import { LogoMotionController } from "@/application/animations/LogoMotionController";
import { bindNativeDialog } from "@/infrastructure/dom/NativeDialogBinding";
import { ParticleSceneController } from "@/application/animations/ParticleSceneController";
import { bindParticleScene } from "@/infrastructure/particles/ParticleSceneBinding";
import { apertureAssets } from "@/infrastructure/particles/ApertureAssets";

import { createPortfolioNavigationHandoff } from "@/infrastructure/dom/PortfolioNavigationHandoff";
import { BrowserContactSubmission } from "@/infrastructure/contact/BrowserContactSubmission";
import type { ContactSubmissionPort } from "@/domain/ports/ContactSubmissionPort";
import {
  DEFAULT_PARTICLE_CONFIG,
  MOBILE_WEB_PARTICLE_CONFIG,
} from "@/domain/particles/ParticleSettings";

/**
 * Create all services with their dependencies
 */
export function createServices(fixture?: {
  decorativeMotionAvailable: boolean;
  contactSubmission?: ContactSubmissionPort;
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
    contactSubmission:
      fixture?.contactSubmission ??
      new BrowserContactSubmission((url, init) => fetch(url, init)),
    bindStickyHeader: (root) =>
      bindStickyHeader(root, motionPolicy, decorativeMotionAvailable),
    apertureAssets,
    bindParticleScene: (target, options) => {
      // Match WEB's existing CSS fit breakpoint; explicit fixture configs win.
      const narrow =
        options.responsiveDefaults && options.config === undefined
          ? dom.matchMedia("(width < 640px)")
          : null;
      const defaults = () =>
        narrow?.matches ? MOBILE_WEB_PARTICLE_CONFIG : DEFAULT_PARTICLE_CONFIG;
      const controller = new ParticleSceneController(
        motionPolicy,
        decorativeMotionAvailable,
        () => {
          const binding = bindParticleScene(target, themeService);
          const changed = () => controller.setDefaults(defaults());
          try {
            narrow?.addEventListener("change", changed);
          } catch (error) {
            binding.destroy();
            throw error;
          }
          return {
            ...binding,
            destroy() {
              try {
                narrow?.removeEventListener("change", changed);
              } finally {
                binding.destroy();
              }
            },
          };
        },
        narrow ? { ...options, config: defaults() } : options,
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
