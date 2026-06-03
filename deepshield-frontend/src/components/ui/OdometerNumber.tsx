"use client";

import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function OdometerNumber({ value }: { value: number | string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const target = typeof value === "number" ? value : parseInt(String(value), 10) || 0;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || typeof value === "string") return;
    let start = 0;
    const duration = 1200;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      setDisplay(Math.round(target * p));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, value]);

  return (
    <motion.span ref={ref} className="font-display tabular-nums">
      {typeof value === "string" ? value : display}
      {typeof value === "number" && value > 0 && value < 20 ? "" : ""}
    </motion.span>
  );
}
