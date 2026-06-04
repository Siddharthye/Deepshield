"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { CyberReportForm } from "@/components/report/CyberReportForm";
import { ShieldOverlay } from "@/components/ui/ShieldOverlay";
import { fetchLegalReportSummary } from "@/lib/api";
import { loadScanSession } from "@/lib/scanSession";
import { verdictLabelKey } from "@/lib/riskScoring";
import { generateEvidencePdf, downloadBlob } from "@/lib/pdf-generator";
import { loadTraceHits, loadTraceUrls } from "@/lib/traceStorage";
import { useLanguage } from "@/context/LanguageContext";
import type { ScanSession } from "@/lib/types";

export default function ReportPage() {
  const { apiLanguage, t } = useLanguage();
  const [scan, setScan] = useState<ScanSession | null>(null);
  const [legalSummary, setLegalSummary] = useState<string | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [shield, setShield] = useState(false);

  useEffect(() => {
    setScan(loadScanSession());
  }, []);

  useEffect(() => {
    return () => {
      if (pdfPreview) URL.revokeObjectURL(pdfPreview);
    };
  }, [pdfPreview]);

  async function buildPdf() {
    if (!scan) return;
    setPdfLoading(true);
    setPdfError(null);
    try {
      let summary = legalSummary ?? undefined;
      if (!summary) {
        setSummaryLoading(true);
        try {
          summary = await fetchLegalReportSummary(scan, "en");
          setLegalSummary(summary);
        } catch {
          summary =
            scan.explain?.explanation ??
            `Deepfake scan completed. Verdict: ${scan.risk.verdict}. Risk: ${scan.risk.finalRisk}%.`;
        } finally {
          setSummaryLoading(false);
        }
      }
      const traceHits = loadTraceHits();
      const traceUrls = loadTraceUrls();
      const blob = await generateEvidencePdf(scan, traceUrls, summary, traceHits, apiLanguage);
      if (pdfPreview) URL.revokeObjectURL(pdfPreview);
      setPdfPreview(URL.createObjectURL(blob));
      return blob;
    } catch (err) {
      const message = err instanceof Error ? err.message : t("reportPdfError");
      setPdfError(message);
      return null;
    } finally {
      setPdfLoading(false);
    }
  }

  async function downloadPdf() {
    const blob = await buildPdf();
    if (blob) {
      downloadBlob(blob, `deepshield_evidence_${Date.now()}.pdf`);
      setShield(true);
      setTimeout(() => setShield(false), 900);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14 pb-24 md:pb-14">
      <ShieldOverlay show={shield} />
      <PageHeader
        badge={t("reportPageBadge")}
        title={t("reportPageTitle")}
        subtitle={t("reportPageSubtitle")}
      />

      {!scan ? (
        <GlassCard>
          <p className="text-sm text-ink-muted">
            {t("reportNoScan")}{" "}
            <Link href="/scan" className="font-medium text-link underline">
              {t("reportRunScanFirst")}
            </Link>
            .
          </p>
        </GlassCard>
      ) : (
        <div className="space-y-8">
          <GlassCard className="space-y-4">
            <p className="font-display text-2xl text-ink">
              {t(verdictLabelKey(scan.risk.verdict))} · {scan.risk.finalRisk}%
            </p>
            {scan.explain && (
              <p className="text-sm leading-relaxed">{scan.explain.explanation}</p>
            )}
            <Button
              variant="secondary"
              disabled={summaryLoading}
              onClick={async () => {
                setSummaryLoading(true);
                try {
                  const s = await fetchLegalReportSummary(scan, apiLanguage);
                  setLegalSummary(s);
                } finally {
                  setSummaryLoading(false);
                }
              }}
            >
              {summaryLoading ? t("reportGeneratingSummary") : t("reportGenerateSummary")}
            </Button>
            {legalSummary && (
              <div className="rounded-xl border border-secondary/12 bg-cream-deep/90 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">
                  {t("pdfLegalSummary")}
                </p>
                <div className="mt-3 max-h-64 overflow-y-auto whitespace-pre-wrap text-sm leading-[1.65] text-ink-muted">
                  {legalSummary}
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" onClick={() => void downloadPdf()} disabled={pdfLoading}>
                {pdfLoading ? t("reportBuildingPdf") : t("reportDownloadPdf")}
              </Button>
              <Button variant="secondary" onClick={() => void buildPdf()} disabled={pdfLoading}>
                {t("reportPreviewPdf")}
              </Button>
            </div>
            {pdfError && (
              <p className="text-sm text-red-800" role="alert">
                {pdfError}
              </p>
            )}
          </GlassCard>

          {pdfPreview && (
            <GlassCard>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-ink">{t("reportPdfPreview")}</p>
                <a
                  href={pdfPreview}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-link underline"
                >
                  {t("reportOpenPdfTab")}
                </a>
              </div>
              <object
                data={pdfPreview}
                type="application/pdf"
                className="h-[min(520px,70vh)] w-full rounded-xl border border-sage/40 bg-cream"
              >
                <embed
                  src={pdfPreview}
                  type="application/pdf"
                  className="h-[min(520px,70vh)] w-full rounded-xl"
                />
              </object>
            </GlassCard>
          )}
        </div>
      )}

      <div className="mt-12 border-t border-secondary/15 pt-10">
        <CyberReportForm />
      </div>
    </div>
  );
}
