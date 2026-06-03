import type { I18nKey } from "@/lib/i18n";

export type LearnImagePair = {
  id: string;
  signKey: I18nKey;
  titleKey: I18nKey;
  bodyKey: I18nKey;
  authenticCaptionKey: I18nKey;
  compareCaptionKey: I18nKey;
  authenticSrc: string;
  compareSrc: string;
};

/** Educational side-by-sides (Unsplash, free to use). Illustrative — not forensic proof. */
export const LEARN_IMAGE_PAIRS: LearnImagePair[] = [
  {
    id: "skin-tone",
    signKey: "learnSign2",
    titleKey: "learnPair1Title",
    bodyKey: "learnPair1Body",
    authenticCaptionKey: "learnPair1Authentic",
    compareCaptionKey: "learnPair1Compare",
    authenticSrc:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=480&h=560&fit=crop&q=80",
    compareSrc:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=480&h=560&fit=crop&q=80",
  },
  {
    id: "hairline",
    signKey: "learnSign1",
    titleKey: "learnPair2Title",
    bodyKey: "learnPair2Body",
    authenticCaptionKey: "learnPair2Authentic",
    compareCaptionKey: "learnPair2Compare",
    authenticSrc:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=480&h=560&fit=crop&q=80",
    compareSrc:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=480&h=560&fit=crop&q=80",
  },
  {
    id: "lighting",
    signKey: "learnSign3",
    titleKey: "learnPair3Title",
    bodyKey: "learnPair3Body",
    authenticCaptionKey: "learnPair3Authentic",
    compareCaptionKey: "learnPair3Compare",
    authenticSrc:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=480&h=560&fit=crop&q=80",
    compareSrc:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=480&h=560&fit=crop&q=80",
  },
  {
    id: "background",
    signKey: "learnSign5",
    titleKey: "learnPair4Title",
    bodyKey: "learnPair4Body",
    authenticCaptionKey: "learnPair4Authentic",
    compareCaptionKey: "learnPair4Compare",
    authenticSrc:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=480&h=560&fit=crop&q=80",
    compareSrc:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=480&h=560&fit=crop&q=80",
  },
];
