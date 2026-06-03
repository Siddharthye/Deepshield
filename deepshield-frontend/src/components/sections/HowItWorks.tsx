"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";

const STEPS = [
  {
    n: "01",
    title: "Scan",
    body: "Upload an image or video. Three signals — model, artifacts, symmetry — combine into one risk score.",
  },
  {
    n: "02",
    title: "Document",
    body: "Trace where media appears, save encrypted evidence, and generate a legal PDF summary.",
  },
  {
    n: "03",
    title: "Act",
    body: "File at cybercrime.gov.in, talk to Asha for support and rights, connect with the community.",
  },
];

export function HowItWorks() {
  return (
    <section className="section-pad mx-auto max-w-6xl px-4">
      <p className="page-badge">How it works</p>
      <h2 className="font-display text-2xl text-ink md:text-3xl">
        Three calm steps when it matters most
      </h2>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <GlassCard className="h-full">
              <span className="text-xs font-semibold tracking-widest text-accent">{s.n}</span>
              <h3 className="font-display mt-2 text-lg text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{s.body}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
