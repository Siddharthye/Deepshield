"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

const PANELS = [
  { title: "Detect", href: "/scan", color: "bg-pink/40" },
  { title: "Trace", href: "/trace", color: "bg-peach/50" },
  { title: "Report", href: "/report", color: "bg-blue/40" },
  { title: "Vault", href: "/vault", color: "bg-sage/40" },
  { title: "Asha", href: "/asha", color: "bg-pink/30" },
];

export function HorizontalFeatures() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      if (!sectionRef.current || !trackRef.current) return;
      const total = trackRef.current.scrollWidth - window.innerWidth;
      gsap.to(trackRef.current, {
        x: -total,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          end: () => `+=${total}`,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="overflow-hidden py-8">
      <p className="page-badge mx-auto max-w-6xl px-4">Explore</p>
      <h2 className="font-display mx-auto max-w-6xl px-4 text-2xl text-ink">Scroll the journey</h2>
      <div ref={trackRef} className="mt-10 flex w-max gap-6 px-8">
        {PANELS.map((p) => (
          <Link
            key={p.title}
            href={p.href}
            className={`flex h-64 w-[min(80vw,320px)] shrink-0 flex-col justify-end rounded-3xl p-8 ${p.color}`}
          >
            <span className="font-display text-3xl text-ink">{p.title}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
