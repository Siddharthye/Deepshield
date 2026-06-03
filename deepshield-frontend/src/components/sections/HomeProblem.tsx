import { GlassCard } from "@/components/ui/GlassCard";

const STATS = [
  {
    stat: "Minutes",
    label: "to spread",
    text: "A single morphed image can reach thousands of accounts before a platform responds.",
  },
  {
    stat: "Years",
    label: "of harm",
    text: "Victims report lasting trauma, career damage, and fear of public spaces — online and off.",
  },
  {
    stat: "One",
    label: "toolkit",
    text: "DeepShield bundles detection, evidence, rights, and support so you are not juggling five apps alone.",
  },
];

export function HomeProblem() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <GlassCard className="bg-gradient-to-br from-blue/25 to-peach/20 p-8 md:p-12">
        <p className="page-badge">The problem</p>
        <h2 className="font-display max-w-2xl text-2xl text-ink md:text-3xl">
          When your face becomes someone else&apos;s weapon
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink/80 md:text-base">
          Non-consensual deepfakes and morphed images are a form of digital sexual violence. Many
          survivors do not know whether an image is real, where it was posted, or which laws apply.
          Police and cyber cells increasingly take these cases seriously — but they need clear
          evidence. DeepShield helps you gather that evidence privately before you decide whom to
          trust with it.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-2xl bg-cream/60 p-5 ring-1 ring-white/50">
              <p className="font-display text-3xl text-pink">{s.stat}</p>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink/60">
                {s.label}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink/75">{s.text}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </section>
  );
}
