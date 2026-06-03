"use client";

import { GlassCard } from "@/components/ui/GlassCard";

const QUOTES = [
  {
    text: "I finally had words for what happened to me — and proof I could show someone.",
    label: "Survivor, anonymous",
  },
  {
    text: "The rights section helped me understand I could file without shame.",
    label: "Advocate partner",
  },
  {
    text: "Knowing my photos never left my browser made me feel safe enough to try the scan.",
    label: "First-time user",
  },
];

const PRINCIPLES = [
  { title: "Trauma-informed", desc: "No blame, no spectacle — calm language throughout." },
  { title: "Evidence-first", desc: "Heatmaps, PDFs, and trace logs you can hand to police." },
  { title: "Always free", desc: "Hackathon build — $0 for survivors, no account required." },
];

export function Testimonials() {
  return (
    <section className="section-pad mx-auto max-w-6xl px-4">
      <p className="page-badge">Voices & values</p>
      <h2 className="font-display text-2xl text-ink md:text-3xl">
        Built for dignity, not spectacle
      </h2>
      <p className="mt-3 max-w-2xl text-sm text-ink/70">
        DeepShield is infrastructure for people facing image-based abuse — designed with input
        from advocates and privacy-first engineering.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {PRINCIPLES.map((p) => (
          <GlassCard key={p.title} className="p-5 text-center md:text-left">
            <p className="font-display text-lg text-ink">{p.title}</p>
            <p className="mt-2 text-xs leading-relaxed text-ink/75">{p.desc}</p>
          </GlassCard>
        ))}
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {QUOTES.map((q) => (
          <GlassCard key={q.label}>
            <p className="text-sm leading-relaxed text-ink/85">&ldquo;{q.text}&rdquo;</p>
            <p className="mt-4 text-xs font-medium text-pink">{q.label}</p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
