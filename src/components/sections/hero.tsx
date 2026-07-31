"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { ManuscriptDivider } from "@/components/shared/manuscript-divider";
import { fadeUp, staggerContainer } from "@/constants/motion";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-20 pb-24 sm:pt-28 sm:pb-32">
      <Container width="narrow">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center"
        >
          <motion.p variants={fadeUp} className="text-eyebrow">
            Islamic Teacher &middot; Author &middot; Speaker
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="mx-auto mt-6 max-w-3xl text-5xl leading-[1.08] text-balance sm:text-6xl lg:text-7xl"
          >
            Ahmad <span className="italic text-gold-600">Mohamed Kassa</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground text-balance"
          >
            Helping Muslims strengthen their understanding of Islam through
            authentic knowledge, thoughtful research and practical guidance.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap"
          >
            <Button asChild variant="gold" size="xl">
              <Link href="/books">Explore Books</Link>
            </Button>
            <Button asChild variant="outline" size="xl">
              <Link href="/articles">Browse Articles</Link>
            </Button>
            <Button asChild variant="ghost" size="xl">
              <Link href="/courses">Coming Soon: Academy</Link>
            </Button>
          </motion.div>
        </motion.div>
      </Container>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-20"
      >
        <ManuscriptDivider className="mx-auto max-w-xs" />
      </motion.div>
    </section>
  );
}
