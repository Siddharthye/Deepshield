"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type Phase = "hidden" | "cover" | "hold" | "exit";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const skipPageEnter = useRef(true);
  const [phase, setPhase] = useState<Phase>("hidden");

  useEffect(() => {
    if (skipPageEnter.current) {
      skipPageEnter.current = false;
      return;
    }

    setPhase("cover");
    const hold = setTimeout(() => setPhase("hold"), 380);
    const exit = setTimeout(() => setPhase("exit"), 1100);
    const hidden = setTimeout(() => setPhase("hidden"), 1650);

    return () => {
      clearTimeout(hold);
      clearTimeout(exit);
      clearTimeout(hidden);
    };
  }, [pathname]);

  const showOverlay = phase !== "hidden";

  return (
    <>
      <AnimatePresence mode="wait">
        {showOverlay && (
          <motion.div
            key={`overlay-${pathname}`}
            className="pointer-events-none fixed inset-0 z-[100] flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <motion.div
              className="absolute inset-0 bg-cream/92 backdrop-blur-2xl"
              initial={{ opacity: 0 }}
              animate={{
                opacity: phase === "exit" ? 0 : 1,
              }}
              transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
            />
            <motion.div
              className="relative z-10 flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.88, y: 12 }}
              animate={{
                opacity: phase === "exit" ? 0 : 1,
                scale: phase === "hold" ? 1 : phase === "exit" ? 1.04 : 0.96,
                y: phase === "exit" ? -8 : 0,
              }}
              transition={{
                duration: phase === "exit" ? 0.5 : 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <motion.div
                className="relative overflow-hidden rounded-3xl bg-white p-3 shadow-[0_24px_80px_rgba(90,83,76,0.12)] ring-1 ring-white/80"
                animate={{
                  boxShadow:
                    phase === "hold"
                      ? "0 28px 90px rgba(253, 200, 194, 0.35)"
                      : "0 24px 80px rgba(90, 83, 76, 0.12)",
                }}
              >
                <Image
                  src="/images/ds-logo.jpeg"
                  alt=""
                  width={72}
                  height={72}
                  className="rounded-2xl object-contain"
                  unoptimized
                  priority
                />
              </motion.div>
              <motion.p
                className="font-display mt-5 text-xl tracking-tight text-ink"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: phase === "cover" ? 0 : 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
              >
                DeepShield
              </motion.p>
              <motion.p
                className="mt-1 text-xs text-ink/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: phase === "hold" ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                Your armor against digital violence
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        key={pathname}
        initial={skipPageEnter.current ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.55,
          delay: showOverlay ? 0.4 : 0,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.div>
    </>
  );
}
