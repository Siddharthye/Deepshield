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
import { verdictLabel } from "@/lib/riskScoring";
import { generateEvidencePdf, downloadBlob } from "@/lib/pdf-generator";
import { loadTraceHits, loadTraceUrls } from "@/lib/traceStorage";
import { useLanguage } from "@/context/LanguageContext";
import type { ScanSession } from "@/lib/types";

export default function ReportPage() {
  const { language } = useLanguage();
  const [scan, setScan] = useState<ScanSession | null>(null);
  const [legalSummary, setLegalSummary] = useState<string | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [shield, setShield] = useState(false);

  useEffect(() => {
    setScan(loadScanSession());
  }, []);

  async function buildPdf() {
    if (!scan) return;
    setPdfLoading(true);
    try {
      let summary = legalSummary;
      if (!summary) {
        setSummaryLoading(true);
        summary = await fetchLegalReportSummary(scan, language);
        setLegalSummary(summary);
        setSummaryLoading(false);
      }
      const traceHits = loadTraceHits();
      const traceUrls = loadTraceUrls();
      const blob = await generateEvidencePdf(scan, traceUrls, summary, traceHits);
      if (pdfPreview) URL.revokeObjectURL(pdfPreview);
      setPdfPreview(URL.createObjectURL(blob));
      return blob;
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
        badge="Evidence"
        title="Legal evidence report"
        subtitle="LLM legal summary, PDF with scan image, trace URLs, and cybercrime filing prep."
      />

      {!scan ? (
        <GlassCard>
          <p className="text-sm text-ink/80">
            No scan yet.{" "}
            <Link href="/scan" className="font-medium text-pink underline">
              Run a scan first
            </Link>
            .
          </p>
        </GlassCard>
      ) : (
        <div className="space-y-8">
          <GlassCard className="space-y-4">
            <p className="font-display text-2xl text-ink">
              {verdictLabel(scan.risk.verdict)} · {scan.risk.finalRisk}%
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
                  const s = await fetchLegalReportSummary(scan, language);
                  setLegalSummary(s);
                } finally {
                  setSummaryLoading(false);
                }
              }}
            >
              {summaryLoading ? "Generating legal summary…" : "Generate LLM legal summary"}
            </Button>
            {legalSummary && (
              <p className="rounded-xl bg-blue/30 p-4 text-sm leading-relaxed">{legalSummary}</p>
            )}
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" onClick={() => void downloadPdf()} disabled={pdfLoading}>
                {pdfLoading ? "Building PDF…" : "Download PDF"}
              </Button>
              <Button variant="secondary" onClick={() => void buildPdf()} disabled={pdfLoading}>
                Preview PDF
              </Button>
            </div>
          </GlassCard>

          {pdfPreview && (
            <GlassCard>
              <p className="mb-3 text-sm font-medium text-ink">PDF preview</p>
              <iframe
                src={pdfPreview}
                title="Evidence PDF preview"
                className="h-[min(520px,70vh)] w-full rounded-xl border border-sage/40 bg-cream"
              />
            </GlassCard>
          )}
        </div>
      )}

      <div className="mt-10">
        <CyberReportForm />
      </div>
    </div>
  );
}
