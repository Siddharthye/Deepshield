/** Soft chime when scan completes (only if user opted into ambient sound). */
export function playScanChime() {
  if (typeof window === "undefined") return;
  if (sessionStorage.getItem("deepshield_ambient_on") !== "1") return;
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
    setTimeout(() => void ctx.close(), 500);
  } catch {
    /* Web Audio unavailable */
  }
}
