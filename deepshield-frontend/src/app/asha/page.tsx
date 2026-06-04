"use client";

import Image from "next/image";
import { AshaChat } from "@/components/asha/AshaChat";
import { BasicRights } from "@/components/asha/BasicRights";
import { RightsExplainer } from "@/components/asha/RightsExplainer";
import { useLanguage } from "@/context/LanguageContext";

export default function AshaPage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 md:gap-12 md:py-14">
      <header className="page-header">
        <p className="page-badge">{t("ashaPageBadge")}</p>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:items-stretch">
          <div>
            <h1 className="font-display text-3xl font-semibold text-ink md:text-4xl">
              {t("ashaPageTitle")}
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-muted">
              {t("ashaPageSubtitle")}
            </p>
            <div className="mt-6 flex items-center gap-4 lg:hidden">
              <div className="relative shrink-0">
                <div
                  className="absolute -inset-2 rounded-2xl bg-blue/35 blur-lg"
                  aria-hidden
                />
                <Image
                  src="/images/asha-logo.jpeg"
                  alt={t("ashaCompanionAlt")}
                  width={72}
                  height={72}
                  className="relative rounded-2xl object-cover shadow-md ring-2 ring-sage/50"
                  priority
                  unoptimized
                />
              </div>
            </div>
          </div>

          <section
            id="asha-chat"
            aria-label={t("ashaChatAria")}
            className="flex min-h-[min(480px,58vh)] flex-col rounded-3xl border border-sage/40 bg-gradient-to-b from-blue/25 to-cream/50 p-1 shadow-lg lg:min-h-[min(520px,62vh)]"
          >
            <AshaChat />
          </section>
        </div>
      </header>

      <BasicRights />
      <RightsExplainer />
    </div>
  );
}
