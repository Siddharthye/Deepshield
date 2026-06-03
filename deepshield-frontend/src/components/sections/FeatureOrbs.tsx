"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const FEATURES = [
  { id: "scan", label: "Scan", href: "/scan", desc: "3-signal deepfake detection with heatmap." },
  { id: "video", label: "Video", href: "/scan", desc: "FFmpeg keyframes + per-frame analysis." },
  { id: "trace", label: "Trace", href: "/trace", desc: "Find where your image appears online." },
  { id: "report", label: "Report", href: "/report", desc: "Legal PDF + cybercrime filing prep." },
  { id: "vault", label: "Vault", href: "/vault", desc: "AES-encrypted evidence storage." },
  { id: "asha", label: "Asha", href: "/asha", desc: "Support chat + know your rights." },
  { id: "rights", label: "Rights", href: "/asha", desc: "AI legal explainer + law cards." },
  { id: "community", label: "Community", href: "/community", desc: "Anonymous solidarity feed." },
  { id: "learn", label: "Learn", href: "/learn", desc: "Deepfake awareness quiz." },
  { id: "i18n", label: "8 languages", href: "/", desc: "Full multilingual UI support." },
  { id: "privacy", label: "Private", href: "/vault", desc: "Browser-first — your data stays local." },
];

function orbPosition(i: number, total: number) {
  const angle = (i / total) * Math.PI * 2 - Math.PI / 2;
  const rx = 42 + (i % 3) * 4;
  const ry = 38 + (i % 2) * 6;
  return {
    left: `${50 + Math.cos(angle) * rx}%`,
    top: `${50 + Math.sin(angle) * ry}%`,
  };
}

export function FeatureOrbs() {
  const [active, setActive] = useState(FEATURES[0].id);
  const current = FEATURES.find((f) => f.id === active) ?? FEATURES[0];

  return (
    <section className="section-pad mx-auto max-w-6xl px-4">
      <p className="page-badge">Features</p>
      <h2 className="font-display text-2xl text-ink md:text-3xl">Eleven ways we protect you</h2>
      <div className="mt-10 flex flex-col gap-8 lg:flex-row">
        <div className="relative mx-auto h-[320px] w-full max-w-lg lg:mx-0">
          {FEATURES.map((f, i) => {
            const pos = orbPosition(i, FEATURES.length);
            const isActive = active === f.id;
            return (
              <motion.button
                key={f.id}
                type="button"
                onMouseEnter={() => setActive(f.id)}
                onFocus={() => setActive(f.id)}
                className={`absolute flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[10px] font-semibold transition ${
                  isActive
                    ? "z-20 bg-pink text-ink shadow-[0_0_28px_rgba(253,200,194,0.9)] ring-4 ring-peach/50"
                    : "z-10 bg-blue/50 text-ink/60 opacity-40 hover:opacity-70"
                }`}
                style={pos}
                animate={{ scale: isActive ? 1.15 : 0.92 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
              >
                {f.label.split(" ")[0]}
                {isActive && (
                  <motion.span
                    className="absolute inset-0 rounded-full border border-pink"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.7, 0, 0.7] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                  />
                )}
              </motion.button>
            );
          })}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-peach/20 blur-2xl"
            aria-hidden
          />
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className="flex flex-1 flex-col justify-center rounded-2xl bg-peach/25 p-8"
          >
            <h3 className="font-display text-xl text-ink">{current.label}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/75">{current.desc}</p>
            <Link href={current.href} className="mt-4 text-sm font-medium text-pink underline">
              Open →
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
