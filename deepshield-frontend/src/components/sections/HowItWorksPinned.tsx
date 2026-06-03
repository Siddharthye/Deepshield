"use client";

"use client";

import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { ButtonLink } from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";

const STEPS = [
  {
    title: "Scan & understand",
    icon: "🔍",
    body: "Upload media in your browser. face-api.js checks facial symmetry, OpenCV scans compression artifacts, and our Hugging Face model scores deepfake probability.",
    checklist: [
      "Full-screen scan animation + heatmap",
      "Compare original vs flagged regions",
      "Risk % with plain-language explanation",
    ],
    href: "/scan",
    cta: "Scan now",
  },
  {
    title: "Document & secure",
    icon: "📁",
    body: "Trace where your image was shared, log URLs with dates, and lock everything in an AES-encrypted vault. Export a ZIP or legal PDF when you're ready.",
    checklist: [
      "Reverse-search helpers (Lens / TinEye)",
      "Vault PIN + local encryption",
      "PDF with scan image + trace log",
    ],
    href: "/trace",
    cta: "Start tracing",
  },
  {
    title: "Act with support",
    icon: "⚖️",
    body: "File at cybercrime.gov.in with prepared evidence. Talk to Asha for emotional support and rights guidance — in the language you choose.",
    checklist: [
      "Cybercrime filing form prep",
      "Asha chat + rights explainer",
      "Applicable law cards (IT Act, IPC)",
    ],
    href: "/asha",
    cta: "Talk to Asha",
  },
];

export function HowItWorksPinned() {
  const { t } = useLanguage();

  return (
    <section className="section-pad mx-auto max-w-6xl px-4">
      <p className="page-badge">{t("howBadge")}</p>
      <h2 className="font-display text-2xl text-ink md:text-3xl">{t("howTitle")}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/70">{t("howIntro")}</p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <GlassCard key={s.title} className="flex h-full flex-col p-6" tilt>
            <span className="text-xs font-bold text-pink">Step {i + 1}</span>
            <span className="mt-3 text-3xl">{s.icon}</span>
            <h3 className="font-display mt-3 text-xl text-ink">{s.title}</h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/75">{s.body}</p>
            <ul className="mt-4 space-y-2 border-t border-white/30 pt-4">
              {s.checklist.map((item) => (
                <li key={item} className="flex gap-2 text-xs text-ink/80">
                  <span className="text-pink">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <ButtonLink href={s.href} variant="secondary" className="mt-6 w-full justify-center">
              {s.cta}
            </ButtonLink>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="mt-8 flex flex-col items-start gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-ink/80">
          <strong className="text-ink">Privacy first:</strong> scans are processed for scoring
          only; your vault and evidence stay encrypted on this device.
        </p>
        <Link href="/vault" className="text-sm font-medium text-pink underline">
          Learn about the vault →
        </Link>
      </GlassCard>
    </section>
  );
}
