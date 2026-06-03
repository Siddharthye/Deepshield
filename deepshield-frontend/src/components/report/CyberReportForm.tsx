"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { loadScanSession } from "@/lib/scanSession";
import { verdictLabel } from "@/lib/riskScoring";

export function CyberReportForm() {
  const [incident, setIncident] = useState("");
  const [platform, setPlatform] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const scan = loadScanSession();
    if (!scan) return;
    setIncident(
      `Deepfake / morphed image concern. Scan: ${verdictLabel(scan.risk.verdict)} (${scan.risk.finalRisk}% risk). ${scan.explain?.explanation?.slice(0, 200) ?? ""}`,
    );
    setNotes(scan.explain?.recommendation ?? "");
  }, []);

  return (
    <GlassCard className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-pink">
        Cybercrime portal prep (anonymous here)
      </p>
      <label className="block text-sm text-ink/75">
        Incident summary
        <textarea
          className="input-field mt-1"
          rows={4}
          value={incident}
          onChange={(e) => setIncident(e.target.value)}
        />
      </label>
      <label className="block text-sm text-ink/75">
        Platform / URL (if known)
        <input
          className="input-field mt-1"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        />
      </label>
      <label className="block text-sm text-ink/75">
        Additional notes
        <textarea
          className="input-field mt-1"
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </label>
      <p className="text-xs text-ink/55">
        Copy these fields when filing. DeepShield does not submit on your behalf.
      </p>
      <Button
        variant="primary"
        className="w-full"
        onClick={() => {
          const blob = new Blob(
            [`Incident:\n${incident}\n\nPlatform:\n${platform}\n\nNotes:\n${notes}`],
            { type: "text/plain" },
          );
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "cybercrime_draft.txt";
          a.click();
          URL.revokeObjectURL(url);
        }}
      >
        Download draft for portal
      </Button>
      <a
        href="https://cybercrime.gov.in/"
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center text-sm text-pink underline"
      >
        Open cybercrime.gov.in →
      </a>
    </GlassCard>
  );
}
