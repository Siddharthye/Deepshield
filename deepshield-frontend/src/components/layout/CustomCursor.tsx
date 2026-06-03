"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const narrow = window.matchMedia("(max-width: 768px)").matches;
    setEnabled(fine && !narrow);
    if (!fine || narrow) return;

    document.body.classList.add("custom-cursor-active");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const interactive = !!t.closest(
        "a,button,[role='button'],input,select,textarea,label,[contenteditable='true']",
      );
      const typing = document.activeElement?.matches("input,textarea,[contenteditable='true']");
      setHovering(interactive && !typing);
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed z-[201] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink/80"
        style={{ left: x, top: y }}
      />
      <motion.div
        className="pointer-events-none fixed z-[200] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-pink/90 bg-pink/10"
        style={{
          left: x,
          top: y,
          width: hovering ? 44 : 28,
          height: hovering ? 44 : 28,
        }}
        transition={{ duration: 0.12, ease: "easeOut" }}
      />
    </>
  );
}
