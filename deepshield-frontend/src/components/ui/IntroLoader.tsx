"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const KEY = "deepshield_intro_seen";

export function IntroLoader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(KEY)) return;
    setShow(true);
    const t = setTimeout(() => {
      sessionStorage.setItem(KEY, "1");
      setShow(false);
    }, 2600);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Image
              src="/images/ds-logo.jpeg"
              alt=""
              width={100}
              height={100}
              className="rounded-2xl"
              unoptimized
            />
          </motion.div>
          <motion.p
            className="mt-6 max-w-xs text-center text-lg text-cream"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Your armor against digital violence
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
