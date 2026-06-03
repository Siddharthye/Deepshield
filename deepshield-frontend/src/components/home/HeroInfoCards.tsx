"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { useLanguage } from "@/context/LanguageContext";
import type { I18nKey } from "@/lib/i18n";

const CARDS: { titleKey: I18nKey; bodyKey: I18nKey; tint?: "blue" | "peach" }[] = [
  { titleKey: "heroInfoPrivateTitle", bodyKey: "heroInfoPrivateBody", tint: "blue" },
  { titleKey: "heroInfoRemindTitle", bodyKey: "heroInfoRemindBody" },
  { titleKey: "heroInfoLawTitle", bodyKey: "heroInfoLawBody", tint: "peach" },
  { titleKey: "heroInfoDocumentTitle", bodyKey: "heroInfoDocumentBody" },
  { titleKey: "heroInfoPaceTitle", bodyKey: "heroInfoPaceBody", tint: "blue" },
];

export function HeroInfoCards() {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.45 }}
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {CARDS.map(({ titleKey, bodyKey, tint }) => (
        <GlassCard
          key={titleKey}
          tilt={false}
          className={`p-5 ${
            tint === "blue"
              ? "glass-card-tint-blue"
              : tint === "peach"
                ? "glass-card-tint-peach"
                : ""
          }`}
        >
          <p className="font-display text-base leading-snug text-ink">{t(titleKey)}</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">{t(bodyKey)}</p>
        </GlassCard>
      ))}
    </motion.div>
  );
}
