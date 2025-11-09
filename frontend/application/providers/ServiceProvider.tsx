/**
 * Service Provider
 * React Context provider for dependency injection
 */

"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { createServices } from "@/infrastructure/services/createServices";
import type { ThemeService } from "../theme/ThemeService";
import type { ScrollService } from "../scroll/ScrollService";
import type { AnimationService } from "../animations/AnimationService";

export interface ServiceContextValue {
  themeService: ThemeService;
  scrollService: ScrollService;
  animationService: AnimationService;
}

const ServiceContext = createContext<ServiceContextValue | null>(null);

export interface ServiceProviderProps {
  children: ReactNode;
}

export function ServiceProvider({ children }: ServiceProviderProps) {
  // Create services on the client side to avoid serialization issues
  // during SSR/prerendering
  const services = useMemo(() => createServices(), []);

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
