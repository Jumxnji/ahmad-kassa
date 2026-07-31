"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Fixed hairline beneath the header that fills as the reader scrolls
 * through the article. Uses whole-page scroll progress so it works
 * regardless of where the article body sits in the layout.
 */
export function ReadingProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 40,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-gold-500"
      aria-hidden="true"
    />
  );
}
