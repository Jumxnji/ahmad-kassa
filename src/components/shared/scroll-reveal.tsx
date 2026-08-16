"use client";

import { motion, useReducedMotion } from "framer-motion";
import { fadeUp } from "@/constants/motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Thin client island wrapping a scroll-triggered fade-up reveal —
 * lets a server-component section (async data fetches, no "use
 * client") still get the same motion treatment as `hero.tsx` without
 * itself becoming a client component. Reuses `fadeUp` from
 * `@/constants/motion` and the same `useReducedMotion` guard idiom
 * already proven in `hero.tsx`/`template.tsx`/`loading-screen.tsx`.
 */
export function ScrollReveal({ children, className }: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
      className={className}
    >
      {children}
    </motion.div>
  );
}
