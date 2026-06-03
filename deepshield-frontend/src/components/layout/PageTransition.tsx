"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [wipe, setWipe] = useState(false);

  useEffect(() => {
    setWipe(true);
    const t = setTimeout(() => setWipe(false), 620);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <>
      <AnimatePresence>
        {wipe && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-[80] bg-peach"
            initial={{ x: "-100%" }}
            animate={{ x: ["-100%", "0%", "0%", "100%"] }}
            transition={{ duration: 0.6, times: [0, 0.4, 0.55, 1], ease: "easeInOut" }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.28, delay: 0.15 }}
      >
        {children}
      </motion.div>
    </>
  );
}
