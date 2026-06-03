"use client";

import { useRef, useState } from "react";

export function CompareSlider({
  originalSrc,
  overlay,
  originalLabel = "Original",
  overlayLabel = "Detected",
}: {
  originalSrc: string;
  overlay: React.ReactNode;
  originalLabel?: string;
  overlayLabel?: string;
}) {
  const [pct, setPct] = useState(50);
  const dragging = useRef(false);

  function onMove(clientX: number, rect: DOMRect) {
    const x = ((clientX - rect.left) / rect.width) * 100;
    setPct(Math.min(98, Math.max(2, x)));
  }

  return (
    <div
      className="relative aspect-square w-full select-none overflow-hidden rounded-xl ring-1 ring-peach/50"
      onPointerDown={(e) => {
        dragging.current = true;
        onMove(e.clientX, e.currentTarget.getBoundingClientRect());
      }}
      onPointerMove={(e) => {
        if (!dragging.current) return;
        onMove(e.clientX, e.currentTarget.getBoundingClientRect());
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
      onPointerLeave={() => {
        dragging.current = false;
      }}
    >
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={originalSrc} alt={originalLabel} className="h-full w-full object-contain" />
      </div>
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}
      >
        {overlay}
      </div>
      <div
        className="absolute bottom-0 top-0 z-10 w-1 cursor-ew-resize bg-pink shadow-md"
        style={{ left: `${pct}%` }}
      >
        <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-pink bg-cream text-xs font-bold text-ink shadow">
          ↔
        </div>
      </div>
      <span className="absolute left-3 top-3 rounded-full bg-cream/80 px-2 py-0.5 text-xs text-ink">
        {originalLabel}
      </span>
      <span className="absolute right-3 top-3 rounded-full bg-cream/80 px-2 py-0.5 text-xs text-ink">
        {overlayLabel}
      </span>
    </div>
  );
}
