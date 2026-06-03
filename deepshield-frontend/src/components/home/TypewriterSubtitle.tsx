"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { I18nKey } from "@/lib/i18n";

const PHRASE_KEYS: I18nKey[] = [
  "typewriter1",
  "typewriter2",
  "typewriter3",
  "typewriter4",
];

type Props = { className?: string };

export function TypewriterSubtitle({ className = "" }: Props) {
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
    const phrase = t(PHRASE_KEYS[phraseIdx]);
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
        setPhraseIdx((i) => (i + 1) % PHRASE_KEYS.length);
        return;
      }
      setText(
        deleting ? phrase.slice(0, text.length - 1) : phrase.slice(0, text.length + 1),
      );
    }, pause);

    return () => clearTimeout(timer);
  }, [text, deleting, phraseIdx, t]);

  return (
    <p className={`text-ink-muted ${className || "mt-3 min-h-[1.75rem] text-lg"}`}>
      {text}
      <span className="ml-0.5 inline-block animate-pulse text-accent">|</span>
    </p>
  );
}
