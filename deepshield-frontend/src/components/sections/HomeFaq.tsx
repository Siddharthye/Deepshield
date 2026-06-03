"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useLanguage } from "@/context/LanguageContext";

const FAQ = [
  {
    q: "Does DeepShield store my photos on a server?",
    a: "Scans are sent to our API only for model scoring — we do not build a gallery of your uploads. Your vault, trace log, and saved sessions are encrypted and stored in your browser’s local storage. You control export and deletion.",
  },
  {
    q: "How accurate is the deepfake detection?",
    a: "We use three independent signals: a Hugging Face image classifier, face-api.js symmetry analysis, and OpenCV-style artifact heuristics. No single signal is perfect; the combined risk score and heatmap are meant to support your judgment and any professional review.",
  },
  {
    q: "Can I use the PDF in a police complaint?",
    a: "The report is designed as supporting documentation — scan results, trace URLs, and law references — alongside your own statement. Always follow guidance from cybercrime.gov.in or a qualified lawyer for your specific case.",
  },
  {
    q: "Who is Asha and what can she help with?",
    a: "Asha provides trauma-informed emotional support and plain-language explanations of Indian cyber and privacy laws. She does not replace legal counsel or emergency services. For immediate danger, call police; for cyber abuse, 1930 is available nationally.",
  },
  {
    q: "Is DeepShield really free?",
    a: "Yes. This is a hackathon build deployed on free-tier infrastructure. There are no paywalls, accounts, or subscriptions — because access to safety tools should not depend on income.",
  },
];

export function HomeFaq() {
  const { t } = useLanguage();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="section-pad mx-auto max-w-6xl px-4">
      <p className="page-badge">{t("faqBadge")}</p>
      <h2 className="font-display text-2xl text-ink md:text-3xl">{t("faqTitle")}</h2>
      <div className="mt-8 space-y-3">
        {FAQ.map((item, i) => (
          <GlassCard key={item.q} className="overflow-hidden p-0">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
            >
              <span className="font-medium text-ink">{item.q}</span>
              <span className="text-pink">{open === i ? "−" : "+"}</span>
            </button>
            {open === i && (
              <p className="border-t border-white/30 px-6 pb-5 pt-2 text-sm leading-relaxed text-ink/75">
                {item.a}
              </p>
            )}
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
