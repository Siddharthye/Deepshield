"use client";

import { useEffect, useMemo, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { loadScanSession } from "@/lib/scanSession";
import { verdictLabelKey } from "@/lib/riskScoring";
import { buildCyberDraft } from "@/lib/cyberDraft";
import { SAFETY } from "@/lib/safetyContacts";
import { useLanguage } from "@/context/LanguageContext";

const CHECKLIST_KEYS = ["cyberCheck1", "cyberCheck2", "cyberCheck3"] as const;
const STEP_KEYS = ["cyberStep1", "cyberStep2", "cyberStep3"] as const;

export function CyberReportForm() {
  const { t, language } = useLanguage();
  const [incident, setIncident] = useState("");
  const [platform, setPlatform] = useState("");
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const scan = loadScanSession();
    if (!scan) return;
    setIncident(
      `${t("cyberIncidentScanPrefix")} ${t(verdictLabelKey(scan.risk.verdict))} (${scan.risk.finalRisk}% risk). ${scan.explain?.explanation?.slice(0, 280) ?? ""}`,
    );
    setNotes(scan.explain?.recommendation ?? "");
  }, [t]);

  const draft = useMemo(
    () => buildCyberDraft({ incident, platform, notes }, language),
    [incident, platform, notes, language],
  );

  async function copyDraft() {
    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* fallback: select preview */
    }
  }

  function downloadDraft() {
    const blob = new Blob([draft], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cybercrime_draft_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="page-badge">{t("cyberFormBadge")}</p>
        <h2 className="font-display mt-2 text-xl text-ink md:text-2xl">{t("cyberFormTitle")}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">{t("cyberHelper")}</p>
      </div>

      <ol className="grid gap-3 sm:grid-cols-3">
        {STEP_KEYS.map((key, i) => (
          <li
            key={key}
            className="flex gap-3 rounded-2xl bg-cream-deep/80 px-4 py-3 ring-1 ring-secondary/12"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-cream-deep">
              {i + 1}
            </span>
            <p className="text-xs leading-relaxed text-ink-muted">{t(key)}</p>
          </li>
        ))}
      </ol>

      <GlassCard className="space-y-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">
          {t("cyberFormFieldsTitle")}
        </p>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-ink-muted">
            {t("cyberIncidentLabel")}
          </span>
          <textarea
            className="input-field min-h-[7rem] resize-y leading-relaxed"
            rows={5}
            value={incident}
            onChange={(e) => setIncident(e.target.value)}
            placeholder={t("cyberDraftIncidentPlaceholder")}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-ink-muted">
            {t("cyberPlatformLabel")}
          </span>
          <input
            className="input-field"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            placeholder={t("cyberDraftPlatformPlaceholder")}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-ink-muted">
            {t("cyberNotesLabel")}
          </span>
          <textarea
            className="input-field min-h-[5rem] resize-y leading-relaxed"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t("cyberDraftNotesPlaceholder")}
          />
        </label>
      </GlassCard>

      <GlassCard className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">
            {t("cyberPreviewTitle")}
          </p>
          <p className="text-[11px] text-ink-subtle">{t("cyberCopyHint")}</p>
        </div>
        <pre className="max-h-56 overflow-y-auto whitespace-pre-wrap rounded-xl border border-secondary/12 bg-parchment/60 p-4 font-sans text-xs leading-relaxed text-ink-muted">
          {draft}
        </pre>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" onClick={() => void copyDraft()}>
            {copied ? t("cyberCopied") : t("cyberCopyDraft")}
          </Button>
          <Button variant="secondary" onClick={downloadDraft}>
            {t("cyberDownloadDraft")}
          </Button>
        </div>
      </GlassCard>

      <GlassCard className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">
          {t("cyberChecklistTitle")}
        </p>
        <ul className="space-y-2">
          {CHECKLIST_KEYS.map((key) => (
            <li key={key} className="flex gap-2 text-sm text-ink-muted">
              <span className="mt-0.5 text-secondary" aria-hidden>
                ✓
              </span>
              {t(key)}
            </li>
          ))}
        </ul>
      </GlassCard>

      <a
        href={SAFETY.portalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-full bg-secondary px-6 py-3 text-center text-sm font-medium text-cream-deep shadow-[0_4px_20px_rgba(75,10,10,0.28)] transition hover:brightness-110"
      >
        {t("cyberOpenPortal")}
        <span aria-hidden>→</span>
      </a>
      <p className="text-center text-xs text-ink-subtle">
        {t("cyberHelplineNote")} {SAFETY.cyberHelpline}
      </p>
    </div>
  );
}
