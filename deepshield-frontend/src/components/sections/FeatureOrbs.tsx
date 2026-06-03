"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { useLanguage } from "@/context/LanguageContext";

const ORB_SIZE = 52;
const RADIUS = 128;
const BOX = 320;

const FEATURES = [
  {
    id: "scan",
    label: "Scan",
    icon: "🔍",
    href: "/scan",
    desc: "Upload a photo or video frame. We combine a Hugging Face deepfake model, face symmetry checks, and compression artifact analysis into one clear risk score — with a heatmap you can show authorities.",
    points: ["3-signal risk score", "Compare slider + heatmap", "Auto-save to vault"],
  },
  {
    id: "video",
    label: "Video",
    icon: "🎬",
    href: "/scan",
    desc: "Extract keyframes in your browser with FFmpeg.wasm, then analyse each frame. Scroll through a timeline to see where manipulation spikes.",
    points: ["In-browser frame extract", "Per-frame heatmaps", "Scroll-scrub timeline"],
  },
  {
    id: "trace",
    label: "Trace",
    icon: "🌐",
    href: "/trace",
    desc: "Log where your image appears — platform, URL, and date. Open Google Lens or TinEye in one tap, then save findings for your legal report.",
    points: ["Reverse-search links", "Evidence log", "Flows into PDF"],
  },
  {
    id: "report",
    label: "Report",
    icon: "📄",
    href: "/report",
    desc: "Generate a court-ready PDF with scan image, risk breakdown, trace log, and an AI legal summary. Includes cybercrime.gov.in filing guidance.",
    points: ["PDF + preview", "LLM legal summary", "Cybercrime form prep"],
  },
  {
    id: "vault",
    label: "Vault",
    icon: "🔐",
    href: "/vault",
    desc: "Store scans, traces, and notes behind a 4-digit PIN with AES-256 encryption. Everything stays on your device — export as ZIP when you need backups.",
    points: ["PIN + AES-256", "ZIP export", "Never leaves browser"],
  },
  {
    id: "asha",
    label: "Asha",
    icon: "💬",
    href: "/asha",
    desc: "Trauma-informed chat for emotional support and plain-language rights guidance. Crisis helplines are one tap away.",
    points: ["Streaming support chat", "Rights quick prompts", "8 languages"],
  },
  {
    id: "rights",
    label: "Rights",
    icon: "⚖️",
    href: "/asha",
    desc: "Pre-written cards for IT Act §66E, §67, §67A, IPC §354C, and POCSO — plus an AI explainer for your specific situation.",
    points: ["Law reference cards", "AI rights explainer", "Not legal advice — guidance"],
  },
  {
    id: "community",
    label: "Community",
    icon: "🤝",
    href: "/community",
    desc: "Anonymous solidarity feed moderated before publish. Share strength without exposing your identity.",
    points: ["Anonymous posts", "AI moderation", "Peer support"],
  },
  {
    id: "learn",
    label: "Learn",
    icon: "📚",
    href: "/learn",
    desc: "Interactive quiz on spotting deepfakes, preserving evidence, and knowing when to report — powered by our LLM for fresh questions each round.",
    points: ["Awareness quiz", "Actionable tips", "Safe sharing habits"],
  },
  {
    id: "i18n",
    label: "Languages",
    icon: "🗣️",
    href: "/",
    desc: "Full UI in English, Hindi, Tamil, Telugu, Bengali, Marathi, Kannada, and Malayalam — so you can navigate in the language you think in.",
    points: ["8 Indian languages", "Nav + core flows", "Asha responds in your language"],
  },
  {
    id: "privacy",
    label: "Private",
    icon: "🛡️",
    href: "/vault",
    desc: "Browser-first architecture: uploads go to the API only for scoring, never stored on our servers. Evidence and vault data live in your local storage.",
    points: ["No server-side vault", "Encrypted locally", "$0 infra for you"],
  },
];

function orbStyle(index: number, total: number) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const cx = BOX / 2;
  const cy = BOX / 2;
  const x = cx + RADIUS * Math.cos(angle) - ORB_SIZE / 2;
  const y = cy + RADIUS * Math.sin(angle) - ORB_SIZE / 2;
  return { left: x, top: y };
}

export function FeatureOrbs() {
  const { t } = useLanguage();
  const [active, setActive] = useState(FEATURES[0].id);
  const current = FEATURES.find((f) => f.id === active) ?? FEATURES[0];

  return (
    <section className="section-pad section-alt-blue mx-auto max-w-6xl px-4">
      <p className="page-badge">{t("featuresBadge")}</p>
      <h2 className="font-display text-2xl text-ink md:text-3xl">{t("featuresTitle")}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/70">{t("featuresIntro")}</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(280px,340px)_1fr] lg:items-start">
        <div
          className="relative mx-auto shrink-0 rounded-full border border-dashed border-sage/50 bg-blue/15"
          style={{ width: BOX, height: BOX }}
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center">
            <span className="font-display text-3xl text-pink">11</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-ink/60">
              tools
            </span>
          </div>
          {FEATURES.map((f, i) => {
            const isActive = active === f.id;
            const dim = active !== f.id;
            return (
              <motion.button
                key={f.id}
                type="button"
                onMouseEnter={() => setActive(f.id)}
                onFocus={() => setActive(f.id)}
                onClick={() => setActive(f.id)}
                className={`absolute flex flex-col items-center justify-center rounded-full shadow-md transition-colors ${
                  isActive
                    ? "z-20 bg-blue text-ink ring-4 ring-sage/50"
                    : "z-10 bg-cream text-ink/80 hover:bg-sage/40"
                }`}
                style={{ ...orbStyle(i, FEATURES.length), width: ORB_SIZE, height: ORB_SIZE }}
                animate={{ scale: isActive ? 1.12 : dim ? 0.88 : 1, opacity: dim ? 0.55 : 1 }}
                transition={{ duration: 0.15 }}
                title={f.label}
              >
                <span className="text-lg leading-none">{f.icon}</span>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <GlassCard className="p-8">
              <div className="flex items-start gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-peach/50 text-2xl">
                  {current.icon}
                </span>
                <div>
                  <h3 className="font-display text-2xl text-ink">{current.label}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/80">{current.desc}</p>
                </div>
              </div>
              <ul className="mt-6 grid gap-2 sm:grid-cols-3">
                {current.points.map((p) => (
                  <li
                    key={p}
                    className="rounded-xl bg-blue/25 px-3 py-2 text-xs font-medium text-ink/85"
                  >
                    ✓ {p}
                  </li>
                ))}
              </ul>
              <Link
                href={current.href}
                className="mt-6 inline-flex rounded-full bg-gradient-to-r from-pink to-peach px-5 py-2.5 text-sm font-medium text-ink shadow-md hover:brightness-105"
              >
                Open {current.label} →
              </Link>
            </GlassCard>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
