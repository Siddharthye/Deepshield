"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { loadScanSession } from "@/lib/scanSession";
import { verdictLabel } from "@/lib/riskScoring";
import { generateEvidencePdf, downloadBlob } from "@/lib/pdf-generator";
import type { ScanSession } from "@/lib/types";

const STEPS = [
  "Review your scan summary and risk score below.",
  "Download the branded PDF evidence report.",
  "Open cybercrime.gov.in — no need to identify yourself in DeepShield.",
  "Call 1930 if you need immediate cyber crime support.",
];

export default function ReportPage() {
  const [scan, setScan] = useState<ScanSession | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    setScan(loadScanSession());
  }, []);

  async function downloadPdf() {
    if (!scan) return;
    setPdfLoading(true);
    try {
      const traceRaw = localStorage.getItem("deepshield_trace_urls");
      const traceUrls = traceRaw ? (JSON.parse(traceRaw) as string[]) : [];
      const blob = await generateEvidencePdf(scan, traceUrls);
      downloadBlob(blob, `deepshield_evidence_${Date.now()}.pdf`);
    } finally {
      setPdfLoading(false);
    }
  }

  function downloadTxt() {
    if (!scan) return;
    const lines = [
      "DeepShield Evidence Summary",
      `Date: ${scan.scannedAt}`,
      `Risk: ${scan.risk.finalRisk}% — ${verdictLabel(scan.risk.verdict)}`,
      scan.explain?.explanation ?? "",
      scan.explain?.recommendation ?? "",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    downloadBlob(blob, `deepshield_evidence_${Date.now()}.txt`);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <PageHeader
        badge="Evidence"
        title="Legal evidence report"
        subtitle="Case builder with PDF export and guided steps toward filing at the National Cyber Crime Portal."
      />

      <GlassCard className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-pink">Filing guide</p>
        <ol className="mt-4 space-y-3">
          {STEPS.map((s, i) => (
            <li
              key={s}
              className={`flex gap-3 text-sm ${i === step ? "font-medium text-ink" : "text-ink/65"}`}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink/40 text-xs">
                {i + 1}
              </span>
              {s}
            </li>
          ))}
        </ol>
        <div className="mt-4 flex gap-2">
          <Button variant="secondary" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
            Back
          </Button>
          <Button
            variant="primary"
            disabled={step >= STEPS.length - 1}
            onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
          >
            Next step
          </Button>
        </div>
      </GlassCard>

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
        <GlassCard className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-pink">Preview</p>
            <p className="font-display mt-1 text-2xl text-ink">
              {verdictLabel(scan.risk.verdict)} · {scan.risk.finalRisk}%
            </p>
          </div>
          {scan.explain && (
            <>
              <p className="text-sm leading-relaxed">{scan.explain.explanation}</p>
              <p className="rounded-xl bg-peach/35 px-4 py-3 text-sm font-medium">
                {scan.explain.recommendation}
              </p>
            </>
          )}
          <p className="text-xs text-ink/55">Laws: IT Act 66E, 67, 67A · IPC 354C</p>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={downloadPdf} disabled={pdfLoading}>
              {pdfLoading ? "Building PDF…" : "Download PDF report"}
            </Button>
            <Button variant="secondary" onClick={downloadTxt}>
              Text summary
            </Button>
            <a
              href="https://cybercrime.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-sage/60 bg-blue/40 px-5 py-2.5 text-sm font-medium text-ink"
            >
              Open cybercrime.gov.in
            </a>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
