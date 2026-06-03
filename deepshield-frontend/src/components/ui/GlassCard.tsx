"use client";

import { motion } from "framer-motion";

export function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card p-6 shadow-sm ${className}`}
    >
      {children}
    </motion.div>
  );
}
