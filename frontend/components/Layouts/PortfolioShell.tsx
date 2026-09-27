"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { useServices } from "@/application/providers/ServiceProvider";
import { HomeIntroScript } from "@/application/providers/HomeIntroScript";
import type { HomeIntroBinding } from "@/domain/ports/HomeIntroPort";
import type { LogoPlaybackState } from "@/domain/ports/LogoMotionPort";
import ButtonLink from "../Controls/ButtonLink";
import Container from "./Container";
import { portfolioDestinations as destinations } from "../../data/portfolioDestinations";
import { LogoMotion, type LogoMotionRef } from "../Logo/LogoMotion";
import PortfolioNavigation from "./PortfolioNavigation";
import PortfolioLegalLinks from "./PortfolioLegalLinks";
import styles from "./PortfolioShell.module.css";

export default function PortfolioShell({
  children,
  animateIdentity = false,
}: {
  children: ReactNode;
  animateIdentity?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const intro = useRef<HomeIntroBinding | null>(null);
  const identity = useRef<LogoMotionRef>(null);
  const state = useRef<LogoPlaybackState>("pending");
  const { bindHomeIntro, decorativeMotionAvailable } = useServices();
  const logoState = useCallback((next: LogoPlaybackState) => {
    state.current = next;
    intro.current?.logoState(next);
  }, []);
  useEffect(() => {
    if (!animateIdentity || !root.current) return;
    const binding = bindHomeIntro(root.current, () =>
      identity.current?.cancelIntroduction(),
    );
    intro.current = binding;
    binding.logoState(state.current);
    return () => {
      binding.release();
      if (intro.current === binding) intro.current = null;
    };
  }, [animateIdentity, bindHomeIntro]);
  return (
    <div
      ref={root}
      className={styles.shell}
      data-home-intro={animateIdentity ? "visible" : undefined}
      suppressHydrationWarning
    >
      {animateIdentity && (
        <HomeIntroScript available={decorativeMotionAvailable} />
      )}
      <a
        href="#main-content"
        className={`${styles.skipLink} sr-only focus:not-sr-only focus:fixed focus:z-10 focus:p-fs-md bg-fs-surface-background text-fs-action-link focus:outline focus:outline-2 focus:outline-fs-border-focus`}
      >
        Skip to main content
      </a>
      <Container
        as="header"
        width="wide"
        padding="none"
        className={`${styles.frame} ${styles.header}`}
      >
        <a
          href={destinations.home.href}
          aria-label={destinations.home.label}
          className={styles.identity}
        >
          <span aria-hidden="true">
            <LogoMotion
              ref={identity}
              enabled={animateIdentity}
              autoPlay={animateIdentity}
              onPlaybackState={animateIdentity ? logoState : undefined}
              className="block h-auto w-full"
            />
          </span>
        </a>
      </Container>
      <Container
        as="main"
        data-home-content=""
        id="main-content"
        tabIndex={-1}
        width="wide"
        padding="none"
        className={`${styles.frame} ${styles.main}`}
      >
        {children}
      </Container>
      <Container
        as="footer"
        width="wide"
        padding="none"
        className={`${styles.frame} ${styles.footer}`}
      >
        <PortfolioNavigation />
        <nav aria-label="Footer" data-home-content="">
          <ul className={styles.links}>
            <li>
              <ButtonLink href={destinations.contact.href}>
                {destinations.contact.label}
              </ButtonLink>
            </li>
            <PortfolioLegalLinks />
          </ul>
        </nav>
      </Container>
    </div>
  );
}
