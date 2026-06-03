"use client";

import { useState } from "react";
import { ImageScanner } from "@/components/scan/ImageScanner";
import { VideoScanner } from "@/components/scan/VideoScanner";

export function ScanCenter() {
  const [tab, setTab] = useState<"image" | "video">("image");

  return (
    <>
      <div className="mb-8 inline-flex rounded-full bg-blue/35 p-1">
        {(["image", "video"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full px-5 py-2 text-sm font-medium capitalize transition ${
              tab === t ? "bg-cream text-ink shadow-sm" : "text-ink/65 hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === "image" ? <ImageScanner /> : <VideoScanner />}
    </>
  );
}
