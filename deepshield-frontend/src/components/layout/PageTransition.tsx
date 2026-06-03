"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedShield } from "@/components/ui/AnimatedShield";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [phase, setPhase] = useState<"idle" | "cover" | "reveal">("idle");

  useEffect(() => {
    setPhase("cover");
    const reveal = setTimeout(() => setPhase("reveal"), 280);
    const idle = setTimeout(() => setPhase("idle"), 720);
    return () => {
      clearTimeout(reveal);
      clearTimeout(idle);
    };
  }, [pathname]);

  return (
    <>
      <AnimatePresence>
        {phase !== "idle" && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-[80] flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-cream via-peach/70 to-blue/50 backdrop-blur-[2px]"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{
                opacity: phase === "reveal" ? 0 : 0.92,
                scale: phase === "reveal" ? 1.08 : 1,
              }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
            />
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{
                scale: phase === "reveal" ? 1.15 : 1,
                opacity: phase === "reveal" ? 0 : 1,
              }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative z-10 rounded-3xl bg-cream/90 p-6 shadow-xl ring-1 ring-white/60"
            >
              <AnimatedShield className="h-14 w-14" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.4, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}
