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
 * Hero Mode A/B switch. "emblem" (default) shows the mark as a large
 * seal — see `HeroEmblem`. Once a commissioned portrait exists, flip
 * this to "portrait" — `HeroPortrait` occupies the identical aspect
 * box, so nothing else in this file needs to change.
 */
const HERO_VISUAL: "emblem" | "portrait" = "emblem";

const TRUST_LINE = "Khateeb, Masjid Al-Noor  ·  Teaching since 2009  ·  Arabic & Islamic Studies" as const;

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
          className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16"
        >
          <motion.div variants={fadeUp} className="order-2 lg:order-1">
            <HeroVisual />
          </motion.div>

          <div className="order-1 text-center lg:order-2 lg:text-left">
            <motion.p variants={fadeUp} className="text-eyebrow">
              Islamic Teacher &middot; Author &middot; Khateeb
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="mx-auto mt-6 max-w-xl text-5xl leading-[1.08] text-balance sm:text-6xl lg:mx-0 lg:text-7xl"
            >
              Ahmad <span className="italic text-gold-600">Mohamed Kassa</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-7 max-w-lg text-lg leading-relaxed text-muted-foreground text-balance lg:mx-0"
            >
              Helping Muslims strengthen their understanding of Islam through
              authentic knowledge, thoughtful research and practical guidance.
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-5 max-w-lg text-sm text-stone-600 text-balance lg:mx-0"
            >
              {TRUST_LINE}
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
