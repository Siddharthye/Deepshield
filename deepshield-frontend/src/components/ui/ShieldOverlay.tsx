"use client";

import { AnimatePresence, motion } from "framer-motion";

export function ShieldOverlay({
  show,
  message = "Protected.",
}: {
  show: boolean;
  message?: string;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center bg-ink/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 1.05, opacity: 0 }}
            className="rounded-3xl bg-cream px-12 py-10 text-center shadow-2xl"
          >
            <p className="font-display text-3xl text-ink">{message}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
