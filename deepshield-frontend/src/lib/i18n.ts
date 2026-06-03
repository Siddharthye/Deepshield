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
  navHome: "Home",
  navScan: "Scan",
  navTrace: "Trace",
  navReport: "Report",
  navVault: "Vault",
  navCommunity: "Community",
  navAsha: "Asha",
  navLearn: "Learn",
};

const HI: Record<string, string> = {
  tagline: "डीपफेक और डिजिटल हिंसा के खिलाफ AI कवच",
  scanNow: "छवि स्कैन करें",
  talkToAsha: "आशा से बात करें",
  knowRights: "सहायता और अधिकार",
  homeHero:
    "डीपफेक पहचानें, कानूनी सबूत बनाएं, और सहायता पाएं — निजी तौर पर।",
  navHome: "होम",
  navScan: "स्कैन",
  navTrace: "ट्रेस",
  navReport: "रिपोर्ट",
  navVault: "वॉल्ट",
  navCommunity: "समुदाय",
  navAsha: "आशा",
  navLearn: "सीखें",
};

const TA: Record<string, string> = {
  tagline: "டீப்ஃபேக் மற்றும் டிஜிட்டல் வன்முறைக்கு எதிரான AI கவசம்",
  scanNow: "படம் ஸ்கேன் செய்யுங்கள்",
  talkToAsha: "ஆஷாவுடன் பேசுங்கள்",
  knowRights: "ஆதரவு மற்றும் உரிமைகள்",
  homeHero: "தனிப்பட்ட முறையில் ஆழமாக பாதுகாக்கவும்.",
  navHome: "முகப்பு",
  navScan: "ஸ்கேன்",
  navTrace: "டிரேஸ்",
  navReport: "அறிக்கை",
  navVault: "வால்ட்",
  navCommunity: "சமூகம்",
  navAsha: "ஆஷா",
  navLearn: "கற்றல்",
};

const TE: Record<string, string> = {
  tagline: "డీప్‌ఫేక్‌లకు వ్యతిరేకంగా AI రక్షణ",
  scanNow: "చిత్రాన్ని స్కాన్ చేయండి",
  talkToAsha: "ఆశతో మాట్లాడండి",
  knowRights: "మద్దతు & హక్కులు",
  homeHero: "మీ బ్రౌజర్‌లో ప్రైవేట్‌గా రక్షణ.",
  navHome: "హోమ్",
  navScan: "స్కాన్",
  navTrace: "ట్రేస్",
  navReport: "రిపోర్ట్",
  navVault: "వాల్ట్",
  navCommunity: "కమ్యూనిటీ",
  navAsha: "ఆశ",
  navLearn: "నేర్చుకోండి",
};

const BN: Record<string, string> = {
  tagline: "ডিপফেক ও ডিজিটাল সহিংসতার বিরুদ্ধে AI ঢাল",
  scanNow: "ছবি স্ক্যান করুন",
  talkToAsha: "আশার সাথে কথা বলুন",
  knowRights: "সহায়তা ও অধিকার",
  homeHero: "নিরাপদে, ব্রাউজারে সুরক্ষা পান।",
  navHome: "হোম",
  navScan: "স্ক্যান",
  navTrace: "ট্রেস",
  navReport: "রিপোর্ট",
  navVault: "ভল্ট",
  navCommunity: "কমিউনিটি",
  navAsha: "আশা",
  navLearn: "শিখুন",
};

const MR: Record<string, string> = {
  tagline: "डीपफेक आणि डिजिटल हिंसाविरुद्ध AI कवच",
  scanNow: "प्रतिमा स्कॅन करा",
  talkToAsha: "आशा शी बोला",
  knowRights: "मदत आणि हक्क",
  homeHero: "खाजगीपणे संरक्षण मिळवा.",
  navHome: "मुख्य",
  navScan: "स्कॅन",
  navTrace: "ट्रेस",
  navReport: "अहवाल",
  navVault: "व्हॉल्ट",
  navCommunity: "समुदाय",
  navAsha: "आशा",
  navLearn: "शिका",
};

const KN: Record<string, string> = {
  tagline: "ಡೀಪ್‌ಫೇಕ್ ವಿರುದ್ಧ AI ರಕ್ಷಣೆ",
  scanNow: "ಚಿತ್ರ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",
  talkToAsha: "ಆಶಾ ಜೊತೆ ಮಾತಾಡಿ",
  knowRights: "ಬೆಂಬಲ ಮತ್ತು ಹಕ್ಕುಗಳು",
  homeHero: "ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಖಾಸಗಿ ರಕ್ಷಣೆ.",
  navHome: "ಮುಖ್ಯ",
  navScan: "ಸ್ಕ್ಯಾನ್",
  navTrace: "ಟ್ರೇಸ್",
  navReport: "ವರದಿ",
  navVault: "ವಾಲ್ಟ್",
  navCommunity: "ಸಮುದಾಯ",
  navAsha: "ಆಶಾ",
  navLearn: "ಕಲಿಯಿರಿ",
};

const ML: Record<string, string> = {
  tagline: "ഡീപ്‌ഫേക്കിനെതിരായ AI പരിരക്ഷ",
  scanNow: "ചിത്രം സ്കാൻ ചെയ്യുക",
  talkToAsha: "ആശയോട് സംസാരിക്കുക",
  knowRights: "പിന്തുണയും അവകാശങ്ങളും",
  homeHero: "നിങ്ങളുടെ ബ്രൗസറിൽ സ്വകാര്യ സംരക്ഷണം.",
  navHome: "ഹോം",
  navScan: "സ്കാൻ",
  navTrace: "ട്രേസ്",
  navReport: "റിപ്പോർട്ട്",
  navVault: "വോൾട്ട്",
  navCommunity: "കമ്മ്യൂണിറ്റി",
  navAsha: "ആശ",
  navLearn: "പഠിക്കുക",
};

const STRINGS: Record<LanguageCode, Record<string, string>> = {
  en: STRINGS_EN,
  hi: HI,
  ta: TA,
  te: TE,
  bn: BN,
  mr: MR,
  kn: KN,
  ml: ML,
};

export function t(lang: LanguageCode, key: string): string {
  return STRINGS[lang]?.[key] ?? STRINGS.en[key] ?? key;
}
