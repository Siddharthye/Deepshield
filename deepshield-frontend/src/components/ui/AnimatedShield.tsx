"use client";

import { motion } from "framer-motion";

export function AnimatedShield({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 64 72"
      className={className}
      initial="hidden"
      animate="visible"
    >
      <motion.path
        d="M32 4 L56 14 V36 C56 52 44 64 32 68 C20 64 8 52 8 36 V14 Z"
        fill="none"
        stroke="#f1cde2"
        strokeWidth="2"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: { pathLength: 1, opacity: 1 },
        }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
      />
      <motion.path
        d="M22 38 L30 46 L44 28"
        fill="none"
        stroke="#3d524c"
        strokeWidth="2.5"
        strokeLinecap="round"
        variants={{
          hidden: { pathLength: 0 },
          visible: { pathLength: 1 },
        }}
        transition={{ duration: 0.5, delay: 0.7 }}
      />
    </motion.svg>
  );
}
