"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { ManuscriptDivider } from "@/components/shared/manuscript-divider";
import { HeroEmblem } from "@/components/sections/hero-emblem";
import { HeroPortrait } from "@/components/sections/hero-portrait";
import { fadeUp, staggerContainer } from "@/constants/motion";

/**
 * Hero Mode A/B switch. "portrait" (current, since Sprint 17) shows the
 * approved professional photograph — see `HeroPortrait`. "emblem" is Mode
 * A, the mark-as-seal treatment used before a portrait existed — kept in
 * the codebase as the "no photo yet" fallback.
 */
const HERO_VISUAL: "emblem" | "portrait" = "portrait";

export function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const HeroVisual = HERO_VISUAL === "portrait" ? HeroPortrait : HeroEmblem;

  return (
    <section className="relative overflow-hidden bg-background manuscript-texture pt-20 pb-24 sm:pt-28 sm:pb-32">
      <Container width="ultra">
        <motion.div
          initial={shouldReduceMotion ? "visible" : "hidden"}
          animate="visible"
          variants={staggerContainer}
          className="grid items-center gap-12 lg:grid-cols-[2fr_3fr] lg:gap-20"
        >
          <motion.div variants={fadeUp} className="order-2 lg:order-1">
            <HeroVisual />
          </motion.div>

          <div className="order-1 text-center lg:order-2 lg:text-left">
            <motion.p variants={fadeUp} className="text-eyebrow">
              Arabic &amp; Islamic Studies
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="mx-auto mt-6 max-w-2xl text-4xl leading-[1.1] text-balance sm:text-5xl lg:mx-0 lg:text-6xl"
            >
              Ahmad Mohamed <span className="italic text-gold-600">Kassa</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-4 text-sm tracking-[0.08em] text-stone-600 uppercase lg:mx-0"
            >
              Author &middot; Teacher &middot; Khateeb
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-7 max-w-md text-lg leading-relaxed text-muted-foreground text-balance lg:mx-0"
            >
              Helping Muslims strengthen their understanding of Islam through
              authentic knowledge and practical guidance.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap lg:justify-start"
            >
              <Button asChild variant="gold" size="xl">
                <Link href="/books">Explore Books</Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link href="/ask">Ask Ahmad</Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </Container>

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-20"
      >
        <ManuscriptDivider className="mx-auto max-w-xs" />
      </motion.div>
    </section>
  );
}
