"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { loadScanSession } from "@/lib/scanSession";
import { verdictLabel } from "@/lib/riskScoring";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ScanSession } from "@/lib/types";

export default function ReportPage() {
  const [scan, setScan] = useState<ScanSession | null>(null);

  useEffect(() => {
    setScan(loadScanSession());
  }, []);

  function downloadSummary() {
    if (!scan) return;
    const lines = [
      "DeepShield Evidence Summary",
      `Date: ${scan.scannedAt}`,
      `Risk: ${scan.risk.finalRisk}% — ${verdictLabel(scan.risk.verdict)}`,
      `Model score: ${scan.risk.breakdown.modelScore}`,
      scan.explain?.explanation ?? "",
      scan.explain?.recommendation ?? "",
      "",
      "File at: cybercrime.gov.in",
      "Helpline: 1930",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `deepshield_evidence_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <PageHeader
        badge="Evidence"
        title="Legal evidence report"
        subtitle="Build a case summary from your latest scan. Branded PDF export can be added next — text summary is available now."
      />

      {!scan ? (
        <GlassCard>
          <p className="text-sm text-espresso/80">
            No scan yet.{" "}
            <Link href="/scan" className="font-medium text-rose underline">
              Run a scan first
            </Link>
            .
          </p>
        </GlassCard>
      ) : (
        <GlassCard className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-rose">
              Verdict
            </p>
            <p className="font-display mt-1 text-2xl font-semibold text-espresso">
              {verdictLabel(scan.risk.verdict)} · {scan.risk.finalRisk}%
            </p>
          </div>
          {scan.explain && (
            <>
              <p className="text-sm leading-relaxed">{scan.explain.explanation}</p>
              <p className="rounded-xl bg-blush/35 px-4 py-3 text-sm font-medium">
                {scan.explain.recommendation}
              </p>
            </>
          )}
          <p className="text-xs text-espresso/60">
            Laws referenced: IT Act 66E, 67, 67A · IPC 354C
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={downloadSummary}>
              Download evidence summary
            </Button>
            <a
              href="https://cybercrime.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-sage/50 bg-blush/50 px-5 py-2.5 text-sm font-medium text-espresso transition hover:bg-blush"
            >
              File at cybercrime.gov.in
            </a>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
