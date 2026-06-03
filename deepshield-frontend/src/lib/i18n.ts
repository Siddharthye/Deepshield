export type LanguageCode =
  | "en"
  | "hi"
  | "ta"
  | "te"
  | "bn"
  | "mr"
  | "kn"
  | "ml";

export const LANGUAGES: { code: LanguageCode; label: string }[] = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "bn", label: "বাংলা" },
  { code: "mr", label: "मराठी" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "ml", label: "മലയാളം" },
];

export const STRINGS_EN = {
  tagline: "AI armor against deepfakes & digital violence",
  scanNow: "Scan an image",
  talkToAsha: "Talk to Asha",
  knowRights: "Support & rights",
  homeHero:
    "Detect deepfakes, build legal proof, and find support — privately, in your browser.",
  navScan: "Scan",
  navTrace: "Trace",
  navReport: "Report",
  navVault: "Vault",
  navCommunity: "Community",
  navAsha: "Asha",
  navLearn: "Learn",
};

const STRINGS: Record<LanguageCode, Record<string, string>> = {
  en: STRINGS_EN,
  hi: {
    tagline: "डीपफेक और डिजिटल हिंसा के खिलाफ AI कवच",
    scanNow: "छवि स्कैन करें",
    talkToAsha: "आशा से बात करें",
    knowRights: "अपने अधिकार जानें",
    homeHero:
      "डीपफेक पहचानें, कानूनी सबूत बनाएं, और सहायता पाएं — निजी तौर पर, ब्राउज़र में।",
    navScan: "स्कैन",
    navTrace: "ट्रेस",
    navReport: "रिपोर्ट",
    navVault: "वॉल्ट",
    navCommunity: "समुदाय",
    navAsha: "आशा",
    navLearn: "सीखें",
  },
  ta: { tagline: "DeepShield", scanNow: "Scan", talkToAsha: "Asha", knowRights: "Support & rights", homeHero: "Protect yourself.", navScan: "Scan", navTrace: "Trace", navReport: "Report", navVault: "Vault", navCommunity: "Community", navAsha: "Asha", navLearn: "Learn" },
  te: { tagline: "DeepShield", scanNow: "Scan", talkToAsha: "Asha", knowRights: "Support & rights", homeHero: "Protect yourself.", navScan: "Scan", navTrace: "Trace", navReport: "Report", navVault: "Vault", navCommunity: "Community", navAsha: "Asha", navLearn: "Learn" },
  bn: { tagline: "DeepShield", scanNow: "Scan", talkToAsha: "Asha", knowRights: "Support & rights", homeHero: "Protect yourself.", navScan: "Scan", navTrace: "Trace", navReport: "Report", navVault: "Vault", navCommunity: "Community", navAsha: "Asha", navLearn: "Learn" },
  mr: { tagline: "DeepShield", scanNow: "Scan", talkToAsha: "Asha", knowRights: "Support & rights", homeHero: "Protect yourself.", navScan: "Scan", navTrace: "Trace", navReport: "Report", navVault: "Vault", navCommunity: "Community", navAsha: "Asha", navLearn: "Learn" },
  kn: { tagline: "DeepShield", scanNow: "Scan", talkToAsha: "Asha", knowRights: "Support & rights", homeHero: "Protect yourself.", navScan: "Scan", navTrace: "Trace", navReport: "Report", navVault: "Vault", navCommunity: "Community", navAsha: "Asha", navLearn: "Learn" },
  ml: { tagline: "DeepShield", scanNow: "Scan", talkToAsha: "Asha", knowRights: "Support & rights", homeHero: "Protect yourself.", navScan: "Scan", navTrace: "Trace", navReport: "Report", navVault: "Vault", navCommunity: "Community", navAsha: "Asha", navLearn: "Learn" },
};

export function t(lang: LanguageCode, key: string): string {
  return STRINGS[lang]?.[key] ?? STRINGS.en[key] ?? key;
}
