"use client";

import { GlassCard } from "@/components/ui/GlassCard";
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
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-semibold text-espresso">Legal evidence report</h1>
      <p className="mb-8 text-espresso/70">
        Build a case summary from your latest scan. Full branded PDF (pdf-lib) can
        be added next — this exports a text summary now.
      </p>
      {!scan ? (
        <GlassCard>
          <p className="text-sm text-espresso/80">
            No scan yet.{" "}
            <Link href="/scan" className="text-rose underline">
              Run a scan first
            </Link>
            .
          </p>
        </GlassCard>
      ) : (
        <GlassCard className="space-y-4">
          <p>
            <strong>Verdict:</strong> {verdictLabel(scan.risk.verdict)} (
            {scan.risk.finalRisk}%)
          </p>
          {scan.explain && (
            <>
              <p className="text-sm">{scan.explain.explanation}</p>
              <p className="text-sm font-medium">{scan.explain.recommendation}</p>
            </>
          )}
          <p className="text-xs text-espresso/60">
            Laws referenced: IT Act 66E, 67, 67A · IPC 354C
          </p>
          <button
            type="button"
            onClick={downloadSummary}
            className="rounded-full bg-rose px-5 py-2 text-sm font-medium text-espresso"
          >
            Download evidence summary
          </button>
          <a
            href="https://cybercrime.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-sm text-rose underline"
          >
            Open cybercrime.gov.in to file
          </a>
        </GlassCard>
      )}
    </div>
  );
}
