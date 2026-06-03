"use client";

import { useState } from "react";
import { ImageScanner } from "@/components/scan/ImageScanner";
import { VideoScanner } from "@/components/scan/VideoScanner";
import { useLanguage } from "@/context/LanguageContext";

export function ScanCenter() {
  const { t } = useLanguage();
  const [tab, setTab] = useState<"image" | "video">("image");

  const tabs = [
    { id: "image" as const, label: t("tabImage") },
    { id: "video" as const, label: t("tabVideo") },
  ];

  return (
    <>
      <div className="mb-8 inline-flex rounded-full bg-blue/40 p-1 ring-1 ring-sage/30">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              tab === id ? "bg-cream text-ink shadow-sm" : "text-ink/65 hover:text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === "image" ? <ImageScanner /> : <VideoScanner />}
    </>
  );
}
