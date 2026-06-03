"use client";

import { motion } from "framer-motion";
import { useTilt } from "@/hooks/useTilt";

export function GlassCard({
  children,
  className = "",
  tilt = true,
}: {
  children: React.ReactNode;
  className?: string;
  tilt?: boolean;
}) {
  const { ref, transform, onMove, onLeave } = useTilt(6);

  return (
    <motion.div
      ref={tilt ? ref : undefined}
      onMouseMove={tilt ? onMove : undefined}
      onMouseLeave={tilt ? onLeave : undefined}
      style={tilt ? { transform, transition: "transform 0.15s ease-out" } : undefined}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      className={`glass-card p-6 shadow-sm ${className}`}
    >
      {children}
    </motion.div>
  );
}
