"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useLanguage } from "@/context/LanguageContext";
import type { I18nKey } from "@/lib/i18n";

const FAQ_KEYS: { q: I18nKey; a: I18nKey }[] = [
  { q: "faq1Q", a: "faq1A" },
  { q: "faq2Q", a: "faq2A" },
  { q: "faq3Q", a: "faq3A" },
  { q: "faq4Q", a: "faq4A" },
  { q: "faq5Q", a: "faq5A" },
];

export function HomeFaq() {
  const { t } = useLanguage();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="section-pad mx-auto max-w-6xl px-4">
      <p className="page-badge">{t("faqBadge")}</p>
      <h2 className="font-display text-2xl text-ink md:text-3xl">{t("faqTitle")}</h2>
      <div className="mt-8 space-y-3">
        {FAQ_KEYS.map((item, i) => (
          <GlassCard key={item.q} className="overflow-hidden p-0">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
            >
              <span className="font-medium text-ink">{t(item.q)}</span>
              <span className="text-sage">{open === i ? "−" : "+"}</span>
            </button>
            {open === i && (
              <p className="border-t border-white/30 px-6 pb-5 pt-2 text-sm leading-relaxed text-ink-muted">
                {t(item.a)}
              </p>
            )}
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
