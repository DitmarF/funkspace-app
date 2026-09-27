/**
 * Service Provider
 * React Context provider for dependency injection
 */

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { createServices } from "@/infrastructure/services/createServices";
import type { ThemeService } from "../theme/ThemeService";
import type { ScrollService } from "../scroll/ScrollService";
import type { AnimationService } from "../animations/AnimationService";
import type { DialogBindingFactory } from "@/domain/ports/DialogBindingPort";

import type { PortfolioNavigationHandoffPort } from "@/domain/ports/PortfolioNavigationHandoffPort";
import type {
  MotionPolicyConsumer,
  MotionPolicyService,
} from "../motion/MotionPolicyService";

export interface ServiceContextValue {
  readonly motionPolicy: MotionPolicyConsumer;
  readonly decorativeMotionAvailable: boolean;
  navigationHandoff: PortfolioNavigationHandoffPort<HTMLElement>;
  themeService: ThemeService;
  scrollService: ScrollService;
  animationService: AnimationService;
  bindDialog: DialogBindingFactory<HTMLDialogElement, HTMLElement>;
}

/** Only composition/provider owns activation; consumers receive the narrowed type. */
export interface OwnedServices extends ServiceContextValue {
  readonly motionPolicy: MotionPolicyService;
}

const ServiceContext = createContext<ServiceContextValue | null>(null);

export interface ServiceProviderProps {
  children: ReactNode;
}

export function ServiceProvider({ children }: ServiceProviderProps) {
  // Create services on the client side to avoid serialization issues
  // during SSR/prerendering
  const services = useMemo(() => createServices(), []);

  useEffect(() => {
    let releaseMotion = () => {};
    const cleanup = () => {
      let failed = false;
      let firstError: unknown;
      for (const release of [
        releaseMotion,
        () => services.navigationHandoff.cancel(),
        () => services.themeService.destroy(),
      ]) {
        try {
          release();
        } catch (error) {
          if (!failed) {
            failed = true;
            firstError = error;
          }
        }
      }
      if (failed) throw firstError;
    };
    try {
      services.themeService.initialize();
      releaseMotion = services.motionPolicy.initialize();
    } catch (error) {
      try {
        cleanup();
      } catch {
        /* Preserve the original setup error. */
      }
      throw error;
    }
    return cleanup;
  }, [services]);

  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  );
}

export function useServices(): ServiceContextValue {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error("useServices must be used within ServiceProvider");
  }
  return context;
}
