"use client";

import Image from "next/image";
import { AshaChat } from "@/components/asha/AshaChat";
import { BasicRights } from "@/components/asha/BasicRights";
import { RightsExplainer } from "@/components/asha/RightsExplainer";
import { PageHeader } from "@/components/ui/PageHeader";
import { useLanguage } from "@/context/LanguageContext";

export default function AshaPage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto flex max-w-6xl flex-col px-4 py-10 md:py-14">
      <PageHeader
        badge={t("ashaPageBadge")}
        title={t("ashaPageTitle")}
        subtitle={t("ashaPageSubtitle")}
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute -inset-2 rounded-2xl bg-blue/35 blur-lg" aria-hidden />
            <Image
              src="/images/asha-logo.jpeg"
              alt={t("ashaCompanionAlt")}
              width={80}
              height={80}
              className="relative rounded-2xl object-cover shadow-md ring-2 ring-sage/50"
              priority
              unoptimized
            />
          </div>
        </div>
      </PageHeader>

      <div className="mb-10 space-y-10">
        <BasicRights />
        <RightsExplainer />
      </div>

      <section
        aria-label={t("ashaChatAria")}
        className="flex min-h-[calc(100vh-12rem)] flex-col rounded-3xl border border-sage/40 bg-gradient-to-b from-blue/20 to-cream/40 p-1 shadow-lg md:min-h-[calc(100vh-10rem)]"
      >
        <AshaChat />
      </section>
    </div>
  );
}
