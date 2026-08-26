"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  /** Vertical rise in px. 0 fades in place — used for chrome, so only the
   *  subject of the page actually moves. */
  y?: number;
  duration?: number;
  className?: string;
}

export function FadeIn({
  children,
  delay = 0,
  y = 8,
  duration = 0.8,
  className,
}: FadeInProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      // 0.01 rather than 0: an element at exactly 0 is never painted, so
      // Lighthouse charges the whole fade to LCP as render delay.
      initial={reduceMotion ? false : { opacity: 0.01, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration, delay, ease: [0.16, 1, 0.3, 1] }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}
