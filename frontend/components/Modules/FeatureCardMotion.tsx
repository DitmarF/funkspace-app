"use client";

import { Children, cloneElement, isValidElement } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { buildTransition, variants } from "@/utils/motion";

type FeatureCardMotionProps = {
  children: React.ReactNode;
  className?: string;
  /** Delay for the group entrance (ms) */
  delayMs?: number;
  /** Stagger between items (ms) */
  staggerMs?: number;
};

export default function FeatureCardMotion({
  children,
  className,
  delayMs = 0,
  staggerMs = 60,
}: FeatureCardMotionProps) {
  const animationsEnabled =
    (process.env.NEXT_PUBLIC_ANIMATIONS_ENABLED || "false") === "true";
  const prefersReduced = useReducedMotion();

  if (!animationsEnabled) {
    return <div className={className}>{children}</div>;
  }

  const itemVariant = prefersReduced ? variants.fadeIn : variants.scaleIn;
  const transition = buildTransition("normal", "ease-out");

  return (
    <motion.div
      initial="from"
      animate="to"
      transition={{
        delayChildren: delayMs / 1000,
        staggerChildren: staggerMs / 1000,
      }}
      style={{ transition }}
      className={
        "will-change-transform motion-reduce:transition-none " +
        (className ?? "")
      }
    >
      {Children.map(children, (child) => {
        if (!isValidElement(child)) return child;
        return (
          <motion.div
            variants={itemVariant}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ transition }}
            className="will-change-transform motion-reduce:transition-none"
          >
            {cloneElement(child)}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
