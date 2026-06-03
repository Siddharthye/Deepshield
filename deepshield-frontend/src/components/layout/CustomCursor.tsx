"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 280, damping: 28 });
  const ringY = useSpring(y, { stiffness: 280, damping: 28 });
  const [hovering, setHovering] = useState(false);
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const narrow = window.matchMedia("(max-width: 768px)").matches;
    setEnabled(fine && !narrow);
    if (!fine || narrow) return;

    document.body.classList.add("custom-cursor-active");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setTrail((t) => [...t.slice(-5), { x: e.clientX, y: e.clientY, id: e.timeStamp }]);
    };

    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const interactive = !!t.closest(
        "a,button,[role='button'],input,select,textarea,label,[contenteditable='true']",
      );
      const typing = document.activeElement?.matches("input,textarea,[contenteditable='true']");
      setHovering(interactive && !typing);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      {trail.map((p, i) => (
        <motion.span
          key={p.id}
          className="pointer-events-none fixed z-[200] h-1.5 w-1.5 rounded-full bg-pink/50"
          style={{ left: p.x, top: p.y }}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.4, delay: i * 0.02 }}
        />
      ))}
      <motion.div
        className="pointer-events-none fixed z-[201] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-peach mix-blend-difference"
        style={{ left: x, top: y, opacity: hovering ? 0 : 1 }}
      />
      <motion.div
        className="pointer-events-none fixed z-[200] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-peach mix-blend-difference"
        style={{
          left: ringX,
          top: ringY,
          width: hovering ? 56 : 32,
          height: hovering ? 56 : 32,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      />
    </>
  );
}
