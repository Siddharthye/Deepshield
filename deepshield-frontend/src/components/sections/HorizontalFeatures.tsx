"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";

const PANELS = [
  {
    title: "Detect",
    href: "/scan",
    color: "from-pink/50 to-peach/40",
    icon: "🔍",
    desc: "Run the three-signal scan and see exactly where the model flags manipulation.",
    cta: "Start scan",
  },
  {
    title: "Trace",
    href: "/trace",
    color: "from-peach/50 to-cream",
    icon: "🌐",
    desc: "Find where your face was reposted. Log URLs for your evidence bundle.",
    cta: "Trace image",
  },
  {
    title: "Report",
    href: "/report",
    color: "from-blue/50 to-sage/30",
    icon: "📄",
    desc: "Download a legal PDF with scan data, trace log, and filing instructions.",
    cta: "Build report",
  },
  {
    title: "Vault",
    href: "/vault",
    color: "from-sage/40 to-blue/30",
    icon: "🔐",
    desc: "PIN-protected AES storage for everything you need to keep safe.",
    cta: "Open vault",
  },
  {
    title: "Asha",
    href: "/asha",
    color: "from-pink/35 to-blue/35",
    icon: "💬",
    desc: "Support chat plus know-your-rights cards — private and trauma-informed.",
    cta: "Talk to Asha",
  },
  {
    title: "Learn",
    href: "/learn",
    color: "from-peach/40 to-pink/25",
    icon: "📚",
    desc: "Quiz yourself on deepfake red flags and safe evidence habits.",
    cta: "Take quiz",
  },
];

export function HorizontalFeatures() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = window.matchMedia("(min-width: 1024px)");
    const ctx = gsap.context(() => {
      if (!sectionRef.current || !trackRef.current || !mm.matches) return;
      const total = trackRef.current.scrollWidth - window.innerWidth + 80;
      if (total <= 0) return;
      gsap.to(trackRef.current, {
        x: -total,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 0.8,
          end: () => `+=${total}`,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="overflow-hidden py-12">
      <div className="mx-auto max-w-6xl px-4">
        <p className="page-badge">Your journey</p>
        <h2 className="font-display text-2xl text-ink md:text-3xl">Scroll the journey</h2>
        <p className="mt-3 max-w-2xl text-sm text-ink/70">
          From first suspicion to filing a complaint — each step connects. Swipe horizontally on
          desktop, or browse the cards below on mobile.
        </p>
      </div>

      <div
        ref={trackRef}
        className="mt-8 flex w-max gap-5 px-4 pb-4 lg:px-8 lg:pb-8"
      >
        {PANELS.map((p) => (
          <Link
            key={p.title}
            href={p.href}
            className={`flex h-[min(420px,70vh)] w-[min(85vw,340px)] shrink-0 flex-col justify-between rounded-3xl bg-gradient-to-br p-8 shadow-lg ring-1 ring-white/40 ${p.color}`}
          >
            <div>
              <span className="text-4xl">{p.icon}</span>
              <h3 className="font-display mt-4 text-3xl text-ink">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/80">{p.desc}</p>
            </div>
            <span className="mt-6 inline-flex w-fit rounded-full bg-cream/80 px-4 py-2 text-sm font-medium text-ink">
              {p.cta} →
            </span>
          </Link>
        ))}
      </div>

      <div className="mx-auto mt-6 grid max-w-6xl gap-4 px-4 lg:hidden">
        {PANELS.map((p) => (
          <GlassCard key={p.title} className="flex items-center gap-4 p-5">
            <span className="text-2xl">{p.icon}</span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-lg text-ink">{p.title}</p>
              <p className="text-xs text-ink/70">{p.desc}</p>
            </div>
            <Link href={p.href} className="shrink-0 text-sm font-medium text-pink">
              Go →
            </Link>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="mx-auto mt-10 max-w-6xl px-4">
        <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-pink">
              Need help now?
            </p>
            <p className="mt-1 font-display text-lg text-ink">
              National helplines — free, confidential
            </p>
          </div>
          <ul className="flex flex-wrap gap-3 text-sm text-ink/85">
            <li className="rounded-full bg-peach/40 px-3 py-1.5">Cyber Crime: 1930</li>
            <li className="rounded-full bg-peach/40 px-3 py-1.5">NCW: 181</li>
            <li className="rounded-full bg-peach/40 px-3 py-1.5">iCall: 9152987821</li>
          </ul>
        </div>
      </GlassCard>
    </section>
  );
}
