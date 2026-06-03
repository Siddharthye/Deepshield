"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";

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
    body: "Screenshot evidence, avoid engaging with abusers, scan with DeepShield, save to vault, know your rights.",
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
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-semibold text-espresso">Awareness hub</h1>
      <p className="mb-8 text-espresso/70">Learn to spot deepfakes and protect yourself.</p>
      <GlassCard className="mb-8">
        <p className="text-sm font-medium text-espresso">Quiz score: {score}</p>
        <p className="mt-4 text-sm text-espresso/80">{current.hint}</p>
        <p className="mt-2 text-xs text-espresso/60">Which is more likely authentic?</p>
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={() => guess("real")}
            className="flex-1 rounded-xl bg-sage/40 py-3 text-sm font-medium"
          >
            Likely real
          </button>
          <button
            type="button"
            onClick={() => guess("fake")}
            className="flex-1 rounded-xl bg-rose/40 py-3 text-sm font-medium"
          >
            Likely fake
          </button>
        </div>
        {picked && (
          <p className="mt-3 text-center text-sm">
            {picked === current.answer ? "Correct!" : "Good try — keep practicing."}
          </p>
        )}
      </GlassCard>
      <div className="space-y-4">
        {CARDS.map((c) => (
          <GlassCard key={c.title}>
            <h3 className="font-semibold text-espresso">{c.title}</h3>
            <p className="mt-2 text-sm text-espresso/80">{c.body}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
