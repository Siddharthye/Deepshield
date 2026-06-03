"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { useLanguage } from "@/context/LanguageContext";

const KEY = "deepshield_intro_seen";

export function IntroLoader() {
  const { t } = useLanguage();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(KEY)) return;
    setShow(true);
    const timer = setTimeout(() => {
      sessionStorage.setItem(KEY, "1");
      setShow(false);
    }, 2600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="intro-pink-bg fixed inset-0 z-[100] flex flex-col items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <BrandLogo size="lg" showWordmark={false} />
          </motion.div>
          <motion.p
            className="mt-6 max-w-xs text-center text-lg text-ink"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {t("heroTitle")}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
