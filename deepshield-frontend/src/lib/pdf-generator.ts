import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import type { ScanSession } from "./types";
import { verdictLabel } from "./riskScoring";

const INK = rgb(0.35, 0.33, 0.3);
const PINK = rgb(0.99, 0.79, 0.76);
const PEACH = rgb(0.99, 0.84, 0.76);

export async function generateEvidencePdf(scan: ScanSession, traceUrls: string[]) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  let y = 800;
  const draw = (text: string, size = 11, useBold = false) => {
    page.drawText(text, {
      x: 50,
      y,
      size,
      font: useBold ? bold : font,
      color: INK,
      maxWidth: 495,
    });
    y -= size + 10;
  };

  page.drawRectangle({ x: 0, y: 780, width: 595, height: 62, color: PEACH });
  page.drawText("DeepShield — Legal Evidence Report", {
    x: 50,
    y: 805,
    size: 18,
    font: bold,
    color: INK,
  });

  y = 740;
  draw(`Generated: ${new Date(scan.scannedAt).toLocaleString()}`, 10);
  draw(
    `Verdict: ${verdictLabel(scan.risk.verdict)} (${scan.risk.finalRisk}% manipulation risk)`,
    12,
    true,
  );
  y -= 4;
  draw(`Model signal: ${(scan.risk.breakdown.modelScore * 100).toFixed(0)}%`);
  draw(`Artifact signal: ${(scan.risk.breakdown.artifactScore * 100).toFixed(0)}%`);
  draw(`Symmetry signal: ${(scan.risk.breakdown.symmetryScore * 100).toFixed(0)}%`);

  if (scan.explain) {
    y -= 8;
    draw("Summary", 13, true);
    draw(scan.explain.explanation);
    draw(`Recommendation: ${scan.explain.recommendation}`, 10, true);
  }

  y -= 8;
  draw("Applicable laws (India)", 13, true);
  draw("IT Act §66E (privacy), §67, §67A · IPC §354C (voyeurism)");

  if (traceUrls.length) {
    y -= 8;
    draw("URLs found (reverse trace)", 13, true);
    traceUrls.slice(0, 12).forEach((u) => draw(`• ${u}`, 9));
  }

  y -= 8;
  draw("Filing instructions", 13, true);
  draw("Report at https://cybercrime.gov.in/ · Helpline 1930 · NCW 181");

  page.drawRectangle({ x: 50, y: 60, width: 495, height: 36, color: PINK, borderOpacity: 0 });
  page.drawText("DeepShield — Detect · Report · Educate", {
    x: 50,
    y: 72,
    size: 9,
    font,
    color: INK,
  });

  const bytes = await doc.save();
  return new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
