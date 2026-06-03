import { GlassCard } from "@/components/ui/GlassCard";

const HELPLINES = [
  { name: "Cyber Crime Helpline", number: "1930", note: "24/7 · Report online abuse" },
  { name: "NCW Helpline", number: "181", note: "Women's commission support" },
  { name: "iCall Psychosocial", number: "9152987821", note: "Counselling · Mon–Sat" },
];

export function HomeCrisisStrip() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-6">
      <GlassCard className="border-pink/30 bg-gradient-to-r from-peach/30 to-pink/20 p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-pink">
          Immediate support
        </p>
        <p className="mt-1 text-sm text-ink/80">
          If you are in danger right now, contact local police. These national lines can help
          with cyber abuse and emotional support.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {HELPLINES.map((h) => (
            <div
              key={h.number}
              className="rounded-2xl bg-cream/70 px-4 py-3 ring-1 ring-white/50"
            >
              <p className="text-xs font-medium text-ink/65">{h.name}</p>
              <p className="font-display text-xl text-ink">{h.number}</p>
              <p className="text-[11px] text-ink/55">{h.note}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </section>
  );
}
