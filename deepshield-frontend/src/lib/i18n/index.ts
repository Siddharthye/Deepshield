import { EN, type I18nKey } from "./en";
import { HI } from "./hi";

export type LanguageCode =
  | "en"
  | "hi"
  | "ta"
  | "te"
  | "bn"
  | "mr"
  | "kn"
  | "ml";

export type { I18nKey };

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

/** Build locale from English with partial overrides (missing keys fall back to EN). */
function L(overrides: Partial<Record<I18nKey, string>>): Record<I18nKey, string> {
  return { ...EN, ...overrides };
}

/** Regional locales: Hindi base + script-specific nav/chrome overrides. */
const TA = { ...HI, ...L({
  navHome: "முகப்பு",
  navScan: "ஸ்கேன்",
  navTrace: "டிரேஸ்",
  navReport: "அறிக்கை",
  navVault: "வால்ட்",
  navCommunity: "சமூகம்",
  navAsha: "ஆஷா",
  navLearn: "கற்றல்",
  tagline: "டீப்ஃபேக் மற்றும் டிஜிட்டல் வன்முறைக்கு எதிரான AI கவசம்",
  scanNow: "படம் ஸ்கேன் செய்யுங்கள்",
  talkToAsha: "ஆஷாவுடன் பேசுங்கள்",
  homeHero: "தனிப்பட்ட முறையில் கண்டறிந்து, சட்ட ஆதாரம் உருவாக்குங்கள்.",
  heroTitle: "டிஜிட்டல் வன்முறைக்கு எதிரான உங்கள் கவசம்",
  footerLine1: "நீங்கள் தனியாக இல்லை. உங்களுக்கு உரிமைகள் உள்ளன.",
  transitionTagline: "டிஜிட்டல் வன்முறைக்கு எதிரான உங்கள் கவசம்",
  protected: "பாதுகாக்கப்பட்டது.",
  scanPageTitle: "ஸ்கேன் மையம்",
  tabImage: "படம்",
  tabVideo: "வீடியோ",
}) };

const TE = { ...HI, ...L({
  navHome: "హోమ్",
  navScan: "స్కాన్",
  navTrace: "ట్రేస్",
  navReport: "రిపోర్ట్",
  navVault: "వాల్ట్",
  navCommunity: "కమ్యూనిటీ",
  navAsha: "ఆశ",
  navLearn: "నేర్చుకోండి",
  tagline: "డీప్‌ఫేక్‌లకు వ్యతిరేకంగా AI రక్షణ",
  scanNow: "చిత్రాన్ని స్కాన్ చేయండి",
  talkToAsha: "ఆశతో మాట్లాడండి",
  homeHero: "మీ బ్రౌజర్‌లో ప్రైవేట్‌గా రక్షణ.",
  heroTitle: "డిజిటల్ హింసకు వ్యతిరేకంగా మీ కవచం",
  footerLine1: "మీరు ఒంటరిగా లేరు. మీకు హక్కులు ఉన్నాయి.",
  transitionTagline: "డిజిటల్ హింసకు వ్యతిరేకంగా మీ కవచం",
  protected: "రక్షించబడింది.",
  scanPageTitle: "స్కాన్ కేంద్రం",
  tabImage: "చిత్రం",
  tabVideo: "వీడియో",
}) };

const BN = { ...HI, ...L({
  navHome: "হোম",
  navScan: "স্ক্যান",
  navTrace: "ট্রেস",
  navReport: "রিপোর্ট",
  navVault: "ভল্ট",
  navCommunity: "কমিউনিটি",
  navAsha: "আশা",
  navLearn: "শিখুন",
  tagline: "ডিপফেক ও ডিজিটাল সহিংসতার বিরুদ্ধে AI ঢাল",
  scanNow: "ছবি স্ক্যান করুন",
  talkToAsha: "আশার সাথে কথা বলুন",
  homeHero: "ব্রাউজারে নিরাপদে সুরক্ষা পান।",
  heroTitle: "ডিজিটাল সহিংসতার বিরুদ্ধে আপনার ঢাল",
  footerLine1: "আপনি একা নন। আপনার অধিকার আছে।",
  transitionTagline: "ডিজিটাল সহিংসতার বিরুদ্ধে আপনার ঢাল",
  protected: "সুরক্ষিত।",
  scanPageTitle: "স্ক্যান কেন্দ্র",
  tabImage: "ছবি",
  tabVideo: "ভিডিও",
}) };

const MR = { ...HI, ...L({
  navHome: "मुख्य",
  navScan: "स्कॅन",
  navTrace: "ट्रेस",
  navReport: "अहवाल",
  navVault: "व्हॉल्ट",
  navCommunity: "समुदाय",
  navAsha: "आशा",
  navLearn: "शिका",
  tagline: "डीपफेक आणि डिजिटल हिंसाविरुद्ध AI कवच",
  scanNow: "प्रतिमा स्कॅन करा",
  talkToAsha: "आशा शी बोला",
  homeHero: "खाजगीपणे संरक्षण मिळवा.",
  heroTitle: "डिजिटल हिंसाविरुद्ध तुमचे कवच",
  footerLine1: "तुम्ही एकटे नाही. तुमचे हक्क आहेत.",
  transitionTagline: "डिजिटल हिंसाविरुद्ध तुमचे कवच",
  protected: "संरक्षित.",
  scanPageTitle: "स्कॅन केंद्र",
  tabImage: "प्रतिमा",
  tabVideo: "व्हिडिओ",
}) };

const KN = { ...HI, ...L({
  navHome: "ಮುಖ್ಯ",
  navScan: "ಸ್ಕ್ಯಾನ್",
  navTrace: "ಟ್ರೇಸ್",
  navReport: "ವರದಿ",
  navVault: "ವಾಲ್ಟ್",
  navCommunity: "ಸಮುದಾಯ",
  navAsha: "ಆಶಾ",
  navLearn: "ಕಲಿಯಿರಿ",
  tagline: "ಡೀಪ್‌ಫೇಕ್ ವಿರುದ್ಧ AI ರಕ್ಷಣೆ",
  scanNow: "ಚಿತ್ರ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",
  talkToAsha: "ಆಶಾ ಜೊತೆ ಮಾತಾಡಿ",
  homeHero: "ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಖಾಸಗಿ ರಕ್ಷಣೆ.",
  heroTitle: "ಡಿಜಿಟಲ್ ಹಿಂಸೆಗೆ ವಿರುದ್ಧ ನಿಮ್ಮ ಕವಚ",
  footerLine1: "ನೀವು ಒಬ್ಬರಲ್ಲ. ನಿಮಗೆ ಹಕ್ಕುಗಳಿವೆ.",
  transitionTagline: "ಡಿಜಿಟಲ್ ಹಿಂಸೆಗೆ ವಿರುದ್ಧ ನಿಮ್ಮ ಕವಚ",
  protected: "ರಕ್ಷಿಸಲಾಗಿದೆ.",
  scanPageTitle: "ಸ್ಕ್ಯಾನ್ ಕೇಂದ್ರ",
  tabImage: "ಚಿತ್ರ",
  tabVideo: "ವೀಡಿಯೊ",
}) };

const ML = { ...HI, ...L({
  navHome: "ഹോം",
  navScan: "സ്കാൻ",
  navTrace: "ട്രേസ്",
  navReport: "റിപ്പോർട്ട്",
  navVault: "വോൾട്ട്",
  navCommunity: "കമ്മ്യൂണിറ്റി",
  navAsha: "ആശ",
  navLearn: "പഠിക്കുക",
  tagline: "ഡീപ്‌ഫേക്കിനെതിരായ AI പരിരക്ഷ",
  scanNow: "ചിത്രം സ്കാൻ ചെയ്യുക",
  talkToAsha: "ആശയോട് സംസാരിക്കുക",
  homeHero: "നിങ്ങളുടെ ബ്രൗസറിൽ സ്വകാര്യ സംരക്ഷണം.",
  heroTitle: "ഡിജിറ്റൽ ഹിംസയ്ക്കെതിരായ നിങ്ങളുടെ കവചം",
  footerLine1: "നിങ്ങൾ ഒറ്റയല്ല. നിങ്ങൾക്ക് അവകാശങ്ങളുണ്ട്.",
  transitionTagline: "ഡിജിറ്റൽ ഹിംസയ്ക്കെതിരായ നിങ്ങളുടെ കവചം",
  protected: "സുരക്ഷിതം.",
  scanPageTitle: "സ്കാൻ സെന്റർ",
  tabImage: "ചിത്രം",
  tabVideo: "വീഡിയോ",
}) };

const STRINGS: Record<LanguageCode, Record<I18nKey, string>> = {
  en: EN,
  hi: HI,
  ta: TA,
  te: TE,
  bn: BN,
  mr: MR,
  kn: KN,
  ml: ML,
};

export function t(lang: LanguageCode, key: I18nKey): string {
  return STRINGS[lang]?.[key] ?? HI[key] ?? EN[key] ?? key;
}

/** Re-export EN keys for components that need phrase arrays */
export { EN };
