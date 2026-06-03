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
];

export function Testimonials() {
  return (
    <section className="section-pad mx-auto max-w-6xl px-4">
      <p className="page-badge">Voices</p>
      <h2 className="font-display text-2xl text-ink md:text-3xl">
        Built for dignity, not spectacle
      </h2>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
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
