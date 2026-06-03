"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";

const CARDS = [
  {
    title: "How deepfakes are made",
    body: "AI swaps faces or generates expressions from training data — often without consent.",
  },
  {
    title: "5 signs of manipulation",
    body: "Blurry jawlines, skin tone mismatch, odd shadows, inconsistent lighting, warped backgrounds.",
  },
  {
    title: "First 24 hours",
    body: "Screenshot evidence, scan with DeepShield, save to vault, talk to Asha, know your rights.",
  },
];

const ROUNDS = [
  { hint: "Portrait with consistent lighting and natural skin texture.", answer: "real" as const },
  { hint: "Face edges look melted; earrings blur into skin.", answer: "fake" as const },
  { hint: "Stable teeth and lip sync in motion.", answer: "real" as const },
];

export default function LearnPage() {
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<"real" | "fake" | null>(null);
  const shareRef = useRef<HTMLDivElement>(null);

  const current = ROUNDS[round % ROUNDS.length];

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
        subtitle="Spot deepfakes with a short quiz and calm educational cards."
      />

      <GlassCard className="mb-8">
        <p className="font-display text-2xl text-pink">Score: {score}</p>
        <p className="mt-4 text-sm leading-relaxed text-ink/85">{current.hint}</p>
        <div className="mt-5 flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => guess("real")}>
            Likely real
          </Button>
          <Button variant="primary" className="flex-1" onClick={() => guess("fake")}>
            Likely fake
          </Button>
        </div>
        {picked && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-center text-sm">
            {picked === current.answer ? "Correct — well done." : "Keep practicing — you've got this."}
          </motion.p>
        )}
      </GlassCard>

      <div ref={shareRef} className="mb-8">
        <GlassCard className="text-center">
          <p className="text-xs uppercase tracking-wide text-pink">Share your score</p>
          <p className="font-display mt-2 text-4xl text-ink">{score}</p>
          <p className="mt-1 text-sm text-ink/65">deepfake awareness · DeepShield</p>
        </GlassCard>
      </div>

      <div className="space-y-4">
        {CARDS.map((c) => (
          <GlassCard key={c.title}>
            <h3 className="font-display text-lg text-ink">{c.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/80">{c.body}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
