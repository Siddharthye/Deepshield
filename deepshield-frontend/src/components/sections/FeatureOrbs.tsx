"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { useLanguage } from "@/context/LanguageContext";
import { LANGUAGES, type LanguageCode } from "@/lib/i18n";
import { ORB_FEATURE_META, orbKeys } from "@/lib/i18n/orbKeys";

const ORB_SIZE = 52;
const RADIUS = 128;
const BOX = 320;

function orbStyle(index: number, total: number) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const cx = BOX / 2;
  const cy = BOX / 2;
  const x = cx + RADIUS * Math.cos(angle) - ORB_SIZE / 2;
  const y = cy + RADIUS * Math.sin(angle) - ORB_SIZE / 2;
  return { left: x, top: y };
}

export function FeatureOrbs() {
  const { t, language, setLanguage } = useLanguage();
  const [active, setActive] = useState(ORB_FEATURE_META[0].id);
  const current = ORB_FEATURE_META.find((f) => f.id === active) ?? ORB_FEATURE_META[0];
  const keys = orbKeys(current.id);

  return (
    <section className="section-pad section-alt-blue mx-auto max-w-6xl px-4">
      <p className="page-badge">{t("featuresBadge")}</p>
      <h2 className="font-display text-2xl text-ink md:text-3xl">{t("featuresTitle")}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">{t("featuresIntro")}</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(280px,340px)_1fr] lg:items-start">
        <div
          className="relative mx-auto shrink-0 rounded-full border border-dashed border-secondary/30 bg-primary"
          style={{ width: BOX, height: BOX }}
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center">
            <span className="font-display text-3xl text-accent">11</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-subtle">
              {t("orbTools")}
            </span>
          </div>
          {ORB_FEATURE_META.map((f, i) => {
            const isActive = active === f.id;
            const dim = active !== f.id;
            const label = t(orbKeys(f.id).label);
            return (
              <motion.button
                key={f.id}
                type="button"
                onMouseEnter={() => setActive(f.id)}
                onFocus={() => setActive(f.id)}
                onClick={() => setActive(f.id)}
                className={`absolute flex flex-col items-center justify-center rounded-full shadow-sm transition-colors ${
                  isActive
                    ? "z-20 bg-[var(--color-koubai)] text-white ring-4 ring-[var(--color-berry)]/70"
                    : "z-10 bg-white text-ink-muted ring-1 ring-black/8 hover:bg-[var(--color-berry)]/40"
                }`}
                style={{ ...orbStyle(i, ORB_FEATURE_META.length), width: ORB_SIZE, height: ORB_SIZE }}
                animate={{ scale: isActive ? 1.12 : dim ? 0.88 : 1, opacity: dim ? 0.55 : 1 }}
                transition={{ duration: 0.15 }}
                title={label}
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
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-berry)]/55 text-2xl">
                  {current.icon}
                </span>
                <div>
                  <h3 className="font-display text-2xl text-ink">{t(keys.label)}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">{t(keys.desc)}</p>
                </div>
              </div>
              <ul className="mt-6 grid gap-2 sm:grid-cols-3">
                {[keys.p1, keys.p2, keys.p3].map((pk) => (
                  <li
                    key={pk}
                    className="rounded-xl bg-secondary/8 px-3 py-2 text-xs font-medium text-ink-muted"
                  >
                    ✓ {t(pk)}
                  </li>
                ))}
              </ul>
              {current.id === "i18n" ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setLanguage(l.code as LanguageCode)}
                      className={`rounded-full px-5 py-2.5 text-sm font-medium shadow-md transition ${
                        language === l.code
                          ? "bg-[var(--color-koubai)] text-white ring-2 ring-[var(--color-berry)]/60"
                          : "border border-black/8 bg-white/80 text-ink-muted hover:bg-white"
                      }`}
                      aria-pressed={language === l.code}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              ) : (
                <Link
                  href={current.href}
                  className="mt-6 inline-flex rounded-full bg-[var(--color-koubai)] px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-glow)] hover:brightness-[1.06]"
                >
                  {t("openFeature")} {t(keys.label)} {t("openFeatureArrow")}
                </Link>
              )}
            </GlassCard>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
