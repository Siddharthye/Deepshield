"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";

const REPORT_LINKS = [
  { name: "Meta (Facebook/Instagram)", url: "https://www.facebook.com/help/contact/571927962448785" },
  { name: "X (Twitter)", url: "https://help.twitter.com/forms/privacy" },
  { name: "Telegram", url: "https://telegram.org/support" },
];

export default function TracePage() {
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <PageHeader
        badge="Trace"
        title="Reverse image tracer"
        subtitle="Use Google Lens and TinEye to find where your image appears online, then save links to your vault."
      />

      <GlassCard className="space-y-4">
        <a
          href="https://lens.google.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-2xl bg-gradient-to-r from-rose/50 to-blush/60 px-4 py-4 text-center text-sm font-medium text-espresso transition hover:brightness-105"
        >
          Open Google Lens
        </a>
        <a
          href="https://tineye.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-2xl border border-sage/40 bg-blush/40 px-4 py-4 text-center text-sm font-medium text-espresso transition hover:bg-blush/70"
        >
          Open TinEye
        </a>
        <textarea
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
            setSaved(false);
          }}
          placeholder="Paste URLs you found (one per line)…"
          rows={5}
          className="input-field"
        />
        <Button
          variant="dark"
          className="w-full"
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
            setSaved(true);
          }}
        >
          Save URLs locally
        </Button>
        {saved && (
          <p className="text-center text-sm text-rose">
            URLs saved for your report.
          </p>
        )}
      </GlassCard>

      <h2 className="font-display mb-4 mt-12 text-xl font-semibold text-espresso">
        Report to platforms
      </h2>
      <div className="space-y-3">
        {REPORT_LINKS.map((l) => (
          <GlassCard key={l.name}>
            <a
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-rose underline decoration-blush underline-offset-4 hover:text-espresso"
            >
              {l.name} — takedown / privacy form
            </a>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
