"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AnimatedShield } from "@/components/ui/AnimatedShield";
import { useLanguage } from "@/context/LanguageContext";

export function ShieldOverlay({
  show,
  message,
}: {
  show: boolean;
  message?: string;
}) {
  const { t } = useLanguage();
  const label = message ?? t("protected");
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center bg-ink/35 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.05, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="relative rounded-3xl bg-cream px-14 py-12 text-center shadow-2xl"
          >
            <motion.span
              className="absolute inset-0 rounded-3xl border-2 border-pink/50"
              initial={{ scale: 0.9, opacity: 0.8 }}
              animate={{ scale: 1.35, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              aria-hidden
            />
            <AnimatedShield className="mx-auto mb-4 h-16 w-16" />
            <p className="font-display text-3xl text-ink">{label}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
