"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { askRights } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import { RIGHTS_QUICK_PROMPTS } from "@/components/asha/BasicRights";

export function RightsExplainer() {
  const { language } = useLanguage();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function ask(q: string) {
    if (!q.trim() || loading) return;
    setLoading(true);
    setAnswer(null);
    try {
      const res = await askRights({ question: q.trim(), language });
      setAnswer(res.answer);
    } catch (e) {
      setAnswer(e instanceof Error ? e.message : "Could not get an answer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <GlassCard className="mt-8">
      <h3 className="font-display text-lg text-ink">Ask about your rights (AI)</h3>
      <p className="mt-1 text-sm text-ink/65">
        Plain-language legal guidance — separate from Asha&apos;s emotional support chat.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {RIGHTS_QUICK_PROMPTS.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => {
              setQuestion(q);
              void ask(q);
            }}
            className="rounded-full bg-blue/40 px-3 py-1 text-xs text-ink hover:bg-pink/40"
          >
            {q}
          </button>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <input
          className="input-field flex-1"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your rights question…"
          onKeyDown={(e) => e.key === "Enter" && ask(question)}
        />
        <Button variant="primary" onClick={() => ask(question)} disabled={loading}>
          {loading ? "…" : "Ask"}
        </Button>
      </div>
      {answer && (
        <p className="mt-4 rounded-xl bg-peach/30 p-4 text-sm leading-relaxed text-ink">{answer}</p>
      )}
    </GlassCard>
  );
}
