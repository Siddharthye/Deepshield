import { t, type LanguageCode } from "@/lib/i18n";

export type CyberDraftFields = {
  incident: string;
  platform: string;
  notes: string;
};

export function buildCyberDraft(fields: CyberDraftFields, lang: LanguageCode = "en"): string {
  const L = (key: Parameters<typeof t>[1]) => t(lang, key);
  const date = new Date().toLocaleString();
  const incident = fields.incident.trim() || L("cyberDraftIncidentPlaceholder");
  const platform = fields.platform.trim() || L("cyberDraftPlatformPlaceholder");
  const notes = fields.notes.trim() || L("cyberDraftNotesPlaceholder");

  return [
    L("cyberDraftHeader"),
    `${L("cyberDraftGenerated")} ${date}`,
    "",
    `1. ${L("cyberIncidentLabel").toUpperCase()}`,
    incident,
    "",
    `2. ${L("cyberPlatformLabel").toUpperCase()}`,
    platform,
    "",
    `3. ${L("cyberNotesLabel").toUpperCase()}`,
    notes,
    "",
    `4. ${L("cyberDraftEvidenceTitle").toUpperCase()}`,
    L("cyberDraftEvidenceBody"),
    "",
    "---",
    L("cyberDraftFooter"),
  ].join("\n");
}
