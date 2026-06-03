"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { useLanguage } from "@/context/LanguageContext";
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
  const { t } = useLanguage();
  const [active, setActive] = useState(ORB_FEATURE_META[0].id);
  const current = ORB_FEATURE_META.find((f) => f.id === active) ?? ORB_FEATURE_META[0];
  const keys = orbKeys(current.id);

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
                className={`absolute flex flex-col items-center justify-center rounded-full shadow-md transition-colors ${
                  isActive
                    ? "z-20 bg-blue text-ink ring-4 ring-sage/50"
                    : "z-10 bg-cream text-ink/80 hover:bg-sage/40"
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
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-peach/50 text-2xl">
                  {current.icon}
                </span>
                <div>
                  <h3 className="font-display text-2xl text-ink">{t(keys.label)}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/80">{t(keys.desc)}</p>
                </div>
              </div>
              <ul className="mt-6 grid gap-2 sm:grid-cols-3">
                {[keys.p1, keys.p2, keys.p3].map((pk) => (
                  <li
                    key={pk}
                    className="rounded-xl bg-blue/25 px-3 py-2 text-xs font-medium text-ink/85"
                  >
                    ✓ {t(pk)}
                  </li>
                ))}
              </ul>
              <Link
                href={current.href}
                className="mt-6 inline-flex rounded-full bg-gradient-to-r from-pink to-peach px-5 py-2.5 text-sm font-medium text-ink shadow-md hover:brightness-105"
              >
                {t("openFeature")} {t(keys.label)} {t("openFeatureArrow")}
              </Link>
            </GlassCard>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
