"use client";

import { VaultManager } from "@/components/vault/VaultManager";
import { PageHeader } from "@/components/ui/PageHeader";
import { useLanguage } from "@/context/LanguageContext";

export default function VaultPage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <PageHeader
        badge={t("vaultPageBadge")}
        title={t("vaultPageTitle")}
        subtitle={t("vaultPageSubtitle")}
      />
      <VaultManager />
    </div>
  );
}
