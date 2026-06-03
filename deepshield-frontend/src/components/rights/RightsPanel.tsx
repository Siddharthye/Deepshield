"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { askRights } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

const QUICK = [
  "Can I get them arrested?",
  "How do I file a complaint online?",
  "What if the perpetrator is abroad?",
];

const LAWS = [
  { title: "IT Act §66E", desc: "Privacy violation — capturing/publishing private images." },
  { title: "IT Act §67 / §67A", desc: "Obscene or sexually explicit electronic content." },
  { title: "IPC §354C", desc: "Voyeurism — watching or disseminating images without consent." },
  { title: "POCSO Act", desc: "Enhanced protections if the victim is a minor." },
];

export function RightsPanel() {
  const { language } = useLanguage();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(q: string) {
    setQuestion(q);
    setLoading(true);
    setError(null);
    setAnswer(null);
    try {
      const res = await askRights({ question: q, language });
      setAnswer(res.answer);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        {LAWS.map((law) => (
          <GlassCard key={law.title}>
            <h3 className="font-semibold text-espresso">{law.title}</h3>
            <p className="mt-1 text-sm text-espresso/80">{law.desc}</p>
          </GlassCard>
        ))}
      </div>
      <GlassCard>
        <h2 className="mb-4 font-semibold text-espresso">Ask in plain language</h2>
        <div className="mb-4 flex flex-wrap gap-2">
          {QUICK.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => submit(q)}
              className="rounded-full bg-blush/60 px-3 py-1.5 text-xs text-espresso hover:bg-rose/30"
            >
              {q}
            </button>
          ))}
        </div>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={4}
          placeholder="What are my rights if someone morphed my photo?"
          className="w-full rounded-xl border border-sage/40 bg-fantasy p-3 text-sm outline-none focus:border-rose"
        />
        <button
          type="button"
          onClick={() => submit(question)}
          disabled={loading || !question.trim()}
          className="mt-3 rounded-full bg-rose px-5 py-2 text-sm font-medium text-espresso disabled:opacity-50"
        >
          {loading ? "Thinking…" : "Get answer"}
        </button>
        {error && <p className="mt-3 text-sm text-rose">{error}</p>}
        {answer && (
          <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-espresso/90">
            {answer}
          </p>
        )}
      </GlassCard>
    </div>
  );
}
