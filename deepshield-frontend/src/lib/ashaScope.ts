/** Keep in sync with deepshield-backend/src/lib/ashaScope.ts */

const GREETING =
  /^(hi|hello|hey|hiya|namaste|नमस्ते|नमस्कार|thanks|thank you|धन्यवाद|ok|okay|yes|no|help)\b/i;

const OFF_TOPIC =
  /\b(recipe|recipes|cook|cooking|bake|baking|pizza|pasta|burger|food|restaurant|meal|ingredient|calories|diet)\b|\b(weather|forecast|temperature|rain today)\b|\b(sport|sports|football|cricket|ipl|match score|nba|world cup)\b|\b(write|generate|create)\s+(me\s+)?(a\s+)?(code|script|program|app|website|essay|poem|story|joke|song|lyrics)\b|\b(homework|assignment|exam|math problem|solve\s+this\s+equation|calculus|algebra)\b|\b(stock|stocks|crypto|bitcoin|invest|trading tip|share price)\b|\b(movie|movies|netflix|series|celebrity|gossip|bollywood review)\b|\b(game|gaming|cheat code|minecraft|fortnite)\b|\b(translate|translation)\s+.+\s+(to|into)\s+(french|spanish|german|chinese)\b|\b(who won|capital of|population of|trivia)\b|\b(flirt|date me|romantic|pickup line)\b/i;

const IN_SCOPE =
  /\b(deepfake|deep fake|morph|morphed|manipulat|fake\s+(photo|image|video|pic)|synthetic\s+face|face\s+swap)\b|\b(ncii|intimate|nude|nudes|leak|leaked|revenge\s+porn|sextortion|blackmail|extort|harass|abuse|bully|stalk|dox)\b|\b(cyber|online\s+abuse|digital\s+violence|cybercrime|cyber\s+crime)\b|\b(right|rights|law|legal|ipc|it\s+act|section\s*66|pocso|fir|police|complaint|court|lawyer|bail)\b|\b(report|evidence|proof|screenshot|document|pdf|filing|cybercrime\.gov)\b|\b(scan|trace|vault|deepshield|heatmap|upload|compare)\b|\b(asha|helpline|1930|9152987821|ncw|181|icall)\b|\b(scared|afraid|anxious|panic|depress|suicid|hurt|unsafe|ashamed|embarrass|trauma|cry|alone|support|feel|feeling|listen)\b|\b(photo|image|video|picture|selfie|whatsapp|instagram|telegram|facebook|twitter|x\.com|reel|viral|posted|share[ds]?)\b|\b(consent|permission|without\s+my\s+consent|morphed\s+photo)\b|\b(डीपफेक|मॉर्फ|गैर-सहमति|अश्लील|ब्लैकमेल|पुलिस|अधिकार|कानून|स्कैन|रिपोर्ट|हेल्पलाइन|साइबर|पीड़|डर|मदद|सहायता|आशा)\b/i;

const OUT_OF_SCOPE_REPLY: Record<string, string> = {
  en: "I'm Asha on DeepShield. I only help with emotional support after digital abuse, your legal rights in India, and using DeepShield (scan, trace, vault, report). I can't help with recipes or other general topics — but I'm here if you want to talk about what's happening or your next steps.",
  hi: "मैं DeepShield पर आशा हूँ। मैं केवल डिजिटल दुर्व्यवहार के बाद भावनात्मक सहायता, भारतीय कानून में आपके अधिकार, और DeepShield टूल (स्कैन, ट्रेस, वॉल्ट, रिपोर्ट) में मदद करती हूँ। पिज़्ज़ा रेसिपी जैसे सामान्य विषयों पर नहीं — लेकिन जो हो रहा है या अगला कदम, उस पर बात कर सकती हूँ।",
};

export function outOfScopeReply(language: string): string {
  return OUT_OF_SCOPE_REPLY[language === "hi" ? "hi" : "en"];
}

export function isAshaInScope(message: string): boolean {
  const text = message.trim();
  if (!text) return false;
  if (text.length <= 3) return true;
  if (GREETING.test(text)) return true;

  if (OFF_TOPIC.test(text)) {
    if (IN_SCOPE.test(text)) return true;
    return false;
  }

  if (IN_SCOPE.test(text)) return true;

  if (text.length <= 48) return true;

  return false;
}
