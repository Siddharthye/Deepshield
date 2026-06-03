"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { LearnNav } from "@/components/learn/LearnNav";
import { LearnImagePairs } from "@/components/learn/LearnImagePairs";
import { LearnEducation } from "@/components/learn/LearnEducation";
import { useLanguage } from "@/context/LanguageContext";

export default function LearnPage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14 pb-24 md:pb-14">
      <PageHeader
        badge={t("learnPageBadge")}
        title={t("learnPageTitle")}
        subtitle={t("learnPageSubtitle")}
      />

      <LearnNav />
      <LearnImagePairs />
      <LearnEducation />
    </div>
  );
}
