"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

/**
 * Fixed hairline beneath the header that fills as the reader scrolls
 * through the article. Uses whole-page scroll progress so it works
 * regardless of where the article body sits in the layout. Skips the
 * spring easing (tracks raw scroll progress instead) when the reader
 * prefers reduced motion — still functional, just without the lag.
 */
export function ReadingProgressBar() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const springScaleX = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 40,
    restDelta: 0.001,
  });
  const scaleX = shouldReduceMotion ? scrollYProgress : springScaleX;

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-gold-500"
      aria-hidden="true"
    />
  );
}
