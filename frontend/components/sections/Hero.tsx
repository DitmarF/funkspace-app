"use client";

import { useRef, useEffect } from "react";
import type { ComponentPropsWithoutRef } from "react";

import { useScrollProgressService } from "../../hooks/useScrollProgressService";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { HTMLTimeline } from "../../infrastructure/motion/htmlTimeline";
import Text from "../Base/Text";
import Button from "../Controls/Button";
import SnapSection from "./SnapSection";

export type HeroProps = ComponentPropsWithoutRef<"section"> & {
  /**
   * Main heading text
   */
  heading: string;
  /**
   * Subheading text (optional)
   */
  subheading?: string;
  /**
   * Call-to-action button label (optional)
   */
  ctaLabel?: string;
  /**
   * Call-to-action button click handler (optional)
   */
  onCtaClick?: () => void;
  /**
   * Background color token (default: fs-blue)
   */
  backgroundColor?: string;
};

/**
 * Hero section component with scroll-triggered animations
 *
 * Uses tokenized colors and typography. Animations run only when section is in view.
 * Supports keyboard navigation with proper focus management.
 *
 * @example
 * ```tsx
 * <Hero
 *   heading="Welcome to FunkSpace"
 *   subheading="A modern design system"
 *   ctaLabel="Get Started"
 *   onCtaClick={() => console.log('Clicked')}
 * />
 * ```
 */
const Hero = ({
  heading,
  subheading,
  ctaLabel,
  onCtaClick,
  backgroundColor = "bg-fs-blue",
  className = "",
  ...props
}: HeroProps) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const timelineRef = useRef<HTMLTimeline | null>(null);
  const prefersReduced = useReducedMotion();

  const { inView } = useScrollProgressService(sectionRef, {
    onEnter: () => {
      if (timelineRef.current && !prefersReduced) {
        timelineRef.current.playFrom(0);
      }
    },
    onLeave: () => {
      if (timelineRef.current) {
        timelineRef.current.reset();
      }
    },
  });

  // Create timeline with animated elements
  useEffect(() => {
    const heading = headingRef.current;
    const subheading = subheadingRef.current;
    const cta = ctaRef.current;
    if (!heading) return;

    // If reduced motion, render static end state
    if (prefersReduced) {
      heading.style.transform = "translateY(0)";
      heading.style.opacity = "1";
      if (subheading) {
        subheading.style.transform = "translateY(0)";
        subheading.style.opacity = "1";
      }
      if (cta) {
        cta.style.transform = "translateY(0)";
        cta.style.opacity = "1";
      }
      return;
    }

    try {
      const elements = [
        {
          element: heading as HTMLElement,
          fromTransform: "translateY(30px)",
          toTransform: "translateY(0)",
          fromOpacity: 0,
          toOpacity: 1,
          duration: 600,
          delay: 0,
          easing: "ease-out",
        },
      ];

      if (subheading) {
        elements.push({
          element: subheading as HTMLElement,
          fromTransform: "translateY(20px)",
          toTransform: "translateY(0)",
          fromOpacity: 0,
          toOpacity: 1,
          duration: 600,
          delay: 150,
          easing: "ease-out",
        });
      }

      if (cta) {
        elements.push({
          element: cta as HTMLElement,
          fromTransform: "translateY(20px)",
          toTransform: "translateY(0)",
          fromOpacity: 0,
          toOpacity: 1,
          duration: 600,
          delay: 300,
          easing: "ease-out",
        });
      }

      // Create timeline
      const timeline = new HTMLTimeline(elements, {
        onEnter: () => {
          if (process.env.NODE_ENV !== "production") {
            console.log("[Hero] Animation entered");
          }
        },
        onLeave: () => {
          if (process.env.NODE_ENV !== "production") {
            console.log("[Hero] Animation left");
          }
        },
      });

      timelineRef.current = timeline;

      // Set initial state
      timeline.seek(0);

      // If already in view, play immediately
      if (inView) {
        timeline.playFrom(0);
      }

      return () => {
        timeline.destroy();
        timelineRef.current = null;
      };
    } catch (error) {
      // Graceful fallback: render static end state if timeline creation fails
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "[Hero] Timeline creation failed, rendering static state",
          error,
        );
      }
      heading.style.transform = "translateY(0)";
      heading.style.opacity = "1";
      if (subheading) {
        subheading.style.transform = "translateY(0)";
        subheading.style.opacity = "1";
      }
      if (cta) {
        cta.style.transform = "translateY(0)";
        cta.style.opacity = "1";
      }
      timelineRef.current = null;
    }
  }, [inView, prefersReduced]);

  return (
    <SnapSection
      ref={sectionRef}
      id="hero"
      aria-label="Hero section"
      snap="start"
      className={`relative flex flex-col ${backgroundColor} ${className}`.trim()}
      {...props}
    >
      {/* Sticky pin demo: small badge that stays pinned until container ends */}
      {/* Uses CSS position: sticky - no scroll hijacking, pure CSS solution */}
      <div className="sticky top-0 z-10 w-full py-4">
        <div className="mx-auto max-w-4xl px-8">
          <div
            className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm"
            role="status"
            aria-live="polite"
          >
            <span className="h-2 w-2 rounded-full bg-fs-green"></span>
            Sticky Pin Demo
          </div>
        </div>
      </div>

      {/* Main content - centered vertically and horizontally */}
      <div className="flex flex-1 items-center justify-center">
        <div className="max-w-4xl space-y-8 p-8 text-center">
          <h1
            ref={headingRef}
            className="font-display text-5xl font-bold text-white sm:text-6xl"
            style={{
              willChange: prefersReduced ? "auto" : "transform, opacity",
              transform: prefersReduced ? "translateY(0)" : "translateY(30px)",
              opacity: prefersReduced ? "1" : "0",
            }}
          >
            {heading}
          </h1>
          {subheading && (
            <Text
              ref={subheadingRef}
              size="lg"
              className="mx-auto max-w-2xl text-white"
              style={{
                willChange: prefersReduced ? "auto" : "transform, opacity",
                transform: prefersReduced
                  ? "translateY(0)"
                  : "translateY(20px)",
                opacity: prefersReduced ? "1" : "0",
              }}
            >
              {subheading}
            </Text>
          )}
          {ctaLabel && (
            <div className="flex justify-center">
              <Button
                ref={ctaRef}
                variant="primary"
                onClick={onCtaClick}
                style={{
                  willChange: prefersReduced ? "auto" : "transform, opacity",
                  transform: prefersReduced
                    ? "translateY(0)"
                    : "translateY(20px)",
                  opacity: prefersReduced ? "1" : "0",
                }}
              >
                {ctaLabel}
              </Button>
            </div>
          )}
        </div>
      </div>
    </SnapSection>
  );
};

export default Hero;
