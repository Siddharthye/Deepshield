import { PDFDocument, rgb, StandardFonts, type PDFFont, type PDFPage } from "pdf-lib";
import { t, type LanguageCode } from "@/lib/i18n";
import type { ScanSession } from "./types";
import type { TraceHit } from "./traceStorage";
import { verdictLabelKey } from "./riskScoring";

const MARGIN_X = 50;
const MARGIN_BOTTOM = 72;
const CONTENT_WIDTH = 495;
const PAGE_HEIGHT = 842;

const INK = rgb(0.17, 0.11, 0.09);
const INK_MUTED = rgb(0.29, 0.2, 0.18);
const HEADER_BG = rgb(0.29, 0.04, 0.04);
const HEADER_TEXT = rgb(0.95, 0.91, 0.84);
const RULE = rgb(0.75, 0.65, 0.55);

async function embedScanImage(doc: PDFDocument, dataUrl: string) {
  const base64 = dataUrl.split(",")[1];
  if (!base64) return null;
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  if (dataUrl.includes("image/png")) {
    return doc.embedPng(bytes);
  }
  return doc.embedJpg(bytes);
}

function wrapParagraph(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];

  const lines: string[] = [];
  for (const paragraph of normalized.split("\n")) {
    const words = paragraph.trim().split(/\s+/).filter(Boolean);
    if (!words.length) {
      lines.push("");
      continue;
    }
    let line = "";
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, size) > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = candidate;
      }
    }
    if (line) lines.push(line);
  }
  return lines;
}

type PdfWriter = {
  doc: PDFDocument;
  page: PDFPage;
  font: PDFFont;
  bold: PDFFont;
  y: number;
  pageIndex: number;
  ensureSpace: (needed: number) => void;
  drawLines: (
    text: string,
    opts?: { size?: number; bold?: boolean; color?: ReturnType<typeof rgb>; gap?: number },
  ) => void;
  drawSectionTitle: (text: string) => void;
  drawRule: () => void;
};

function createWriter(doc: PDFDocument, font: PDFFont, bold: PDFFont): PdfWriter {
  let page = doc.addPage([595, PAGE_HEIGHT]);
  let y = 760;
  let pageIndex = 1;

  const ensureSpace = (needed: number) => {
    if (y - needed >= MARGIN_BOTTOM) return;
    page = doc.addPage([595, PAGE_HEIGHT]);
    pageIndex += 1;
    y = 760;
    page.drawText(`DeepShield · ${pageIndex}`, {
      x: MARGIN_X,
      y: 36,
      size: 8,
      font,
      color: INK_MUTED,
    });
  };

  const drawLines = (
    text: string,
    opts?: { size?: number; bold?: boolean; color?: ReturnType<typeof rgb>; gap?: number },
  ) => {
    const size = opts?.size ?? 10;
    const f = opts?.bold ? bold : font;
    const color = opts?.color ?? INK_MUTED;
    const gap = opts?.gap ?? 3;
    const lineHeight = size + gap;

    for (const line of wrapParagraph(text, f, size, CONTENT_WIDTH)) {
      ensureSpace(lineHeight);
      if (line) {
        page.drawText(line, { x: MARGIN_X, y, size, font: f, color });
      }
      y -= lineHeight;
    }
  };

  const drawSectionTitle = (text: string) => {
    ensureSpace(28);
    y -= 8;
    page.drawText(text, { x: MARGIN_X, y, size: 12, font: bold, color: INK });
    y -= 18;
  };

  const drawRule = () => {
    ensureSpace(12);
    y -= 4;
    page.drawLine({
      start: { x: MARGIN_X, y },
      end: { x: MARGIN_X + CONTENT_WIDTH, y },
      thickness: 0.5,
      color: RULE,
    });
    y -= 10;
  };

  return {
    doc,
    get page() {
      return page;
    },
    set page(p: PDFPage) {
      page = p;
    },
    font,
    bold,
    get y() {
      return y;
    },
    set y(v: number) {
      y = v;
    },
    get pageIndex() {
      return pageIndex;
    },
    set pageIndex(v: number) {
      pageIndex = v;
    },
    ensureSpace,
    drawLines,
    drawSectionTitle,
    drawRule,
  };
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
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const w = createWriter(doc, font, bold);

  w.page.drawRectangle({ x: 0, y: 778, width: 595, height: 64, color: HEADER_BG });
  w.page.drawText(L("pdfTitle"), {
    x: MARGIN_X,
    y: 808,
    size: 16,
    font: bold,
    color: HEADER_TEXT,
  });
  w.page.drawText(`${L("pdfGenerated")} ${new Date(scan.scannedAt).toLocaleString()}`, {
    x: MARGIN_X,
    y: 788,
    size: 9,
    font,
    color: HEADER_TEXT,
  });

  w.y = 748;
  w.drawLines(
    `${L("pdfVerdict")} ${L(verdictLabelKey(scan.risk.verdict))} (${scan.risk.finalRisk}% ${L("pdfManipulationRisk")})`,
    { size: 11, bold: true, color: INK, gap: 4 },
  );
  w.drawRule();

  try {
    const img = await embedScanImage(doc, scan.imageDataUrl);
    if (img) {
      const maxW = 220;
      const scale = Math.min(maxW / img.width, 1);
      const dims = img.scale(scale);
      w.ensureSpace(dims.height + 28);
      w.page.drawImage(img, {
        x: MARGIN_X,
        y: w.y - dims.height,
        width: dims.width,
        height: dims.height,
      });
      w.y -= dims.height + 10;
      w.drawLines(L("pdfScanCapture"), { size: 9 });
      w.y -= 4;
    }
  } catch {
    /* skip */
  }

  if (scan.heatmapDataUrl) {
    try {
      const hm = await embedScanImage(doc, scan.heatmapDataUrl);
      if (hm) {
        const maxW = 220;
        const scale = Math.min(maxW / hm.width, 1);
        const dims = hm.scale(scale);
        w.ensureSpace(dims.height + 28);
        w.page.drawImage(hm, {
          x: MARGIN_X,
          y: w.y - dims.height,
          width: dims.width,
          height: dims.height,
        });
        w.y -= dims.height + 10;
        w.drawLines(L("pdfHeatmapCapture"), { size: 9 });
        w.y -= 4;
      }
    } catch {
      /* skip */
    }
  }

  w.drawSectionTitle(L("pdfRiskAnalysis"));
  w.drawLines(
    `${L("pdfModelLine")} ${(scan.risk.breakdown.modelScore * 100).toFixed(0)}% · ${L("pdfArtifacts")} ${(scan.risk.breakdown.artifactScore * 100).toFixed(0)}% · ${L("pdfSymmetry")} ${(scan.risk.breakdown.symmetryScore * 100).toFixed(0)}%`,
  );

  if (legalSummary) {
    w.drawRule();
    w.drawSectionTitle(L("pdfLegalSummary"));
    w.drawLines(legalSummary, { size: 10, gap: 5 });
  } else if (scan.explain) {
    w.drawRule();
    w.drawSectionTitle(L("pdfSummary"));
    w.drawLines(scan.explain.explanation, { size: 10, gap: 5 });
    w.y -= 4;
    w.drawLines(`${L("pdfRecommendation")} ${scan.explain.recommendation}`, {
      size: 10,
      bold: true,
      color: INK,
      gap: 5,
    });
  }

  w.drawRule();
  w.drawSectionTitle(L("pdfApplicableLaws"));
  w.drawLines(L("pdfLawsList"));

  if (traceHits.length) {
    w.drawRule();
    w.drawSectionTitle(L("pdfTraceLog"));
    traceHits.slice(0, 10).forEach((h) => {
      w.drawLines(`${h.platform} — ${h.title}`, { bold: true, color: INK });
      w.drawLines(h.url, { size: 9 });
      w.drawLines(`${L("pdfFirstSeen")} ${h.firstSeen}`, { size: 9 });
      w.y -= 4;
    });
  } else if (traceUrls.length) {
    w.drawRule();
    w.drawSectionTitle(L("pdfUrlsFound"));
    traceUrls.slice(0, 12).forEach((u) => w.drawLines(`• ${u}`, { size: 9 }));
  }

  w.drawRule();
  w.drawLines(L("pdfFilingHint"), { size: 10, bold: true, color: INK });

  w.page.drawText(`DeepShield · ${w.pageIndex}`, {
    x: MARGIN_X,
    y: 36,
    size: 8,
    font,
    color: INK_MUTED,
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
