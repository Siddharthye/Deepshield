"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { AnimatedShield } from "@/components/ui/AnimatedShield";

type HeroVisualPanelProps = {
  logoAlt: string;
  caption: string;
};

export function HeroVisualPanel({ logoAlt, caption }: HeroVisualPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.12, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      className="hero-visual relative mx-auto w-full max-w-[22rem] lg:max-w-none lg:justify-self-end"
    >
      <div className="hero-visual-shell relative aspect-[4/5] w-full min-h-[20rem] sm:min-h-[22rem] lg:min-h-[26rem]">
        <div className="hero-visual-ambient" aria-hidden />
        <div className="hero-visual-mesh" aria-hidden />
        <div className="hero-visual-ring hero-visual-ring--a" aria-hidden />
        <div className="hero-visual-ring hero-visual-ring--b" aria-hidden />
        <div className="hero-visual-flare" aria-hidden />

        <div className="hero-visual-stage">
          <motion.div
            className="hero-visual-pedestal"
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="hero-visual-pedestal-shine" aria-hidden />
            <div className="hero-visual-pedestal-inner">
              <Image
                src="/images/ds-logo.jpeg"
                alt={logoAlt}
                width={280}
                height={280}
                className="hero-visual-logo"
                priority
                unoptimized
              />
            </div>
          </motion.div>

          <AnimatedShield className="hero-visual-shield-accent pointer-events-none absolute right-[12%] top-[14%] h-11 w-11 opacity-70 md:h-12 md:w-12" />
        </div>

        <div className="hero-visual-bezel" aria-hidden>
          <span className="hero-visual-bezel-dot" />
        </div>
      </div>

      <div className="hero-visual-footer mt-7">
        <div className="hero-visual-divider" aria-hidden />
        <p className="hero-visual-caption">{caption}</p>
      </div>
    </motion.div>
  );
}
