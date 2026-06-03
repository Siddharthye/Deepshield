export type QuizRound = {
  hintA: string;
  hintB: string;
  answer: "a" | "b";
  explanation: string;
};

const EN_ROUNDS: QuizRound[] = [
  {
    hintA: "Even studio lighting, natural pores visible on cheeks, earrings cast a small shadow.",
    hintB: "Soft glow on skin but the left earring melts into the jawline with no shadow.",
    answer: "b",
    explanation: "Jewelry that blends into skin without shadows often signals face-swap or generative editing.",
  },
  {
    hintA: "Hair strands vary in thickness; a few flyaways catch light at the temple.",
    hintB: "Hairline is perfectly sharp all around the face with identical strand spacing.",
    answer: "b",
    explanation: "Over-uniform hair edges are common in synthetic portraits.",
  },
  {
    hintA: "Background bookshelves show slight motion blur from a phone camera.",
    hintB: "Background pattern repeats in a mirror behind the subject.",
    answer: "b",
    explanation: "Tiled or repeated background textures are a classic generative artifact.",
  },
  {
    hintA: "Teeth alignment looks natural; gums have subtle color variation.",
    hintB: "Smile shows teeth that are too white and perfectly parallel with blurred gums.",
    answer: "b",
    explanation: "Uncanny teeth and gum blending are frequent in deepfake stills.",
  },
  {
    hintA: "Glasses reflect a window shape consistent with room lighting.",
    hintB: "Lens reflection is a flat white blob that does not match the scene.",
    answer: "b",
    explanation: "Inconsistent reflections in eyewear often reveal compositing.",
  },
  {
    hintA: "Neck skin tone gradually shifts toward the collarbone.",
    hintB: "Face is noticeably lighter than the neck with a hard line at the chin.",
    answer: "b",
    explanation: "Skin tone mismatch between face and body suggests a swapped face.",
  },
  {
    hintA: "Shoulder fabric wrinkles follow gravity and arm position.",
    hintB: "Collar symmetry is pixel-perfect on both sides with no fabric fold variation.",
    answer: "b",
    explanation: "Too-perfect symmetry in clothing can indicate AI generation.",
  },
  {
    hintA: "Eyes have tiny blood vessels and asymmetric catchlights.",
    hintB: "Both irises identical size but pupils point in slightly different directions.",
    answer: "b",
    explanation: "Gaze and pupil inconsistencies are strong manipulation clues.",
  },
];

const HI_ROUNDS: QuizRound[] = [
  {
    hintA: "समान स्टूडियो रोशनी, गालों पर प्राकृतिक छिद्र दिखाई देते हैं, बालियों की छोटी छाया।",
    hintB: "त्वचा पर नरम चमक लेकिन बाईं बाली जबड़े में पिघलकर मिली है, कोई छाया नहीं।",
    answer: "b",
    explanation: "त्वचा में घुलती बालियाँ और गायब छाया अक्सर फेस-स्वैप या AI संपादन का संकेत हैं।",
  },
  {
    hintA: "बालों की मोटाई अलग-अलग; मंदिर पर कुछ उड़ते बाल रोशनी पकड़ते हैं।",
    hintB: "चेहरे के चारों ओर बालों की रेखा बिल्कुल तेज़ और समान दूरी पर धागे जैसी।",
    answer: "b",
    explanation: "अत्यधिक समान बालों के किनारे सिंथेटिक पोर्ट्रेट में आम हैं।",
  },
  {
    hintA: "पीछे की किताबों की अलमारी में फ़ोन कैमरे की हल्की धुंधलापन।",
    hintB: "पीछे के दर्पण में पैटर्न दोहराया हुआ दिखता है।",
    answer: "b",
    explanation: "दोहराया गया पृष्ठभूमि पैटर्न जेनरेटिव आर्टिफैक्ट है।",
  },
  {
    hintA: "दाँतों की संरचना प्राकृतिक; मसूड़ों में रंग का हल्का अंतर।",
    hintB: "मुस्कान में दाँत बहुत सफ़ेद और समानांतर, मसूड़े धुंधले।",
    answer: "b",
    explanation: "अजीब दाँत और मसूड़े अक्सर डीपफेक में मिलते हैं।",
  },
  {
    hintA: "चश्मे में खिड़की का प्रतिबिंब कमरे की रोशनी से मेल खाता है।",
    hintB: "लेंस में सपाट सफ़ेद धब्बा जो दृश्य से मेल नहीं खाता।",
    answer: "b",
    explanation: "चश्मे में गलत प्रतिबिंब कंपोज़िटिंग दिखाते हैं।",
  },
  {
    hintA: "गर्दन की त्वचा का रंग धीरे-धीरे कॉलरबोन की ओर बदलता है।",
    hintB: "चेहरा गर्दन से काफ़ी हल्का, ठोड़ी पर कठोर रेखा।",
    answer: "b",
    explanation: "चेहरे और शरीर का रंग मेल न खाना स्वैप किए चेहरे का संकेत है।",
  },
  {
    hintA: "कंधे के कपड़े की सिलवटें गुरुत्वाकर्षण और हाथ की स्थिति के अनुसार।",
    hintB: "कॉलर दोनों तरफ पिक्सल-परफ़ेक्ट सममित, कोई सिलवट भिन्नता नहीं।",
    answer: "b",
    explanation: "कपड़ों में अत्यधिक सममिति AI जनरेशन दिखा सकती है।",
  },
  {
    hintA: "आँखों में छोटी रक्त वाहिकाएँ और असममित कैचलाइट।",
    hintB: "दोनों आईरिस समान आकार लेकिन पुतलियाँ थोड़ी अलग दिशा में।",
    answer: "b",
    explanation: "नज़र और पुतली की असंगति मज़बूत संकेत हैं।",
  },
];

let lastIndex = -1;

export function getQuizRound(language: string): QuizRound {
  const bank = language === "hi" ? HI_ROUNDS : EN_ROUNDS;
  let idx = Math.floor(Math.random() * bank.length);
  if (bank.length > 1 && idx === lastIndex) {
    idx = (idx + 1) % bank.length;
  }
  lastIndex = idx;
  return bank[idx];
}
