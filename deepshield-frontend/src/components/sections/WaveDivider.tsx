"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function WaveDivider() {
  const backRef = useRef<SVGSVGElement>(null);
  const frontRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (backRef.current) {
      gsap.to(backRef.current, {
        y: 40,
        scrollTrigger: { scrub: 1 },
      });
    }
    if (frontRef.current) {
      gsap.to(frontRef.current, {
        y: 80,
        scrollTrigger: { scrub: 1 },
      });
    }
  }, []);

  return (
    <div className="relative -my-4 h-24 overflow-hidden" aria-hidden>
      <svg
        ref={backRef}
        className="absolute bottom-0 w-[120%] text-peach/50"
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,40 C300,80 600,0 900,40 C1050,60 1150,50 1200,40 L1200,80 L0,80 Z"
        />
      </svg>
      <svg
        ref={frontRef}
        className="absolute bottom-0 w-[120%] text-blue/40"
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,50 C400,10 800,70 1200,50 L1200,80 L0,80 Z"
        />
      </svg>
    </div>
  );
}
