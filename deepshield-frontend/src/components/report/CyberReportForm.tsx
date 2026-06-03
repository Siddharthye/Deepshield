"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { loadScanSession } from "@/lib/scanSession";
import { verdictLabelKey } from "@/lib/riskScoring";
import { useLanguage } from "@/context/LanguageContext";

export function CyberReportForm() {
  const { t } = useLanguage();
  const [incident, setIncident] = useState("");
  const [platform, setPlatform] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const scan = loadScanSession();
    if (!scan) return;
    setIncident(
      `${t("cyberIncidentScanPrefix")} ${t(verdictLabelKey(scan.risk.verdict))} (${scan.risk.finalRisk}% risk). ${scan.explain?.explanation?.slice(0, 200) ?? ""}`,
    );
    setNotes(scan.explain?.recommendation ?? "");
  }, [t]);

  return (
    <GlassCard className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">{t("cyberFormTitle")}</p>
      <label className="block text-sm text-ink-muted">
        {t("cyberIncidentLabel")}
        <textarea
          className="input-field mt-1"
          rows={4}
          value={incident}
          onChange={(e) => setIncident(e.target.value)}
        />
      </label>
      <label className="block text-sm text-ink-muted">
        {t("cyberPlatformLabel")}
        <input
          className="input-field mt-1"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        />
      </label>
      <label className="block text-sm text-ink-muted">
        {t("cyberNotesLabel")}
        <textarea
          className="input-field mt-1"
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </label>
      <p className="text-xs text-ink-subtle">{t("cyberCopyHint")}</p>
      <Button
        variant="primary"
        className="w-full"
        onClick={() => {
          const blob = new Blob(
            [`${t("cyberIncidentLabel")}:\n${incident}\n\n${t("cyberPlatformLabel")}:\n${platform}\n\n${t("cyberNotesLabel")}:\n${notes}`],
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
        {t("cyberDownloadDraft")}
      </Button>
      <a
        href="https://cybercrime.gov.in/"
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center text-sm text-link underline"
      >
        {t("cyberOpenPortal")}
      </a>
    </GlassCard>
  );
}
