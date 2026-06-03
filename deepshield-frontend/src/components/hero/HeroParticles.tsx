"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Canvas = dynamic(
  () => import("@/components/hero/ParticleCanvas").then((m) => m.ParticleCanvas),
  { ssr: false },
);

export function HeroParticles() {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    setMobile(window.matchMedia("(max-width: 768px)").matches);
  }, []);

  if (mobile) {
    return (
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden
      >
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-pink/25 blur-3xl animate-pulse" />
        <div className="absolute right-1/4 bottom-1/3 h-56 w-56 rounded-full bg-blue/30 blur-3xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 h-[min(520px,70vh)] w-full">
      <Canvas />
    </div>
  );
}
