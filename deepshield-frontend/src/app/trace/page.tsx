"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";

const REPORT_LINKS = [
  { name: "Meta (Facebook/Instagram)", url: "https://www.facebook.com/help/contact/571927962448785" },
  { name: "X (Twitter)", url: "https://help.twitter.com/forms/privacy" },
  { name: "Telegram", url: "https://telegram.org/support" },
];

export default function TracePage() {
  const [note, setNote] = useState("");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-semibold text-espresso">Reverse image tracer</h1>
      <p className="mb-8 text-espresso/70">
        Use Google Lens and TinEye to find where your image appears online, then
        save links to your vault.
      </p>
      <GlassCard className="space-y-4">
        <a
          href="https://lens.google.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-xl bg-rose/30 px-4 py-3 text-center text-sm font-medium text-espresso"
        >
          Open Google Lens
        </a>
        <a
          href="https://tineye.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-xl bg-blush/50 px-4 py-3 text-center text-sm font-medium text-espresso"
        >
          Open TinEye
        </a>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Paste URLs you found (one per line)…"
          rows={5}
          className="w-full rounded-xl border border-sage/40 bg-fantasy p-3 text-sm"
        />
        <button
          type="button"
          onClick={() => {
            if (!note.trim()) return;
            const existing = JSON.parse(
              localStorage.getItem("deepshield_trace_urls") || "[]",
            ) as string[];
            const added = note.split("\n").map((s) => s.trim()).filter(Boolean);
            localStorage.setItem(
              "deepshield_trace_urls",
              JSON.stringify([...existing, ...added]),
            );
            setNote("");
            alert("URLs saved locally for your report.");
          }}
          className="rounded-full bg-espresso px-5 py-2 text-sm text-fantasy"
        >
          Save URLs locally
        </button>
      </GlassCard>
      <h2 className="mb-4 mt-10 text-lg font-semibold">Report to platforms</h2>
      <div className="space-y-3">
        {REPORT_LINKS.map((l) => (
          <GlassCard key={l.name}>
            <a
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-rose underline"
            >
              {l.name} — takedown / privacy form
            </a>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
