"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { PropsWithChildren } from "react";
import { buildTransition, variants } from "@/utils/motion";

type HeroMotionProps = PropsWithChildren<{
  className?: string;
  /** Delay in ms before starting the entrance animation */
  delayMs?: number;
}>;

export default function HeroMotion({
  children,
  className,
  delayMs = 0,
}: HeroMotionProps) {
  const animationsEnabled =
    (process.env.NEXT_PUBLIC_ANIMATIONS_ENABLED || "false") === "true";
  const prefersReduced = useReducedMotion();

  if (!animationsEnabled) {
    return <div className={className}>{children}</div>;
  }

  const base = prefersReduced ? variants.fadeIn : variants.fadeInUp;
  const transition = `${buildTransition("normal", "ease-out")} ${delayMs}ms`;

  return (
    <motion.div
      initial={base.from}
      animate={base.to}
      transition={{
        // duration and easing via CSS variables; numeric fallback for framer
        duration: 0.2,
        ease: [0.16, 1, 0.3, 1],
        delay: delayMs / 1000,
      }}
      style={{ transition }}
      className={
        "will-change-transform motion-reduce:transition-none " +
        (className ?? "")
      }
    >
      {children}
    </motion.div>
  );
}
