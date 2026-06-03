import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { t, type LanguageCode } from "@/lib/i18n";
import type { ScanSession } from "./types";
import type { TraceHit } from "./traceStorage";
import { verdictLabelKey } from "./riskScoring";

const INK = rgb(0.35, 0.33, 0.3);
const PEACH = rgb(0.99, 0.84, 0.76);

async function embedScanImage(doc: PDFDocument, dataUrl: string) {
  const base64 = dataUrl.split(",")[1];
  if (!base64) return null;
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  if (dataUrl.includes("image/png")) {
    return doc.embedPng(bytes);
  }
  return doc.embedJpg(bytes);
}

export async function generateEvidencePdf(
  scan: ScanSession,
  traceUrls: string[],
  legalSummary?: string,
  traceHits: TraceHit[] = [],
  lang: LanguageCode = "en",
) {
  const L = (key: Parameters<typeof t>[1]) => t(lang, key);
  const doc = await PDFDocument.create();
  let page = doc.addPage([595, 842]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  let y = 800;
  const draw = (text: string, size = 11, useBold = false) => {
    if (y < 80) {
      page = doc.addPage([595, 842]);
      y = 800;
    }
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
  page.drawText(L("pdfTitle"), {
    x: 50,
    y: 805,
    size: 18,
    font: bold,
    color: INK,
  });

  y = 740;
  draw(`${L("pdfGenerated")} ${new Date(scan.scannedAt).toLocaleString()}`, 10);
  draw(
    `${L("pdfVerdict")} ${L(verdictLabelKey(scan.risk.verdict))} (${scan.risk.finalRisk}% ${L("pdfManipulationRisk")})`,
    12,
    true,
  );

  try {
    const img = await embedScanImage(doc, scan.imageDataUrl);
    if (img) {
      const dims = img.scale(0.35);
      if (y - dims.height < 60) {
        page = doc.addPage([595, 842]);
        y = 750;
      }
      page.drawImage(img, { x: 50, y: y - dims.height, width: dims.width, height: dims.height });
      y -= dims.height + 16;
      draw(L("pdfScanCapture"), 9);
    }
  } catch {
    /* skip image if embed fails */
  }

  draw(
    `${L("pdfModelLine")} ${(scan.risk.breakdown.modelScore * 100).toFixed(0)}% · ${L("pdfArtifacts")} ${(scan.risk.breakdown.artifactScore * 100).toFixed(0)}% · ${L("pdfSymmetry")} ${(scan.risk.breakdown.symmetryScore * 100).toFixed(0)}%`,
  );

  if (legalSummary) {
    y -= 6;
    draw(L("pdfLegalSummary"), 13, true);
    draw(legalSummary);
  } else if (scan.explain) {
    y -= 6;
    draw(L("pdfSummary"), 13, true);
    draw(scan.explain.explanation);
    draw(`${L("pdfRecommendation")} ${scan.explain.recommendation}`, 10, true);
  }

  y -= 6;
  draw(L("pdfApplicableLaws"), 13, true);
  draw(L("pdfLawsList"));

  if (traceHits.length) {
    y -= 6;
    draw(L("pdfTraceLog"), 13, true);
    traceHits.slice(0, 10).forEach((h) => {
      draw(`${h.platform} — ${h.title}`, 10, true);
      draw(h.url, 9);
      draw(`${L("pdfFirstSeen")} ${h.firstSeen}`, 9);
    });
  } else if (traceUrls.length) {
    y -= 6;
    draw(L("pdfUrlsFound"), 13, true);
    traceUrls.slice(0, 12).forEach((u) => draw(`• ${u}`, 9));
  }

  draw(L("pdfFilingHint"), 10, true);

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
