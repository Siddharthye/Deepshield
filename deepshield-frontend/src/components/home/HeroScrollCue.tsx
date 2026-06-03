"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export function HeroScrollCue() {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="mt-12 flex flex-col items-center gap-2 md:mt-14"
      aria-hidden
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-subtle">
        {t("heroScroll")}
      </span>
      <motion.span
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        className="flex h-9 w-5 items-start justify-center rounded-full border border-secondary/25 bg-cream-tan/50 pt-1.5"
      >
        <span className="h-1.5 w-1 rounded-full bg-accent" />
      </motion.span>
    </motion.div>
  );
}
