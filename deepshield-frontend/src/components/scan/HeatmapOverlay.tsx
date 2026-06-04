"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { HeatmapCell } from "@/lib/clientAnalysis";
import { fallbackHeatmapCells, HEATMAP_GRID } from "@/lib/heatmapBuilder";

export function HeatmapOverlay({
  imageSrc,
  cells,
  grid = HEATMAP_GRID,
  showBaseImage = true,
  animateReveal = false,
  suspicion = 0.35,
}: {
  imageSrc: string;
  cells: HeatmapCell[];
  grid?: number;
  showBaseImage?: boolean;
  animateReveal?: boolean;
  suspicion?: number;
}) {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [reveal, setReveal] = useState(animateReveal ? 0 : 1);

  useEffect(() => {
    if (!animateReveal) {
      setReveal(1);
      return;
    }
    setReveal(0);
    const start = performance.now();
    const duration = 1600;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setReveal(p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animateReveal, imageSrc, cells, suspicion, grid]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let img: HTMLImageElement | null = null;

    const draw = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w < 8 || h < 8) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const paint = () => {
        ctx.clearRect(0, 0, w, h);
        if (!img) return;

        const scale = Math.min(w / img.width, h / img.height);
        const dw = img.width * scale;
        const dh = img.height * scale;
        const ox = (w - dw) / 2;
        const oy = (h - dh) / 2;

        if (showBaseImage) {
          ctx.drawImage(img, ox, oy, dw, dh);
        } else {
          ctx.fillStyle = "#e8e4dc";
          ctx.fillRect(0, 0, w, h);
        }

        const cw = dw / grid;
        const ch = dh / grid;
        const painted =
          cells.length > 0 ? cells : fallbackHeatmapCells(grid, suspicion);
        painted.forEach((c) => {
          const alpha = Math.min(0.92, (0.28 + c.intensity * 0.72) * reveal);
          ctx.fillStyle = `rgba(200, 55, 75, ${alpha})`;
          ctx.fillRect(ox + c.x * cw, oy + c.y * ch, cw + 0.5, ch + 0.5);
        });

        if (showBaseImage && reveal > 0.12) {
          ctx.strokeStyle = `rgba(244, 196, 208, ${0.4 * reveal})`;
          ctx.lineWidth = 1;
          for (let i = 0; i <= grid; i++) {
            ctx.beginPath();
            ctx.moveTo(ox + (i * dw) / grid, oy);
            ctx.lineTo(ox + (i * dw) / grid, oy + dh);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(ox, oy + (i * dh) / grid);
            ctx.lineTo(ox + dw, oy + (i * dh) / grid);
            ctx.stroke();
          }
        }
      };

      if (!img || img.src !== imageSrc) {
        img = new Image();
        img.onload = paint;
        img.onerror = paint;
        img.src = imageSrc;
      } else {
        paint();
      }
    };

    draw();
    const ro = new ResizeObserver(() => draw());
    ro.observe(container);
    return () => ro.disconnect();
  }, [imageSrc, cells, suspicion, grid, showBaseImage, reveal]);

  return (
    <div ref={containerRef} className="absolute inset-0 h-full w-full min-h-[120px]">
      <canvas ref={canvasRef} className="block h-full w-full" aria-label={t("heatmapAria")} />
    </div>
  );
}
