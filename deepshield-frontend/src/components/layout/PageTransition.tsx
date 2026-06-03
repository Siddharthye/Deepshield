"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const DURATION_MS = 1000;

type Phase = "hidden" | "cover" | "hold" | "exit";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const skipFirst = useRef(true);
  const [phase, setPhase] = useState<Phase>("hidden");
  const [contentVisible, setContentVisible] = useState(true);

  useLayoutEffect(() => {
    if (skipFirst.current) {
      skipFirst.current = false;
      return;
    }

    setContentVisible(false);
    setPhase("cover");

    const hold = window.setTimeout(() => setPhase("hold"), 220);
    const exit = window.setTimeout(() => setPhase("exit"), 620);
    const done = window.setTimeout(() => {
      setPhase("hidden");
      setContentVisible(true);
    }, DURATION_MS);

    return () => {
      clearTimeout(hold);
      clearTimeout(exit);
      clearTimeout(done);
    };
  }, [pathname]);

  const showOverlay = phase !== "hidden";

  return (
    <>
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            key="page-transition-overlay"
            className="pointer-events-none fixed inset-0 z-[100] flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="absolute inset-0 bg-cream/94 backdrop-blur-2xl"
              animate={{ opacity: phase === "exit" ? 0 : 1 }}
              transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
            />
            <motion.div
              className="relative z-10 flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{
                opacity: phase === "exit" ? 0 : 1,
                scale: phase === "hold" ? 1 : phase === "exit" ? 1.03 : 0.94,
                y: phase === "exit" ? -6 : 0,
              }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="overflow-hidden rounded-3xl bg-white p-3 shadow-[0_24px_80px_rgba(90,83,76,0.1)] ring-1 ring-blue/30">
                <Image
                  src="/images/ds-logo.jpeg"
                  alt="DeepShield"
                  width={80}
                  height={80}
                  className="rounded-2xl object-contain"
                  unoptimized
                  priority
                />
              </div>
              <p className="font-display mt-5 text-xl tracking-tight text-ink">DeepShield</p>
              <p className="mt-1 text-xs text-ink/55">{t("transitionTagline")}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div
        className="transition-opacity duration-300 ease-out"
        style={{
          opacity: contentVisible ? 1 : 0,
          visibility: contentVisible ? "visible" : "hidden",
          pointerEvents: contentVisible ? "auto" : "none",
        }}
        aria-hidden={!contentVisible}
      >
        {children}
      </div>
    </>
  );
}
