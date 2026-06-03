"use client";

import { useRef, useState } from "react";

export function useTilt(maxDeg = 8) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("perspective(800px) rotateX(0deg) rotateY(0deg)");

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    setTransform(
      `perspective(800px) rotateX(${-y * maxDeg}deg) rotateY(${x * maxDeg}deg)`,
    );
  }

  function onLeave() {
    setTransform("perspective(800px) rotateX(0deg) rotateY(0deg)");
  }

  return { ref, transform, onMove, onLeave };
}
