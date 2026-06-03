"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { HeatmapCell } from "@/lib/clientAnalysis";

export function HeatmapOverlay({
  imageSrc,
  cells,
  grid = 8,
  showBaseImage = true,
  animateReveal = false,
}: {
  imageSrc: string;
  cells: HeatmapCell[];
  grid?: number;
  showBaseImage?: boolean;
  animateReveal?: boolean;
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
  }, [animateReveal, imageSrc, cells]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas || cells.length === 0) return;

    const draw = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w < 16 || h < 16) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = w;
      canvas.height = h;

      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, w, h);
        if (showBaseImage) {
          const scale = Math.min(w / img.width, h / img.height);
          const dw = img.width * scale;
          const dh = img.height * scale;
          const ox = (w - dw) / 2;
          const oy = (h - dh) / 2;
          ctx.drawImage(img, ox, oy, dw, dh);

          const cw = dw / grid;
          const ch = dh / grid;
          cells.forEach((c) => {
            const alpha = (0.2 + c.intensity * 0.75) * reveal;
            ctx.fillStyle = `rgba(214, 90, 110, ${alpha})`;
            ctx.fillRect(ox + c.x * cw, oy + c.y * ch, cw, ch);
          });
          if (reveal > 0.15) {
            ctx.strokeStyle = `rgba(244, 196, 208, ${0.35 * reveal})`;
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
        } else {
          const cw = w / grid;
          const ch = h / grid;
          cells.forEach((c) => {
            const alpha = (0.25 + c.intensity * 0.75) * reveal;
            ctx.fillStyle = `rgba(214, 90, 110, ${alpha})`;
            ctx.fillRect(c.x * cw, c.y * ch, cw, ch);
          });
        }
      };
      img.src = imageSrc;
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(container);
    return () => ro.disconnect();
  }, [imageSrc, cells, grid, showBaseImage, reveal]);

  return (
    <div ref={containerRef} className="absolute inset-0 min-h-[240px]">
      <canvas ref={canvasRef} className="h-full w-full" aria-label={t("heatmapAria")} />
    </div>
  );
}
