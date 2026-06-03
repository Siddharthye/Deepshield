import type { I18nKey } from "./index";

const ORB_IDS = [
  "scan",
  "video",
  "trace",
  "report",
  "vault",
  "asha",
  "rights",
  "community",
  "learn",
  "i18n",
  "privacy",
] as const;

export type OrbId = (typeof ORB_IDS)[number];

export const ORB_FEATURE_META: {
  id: OrbId;
  icon: string;
  href: string;
}[] = [
  { id: "scan", icon: "🔍", href: "/scan" },
  { id: "video", icon: "🎬", href: "/scan" },
  { id: "trace", icon: "🌐", href: "/trace" },
  { id: "report", icon: "📄", href: "/report" },
  { id: "vault", icon: "🔐", href: "/vault" },
  { id: "asha", icon: "💬", href: "/asha" },
  { id: "rights", icon: "⚖️", href: "/asha" },
  { id: "community", icon: "🤝", href: "/community" },
  { id: "learn", icon: "📚", href: "/learn" },
  { id: "i18n", icon: "🗣️", href: "/" },
  { id: "privacy", icon: "🛡️", href: "/vault" },
];

function cap(id: OrbId): string {
  return id.charAt(0).toUpperCase() + id.slice(1);
}

export function orbKeys(id: OrbId): {
  label: I18nKey;
  desc: I18nKey;
  p1: I18nKey;
  p2: I18nKey;
  p3: I18nKey;
} {
  const p = `orb${cap(id)}`;
  return {
    label: `${p}Label` as I18nKey,
    desc: `${p}Desc` as I18nKey,
    p1: `${p}P1` as I18nKey,
    p2: `${p}P2` as I18nKey,
    p3: `${p}P3` as I18nKey,
  };
}
