"use client";

import { ScanCenter } from "@/components/scan/ScanCenter";
import { PageHeader } from "@/components/ui/PageHeader";
import { useLanguage } from "@/context/LanguageContext";

export default function ScanPage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <PageHeader
        badge={t("scanPageBadge")}
        title={t("scanPageTitle")}
        subtitle={t("scanPageSubtitle")}
      />
      <ScanCenter />
    </div>
  );
}
