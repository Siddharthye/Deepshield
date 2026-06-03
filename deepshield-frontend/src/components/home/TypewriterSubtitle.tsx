"use client";

import { useEffect, useState } from "react";

const PHRASES = [
  "Detect deepfakes in seconds.",
  "Generate legal proof instantly.",
  "Find where your photo was shared.",
  "You are not alone. You have rights.",
];

export function TypewriterSubtitle() {
  const [text, setText] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const phrase = PHRASES[phraseIdx];
    const doneTyping = text === phrase;
    const doneDeleting = text === "";

    const delay = deleting ? 20 : 40;
    const pause = doneTyping ? 2000 : doneDeleting ? 400 : delay;

    const t = setTimeout(() => {
      if (doneTyping && !deleting) {
        setDeleting(true);
        return;
      }
      if (doneDeleting && deleting) {
        setDeleting(false);
        setPhraseIdx((i) => (i + 1) % PHRASES.length);
        return;
      }
      setText(
        deleting
          ? phrase.slice(0, text.length - 1)
          : phrase.slice(0, text.length + 1),
      );
    }, pause);

    return () => clearTimeout(t);
  }, [text, deleting, phraseIdx]);

  return (
    <p className="mt-3 min-h-[1.75rem] text-lg text-ink/75">
      {text}
      <span className="ml-0.5 inline-block animate-pulse text-pink">|</span>
    </p>
  );
}
