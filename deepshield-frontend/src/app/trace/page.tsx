"use client";

import { useState } from "react";
import Image from "next/image";
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
  const [preview, setPreview] = useState<string | null>(null);

  function onImage(file: File) {
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <PageHeader
        badge="Trace"
        title="Reverse image tracer"
        subtitle="Upload your photo, search with Lens or TinEye, and save URLs for your evidence report."
      />

      <GlassCard className="mb-6 space-y-4">
        <label className="upload-zone py-8">
          <span className="text-sm font-medium text-ink">Upload image to trace</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onImage(f);
            }}
          />
        </label>
        {preview && (
          <div className="relative mx-auto aspect-video max-h-48 w-full overflow-hidden rounded-xl">
            <Image src={preview} alt="Trace preview" fill className="object-contain" unoptimized />
          </div>
        )}
        <a
          href="https://lens.google.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-2xl bg-gradient-to-r from-pink/55 to-peach/60 py-3.5 text-center text-sm font-medium text-ink"
        >
          Open Google Lens
        </a>
        <a
          href="https://tineye.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-2xl border border-sage/50 bg-blue/45 py-3.5 text-center text-sm font-medium text-ink"
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
          Save URLs for report
        </Button>
        {saved && <p className="text-center text-sm text-pink">Saved locally.</p>}
      </GlassCard>

      <h2 className="font-display mb-4 text-xl text-ink">Report to platforms</h2>
      <div className="space-y-3">
        {REPORT_LINKS.map((l) => (
          <GlassCard key={l.name}>
            <a
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-pink underline underline-offset-4"
            >
              {l.name}
            </a>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
