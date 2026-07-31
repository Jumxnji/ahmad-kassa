"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { brand } from "@/config/brand";

/**
 * Full-viewport loading state so route transitions never show a
 * blank screen. Kept quiet — a breathing mark, not a spinner.
 */
export function LoadingScreen() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 py-24">
      <motion.div
        initial={{ opacity: 0.4, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 1.1,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        aria-hidden="true"
      >
        <Image src={brand.logo.mark} alt="" width={39} height={34} className="h-9 w-auto" />
      </motion.div>
      <span className="sr-only" role="status">
        Loading…
      </span>
    </div>
  );
}
