"use client";

import { useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export function AmbientSoundToggle() {
  const { t } = useLanguage();
  const [on, setOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  function toggle() {
    if (on) {
      oscRef.current?.stop();
      oscRef.current = null;
      void ctxRef.current?.close();
      ctxRef.current = null;
      sessionStorage.removeItem("deepshield_ambient_on");
      setOn(false);
      return;
    }
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 110;
    gain.gain.value = 0.03;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    ctxRef.current = ctx;
    oscRef.current = osc;
    sessionStorage.setItem("deepshield_ambient_on", "1");
    setOn(true);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="fixed bottom-20 left-4 z-50 rounded-full border border-sage/50 bg-cream/90 px-3 py-2 text-xs text-ink shadow-md backdrop-blur md:bottom-6 lg:left-6"
      aria-label={t("toggleSoundAria")}
    >
      {on ? `🔊 ${t("soundOn")}` : `🔇 ${t("soundOff")}`}
    </button>
  );
}
