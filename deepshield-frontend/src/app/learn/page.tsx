"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";

const CARDS = [
  {
    title: "How deepfakes are made",
    body: "AI swaps faces or generates new expressions from training data — often without consent.",
  },
  {
    title: "5 signs of manipulation",
    body: "Blurry jawlines, mismatched skin tones, odd earring shadows, inconsistent lighting, warped backgrounds.",
  },
  {
    title: "First 24 hours",
    body: "Screenshot evidence, avoid engaging with abusers, scan with DeepShield, save to vault, talk to Asha.",
  },
];

export default function LearnPage() {
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<"real" | "fake" | null>(null);

  const rounds = [
    { hint: "Portrait with consistent lighting and natural skin texture.", answer: "real" as const },
    { hint: "Face edges look melted; earrings blur into skin.", answer: "fake" as const },
    { hint: "Video frame with stable teeth and lip sync.", answer: "real" as const },
  ];

  const current = rounds[round % rounds.length];

  function guess(g: "real" | "fake") {
    setPicked(g);
    if (g === current.answer) setScore((s) => s + 1);
    setTimeout(() => {
      setRound((r) => r + 1);
      setPicked(null);
    }, 1200);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <PageHeader
        badge="Learn"
        title="Awareness hub"
        subtitle="Learn to spot deepfakes and protect yourself — at your own pace."
      />

      <GlassCard className="mb-10">
        <p className="font-display text-2xl font-semibold text-rose">Score: {score}</p>
        <p className="mt-4 text-sm leading-relaxed text-espresso/85">{current.hint}</p>
        <p className="mt-2 text-xs text-espresso/60">Which is more likely authentic?</p>
        <div className="mt-5 flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => guess("real")}>
            Likely real
          </Button>
          <Button variant="primary" className="flex-1" onClick={() => guess("fake")}>
            Likely fake
          </Button>
        </div>
        {picked && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center text-sm font-medium"
          >
            {picked === current.answer
              ? "Correct — you're building a sharp eye."
              : "Good try — keep practicing."}
          </motion.p>
        )}
      </GlassCard>

      <div className="space-y-4">
        {CARDS.map((c) => (
          <GlassCard key={c.title}>
            <h3 className="font-display text-lg font-semibold text-espresso">{c.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-espresso/80">{c.body}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
