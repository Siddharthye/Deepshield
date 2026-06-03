"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { I18nKey } from "@/lib/i18n";

const DEFAULT_PHRASE_KEYS: I18nKey[] = [
  "typewriter1",
  "typewriter2",
  "typewriter3",
  "typewriter4",
];

export function TypewriterSubtitle({ phrases = DEFAULT_PHRASE_KEYS }: { phrases?: I18nKey[] }) {
  const { t, language } = useLanguage();
  const [text, setText] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setText("");
    setPhraseIdx(0);
    setDeleting(false);
  }, [language]);

  useEffect(() => {
    const phrase = t(phrases[phraseIdx]);
    const doneTyping = text === phrase;
    const doneDeleting = text === "";

    const delay = deleting ? 20 : 40;
    const pause = doneTyping ? 2000 : doneDeleting ? 400 : delay;

    const timer = setTimeout(() => {
      if (doneTyping && !deleting) {
        setDeleting(true);
        return;
      }
      if (doneDeleting && deleting) {
        setDeleting(false);
        setPhraseIdx((i) => (i + 1) % phrases.length);
        return;
      }
      setText(
        deleting ? phrase.slice(0, text.length - 1) : phrase.slice(0, text.length + 1),
      );
    }, pause);

    return () => clearTimeout(timer);
  }, [text, deleting, phraseIdx, t, phrases]);

  return (
    <p className="min-h-[1.75rem] text-center text-xl font-normal leading-snug tracking-tight text-ink-muted md:min-h-[2rem] md:text-2xl">
      {text}
      <span className="ml-0.5 inline-block font-light text-ink-subtle/80">|</span>
    </p>
  );
}
