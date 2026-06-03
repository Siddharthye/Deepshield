"use client";

import { useEffect, useRef } from "react";
import type { HeatmapCell } from "@/lib/clientAnalysis";

export function HeatmapOverlay({
  imageSrc,
  cells,
  grid = 8,
}: {
  imageSrc: string;
  cells: HeatmapCell[];
  grid?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !cells.length) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const cw = canvas.width / grid;
      const ch = canvas.height / grid;
      cells.forEach((c) => {
        const alpha = 0.15 + c.intensity * 0.55;
        ctx.fillStyle = `rgba(253, 100, 90, ${alpha})`;
        ctx.fillRect(c.x * cw, c.y * ch, cw, ch);
      });
    };
    img.src = imageSrc;
  }, [imageSrc, cells, grid]);

  return (
    <canvas
      ref={ref}
      className="h-full w-full rounded-xl object-contain"
      aria-label="Artifact density heatmap overlay"
    />
  );
}
