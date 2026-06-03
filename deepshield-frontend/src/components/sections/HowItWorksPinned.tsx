"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const STEPS = [
  { title: "Scan", body: "Upload media. face-api, OpenCV, and our HF model combine into one risk score." },
  { title: "Document", body: "Trace appearances, encrypt evidence in your vault, export a legal PDF." },
  { title: "Act", body: "File at cybercrime.gov.in, speak with Asha, know your rights." },
];

export function HowItWorksPinned() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const panels = panelsRef.current.filter(Boolean);
      if (!panels.length || !wrapRef.current) return;

      gsap.set(panels.slice(1), { opacity: 0, y: 40 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 1,
        },
      });

      panels.forEach((panel, i) => {
        if (i === 0) return;
        tl.to(panels[i - 1], { opacity: 0, y: -30, duration: 0.3 }, i * 0.35);
        tl.fromTo(panel, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.35 }, i * 0.35);
      });
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={wrapRef} className="relative mx-auto max-w-6xl px-4 py-24">
      <p className="page-badge">How it works</p>
      <h2 className="font-display text-2xl text-ink md:text-3xl">Scroll through your path</h2>
      <div className="relative mt-16 min-h-[40vh]">
        {STEPS.map((s, i) => (
          <div
            key={s.title}
            ref={(el) => {
              if (el) panelsRef.current[i] = el;
            }}
            className="absolute inset-x-0 top-0 rounded-3xl bg-blue/30 p-10 backdrop-blur-md"
          >
            <span className="text-xs font-semibold text-pink">Step {i + 1}</span>
            <h3 className="font-display mt-2 text-3xl text-ink">{s.title}</h3>
            <p className="mt-4 max-w-lg text-lg text-ink/75">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
