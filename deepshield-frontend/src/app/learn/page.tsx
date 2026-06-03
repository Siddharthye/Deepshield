"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { fetchQuizRound } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

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

export default function LearnPage() {
  const { language } = useLanguage();
  const [score, setScore] = useState(0);
  const [round, setRound] = useState<{ hintA: string; hintB: string; answer: "a" | "b"; explanation: string } | null>(null);
  const [picked, setPicked] = useState<"a" | "b" | null>(null);
  const [loading, setLoading] = useState(true);
  const shareRef = useRef<HTMLDivElement>(null);

  async function loadRound() {
    setLoading(true);
    try {
      const r = await fetchQuizRound(language);
      setRound(r);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadRound();
  }, [language]);

  function guess(g: "a" | "b") {
    if (!round) return;
    setPicked(g);
    if (g === round.answer) setScore((s) => s + 1);
    setTimeout(() => {
      setPicked(null);
      void loadRound();
    }, 1800);
  }

  function shareScore() {
    shareRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14 pb-24 md:pb-14">
      <PageHeader
        badge="Learn"
        title="Awareness hub"
        subtitle="LLM-generated quiz rounds and educational cards — spot deepfakes with confidence."
      />

      <GlassCard className="mb-8">
        <p className="font-display text-2xl text-pink">Score: {score}</p>
        {loading || !round ? (
          <p className="mt-4 text-sm text-ink/60">Loading quiz round…</p>
        ) : (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => guess("a")}
                className="rounded-xl bg-blue/35 p-4 text-left text-sm hover:bg-pink/30"
              >
                <span className="text-xs font-semibold text-pink">Image A</span>
                <p className="mt-2">{round.hintA}</p>
              </button>
              <button
                type="button"
                onClick={() => guess("b")}
                className="rounded-xl bg-peach/40 p-4 text-left text-sm hover:bg-pink/30"
              >
                <span className="text-xs font-semibold text-pink">Image B</span>
                <p className="mt-2">{round.hintB}</p>
              </button>
            </div>
            {picked && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-center text-sm"
              >
                {picked === round.answer ? "Correct." : "Good try."} {round.explanation}
              </motion.p>
            )}
          </>
        )}
        <Button variant="ghost" className="mt-4" onClick={shareScore}>
          Share score card ↓
        </Button>
      </GlassCard>

      <div ref={shareRef} className="mb-8" id="share-card">
        <GlassCard className="text-center">
          <p className="text-xs uppercase tracking-wide text-pink">DeepShield · Can you spot the deepfake?</p>
          <p className="font-display mt-2 text-5xl text-ink">{score}</p>
          <p className="mt-1 text-sm text-ink/65">points · screenshot to share</p>
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
